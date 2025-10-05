import crypto from 'crypto'

const PBKDF2_ITERATIONS = 120000
const PBKDF2_KEYLEN = 64
const PBKDF2_DIGEST = 'sha512'
const HASH_PREFIX = 'pbkdf2'

const pbkdf2Async = (password, salt, iterations, keylen, digest) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (error, derivedKey) => {
      if (error) {
        reject(error)
      } else {
        resolve(derivedKey)
      }
    })
  })

export const isPasswordHashed = (password) =>
  typeof password === 'string' && password.startsWith(`${HASH_PREFIX}$`)

export const hashPassword = async (password) => {
  if (typeof password !== 'string' || password.length === 0) return password
  if (isPasswordHashed(password)) return password

  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await pbkdf2Async(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  )

  return `${HASH_PREFIX}$${PBKDF2_ITERATIONS}$${salt}$${derivedKey.toString('hex')}`
}

export const verifyPassword = async (password, storedPassword) => {
  if (typeof password !== 'string' || !storedPassword) return false

  if (!isPasswordHashed(storedPassword)) {
    return storedPassword === password
  }

  const [, iterationsRaw, salt, hash] = storedPassword.split('$')
  const iterations = Number(iterationsRaw)

  if (!iterations || !salt || !hash) return false

  const derivedKey = await pbkdf2Async(
    password,
    salt,
    iterations,
    hash.length / 2,
    PBKDF2_DIGEST
  )

  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derivedKey)
  } catch (error) {
    return false
  }
}

export const shouldRehashPassword = (password) => !isPasswordHashed(password)
