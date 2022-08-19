const nodemailer = require('nodemailer')

const emailSend = (to, subject, html) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      // service: process.env.EMAIL_SERVICE,
      // auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
      pool: true,
      host: 'mail.hosting.reg.ru',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: 'info@uniplatform.ru',
        pass: 'Magister86',
      },
    })

    const message = {
      from: 'info@uniplatform.ru', //process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    }

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('error', error)
        rej(error)
      } else {
        console.log('info', info)
        res(info)
      }
    })
  })
}

export default emailSend
