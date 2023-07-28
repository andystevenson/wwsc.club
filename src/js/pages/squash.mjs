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
import dayjs from 'dayjs'
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
  const db = await Handlers.db(programme)
  const { open } = db

  if (open) {
    image.classList.add('inactive')
    bookNow.classList.add('inactive')
    form.classList.remove('inactive')
    form.classList.add('active')
    firstInput.focus()
    return
  }

  // the programme has closed
  bookNow.textContent = 'Fully Booked!'
}

const bookingData = (form) => {
  const data = new FormData(form)
  const entries = Object.fromEntries(data.entries())
  // make the stripe checkout session easier
  if (entries['stripe-price'] !== '') {
    entries.session = {
      client_reference_id: entries['booking-reference'],
      success_url: `${window.location.origin}/roa-thanks`,
      customer_email: entries.email,
      // custom_text: {
      //   submit: {
      //     message: `${entries.weeks} sessions at ${entries['unit-price']}`,
      //   },
      // },
      line_items: [
        { price: entries['stripe-price'], quantity: entries.quantity },
      ],
      mode: 'payment',
      metadata: {
        /*
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
        */
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
        roaProgramme: entries['roa-programme'],
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

const roaProgramme = async (programme) => {
  try {
    const response = await fetch(`/api/roa-programme/?name=${programme}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      const programme = await response.json()
      return programme
    }
    console.error('roa-programme failed', response.statusText)
  } catch (error) {
    console.error('roa-programme exception', error)
  }
}

const bookSessions = async (booking) => {
  try {
    const response = await fetch('/api/roa-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking), // body data type must match "Content-Type" header
    })

    if (response.ok) {
      const bookingResponse = await response.json()
      const { data } = bookingResponse
      // console.log('booking completed', bookingResponse, { data })

      return bookingResponse
    }
    console.error('booking failed', response.statusText)
  } catch (error) {
    console.error('booking exception', error)
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
      const bookingSessions = await bookSessions(booking)
      if (booking.session) {
        // stripe checkout session required
        // update the attendee id on the session metadata
        booking.session.metadata.attendee = bookingSessions.id
        const session = await checkout(booking)
        // console.log('session', session)
        window.location.href = session.url
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

const getWeeks = (article) => {
  const weeksElement = article.querySelector('input[type=number]')
  let weeks = +weeksElement.value
  weeks = weeks > 8 ? 8 : weeks < 1 ? 0 : weeks
  weeksElement.value = weeks
  return weeks
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
const eliteForm = (name, prices, id) => {
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
        <fieldset class="pricing"
            data-price="${prices[0].price}" 
            data-unit="${prices[0].unit}" 
            data-stripe="${prices[0].stripe.price}"
            >
          <legend>price</legend>
          <p class="description">
            <span class="price">£${prices[0].price}</span>
            <span class="unit">per ${prices[0].unit}</span>
          </p>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <label for="${name}-d2023-07-31">
            <input type="checkbox" name="d2023-07-31" id="${name}-d2023-07-31">
            <span>July 31st,2023</span>
          </label>
          <label for="${name}-d2023-08-01">
            <input type="checkbox" name="d2023-08-01" id="${name}-d2023-08-01">
            <span>August 1st,2023</span>
          </label>
          <label for="${name}-d2023-08-02">
            <input type="checkbox" name="d2023-08-02" id="${name}-d2023-08-02">
            <span>August 2nd,2023</span>
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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions">
      </section>
    </fieldset>
  </form>`

  return template
}

const summerCampsForm = (name, prices, id) => {
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
          <input type="text" name="card" id="${name}-card" pattern="[0-9]*" 
            title="Please enter digits only!">
        </label>
        <fieldset class="pricing members" 
          data-price1="${prices[0].price}"
          data-stripe1="${prices[0].stripe.price}"
          data-price2="${prices[1].price}" 
          data-stripe2="${prices[1].stripe.price}"
          data-price3="${prices[2].price}"
          data-stripe3="${prices[2].stripe.price}">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[0].price}>£${prices[0].price}</span>
              <span class="unit" 
                data-unit="${prices[0].unit}">per ${prices[0].unit}</span>
            </div>
            <div>
              <span class="price" 
                data-price=${prices[1].price}>£${prices[1].price}</span>
              <span class="unit" 
                data-unit="${prices[1].unit}">for ${prices[1].unit}</span>
            </div>
            <div>
              <span class="price" 
                data-price=${prices[2].price}>£${prices[2].price}</span>
              <span class="unit" 
                data-unit="${prices[2].unit}">for ${prices[2].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="pricing non-members" 
          data-price4="${prices[3].price}"
          data-stripe4="${prices[3].stripe.price}"
          data-price5="${prices[4].price}" 
          data-stripe5="${prices[4].stripe.price}"
          data-price6="${prices[5].price}"
          data-stripe6="${prices[5].stripe.price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[3].price}>£${prices[3].price}</span>
              <span class="unit" 
                data-unit="${prices[3].unit}">per ${prices[3].unit}</span>
            </div>
            <div>
              <span class="price" 
                data-price=${prices[4].price}>£${prices[4].price}</span>
              <span class="unit" 
                data-unit="${prices[4].unit}">for ${prices[4].unit}</span>
            </div>
            <div>
              <span class="price" 
                data-price=${prices[5].price}>£${prices[5].price}</span>
              <span class="unit" 
                data-unit="${prices[5].unit}">for ${prices[5].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <label for="${name}-d2023-07-27">
            <input type="checkbox" name="d2023-07-27" id="${name}-d2023-07-27">
            <span>27th</span>
          </label>
          <label for="${name}-d2023-07-28">
            <input type="checkbox" name="d2023-07-28" id="${name}-d2023-07-28">
            <span>28th</span>
          </label>
          <span>July, 2023</span>

          <label for="${name}-d2023-08-07">
            <input type="checkbox" name="d2023-08-07" id="${name}-d2023-08-07">
            <span>7th</span>
          </label>
          <label for="${name}-d2023-08-08">
            <input type="checkbox" name="d2023-08-08" id="${name}-d2023-08-08">
            <span>8th</span>
          </label>
          <span>August, 2023</span>

          <label for="${name}-d2023-08-29">
            <input type="checkbox" name="d2023-08-29" id="${name}-d2023-08-29">
            <span>29th</span>
          </label>
          <label for="${name}-d2023-08-30">
            <input type="checkbox" name="d2023-08-30" id="${name}-d2023-08-30">
            <span>30th</span>
          </label>
          <span>August, 2023</span>

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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions">
      </section>
    </fieldset>
  </form>`

  return template
}

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
        <fieldset class="pricing members" 
          data-price1="${prices[0].price}" 
          data-stripe1="${prices[0].stripe.price}" 
          data-price2="${prices[1].price}"
          data-stripe2="${prices[1].stripe.price}"
          data-quantity="${prices[1].stripe.quantity}"
          >
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[0].price}>£${prices[0].price}</span>
              <span class="unit" 
                data-unit="${prices[0].unit}">per ${prices[0].unit}</span>
            </div>
            <div>
              <span class="price" 
              data-price=${prices[1].price}>£${prices[1].price}</span>
              <span class="unit" 
                data-unit="${prices[1].unit}">for ${prices[1].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="pricing non-members" 
          data-price3="${prices[2].price}" 
          data-stripe3="${prices[2].stripe.price}" 
          data-price4="${prices[3].price}"
          data-stripe4="${prices[3].stripe.price}"
          data-quantity="${prices[3].stripe.quantity}"
          >
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" 
                data-price=${prices[2].price}>£${prices[2].price}</span>
              <span class="unit" 
                data-unit="${prices[2].unit}">per ${prices[2].unit}</span>
            </div>
            <div>
              <span class="price" 
                data-price=${prices[3].price}>£${prices[3].price}</span>
              <span class="unit" 
                data-unit="${prices[3].unit}">for ${prices[3].unit}</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <small>${nextDay}</small>
          <small>${followingDay}</small>
          <label for="${name}-tuesday">
            <input type="checkbox" name="tuesday" id="${name}-tuesday">
            <span>17:00-18:00, Tuesday</span>
          </label>
          <label for="${name}-saturday">
            <input type="checkbox" name="saturday" id="${name}-saturday">
            <span>10:00-12:45, Saturday</span>
          </label>
          <label for="${name}-weeks">
            <input type="number" name="weeks" id="${name}-weeks" value=1 min=1 max=8>
            <span>week(s)</span>
            <sup>(max 8)</sup>

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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions">
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
            <sup>(max 8)</sup>
            
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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions">
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
            <sup>(max 8)</sup>            
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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions">
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
            <sup>(max 8)</sup>            
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
        <input type="hidden" value='{"sessions":[]}' name="sessions">
        <input type="hidden" value='{"roa-sessions":[]}' name="roa-sessions"> 
      </section>
    </fieldset>
  </form>`

  return template
}
// init

const handleInit = async (form, id, generateForm) => {
  const programme = findSquashData(id)
  const { name, prices } = programme
  const db = await Handlers.db(name)
  const programmeId = db.id

  const newForm = generateForm(name, prices, programmeId, open)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

// const handleEliteInit = async (form) => {
//   const programme = findSquashData('roa-elite-junior-camp')
//   const { name, prices } = programme
//   const db = await Handlers.db(name)
//   const programmeId = db.id

//   const newForm = eliteForm(name, prices, programmeId)
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(newForm, 'text/html')
//   const replaceForm = doc.querySelector('form')
//   form.replaceWith(replaceForm)
//   return replaceForm
// }

// const handleSummerCampsInit = async (form) => {
//   const programme = findSquashData('roa-junior-squash-summer-camps')
//   const { name, prices } = programme
//   const db = await Handlers.db(name)
//   const programmeId = db.id

//   const newForm = summerCampsForm(name, prices, programmeId)
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(newForm, 'text/html')
//   const replaceForm = doc.querySelector('form')
//   form.replaceWith(replaceForm)
//   return replaceForm
// }

// const handleJuniorProgrammeInit = async (form) => {
//   const programme = findSquashData('roa-junior-squash-programme')
//   const { name, prices } = programme
//   const db = await Handlers.db(name)
//   const programmeId = db.id

//   const newForm = juniorProgrammeForm(name, prices, programmeId)
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(newForm, 'text/html')
//   const replaceForm = doc.querySelector('form')
//   form.replaceWith(replaceForm)
//   return replaceForm
// }

// const handleIndividualInit = async (form, id) => {
//   const programme = findSquashData(id)
//   const { name, prices } = programme
//   const db = await Handlers.db(name)
//   const programmeId = db.id

//   const newForm = individualForm(name, prices, programmeId)
//   const parser = new DOMParser()
//   const doc = parser.parseFromString(newForm, 'text/html')
//   const replaceForm = doc.querySelector('form')
//   form.replaceWith(replaceForm)
//   return replaceForm
// }

// form handlers
const sessionIdsFromDates = (dates, sessions) => {
  if (dates.length < 1) return
  if (sessions.length < 1) return

  const ids = []
  for (const date of dates) {
    const formatted = date.format('YYYY-MM-DD')
    // console.log(`looking for session on ${formatted}`)
    const found = sessions.find((session) => session.date === formatted)
    if (found) ids.push(found.id)
    if (!found) console.warn(`session not found ${formatted}`)
  }
  // console.log(`sessionIdsFromDates`, ids)
  return ids
}

const updateROASessions = async (article, sessionDates) => {
  // console.log({ sessionDates })
  const sessionsContent = {
    'roa-sessions': [],
  }

  const programmeName = article.querySelector('input[name="programme"]').value
  const roaSessionsElement = article.querySelector('input[name="roa-sessions"]')

  const db = await Handlers.db(programmeName)

  sessionsContent['roa-sessions'] = sessionIdsFromDates(
    sessionDates,
    db.sessions,
  )

  roaSessionsElement.value = JSON.stringify(sessionsContent)
}

const updateProgrammeSessions = async (article) => {
  const form = article.querySelector('form')
  const formData = new FormData(form)
  const values = Object.fromEntries(formData.entries())

  const dates = []
  for (const property in values) {
    if (property.startsWith('d')) {
      const dateString = property.slice(1)
      dates.push(dayjs(dateString))
    }
  }
  dates.sort(ascending)
  const sessionsContent = {
    sessions: [],
  }
  const sessionsElement = article.querySelector('input[name="sessions"]')

  sessionsContent.sessions = dates.map((date) => date.format('YYYY-MM-DD'))
  sessionsElement.value = JSON.stringify(sessionsContent)
  await updateROASessions(article, dates)
}

const handleEliteForm = (e) => {
  const article = e.target.closest('article')
  const id = article.id

  const inputs = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"]:checked`,
    ),
  )
  const sessions = inputs.length
  const { submit } = articleElements(article)
  const pricing = article.querySelector('.pricing')
  const unitPrice = +pricing.dataset.price
  const stripePrice = pricing.dataset.stripe
  const price = unitPrice * sessions
  submit.textContent = inputs.length > 0 ? `Buy (£${price})` : 'Buy'
  sessions > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (sessions > 0) {
    updatePricePaid(article, price, unitPrice, sessions, stripePrice)
    updateProgrammeSessions(article)
  }
}

const updateJuniorProgrammeSessions = async (article) => {
  const form = article.querySelector('form')
  const formData = new FormData(form)
  const values = Object.fromEntries(formData.entries())

  // console.log(values)
  const onTuesdays = values.tuesday === 'on'
  const onSaturdays = values.saturday === 'on'

  const dates = []
  const weeks = getWeeks(article)
  let nextTue = nextTuesday()
  let nextSat = nextSaturday()
  for (let count = 0; count < weeks; count = count + 1) {
    if (onTuesdays) {
      dates.push(nextTue)
      nextTue = nextTuesday(nextTue.add(1, 'day'))
    }

    if (onSaturdays) {
      dates.push(nextSat)
      nextSat = nextSaturday(nextSat.add(1, 'day'))
    }
  }

  dates.sort(ascending)
  const sessionsContent = {
    sessions: [],
  }
  const sessionsElement = article.querySelector('input[name="sessions"]')

  sessionsContent.sessions = dates.map((date) => date.format('YYYY-MM-DD'))
  sessionsElement.value = JSON.stringify(sessionsContent)
  // console.log(sessionsContent)
  // console.log(sessionsElement.value)
  await updateROASessions(article, dates)
}

const handleJuniorProgrammeForm = async (e) => {
  const article = e.target.closest('article')
  const id = article.id

  const inputs = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"]:checked`,
    ),
  )

  const weeks = getWeeks(article)
  // if any schedule is checked we have a potential buy scenario
  // update the value on the submit button
  const { submit } = articleElements(article)

  let pricing = article.querySelector('.pricing.members')
  const price1 = +pricing.dataset.price1
  const stripe1 = pricing.dataset.stripe1
  const price2 = +pricing.dataset.price2
  const stripe2 = pricing.dataset.stripe2
  let quantity = +pricing.dataset.quantity
  pricing = article.querySelector('.pricing.non-members')
  const price3 = +pricing.dataset.price3
  const stripe3 = pricing.dataset.stripe3
  const price4 = +pricing.dataset.price4
  const stripe4 = pricing.dataset.stripe4
  quantity = +pricing.dataset.quantity

  let price = 0
  let unitPrice = 0
  let stripePrice = ''
  const sessions = inputs.length * weeks

  price = sessions * price1
  unitPrice = price1
  stripePrice = stripe1
  quantity = sessions
  if (weeks === 8) {
    quantity = inputs.length
    price = quantity * price2
    unitPrice = price2
    stripePrice = stripe2
  }

  let isMember = await checkCard(article)
  if (!isMember) {
    price = sessions * price3
    unitPrice = price3
    quantity = sessions
    stripePrice = stripe3
    if (weeks === 8) {
      quantity = inputs.length
      price = quantity * price4
      unitPrice = price4
      stripePrice = stripe4
    }
  }

  submit.textContent = sessions > 0 ? `Buy (£${price})` : 'Buy'
  sessions > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (sessions > 0) {
    updatePricePaid(article, price, unitPrice, quantity, stripePrice)
    await updateJuniorProgrammeSessions(article)
  }
}

const handleSummerCampsForm = async (e) => {
  const article = e.target.closest('article')
  const id = article.id

  const inputs = Array.from(
    article?.querySelectorAll(
      `#${id} .sessions input[type="checkbox"]:checked`,
    ),
  )
  // if any schedule is checked we have a potential buy scenario
  // update the value on the submit button
  const { submit } = articleElements(article)

  let pricing = article.querySelector('.pricing.members')
  const price1 = +pricing.dataset.price1
  const stripe1 = pricing.dataset.stripe1
  const price2 = +pricing.dataset.price2
  const stripe2 = pricing.dataset.stripe2
  const price3 = +pricing.dataset.price3
  const stripe3 = pricing.dataset.stripe3

  pricing = article.querySelector('.pricing.non-members')
  const price4 = +pricing.dataset.price4
  const stripe4 = pricing.dataset.stripe4
  const price5 = +pricing.dataset.price5
  const stripe5 = pricing.dataset.stripe5
  const price6 = +pricing.dataset.price6
  const stripe6 = pricing.dataset.stripe6

  let price = 0
  let unitPrice = 0
  let stripePrice = ''
  let sessions = inputs.length

  // unitPrice for members
  unitPrice = sessions < 2 ? price1 : sessions < 6 ? price2 / 2 : price3
  stripePrice = sessions < 2 ? stripe1 : sessions < 6 ? stripe2 : stripe3

  let isMember = await checkCard(article)
  if (!isMember) {
    unitPrice = sessions < 2 ? price4 : sessions < 6 ? price5 / 2 : price6
    stripePrice = sessions < 2 ? stripe4 : sessions < 6 ? stripe5 : stripe6
  }
  sessions = sessions === 6 ? 1 : sessions
  price = sessions * unitPrice

  submit.textContent = sessions > 0 ? `Buy (£${price})` : 'Buy'
  sessions > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (sessions > 0) {
    updatePricePaid(article, price, unitPrice, sessions, stripePrice)
    await updateProgrammeSessions(article)
  }
}

const updateIndividualSessions = async (article, weeks) => {
  if (weeks < 1) return
  const programme = article.querySelector('input[name="programme"]').value
  if (programme !== 'roa-skills-and-drills') return

  const sessionsContent = {
    sessions: [],
  }
  const sessionsElement = article.querySelector('input[name="sessions"]')
  let nextTue = nextTuesday()
  const dates = []
  for (let count = 0; count < weeks; count = count + 1) {
    dates.push(nextTue)
    nextTue = nextTuesday(nextTue.add(1, 'day'))
  }
  sessionsContent.sessions = dates.map((date) => date.format('YYYY-MM-DD'))
  sessionsElement.value = JSON.stringify(sessionsContent)
  await updateROASessions(article, dates)
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

  let weeks = getWeeks(article)
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
  if (weeks > 0) await updateIndividualSessions(article, weeks)
}

const updateClubNightSessions = async (article, weeks) => {
  if (weeks < 1) return
  const sessionsContent = {
    sessions: [],
  }
  const sessionsElement = article.querySelector('input[name="sessions"]')
  let nextFri = nextFriday()
  const dates = []
  for (let count = 0; count < weeks; count = count + 1) {
    dates.push(nextFri)
    nextFri = nextFriday(nextFri.add(1, 'day'))
  }

  sessionsContent.sessions = dates.map((date) => date.format('YYYY-MM-DD'))
  sessionsElement.value = JSON.stringify(sessionsContent)
  await updateROASessions(article, dates)
}

const handleClubNightForm = async (e) => {
  const article = e.target.closest('article')

  const { submit } = articleElements(article)
  await checkCard(article)

  let weeks = getWeeks(article)
  if (weeks > 0) {
    await updateClubNightSessions(article, weeks)
  }
  weeks > 0 ? (submit.disabled = false) : (submit.disabled = true)
}
// controller
const buildHandlers = async () => {
  const handlers = {
    db: async (name) => {
      if (!Handlers) throw Error('Handlers not initialised')
      if (!Handlers[name].db) Handlers[name].db = await roaProgramme(name)
      return Handlers[name].db
    },

    'roa-elite-junior-camp': {
      generate: eliteForm,
      init: handleInit,
      form: handleEliteForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-junior-squash-summer-camps': {
      generate: summerCampsForm,
      init: handleInit,
      form: handleSummerCampsForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-junior-squash-programme': {
      generate: juniorProgrammeForm,
      init: handleInit,
      form: handleJuniorProgrammeForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-individual-coaching': {
      generate: individualForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-skills-and-drills': {
      generate: skillsAndDrillsForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-club-night': {
      generate: clubNightForm,
      init: handleInit,
      form: handleClubNightForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
    },

    'roa-individual-adult-coaching': {
      generate: individualForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      db: null,
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
