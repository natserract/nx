// eslint-disable-next-line @typescript-eslint/ban-types
type Val = {}

type StorageValues = {
  [key: string]: Val
}

export function setItem(key: string, object: StorageValues) {
  return localStorage.setItem(key, JSON.stringify(object));
}

export function getItem(key: string) {
  const lack = JSON.stringify({})

  return JSON.parse(localStorage.getItem(key) ?? lack)
}

export function hasItem(key: string) {
  return localStorage.getItem(key) !== null;
}

export function remove(key: string) {
  return localStorage.removeItem(key)
}

export function removeAll() {
  return localStorage.clear()
}
