import NextAuth from 'next-auth'
// import Providers from 'next-auth/providers'
// import dbConnect from '@utils/dbConnect'
import Users from '@models/Users'
// import CRUD from '@server/CRUD'
// import Auth0Provider from 'next-auth/providers/auth0'
import GoogleProvider from 'next-auth/providers/google'
import { fetchingUserByEmail } from '@helpers/fetchers'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@utils/dbConnect'
// import VkProvider from 'next-auth/providers/vk'
// import EmailProvider from 'next-auth/providers/email'
// import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
// import clientPromise from '@utils/mongodb'

// import { MongoClient } from 'mongodb'

// const uri = process.env.MONGODB_URI
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// }

// let client
// let clientPromise

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local')
// }

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     global._mongoClientPromise = client.connect()
//   }
//   clientPromise = global._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// const defaultUserProps = {
//   role: 'client',
//   phone: null,
//   whatsapp: null,
//   viber: null,
//   telegram: null,
//   instagram: null,
//   vk: null,
//   gender: null,
//   birthday: null,
//   updatedAt: Date.now(),
//   lastActivityAt: Date.now(),
//   prevActivityAt: Date.now(),
// }

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    secret: process.env.SECRET,
    // Configure one or more authentication providers
    providers: [
      // Providers.Email({
      //   server: process.env.EMAIL_SERVER,
      //   from: process.env.EMAIL_FROM,
      // }),
      CredentialsProvider({
        id: 'credentials', // <- add this line
        name: 'credentials',
        credentials: {
          username: { label: 'EMail', type: 'text', placeholder: '' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
          const { username, password } = credentials
          if (username && password) {
            await dbConnect()
            const userEmail = username.toLowerCase()
            const fetchedUser = await Users.find({ email: userEmail, password })
            console.log('fetchedUser', fetchedUser)
            if (fetchedUser.length > 0) {
              console.log('fetchedUser[0].name', fetchedUser[0]?.name)
              return {
                name: fetchedUser[0].name,
                email: fetchedUser[0].email,
              }
            } else {
              return null
            }
          } else {
            return null
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // authorizationUrl:
        //   'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      }),
      // VkProvider({
      //   clientId: process.env.VK_CLIENT_ID,
      //   clientSecret: process.env.VK_CLIENT_SECRET,
      // }),
      // ...add more providers here
    ],
    callbacks: {
      async session({ session, token }) {
        const { user } = session
        const userEmail = user.email?.toLowerCase()
        // const cached = await dbConnect()
        const result = await fetchingUserByEmail(
          userEmail,
          process.env.NEXTAUTH_SITE
        )
        // console.log('result', result)
        // const result = await Users.find({
        //   email: userEmail,
        // })

        // Если пользователь есть в базе
        if (result?.length) {
          // Если аватарка пользователя не сохранена в cloudinary, то сохраняем в cloudinary и обнояем данные пользователя
          // if (
          //   result[0].image &&
          //   !result[0].image.includes('https://res.cloudinary.com')
          // ) {
          //   await fetch(process.env.CLOUDINARY_UPLOAD_URL, {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json;charset=utf-8',
          //     },
          //     body: JSON.stringify({
          //       file: result[0].image,
          //       upload_preset: process.env.CLOUDINARY_FOLDER + '_users',
          //       public_id: result[0]._id,
          //     }),
          //   })
          //     .then((response) => response.json())
          //     .then(async (data) => {
          //       if (data.secure_url !== '') {
          //         await CRUD(Users, {
          //           method: 'PUT',
          //           query: { id: result[0]._id },
          //           body: { image: data.secure_url },
          //         })
          //         user.image = data.secure_url
          //       }
          //     })
          //     .catch((err) => console.error(err))
          // } else {
          //   user.image = result[0].image
          // }

          user._id = result[0]._id
          user.role = result[0].role
          user.name = result[0].name
          user.phone = result[0].phone
          user.whatsapp = result[0].whatsapp
          user.viber = result[0].viber
          user.telegram = result[0].telegram
          user.instagram = result[0].instagram
          user.vk = result[0].vk
          user.gender = result[0].gender
          user.birthday = result[0].birthday
          user.lastActivityAt = result[0].lastActivityAt
          user.prevActivityAt = result[0].prevActivityAt

          if (result[0].role === 'client') {
          } else {
            // Если пользователь авторизован, то обновляем только время активности
            await Users.findOneAndUpdate(
              { email: userEmail },
              {
                lastActivityAt: Date.now(),
                prevActivityAt: user.lastActivityAt,
              }
            )
          }
        } else {
          // если пользователь не зарегистрирован
        }
        return Promise.resolve(session)
      },
    },
    jwt: {
      secret: 'test',
      encryption: true,
    },
    pages: {
      signIn: '/login',
    },
    // A database is optional, but required to persist accounts in a database
    // database: process.env.MONGODB_URI,
    // adapter: TypeORMLegacyAdapter(process.env.MONGODB_URI)
    // adapter: MongoDBAdapter({
    //   db: (await clientPromise).db(),
    // }),
  })
}
