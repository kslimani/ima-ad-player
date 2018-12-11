// utils.js

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function makeNum(value, fallback) {
  return isNumeric(value) ? value + 0 : fallback
}

export function makeDefault(value, defaultValue) {
  return value === undefined ? defaultValue : value
}

export function isFunction(value) {
  return typeof value === 'function'
}
