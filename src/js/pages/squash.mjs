import { nearestDayOfWeek, ordinalDate } from '../utilities/dates.mjs'
import { v4 as uuid } from 'uuid'

// data configuration for squash
let squashData = null

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

const handleBookNow = (e) => {
  e.preventDefault()

  const bookNow = e.target
  const article = bookNow.closest('article')
  const { image, form, firstInput } = articleElements(article)
  image.classList.add('inactive')
  bookNow.classList.add('inactive')
  form.classList.remove('inactive')
  form.classList.add('active')
  firstInput.focus()
}

const bookingData = (form) => {
  const data = new FormData(form)
  const entries = Object.fromEntries(data.entries())
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
}

const handleSubmit = (e) => {
  console.log('handleSubmit')
  e.preventDefault()

  const submit = e.target
  const form = submit.closest('form')
  // const isValid = form.checkValidity()
  const booking = bookingData(form)
  console.log({ booking })
  handleCancel(e)
}

// utilities

const updatePricePaid = (article, price) => {
  const pricePaid = article.querySelector('input[name="price-paid"')
  console.log({ pricePaid })
  pricePaid.value = price
}

const countCheckboxPairs = (checked) => {
  const paired = []
  const count = checked.reduce((sum, current) => {
    const id = current.id
    const pair = document.getElementById(current.dataset.pair)
    if (paired.includes(id)) return sum
    if (pair.checked) {
      sum = sum + 1
      paired.push(id, pair.id)
    }
    return sum
  }, 0)

  return count
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

// forms
const eliteForm = (name, price, unit) => {
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <fieldset class="pricing">
          <legend>price</legend>
          <p class="description">
            <span class="price" data-price=${price}>£${price}</span>
            <span class="unit" data-unit="${unit}">per ${unit}</span>
          </p>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <label for="${name}-july-31-2023">
            <input type="checkbox" name="${name}-july-31-2023" id="${name}-july-31-2023">
            <span>July 31st,2023</span>
          </label>
          <label for="${name}-august-1-2023">
            <input type="checkbox" name="${name}-august-1-2023" id="${name}-august-1-2023">
            <span>August 1st,2023</span>
          </label>
          <label for="${name}-august-2-2023">
            <input type="checkbox" name="${name}-august-2-2023" id="${name}-august-2-2023">
            <span>August 2nd,2023</span>
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}

const summerCampsForm = (name, prices) => {
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <fieldset class="pricing" data-price1="${
          prices[0].price
        }" data-price2="${prices[1].price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[0].price}>£${
    prices[0].price
  }</span>
              <span class="unit" data-unit="${prices[0].unit}">per ${
    prices[0].unit
  }</span>
            </div>
            <div>
              <span class="price" data-price=${prices[1].price}>£${
    prices[1].price
  }</span>
              <span class="unit" data-unit="${prices[1].unit}">for ${
    prices[1].unit
  }</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <label for="${name}-july-27-2023">
            <input type="checkbox" name="${name}-july-27-2023" id="${name}-july-27-2023" data-pair="${name}-july-28-2023">
            <span>27th</span>
          </label>
          <label for="${name}-july-28-2023">
            <input type="checkbox" name="${name}-july-28-2023" id="${name}-july-28-2023" data-pair="${name}-july-27-2023">
            <span>28th</span>
          </label>
          <span>July, 2023</span>

          <label for="${name}-august-7-2023">
            <input type="checkbox" name="${name}-august-7-2023" id="${name}-august-7-2023" data-pair="${name}-august-8-2023">
            <span>7th</span>
          </label>
          <label for="${name}-august-8-2023">
            <input type="checkbox" name="${name}-august-8-2023" id="${name}-august-8-2023" data-pair="${name}-august-7-2023">
            <span>8th</span>
          </label>
          <span>August, 2023</span>

          <label for="${name}-august-29-2023">
            <input type="checkbox" name="${name}-august-29-2023" id="${name}-august-29-2023" data-pair="${name}-august-30-2023">
            <span>29th</span>
          </label>
          <label for="${name}-august-30-2023">
            <input type="checkbox" name="${name}-august-30-2023" id="${name}-august-30-2023" data-pair="${name}-august-29-2023">
            <span>30th</span>
          </label>
          <span>August, 2023</span>

        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}

const juniorProgrammeForm = (name, prices) => {
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
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="${name}-card" id="${name}-card">
        </label>
        <fieldset class="pricing members" data-price1="${
          prices[0].price
        }" data-price2="${prices[1].price}">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[0].price}>£${
    prices[0].price
  }</span>
              <span class="unit" data-unit="${prices[0].unit}">per ${
    prices[0].unit
  }</span>
            </div>
            <div>
              <span class="price" data-price=${prices[1].price}>£${
    prices[1].price
  }</span>
              <span class="unit" data-unit="${prices[1].unit}">for ${
    prices[1].unit
  }</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="pricing non-members" data-price3="${
          prices[2].price
        }" data-price4="${prices[3].price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[2].price}>£${
    prices[2].price
  }</span>
              <span class="unit" data-unit="${prices[2].unit}">per ${
    prices[2].unit
  }</span>
            </div>
            <div>
              <span class="price" data-price=${prices[3].price}>£${
    prices[3].price
  }</span>
              <span class="unit" data-unit="${prices[3].unit}">for ${
    prices[3].unit
  }</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>select sessions to attend</legend>
          <small>${nextDay}</small>
          <small>${followingDay}</small>
          <label for="${name}-tuesday">
            <input type="checkbox" name="${name}-tuesday" id="${name}-tuesday">
            <span>17:00-18:00, Tuesday</span>
          </label>
          <label for="${name}-saturday">
            <input type="checkbox" name="${name}-saturday" id="${name}-saturday">
            <span>10:00-12:45, Saturday</span>
          </label>
          <label for="${name}-repeat">
            <input type="number" name="${name}-repeat" id="${name}-repeat" value=1 min=1 max=8>
            <span>week(s)</span>
            <sup>(max 8)</sup>

          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}

const individualForm = (name, prices) => {
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
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="${name}-card" id="${name}-card">
        </label>
        <fieldset class="pricing members" data-price1="${prices[0].price}"">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[0].price}>£${
    prices[0].price
  }</span>
              <span class="unit" data-unit="${prices[0].unit}">per ${
    prices[0].unit
  }</span>
            </div>

          </section>
        </fieldset>
        <fieldset class="pricing non-members" data-price2="${prices[1].price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[1].price}>£${
    prices[1].price
  }</span>
              <span class="unit" data-unit="${prices[1].unit}">per ${
    prices[1].unit
  }</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <label for="${name}-repeat">
            <input type="number" name="${name}-repeat" id="${name}-repeat" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 8)</sup>
            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}

const skillsAndDrillsForm = (name, prices) => {
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
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="${name}-card" id="${name}-card">
        </label>
        <fieldset class="pricing members" data-price1="${prices[0].price}"">
          <legend>members price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[0].price}>£${
    prices[0].price
  }</span>
              <span class="unit" data-unit="${prices[0].unit}">per ${
    prices[0].unit
  }</span>
            </div>

          </section>
        </fieldset>
        <fieldset class="pricing non-members" data-price2="${prices[1].price}">
          <legend>price</legend>
          <section class="description">
            <div>
              <span class="price" data-price=${prices[1].price}>£${
    prices[1].price
  }</span>
              <span class="unit" data-unit="${prices[1].unit}">per ${
    prices[1].unit
  }</span>
            </div>
          </section>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <small>${nextTuesday}</small>
          <label for="${name}-repeat">
            <input type="number" name="${name}-repeat" id="${name}-repeat" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 8)</sup>            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}

const clubNightForm = (name, prices) => {
  const template = `
  <form action="" class="inactive" >
    <fieldset id="${name}-form">
      <legend>booking</legend>
      <p class="description">${name}</p>
      <section>
        <label for="${name}-name">
          <span>Name</span>
          <input type="text" name="${name}-name" id="${name}-name" placeholder="Full Name ... e.g.: Joe Bloggs" autofocus required>
        </label>
        <label for="${name}-email">
          <span>Email</span>
          <input type="email" name="${name}-email" id="${name}-email" placeholder="e.g.: someone@example.com" required>
        </label>
        <label for="${name}-mobile">
          <span>Mobile</span>
          <input type="text" name="${name}-mobile" id="${name}-mobile" placeholder="Mobile Number ... e.g.: 07920 027695">
        </label>
        <label for="${name}-card">
          <span>Membership Card</span>
          <input type="text" name="${name}-card" id="${name}-card">
        </label>
        <fieldset class="pricing">
          <legend>price</legend>
          <p class="description">FREE</p>
        </fieldset>
        <fieldset class="sessions">
          <legend>number of sessions</legend>
          <label for="${name}-repeat">
            <input type="number" name="${name}-repeat" id="${name}-repeat" value=0 min=0 max=8>
            <span>week(s)</span>
            <sup>(max 8)</sup>            
          </label>
        </fieldset>
        <section class="submit">
          <button type="button" id="${name}-cancel">Cancel</button>
          <button type="submit" id="${name}-submit" disabled>Buy</button>
        </section>
        <input type="hidden" value="${uuid()}" name="booking-reference">
        <input type="hidden" value="${name}" name="programme">
        <input type="hidden" value="" name="price-paid">
      </section>
    </fieldset>
  </form>`

  return template
}
// init

const handleInit = (form, id, generateForm) => {
  const programme = findSquashData(id)
  const { name, prices } = programme

  const newForm = generateForm(name, prices)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

const handleEliteInit = (form) => {
  const programme = findSquashData('roa-elite-junior-camp')
  const { name, prices } = programme
  const { price, unit } = prices[0]

  const newForm = eliteForm(name, price, unit)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

const handleSummerCampsInit = (form) => {
  const programme = findSquashData('roa-junior-squash-summer-camps')
  const { name, prices } = programme

  const newForm = summerCampsForm(name, prices)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

const handleJuniorProgrammeInit = (form) => {
  const programme = findSquashData('roa-junior-squash-programme')
  const { name, prices } = programme

  const newForm = juniorProgrammeForm(name, prices)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

const handleIndividualInit = (form, id) => {
  console.log('handleIndividualInit', id)
  const programme = findSquashData(id)
  const { name, prices } = programme

  console.log({ programme, name, prices })
  const newForm = individualForm(name, prices)
  const parser = new DOMParser()
  const doc = parser.parseFromString(newForm, 'text/html')
  const replaceForm = doc.querySelector('form')
  form.replaceWith(replaceForm)
  return replaceForm
}

// form handlers
const handleEliteForm = (e) => {
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
  const price = +article.querySelector('.price').dataset.price * inputs.length
  submit.textContent = inputs.length > 0 ? `Buy (£${price})` : 'Buy'
  inputs.length > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (inputs.length > 0) updatePricePaid(article, price)
}

const handleSummerCampsForm = (e) => {
  console.log('handleSummerCampsForm')

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

  const pricing = article.querySelector('.pricing')
  const price1 = +pricing.dataset.price1
  const price2 = +pricing.dataset.price2
  const discount = price1 * 2 - price2
  let price = price1 * inputs.length

  const pairs = countCheckboxPairs(inputs)
  price = price - discount * pairs

  submit.textContent = inputs.length > 0 ? `Buy (£${price})` : 'Buy'
  inputs.length > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (inputs.length > 0) updatePricePaid(article, price)
}

const handleJuniorProgrammeForm = (e) => {
  console.log('handleJuniorProgrammeForm')

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
  const price2 = +pricing.dataset.price2
  pricing = article.querySelector('.pricing.non-members')
  const price3 = +pricing.dataset.price3
  const price4 = +pricing.dataset.price4

  const weeks = +article.querySelector('input[type=number]').value
  console.log({ price1, price2, price3, price4, weeks })
  let price = 0
  let isMember = false
  price = weeks >= 8 ? price2 : weeks * price1
  if (!isMember) price = weeks >= 8 ? price4 : weeks * price3

  price = price * inputs.length

  submit.textContent = inputs.length > 0 ? `Buy (£${price})` : 'Buy'
  inputs.length > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (inputs.length > 0) updatePricePaid(article, price)
}

const handleIndividualForm = (e) => {
  console.log('handleIndividualForm')

  const article = e.target.closest('article')

  const { submit } = articleElements(article)

  let pricing = article.querySelector('.pricing.members')
  const price1 = +pricing.dataset.price1
  pricing = article.querySelector('.pricing.non-members')
  const price2 = +pricing.dataset.price2

  let weeks = +article.querySelector('input[type=number]').value
  console.log({ price1, price2, weeks })
  if (weeks > 8) weeks = 8
  if (weeks < 0) weeks = 0
  let price = 0
  let isMember = false
  price = weeks * price2
  if (!isMember) weeks * price1
  console.log({ price1, price2, weeks })

  submit.textContent = weeks > 0 ? `Buy (£${price})` : 'Buy'
  weeks > 0 ? (submit.disabled = false) : (submit.disabled = true)
  if (weeks > 0) updatePricePaid(article, price)
}

const handleClubNightForm = (e) => {
  console.log('handleClubNightForm')

  const article = e.target.closest('article')

  const { submit } = articleElements(article)

  let weeks = +article.querySelector('input[type=number]').value
  weeks > 0 ? (submit.disabled = false) : (submit.disabled = true)
}
// controller
const buildHandlers = () => {
  const handlers = {
    'roa-elite-junior-camp': {
      generate: eliteForm,
      init: handleEliteInit,
      form: handleEliteForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-elite-junior-camp'),
    },

    'roa-junior-squash-summer-camps': {
      generate: summerCampsForm,
      init: handleSummerCampsInit,
      form: handleSummerCampsForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-junior-squash-summer-camps'),
    },
    'roa-junior-squash-programme': {
      generate: juniorProgrammeForm,
      init: handleJuniorProgrammeInit,
      form: handleJuniorProgrammeForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-junior-squash-programme'),
    },
    'roa-individual-coaching': {
      generate: individualForm,
      init: handleIndividualInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-individual-coaching'),
    },

    'roa-skills-and-drills': {
      generate: skillsAndDrillsForm,
      init: handleInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-skills-and-drills'),
    },
    'roa-club-night': {
      generate: clubNightForm,
      init: handleInit,
      form: handleClubNightForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-club-night'),
    },
    'roa-individual-adult-coaching': {
      generate: individualForm,
      init: handleIndividualInit,
      form: handleIndividualForm,
      bookNow: handleBookNow,
      cancel: handleCancel,
      submit: handleSubmit,
      data: findSquashData('roa-individual-adult-coaching'),
    },
  }
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

    const handlers = buildHandlers()

    allProgrammes.forEach((programme) => {
      const id = programme.id
      const {
        generate,
        init: initAction,
        form: formAction,
        bookNow: bookNowAction,
        cancel: cancelAction,
        submit: submitAction,
      } = handlers[id]

      const { form } = articleElements(programme)

      initAction(form, id, generate)
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
    })
  } catch (error) {
    console.error('squash script failed', error)
  }
})()
