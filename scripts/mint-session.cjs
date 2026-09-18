/* Минтит dev-сессию next-auth для тестового вызова API (Владимир Кондаков, участник события 03.09).
 * Запуск: node --env-file=.env.local scripts/mint-session.cjs
 */
const { encode } = require('next-auth/jwt')

const main = async () => {
  const secret = process.env.SECRET
  if (!secret) throw new Error('Нет SECRET')

  const token = await encode({
    token: {
      name: '65f659b0e7d7e5bc59933e4b',
      email: 'krsk',
      userId: '65f659b0e7d7e5bc59933e4b',
      location: 'krsk',
      sub: '65f659b0e7d7e5bc59933e4b',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    secret,
    maxAge: 3600,
  })
  console.log(token)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
