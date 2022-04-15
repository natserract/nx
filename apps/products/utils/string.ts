// Create slug from string
// From: https://gist.github.com/codeguy/6684588
export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, _index) {
      return word.toUpperCase()
    })
    .replace(/\s+/g, ' ')
}

export const excerptStr = (str: string, maxLen: number) => {
  const lastChar = '...'

  if (str.length > maxLen) {
    return str.substring(0, maxLen) + lastChar
  }

  return str
}

/**
 * Remove dash character
 * unDashStr(bla-bla)
 */
export const unDashStr = (str: string, replcWith = ' ') =>
  str.replace(/-/g, replcWith)

/**
 * Serializing file url, use from download file
 */
export const serializeFileUrl = (fileUrl: string) => {
  const fileRegex = /^.*\.(jpe?g|gif|png|pdf|docx|zip|xlsx)/i

  return fileUrl.match(fileRegex)[0]
}
