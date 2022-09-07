const getCategories = require('../js/getSumupProductCategories')
const formatPoundValue = require('../js/formatPoundValue')

const orderVariants = (sundayLunch) => {
  const ordered = {
    adult: null,
    kids: null,
  }

  if (sundayLunch.current_variants.length) {
    sundayLunch.current_variants.forEach((variant) => {
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
    sundayLunch.current_variants = newVariants
  }
}

const sundayLunchCategory = async () => {
  const categories = await getCategories()

  const theSpirtsCategory = Object.values(categories).find(
    (category) => category.name === 'SUNDAY LUNCH',
  )

  theSpirtsCategory.children.forEach((sundayLunch) => {
    sundayLunch.selling_price = formatPoundValue(sundayLunch.selling_price)
    orderVariants(sundayLunch)
  })

  return theSpirtsCategory
}

async function produce() {
  const sundayLunchList = await sundayLunchCategory()

  return sundayLunchList
}

module.exports = produce()
