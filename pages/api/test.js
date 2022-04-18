// import yandexCloud from '@helpers/yandexCloud'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export default async function handler(req, res) {
  console.log('-------------------------------- recive video')
  const { query, method, body } = req
  console.log('method', method)
  console.log('!! query', query)
  console.log('!! body', body)
  // var list = await yandexCloud.GetList('courses/')
  // return emailSend('2562020@list.ru', 'escalion@uniplatform.ru')
  return res?.status(201).json({ success: true, data: body })
}
