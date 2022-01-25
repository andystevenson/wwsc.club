// function to attach dark/light theme to the whole document
const html = document.firstElementChild

const storageKey = 'color-scheme'

// check the OS system settings first
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

let theme = prefersDark.matches ? 'dark' : 'light'
theme = theme === 'dark' ? theme : 'light' // takes care of the default case of no-preference

// read from localStorage ... if not set then set it to whatever the system preference is
// the first time around
const setPreference = (preference) => {
  localStorage.setItem(storageKey, preference)
  html.dataset.theme = preference
  theme = preference
  return preference
}

const initPreference = () => {
  const current = localStorage.getItem(storageKey)
  if (current) return setPreference(current)
  setPreference(theme)
  return theme
}
// call it once on load to initialise the document
initPreference()

const goLight = () => setPreference('light')
const goDark = () => setPreference('dark')

const toggleTheme = () => (theme === 'light' ? goDark() : goLight())

// set up the listeners looking for the user to do an OS level preference change
prefersDark.addEventListener('change', toggleTheme)

// once the DOM has loaded attach to the theme-toggler to watch for click events, if he's there at all
document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('#theme-toggler')
  toggler?.addEventListener('click', toggleTheme)
})
