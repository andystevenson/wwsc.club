const getCategories = require('../js/productCategories.js')
const formatPoundValue = require('../js/formatPoundValue.js')

const orderVariants = (spirits) => {
  const ordered = {
    single: null,
    double: null,
  }

  if (spirits.current_variants.length) {
    spirits.current_variants.forEach((variant) => {
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
    spirits.current_variants = newVariants
  }
}

const spiritsCategory = async () => {
  const categories = await getCategories()

  const theSpirtsCategory = Object.values(categories).find(
    (category) => category.name === 'SPIRITS',
  )

  theSpirtsCategory.children.forEach((spirits) => {
    spirits.selling_price = formatPoundValue(spirits.selling_price)
    orderVariants(spirits)
  })

  return theSpirtsCategory
}

async function produce() {
  const spiritsList = await spiritsCategory()

  return spiritsList
}

module.exports = produce()
