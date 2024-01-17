import debounce from 'lodash.debounce'
import {
  nearestDayOfWeek,
  ordinalDate,
  nextTuesday,
  nextFriday,
  nextSaturday,
  ascending,
  today,
} from '../utilities/dates.mjs'
import getCard from '../utilities/getCard.mjs'
import { v4 as uuid } from 'uuid'
import spinner from '../utilities/spinner.mjs'

// data configuration for squash
let squashData = null
let Handlers = null

const articleElements = (article) => {
  const id = article.id
  const image = article?.firstElementChild
  const bookNow = image.nextElementSibling
  const details = bookNow.nextElementSibling
  const form = details.nextElementSibling
  const cancel = article.querySelector(`#${id}-cancel`)
  const submit = article.querySelector(`#${id}-submit`)
  const firstInput = form.querySelector('input:first-of-type')
  return { image, bookNow, details, form, cancel, submit, firstInput }
}

const handleBookNow = async (e) => {
  e.preventDefault()

  const bookNow = e.target
  const article = bookNow.closest('article')
  const { image, form, firstInput } = articleElements(article)
  const programme = form.querySelector('input[name="programme"]').value
  image.classList.add('inactive')
  bookNow.classList.add('inactive')
  form.classList.remove('inactive')
  form.classList.add('active')
  firstInput.focus()
  return
}

const bookingData = (form) => {
  const data = new FormData(form)
  const entries = Object.fromEntries(data.entries())
  // make the stripe checkout session easier
  if (entries['stripe-price'] !== '') {
    entries.session = {
      client_reference_id: entries['booking-reference'],
      success_url: `${window.location.origin}/roa-thanks`,
      cancel_url: `${window.location.origin}/roa-cancel`,
      customer_email: entries.email,
      line_items: [
        { price: entries['stripe-price'], quantity: entries.quantity },
      ],
      mode: 'payment',
      metadata: {
        name: entries.name,
        email: entries.email,
        mobile: entries.mobile,
        card: entries.card ? entries.card : '',
        age: entries.age,
        price: entries['price-paid'],
        quantity: entries.quantity,
        unitPrice: entries['unit-price'],
        stripePrice: entries['stripe-price'],
        reference: entries['booking-reference'],
        time: entries['booking-time'],
        programme: entries.programme,
        // sessions: entries.sessions,
        roaProgramme: entries['roa-programme'],
        // roaSessions: entries['roa-sessions'],
      },
    }
  }

  return entries
}

const handleCancel = (e) => {
  e.preventDefault()

  const cancel = e.target
  const article = cancel.closest('article')
  const { image, bookNow, form } = articleElements(article)
  image.classList.remove('inactive')
  bookNow.classList.remove('inactive')
  form.classList.add('inactive')
  form.classList.remove('active')
  form.reset()
}

const checkout = async (request) => {
  try {
    const response = await fetch('/api/roa-stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request), // body data type must match "Content-Type" header
    })
    if (response.ok) {
      const session = await response.json()
      // console.log('stripe url', session.url)
      return session
    }
    console.error('checkout failed', response.statusText)
  } catch (error) {
    console.error('checkout exception', error)
  }
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    spinner.on()
    const submit = e.target
    const form = submit.closest('form')
    const isValid = form.reportValidity()
    const booking = bookingData(form)

    if (isValid) {
      if (booking.session) {
        // stripe checkout session required
        const session = await checkout(booking)
        console.log('session', session)
        if (session) window.location.href = session.url
      } else {
        window.location.href = `${window.location.origin}/roa-thanks`
      }
      handleCancel(e)
    }
    spinner.off()
  } catch (error) {
    console.error('handleSubmit failed', error)
    spinner.off()
  }
}

// utilities

const updatePricePaid = (article, price, unitPrice, quantity, stripePrice) => {
  const pricePaidElement = article.querySelector('input[name="price-paid"')
  pricePaidElement.value = price
  const unitPriceElement = article.querySelector('input[name="unit-price"')
  unitPriceElement.value = unitPrice
  const quantityElement = article.querySelector('input[name="quantity"')
  quantityElement.value = quantity
  const stripePriceElement = article.querySelector('input[name="stripe-price"')
  stripePriceElement.value = stripePrice
}

const findSquashData = (name) => {
  const juniorProgramme = squashData.juniorProgrammes.find(
    (programme) => programme.name === name,
  )
  if (juniorProgramme) return juniorProgramme

  const adultProgram = squashData.adultProgrammes.find(
    (programme) => programme.name === name,
  )
  if (adultProgram) return adultProgram

  return null
}

const getSessions = (article) => {
  const sessionsElement = article.querySelector('input[type=number]')
  let sessions = +sessionsElement.value
  sessions = sessions > 5 ? 5 : sessions < 1 ? 1 : sessions
  sessionsElement.value = sessions
  return sessions
}

const getMembershipCardElement = (article) => {
  const cardElement = article.querySelector('input[name="card"]')
  return cardElement
}

const getArticleElements = (article) => {
  const name = article.querySelector('input[name="name"]')
  const email = article.querySelector('input[name="email"]')
  const mobile = article.querySelector('input[name="mobile"]')
  const card = article.querySelector('input[name="card"]')
  const age = article.querySelector('input[name="age"]')
  const status = article.querySelector('input[name="status"]')

  return { name, email, mobile, card, age, status }
}

const updateFieldValidity = (
  article,
  element,
  isValid = false,
  cardData = {},
) => {
  element.classList.remove('valid')
  element.classList.remove('invalid')
  const elements = getArticleElements(article)
  elements.status.value = 'non-member'

  if (isValid) {
    element.classList.add('valid')
    let [isMember, name, status, email, age, mobile] = cardData

    if (elements.name.value === '') elements.name.value = name
    if (elements.email.value === '') elements.email.value = email
    if (elements.mobile.value === '') elements.mobile.value = mobile
    elements.age.value = age
    elements.status.value = status

    return
  }
  element.classList.add('invalid')
  return
}

const checkCard = async (article) => {
  const cardElement = getMembershipCardElement(article)

  if (cardElement.value.trim() === '') {
    cardElement.classList.remove('valid')
    cardElement.classList.remove('invalid')
    cardElement.value = ''
    return false
  }

  if (!cardElement.checkValidity()) {
    updateFieldValidity(article, cardElement, false)
    return false
  }

  try {
    const cardNumber = +cardElement.value.trim()
    const result = await getCard(cardNumber)

    let isMember = false
    if (result.found) {
      // {found: [true,"Andy Stevenson","live 03/11/2023","andystevenson@mac.com",59]
      const [isMemberValid] = result.found
      // more can be done to check name, email against article
      isMember = isMemberValid
    }

    updateFieldValidity(article, cardElement, isMember, result.found)
    return isMember
  } catch (error) {
    console.error('checkCard failed', error.message)
    updateFieldValidity(article, cardElement, false)
    return false
  }
}

// forms

const juniorProgrammeForm = (name, prices, id) => {
  const bookingFrom = nearestDayOfWeek('tuesday', 'saturday')
  const nextDay = ordinalDate(bookingFrom[0])
  const followingDay = ordinalDate(bookingFrom[1])
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="name" id="${name}-name"
            title="Please enter a full name"
            placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="email" id="${name}-email" 
            title="Please enter a valid email address"
            placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="mobile" id="${name}-mobile" 
            title="Please enter your contact number"
            placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="card"  id="${name}-card" pattern="[0-9]*" 
          title="Please enter digits only!">
        </label>
        <fieldset class="pricing members">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price">£${prices[0].price.toFixed(2)}</span>
              <span class="unit">per ${prices[0].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[1].price.toFixed(2)}</span>
              <span class="unit">for ${prices[1].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[2].price.toFixed(2)}</span>
              <span class="unit">for ${prices[2].unit}</span>
            </div>
            <hr>
            <div>
              <span class="price">£${prices[3].price.toFixed(2)}</span>
              <span class="unit">per ${prices[3].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[4].price.toFixed(2)}</span>
              <span class="unit">for ${prices[4].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[5].price.toFixed(2)}</span>
              <span class="unit">for ${prices[5].unit}</span>
            </div>
            
          </section>
        </fieldset>
        <fieldset class="pricing non-members">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price">£${prices[6].price.toFixed(2)}</span>
              <span class="unit">per ${prices[6].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[7].price.toFixed(2)}</span>
              <span class="unit">for ${prices[7].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[8].price.toFixed(2)}</span>
              <span class="unit">for ${prices[8].unit}</span>
            </div>
            <hr>
            <div>
              <span class="price">£${prices[9].price.toFixed(2)}</span>
              <span class="unit">per ${prices[9].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[10].price.toFixed(2)}</span>
              <span class="unit">for ${prices[10].unit}</span>
            </div>
            <div>
              <span class="price">£${prices[11].price.toFixed(2)}</span>
              <span class="unit">for ${prices[11].unit}</span>
            </div>
            
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <small>${nextDay}</small>
          <small>${followingDay}</small>
          <label for="${name}-tuesday40">
            <input type="checkbox" name="tuesday40" id="${name}-tuesday40">
            <span>17:00-17:40, Tuesday</span>
          </label>
          <label for="${name}-saturday40">
            <input type="checkbox" name="saturday40" id="${name}-saturday40">
            <span>10:00-10:40, Saturday</span>
          </label>
          <hr>
          <label for="${name}-tuesday80">
            <input type="checkbox" name="tuesday80" id="${name}-tuesday80">
            <span>17:00-18:20, Tuesday</span>
          </label>

          <label for="${name}-saturday80">
            <input type="checkbox" name="saturday80" id="${name}-saturday80">
            <span>10:40-12:00, Saturday</span>
          </label>
          <label for="${name}-sessions">
            <input type="number" name="sessions" id="${name}-sessions" value=1 min=1 max=5>
            <span>session(s)</span>
            <sup>(max 5)</sup>
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${today.toISOString()}" name="booking-time">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="${id}" name="roa-programme">
        <input type="hidden" value="" name="price-paid">
        <input type="hidden" value="" name="unit-price">
        <input type="hidden" value="" name="quantity">
        <input type="hidden" value="" name="stripe-price">
        <input type="hidden" value="non-member" name="status">
        <input type="hidden" value="" name="age">
        <input type="hidden" value="" name="sessions">
        <input type="hidden" value="" name="roa-sessions">
      </section>
    </fieldset>
  </form>`

  return template
}

const individualForm = (name, prices, id) => {
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <fieldset class="notice">
        <legend>Please note...</legend>
        <p class="notice">Confirm booking time with coaches before paying!</p>
      </fieldset>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="name" id="${name}-name"
          title="Please enter a full name"
          placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="email" id="${name}-email" 
            title="Please enter a valid email address"
            placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="mobile" id="${name}-mobile" 
            title="Please enter your contact number"
            placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="card" pattern="[0-9]*" id="${name}-card"
            title="Please enter digits only!">
        </label>
         <fieldset class="pricing members"
          data-price1="${prices[0].price}"
          data-stripe1="${prices[0].stripe.price}">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[0].price}>£${prices[0].price}</span>
              <span class="unit" 
                data-unit="${prices[0].unit}">per ${prices[0].unit}</span>
            </div>

          </section>
        </fieldset>
        <fieldset class="pricing non-members" 
          data-price2="${prices[1].price}"
          data-stripe2="${prices[1].stripe.price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[1].price}>£${prices[1].price}</span>
              <span class="unit" 
                data-unit="${prices[1].unit}">per ${prices[1].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <label for="${name}-weeks">
            <input type="number" name="weeks" id="${name}-weeks" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 5)</sup>
            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${today.toISOString()}" name="booking-time">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="${id}" name="roa-programme">
        <input type="hidden" value="" name="price-paid">
        <input type="hidden" value="" name="unit-price">
        <input type="hidden" value="" name="quantity">
        <input type="hidden" value="" name="stripe-price">
        <input type="hidden" value="non-member" name="status">
        <input type="hidden" value="" name="age">
        <input type="hidden" value="" name="sessions">
        <input type="hidden" value="" name="roa-sessions">
      </section>
    </fieldset>
  </form>`

  return template
}

const skillsAndDrillsForm = (name, prices, id) => {
  const bookingFrom = nearestDayOfWeek('tuesday')
  const nextTuesday = ordinalDate(bookingFrom[0])
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="name" id="${name}-name"
            title="Please enter a full name"
            placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="email" id="${name}-email" 
            title="Please enter a valid email address"
            placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="mobile" id="${name}-mobile" 
            title="Please enter your contact number"
            placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="card" pattern="[0-9]*" id="${name}-card"
            title="Please enter digits only!" >
        </label>
        <fieldset class="pricing members"
          data-price1="${prices[0].price}"
          data-stripe1="${prices[0].stripe.price}">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[0].price}>£${prices[0].price}</span>
              <span class="unit" 
                data-unit="${prices[0].unit}">per ${prices[0].unit}</span>
            </div>

          </section>
        </fieldset>
        <fieldset class="pricing non-members" 
          data-price2="${prices[1].price}"
          data-stripe2="${prices[1].stripe.price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[1].price}>£${prices[1].price}</span>
              <span class="unit" 
                data-unit="${prices[1].unit}">per ${prices[1].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <small>${nextTuesday}</small>
          <label for="${name}-weeks">
            <input type="number" name="weeks" id="${name}-weeks" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 5)</sup>            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${today.toISOString()}" name="booking-time">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="${id}" name="roa-programme">
        <input type="hidden" value="" name="price-paid">
        <input type="hidden" value="" name="unit-price">
        <input type="hidden" value="" name="quantity">
        <input type="hidden" value="" name="stripe-price">
        <input type="hidden" value="non-member" name="status">
        <input type="hidden" value="" name="age">
        <input type="hidden" value="" name="sessions">
        <input type="hidden" value="" name="roa-sessions">
      </section>
    </fieldset>
  </form>`

  return template
}

const clubNightForm = (name, prices, id) => {
  const bookingFrom = nearestDayOfWeek('friday')
  const nextFriday = ordinalDate(bookingFrom[0])
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="name" id="${name}-name" 
            title="Please enter a full name"
            placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="email" id="${name}-email" 
            title="Please enter a valid email address"
            placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="mobile" id="${name}-mobile" 
            title="Please enter your contact number"
            placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="card" pattern="[0-9]*" 
            title="Please enter digits only!" 
            id="${name}-card">
        </label>
        <fieldset class="pricing">
          <legend>price</legend>
          <p class="description">FREE</p>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <small>${nextFriday}</small>

          <label for="${name}-weeks">
            <input type="number" name="weeks" id="${name}-weeks" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 5)</sup>            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Join</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${today.toISOString()}" name="booking-time">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="${id}" name="roa-programme">
        <input type="hidden" value="" name="price-paid">
        <input type="hidden" value="" name="unit-price">
        <input type="hidden" value="" name="quantity">
        <input type="hidden" value="" name="stripe-price">
        <input type="hidden" value="non-member" name="status">
        <input type="hidden" value="" name="age">
        <input type="hidden" value="" name="sessions">
        <input type="hidden" value="" name="roa-sessions"> 
      </section>
    </fieldset>
  </form>`

  return template
}
// init

const handleInit = async (form, id, generateForm) => {
  const programme = findSquashData(id)
  const { name, prices } = programme

  const newForm = generateForm(name, prices, id, open)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

// form handlers

const handleJuniorProgrammeForm = async (e) => {
  const article = e.target.closest('article')
  const id = article.id

  let isMember = await checkCard(article)

  const inputs = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"]:checked`,
    ),
  )

  let is40minSession = inputs.length > 0 ? inputs[0].name.endsWith('40') : false
  let disable40 = inputs.length > 0 ? inputs[0].name.endsWith('80') : false

  const inputs40 = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"][name$="40"]`,
    ),
  )

  if (disable40) {
    inputs40.forEach((input) => (input.disabled = true))
  }

  let is80minSession = inputs.length > 0 ? inputs[0].name.endsWith('80') : false
  let disable80 = inputs.length > 0 ? inputs[0].name.endsWith('40') : false

  const inputs80 = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"][name$="80"]`,
    ),
  )

  if (disable80) {
    inputs80.forEach((input) => (input.disabled = true))
  }

  const { submit } = articleElements(article)

  if (inputs.length === 0) {
    inputs40.forEach((input) => (input.disabled = false))
    inputs80.forEach((input) => (input.disabled = false))
    // no inputs selected therefore nothing to calculate
    submit.textContent = 'Buy'
    submit.disabled = true
    return
  }

  let sessions = getSessions(article) * inputs.length

  // if any schedule is checked we have a potential buy scenario
  // update the value on the submit button

  let price = 0
  let unitPrice = 0
  let stripePrice = ''
  let quantity = 0

  const programme = findSquashData(id)
  const { prices } = programme

  if (is40minSession && sessions < 5) {
    const selected = prices.find(
      (price) => price.members === isMember && price.unit.startsWith('40min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 40min=${is40minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price * sessions
    unitPrice = price
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is40minSession && sessions === 5) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('5x 40min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 40min=${is40minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price
    unitPrice = +(price / 5).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is40minSession && sessions === 10) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('10x 40min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 40min=${is40minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price
    unitPrice = +(price / 10).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is40minSession && sessions > 5 && sessions < 10) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('5x 40min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 40min=${is40minSession}, sessions=${sessions}`,
      )
    }

    unitPrice = selected.price / 5
    price = +(unitPrice * sessions).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  // 80min sessions
  if (is80minSession && sessions < 5) {
    const selected = prices.find(
      (price) => price.members === isMember && price.unit.startsWith('80min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 80min=${is80minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price * sessions
    unitPrice = price
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is80minSession && sessions === 5) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('5x 80min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 80min=${is80minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price
    unitPrice = +(price / 5).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is80minSession && sessions === 10) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('10x 80min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 80min=${is80minSession}, sessions=${sessions}`,
      )
    }

    price = selected.price
    unitPrice = +(price / 10).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }

  if (is80minSession && sessions > 5 && sessions < 10) {
    const selected = prices.find(
      (price) =>
        price.members === isMember && price.unit.startsWith('5x 80min'),
    )
    if (!selected) {
      throw Error(
        `price not found ${id} member=${isMember}, 80min=${is80minSession}, sessions=${sessions}`,
      )
    }

    unitPrice = selected.price / 5
    price = +(unitPrice * sessions).toFixed(2)
    quantity = sessions
    stripePrice = selected.stripe.price
  }
  submit.textContent = sessions > 0 ? `Buy (£${price.toFixed(2)})` : 'Buy'
  submit.disabled = false
  updatePricePaid(article, price, unitPrice, quantity, stripePrice)
}

const handleIndividualForm = async (e) => {
  const article = e.target.closest('article')

  const { submit } = articleElements(article)

  let pricing = article.querySelector('.pricing.members')
  const price1 = +pricing.dataset.price1
  const stripe1 = pricing.dataset.stripe1
  pricing = article.querySelector('.pricing.non-members')
  const price2 = +pricing.dataset.price2
  const stripe2 = pricing.dataset.stripe2

  let weeks = getSessions(article)
  let price = 0
  let unitPrice = 0
  let stripePrice = ''

  let isMember = await checkCard(article)
  price = weeks * price1
  unitPrice = price
  stripePrice = stripe1

  if (!isMember) {
    price = weeks * price2
    unitPrice = price2
    stripePrice = stripe2
  }

  submit.textContent = weeks > 0 ? `Buy (£${price})` : 'Buy'
  weeks > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (weeks > 0) updatePricePaid(article, price, unitPrice, weeks, stripePrice)
}

const handleClubNightForm = async (e) => {
  const article = e.target.closest('article')

  const { submit } = articleElements(article)
  await checkCard(article)

  let weeks = getSessions(article)
  if (weeks > 0) {
    await updateClubNightSessions(article, weeks)
  }
  weeks > 0 ? (submit.disabled = false) : (submit.disabled = true)
}
// controller
const buildHandlers = async () => {
  const handlers = {
    'roa-junior-squash-programme': {
      generate: juniorProgrammeForm,
      init: handleInit,
      form: handleJuniorProgrammeForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
    },

    'roa-individual-coaching': {
      generate: individualForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
    },

    'roa-skills-and-drills': {
      generate: skillsAndDrillsForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
    },

    'roa-club-night': {
      generate: clubNightForm,
      init: handleInit,
      form: handleClubNightForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
    },

    'roa-individual-adult-coaching': {
      generate: individualForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
    },
  }

  // console.log({ handlers })
  return handlers
}

// initialise
;(async () => {
  console.log('welcome to WWSC squash')

  try {
    squashData = await fetch('/api/squash')
    squashData = await squashData.json()

    const juniorProgrammes = Array.from(
      document.querySelectorAll('article.roa-junior-programme'),
    )

    const adultProgrammes = Array.from(
      document.querySelectorAll('article.roa-adult-programme'),
    )

    const allProgrammes = [...juniorProgrammes, ...adultProgrammes]

    Handlers = await buildHandlers()

    for (const programme of allProgrammes) {
      const id = programme.id
      const {
        generate,
        init: initAction,
        form: formAction,
        bookNow: bookNowAction,
        cancel: cancelAction,
        submit: submitAction,
      } = Handlers[id]

      const { form } = articleElements(programme)

      await initAction(form, id, generate)
      const {
        bookNow,
        form: newForm,
        cancel,
        submit,
      } = articleElements(programme)

      bookNow.addEventListener('click', bookNowAction)
      cancel?.addEventListener('click', cancelAction)
      submit?.addEventListener('click', submitAction)

      newForm.addEventListener('click', formAction)
      newForm.addEventListener('input', formAction)
    }
  } catch (error) {
    console.error('squash script failed', error)
  }
})()
