const getCategories = require('../js/getSumupProductCategories')
const formatPoundValue = require('../js/formatPoundValue')

const orderVariants = (sportsDrinks) => {
  const ordered = {
    half: null,
    pint: null,
    bottle: null,
  }

  if (sportsDrinks.current_variants.length) {
    sportsDrinks.current_variants.forEach((variant) => {
      variant.selling_price = formatPoundValue(variant.selling_price)
      ordered[variant.display_name.toLowerCase()] = variant
    })

    // purge empty keys
    for (key in ordered) {
      if (ordered[key] === null) {
        delete ordered[key]
      }
    }
    const newVariants = Object.values(ordered)
    sportsDrinks.current_variants = newVariants
  }
}

const sportsDrinksCategory = async () => {
  const categories = await getCategories()

  const theSpirtsCategory = Object.values(categories).find(
    (category) => category.name === 'SOFT DRINKS',
  )

  theSpirtsCategory.children.forEach((sportsDrinks) => {
    sportsDrinks.selling_price = formatPoundValue(sportsDrinks.selling_price)
    orderVariants(sportsDrinks)
  })

  return theSpirtsCategory
}

async function produce() {
  const sportsDrinksList = await sportsDrinksCategory()

  return sportsDrinksList
}

module.exports = produce()
