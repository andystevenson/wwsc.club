const getCategories = require('../js/getSumupProductCategories')
const formatPoundValue = require('../js/formatPoundValue')

const orderVariants = (beer) => {
  const ordered = {
    half: null,
    pint: null,
    bottle: null,
    small: null,
    large: null,
  }

  if (beer.current_variants.length) {
    beer.current_variants.forEach((variant) => {
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
    beer.current_variants = newVariants
  }
}

const beerCategory = async () => {
  const categories = await getCategories()

  const theBeerCategory = Object.values(categories).find(
    (category) => category.name === 'BEER',
  )

  theBeerCategory.children.forEach((beer) => {
    beer.selling_price = formatPoundValue(beer.selling_price)
    orderVariants(beer)
  })

  return theBeerCategory
}

async function produce() {
  const beerList = await beerCategory()

  return beerList
}

module.exports = produce()
