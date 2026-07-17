export const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Enter a valid email address',
}

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
}

export const nameRules = {
  required: 'Full name is required',
  minLength: { value: 2, message: 'Name is too short' },
}
