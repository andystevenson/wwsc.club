console.log('join join join join')

const annual = document.getElementById('annual-prices')
const monthly = document.getElementById('monthly-prices')

// monthly prices are not shown by default
const annualIcon = annual.firstElementChild
const monthlyIcon = monthly.firstElementChild

monthlyIcon.style.display = 'none'

const annualPrices = document.querySelectorAll('article.annual')
const monthlyPrices = document.querySelectorAll('article.monthly')
monthlyPrices.forEach((price) => (price.style.display = 'none'))

annual.addEventListener('click', (e) => {
  monthlyIcon.style.display = 'none'
  annualIcon.style.display = 'block'
  monthlyPrices.forEach((price) => (price.style.display = 'none'))
  annualPrices.forEach((price) => (price.style.display = 'grid'))
})

monthly.addEventListener('click', (e) => {
  annualIcon.style.display = 'none'
  monthlyIcon.style.display = 'block'
  monthlyPrices.forEach((price) => (price.style.display = 'grid'))
  annualPrices.forEach((price) => (price.style.display = 'none'))
})
