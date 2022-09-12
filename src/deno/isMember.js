export const memberStatuses = [
  'live',
  'dd hold',
  'dd presale',
  'defaulter',
  'paid in full',
  'freeze',
]

const isMember = (status) =>
  memberStatuses.includes(status.trim().toLowerCase())

export default isMember
