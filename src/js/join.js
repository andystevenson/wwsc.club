console.log('join join join join')

const categories = document.querySelector('.join-categories')
const buttons = [...categories.children]

const category = (button) => {
  const name = button.id.replace('join-', '')
  return name
}

const unselect = () => {
  buttons.forEach((button) => {
    button.firstElementChild.style.display = 'none'
    const type = category(button)
    const benefits = document.getElementById(`${type}-benefits`)
    const products = document.getElementById(`${type}-category`)
    benefits && (benefits.style.display = 'none')
    products && (products.style.display = 'none')
  })
}

const select = (button) => {
  button.firstElementChild.style.display = 'inline'
  const type = category(button)
  const benefits = document.getElementById(`${type}-benefits`)
  const products = document.getElementById(`${type}-category`)
  benefits && (benefits.style.display = 'grid')
  products && (products.style.display = 'grid')
}

// to start with the first category is selected
unselect()
select(buttons[0])

categories.addEventListener('click', (e) => {
  const button = e.target.closest('button')
  if (!button) return
  unselect()
  select(button)
})
