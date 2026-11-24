export function getAllowedList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedEmail(email: string, allowedEmails: string[]) {
  const normalizedEmail = email.trim().toLowerCase()

  return allowedEmails.includes('*') || allowedEmails.includes(normalizedEmail)
}
