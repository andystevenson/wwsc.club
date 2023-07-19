import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

export const today = dayjs()

export const nextDay = (dayOfWeek) => {
  let day = today.startOf('day')
  while (day.day() !== dayOfWeek) day = day.add(1, 'day')
  return day
}

export const DaysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const nextDayOfWeek = (day) =>
  nextDay(DaysOfWeek.findIndex((weekday) => day.toLowerCase() === weekday))

export const nextSunday = () => nextDay(0)
export const nextMonday = () => nextDay(1)
export const nextTuesday = () => nextDay(2)
export const nextWednesday = () => nextDay(3)
export const nextThursday = () => nextDay(4)
export const nextFriday = () => nextDay(5)
export const nextSaturday = () => nextDay(6)

// utilities
export const ordinalDate = (date) => date.format('dddd, Do MMMM, YYYY')

export const nearestDay = (...days) => {
  const nextDays = days
    .map((day) => nextDay(day))
    .sort((a, b) => {
      if (a.isBefore(b, 'day')) return -1
      if (a.After(b, 'day')) return 1
      return 0
    })
  return nextDays
}

export const nearestDayOfWeek = (...days) => {
  const nextDaysOfWeek = days
    .map((day) => nextDayOfWeek(day))
    .sort((a, b) => {
      if (a.isBefore(b, 'day')) return -1
      if (a.After(b, 'day')) return 1
      return 0
    })
  return nextDaysOfWeek
}
