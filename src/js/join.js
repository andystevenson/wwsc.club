console.log('join join join join')

const main = document.querySelector('main')
const annual = document.getElementById('annual-prices')
const monthly = document.getElementById('monthly-prices')
const visitor = document.getElementById('visitor-prices')
const benefits = main.querySelector('section.benefits')
const withMembership = main.querySelector('span.with-membership')

// monthly prices are not shown by default
const annualIcon = annual.firstElementChild
const monthlyIcon = monthly.firstElementChild
const visitorIcon = visitor.firstElementChild

monthlyIcon.style.display = 'none'
visitorIcon.style.display = 'none'

const annualPrices = document.querySelectorAll('article.annual')
const monthlyPrices = document.querySelectorAll('article.monthly')
const visitorPrices = document.querySelectorAll('article.visitor')
monthlyPrices.forEach((price) => (price.style.display = 'none'))
visitorPrices.forEach((price) => (price.style.display = 'none'))

annual.addEventListener('click', (e) => {
  withMembership.style.display = 'inline'
  visitorIcon.style.display = 'none'
  monthlyIcon.style.display = 'none'
  annualIcon.style.display = 'block'

  visitorPrices.forEach((price) => (price.style.display = 'none'))
  monthlyPrices.forEach((price) => (price.style.display = 'none'))
  annualPrices.forEach((price) => (price.style.display = 'grid'))
})

monthly.addEventListener('click', (e) => {
  withMembership.style.display = 'inline'
  benefits.style.display = 'grid'
  visitorIcon.style.display = 'none'
  annualIcon.style.display = 'none'
  monthlyIcon.style.display = 'block'
  monthlyPrices.forEach((price) => (price.style.display = 'grid'))
  visitorPrices.forEach((price) => (price.style.display = 'none'))
  annualPrices.forEach((price) => (price.style.display = 'none'))
})

visitor.addEventListener('click', (e) => {
  withMembership.style.display = 'none'
  benefits.style.display = 'none'
  visitorIcon.style.display = 'block'
  annualIcon.style.display = 'none'
  monthlyIcon.style.display = 'none'
  visitorPrices.forEach((price) => (price.style.display = 'grid'))
  monthlyPrices.forEach((price) => (price.style.display = 'none'))
  annualPrices.forEach((price) => (price.style.display = 'none'))
})
