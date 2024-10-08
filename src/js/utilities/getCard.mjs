export async function rawRetCard(cardnumber) {
  try {
    const params = new URLSearchParams({ cardnumber })
    const url = `https://westwarwicks.info/api/get-card?${params}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const result = await response.json()
      return result
    }

    throw Error(`/api/get-card ${result.statusText}`)
  } catch (error) {
    console.error(error.message)
    return null
  }
}

const getCard = rawRetCard

export default getCard

// let a = await getCard('4515')
// console.log('getCard', a)
