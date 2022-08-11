const getCategories = require('../js/productCategories.js')
const formatPoundValue = require('../js/formatPoundValue.js')

const teaAndCoffeeCategory = async () => {
  const categories = await getCategories()

  const theTeaAndCoffeeCategory = Object.values(categories).find(
    (category) => category.name === 'TEA & COFFEE',
  )

  theTeaAndCoffeeCategory.children.forEach(
    (tAc) => (tAc.selling_price = formatPoundValue(tAc.selling_price)),
  )
  return theTeaAndCoffeeCategory
}

async function produce() {
  const teaAndCoffee = await teaAndCoffeeCategory()

  return teaAndCoffee
}

module.exports = produce()
