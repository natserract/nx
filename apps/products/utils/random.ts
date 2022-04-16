/* eslint-disable @typescript-eslint/ban-ts-comment */
// Special chars from https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
const validUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const validLowercase = 'abcdefghijklmnopqrstuvwxyz'
const validNumber = '0123456789'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _validSpecial = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`'

// See: https://javascript.info/property-descriptors#sealing-an-object-globally
const asciiChars =
  validUppercase + validLowercase + validNumber

export function cryptoRandomArray(len: number, max: number) {
  const UintArray =
    max <= 255
      ? Uint8Array
      : max <= 65535
        ? Uint16Array
        : max <= 4294967295
          ? Uint32Array
          : BigUint64Array
  const randMax = Math.pow(2, UintArray.BYTES_PER_ELEMENT * 8) - 1
  const bytearray = new UintArray(len) as unknown as any
  window.crypto.getRandomValues(bytearray)

  // See: https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
  const upper = max + 1

  if (upper > randMax) return bytearray
  const unbiasedMax = randMax - (randMax % upper) - 1

  return bytearray.map((x: number) => {
    if (x > unbiasedMax) {
      const b = new UintArray(1) as unknown as any
      do {
        window.crypto.getRandomValues(b)
      } while (b[0] > unbiasedMax)

      return b[0] % upper
    }

    return x % upper
  })
}

export function cryptoRandomString(len = 40, charSet = asciiChars, excludeChars = '') {
  const pattern = new RegExp(`\\[${excludeChars}]+`, 'g')
  const excludedChars = charSet.replace(pattern, '')

  // See: https://javascript.info/string#surrogate-pairs
  // See: https://javascript.info/iterable#array-from
  const charSetSplit = Array.from(excludeChars ? excludedChars : charSet)
  const charPositions = cryptoRandomArray(len, charSetSplit.length - 1)

  // See: https://javascript.info/arraybuffer-binary-arrays
  return Array.from(charPositions)
    // @ts-ignore
    .map((pos: string) => charSetSplit[pos])
    .join('')
}
