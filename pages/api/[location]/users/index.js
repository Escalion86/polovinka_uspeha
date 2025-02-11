import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('Users', req, res, null, {
    select: {
      images: 0,
      haveKids: 0,
      security: 0,
      notifications: 0,
      soctag: 0,
      custag: 0,
      town: 0,
      prevActivityAt: 0,
      lastActivityAt: 0,
      archive: 0,
      role: 0,
      registrationType: 0,
    },
  })
}
