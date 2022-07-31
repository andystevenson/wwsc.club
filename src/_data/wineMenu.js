const getCategories = require('../js/productCategories.js')

const formatPoundValue = (value) => {
  const { length } = value
  const result = `£${Number(value).toFixed(2)}`.padStart(7, ' ')
  return result
}

const orderVariants = (wine) => {
  const ordered = {
    bottle: {},
    large: {},
    medium: {},
    small: {},
    spritzer: null,
  }

  if (wine.current_variants.length) {
    wine.current_variants.forEach((variant) => {
      ordered[variant.display_name.toLowerCase()] = variant
    })

    if (ordered.spritzer === null) delete ordered.spritzer
    const newVariants = Object.values(ordered)
    wine.current_variants = newVariants
  }
}

const wineCategory = async () => {
  const categories = await getCategories()

  const theWineCategory = Object.values(categories).find(
    (category) => category.name === 'WINE',
  )

  const reCategorizedWines = {}
  theWineCategory?.children?.forEach((wine) => {
    const firstTag = wine.tags[0]
    if (firstTag) {
      const { tag_name } = firstTag
      wine.selling_price = formatPoundValue(wine.selling_price)

      reCategorizedWines[tag_name]
        ? reCategorizedWines[tag_name].push(wine)
        : (reCategorizedWines[tag_name] = [wine])
    }

    wine.current_variants.forEach((variant) => {
      variant.selling_price = formatPoundValue(variant.selling_price)
    })

    orderVariants(wine)
  })

  const finalReCategorizedWines = {}
  const order = [
    'white-wine',
    'sparkling-wine',
    'prosecco-wine',
    'rose-wine',
    'red-wine',
  ].forEach((category) => {
    if (category in reCategorizedWines)
      finalReCategorizedWines[category] = reCategorizedWines[category]
  })

  return finalReCategorizedWines
}

async function produceWineList() {
  const wineList = await wineCategory()

  return wineList
}

module.exports = produceWineList()
