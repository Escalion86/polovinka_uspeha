// curl --request POST \
//   --url https://api.elevenlabs.io/v1/text-to-speech/dtsqEF017tpkPHpMcST6 \
//   --header 'Content-Type: application/json' \
//   --header 'xi-api-key: 000a62f028bcd4dc3e89c88d6e49860f' \
//   --data '{
//   "model_id": "eleven_multilingual_v2",
//   "text": "Я хочу рассказать вам про сервис, который потрясающе создает голос. Он позволяет не только использовать готовые голоса, но и создать искуственный новый голос",
//   "voice_settings": {
//     "similarity_boost": 0.9,
//     "stability": 0.9
//   }
// }'
const elevenLabs = require('elevenlabs-js')

// const options = {
//   method: 'POST',
//   headers: {
//     'xi-api-key': '000a62f028bcd4dc3e89c88d6e49860f',
//     'Content-Type': 'application/json',
//     accept: 'audio/mpeg',
//   },
//   body: '{"model_id":"eleven_multilingual_v2","text":"TEST TEST TEST","voice_settings":{"similarity_boost":0.9,"stability":0.9}}',
// }

const handler = (req, res) => {
  if (req.method === 'GET') {
    try {
      elevenLabs.setApiKey(process.env.ELEVENLABSIO_API_KEY)
      // elevenLabs.getUser().then((res) => {
      //   console.log('user', res)
      // })
      // elevenLabs.getModels().then((res) => {
      //   console.log('models', res)
      // })
      elevenLabs
        .textToSpeech(
          'dtsqEF017tpkPHpMcST6',
          'Большой большой привет передаю этому миру',
          // 'eleven_monolingual_v1',
          'eleven_multilingual_v2',
          {
            stability: 0.95,
            similarity_boost: 0.75,
            style: 0.06,
            use_speaker_boost: true,
          }
        )
        .then(async (response) => {
          console.log('response :>> ', response)

          // You can save the file
          await response.saveFile('test.mp3')

          // Or get the pipe and do whatever you want with it (like streaming it to the client)
          // const pipe = await res.pipe;
          // pipe(fs.createWriteStream("test-with-pipe.mp3"));
          res.status(200).json({
            success: true,
            // message: res,
          })
        })

      // fetch(
      //   'https://api.elevenlabs.io/v1/text-to-speech/dtsqEF017tpkPHpMcST6',
      //   options
      // )
      //   .then((response) => response.json())
      //   .then((response) => console.log(response))
      //   .catch((err) => console.error(err))
      // fetch(
      //   'https://api.elevenlabs.io/v1/text-to-speech/dtsqEF017tpkPHpMcST6',
      //   options
      //   // {
      //   //   method: 'POST',
      //   //   headers: {
      //   //     'Content-Type': 'application/json',
      //   //     'xi-api-key': process.env.ELEVENLABSIO_API_KEY,
      //   //   },
      //   //   body: JSON.stringify({
      //   //     model_id: 'eleven_multilingual_v2',
      //   //     text: 'Я хочу рассказать вам про сервис, который потрясающе создает голос. Он позволяет не только использовать готовые голоса, но и создать искуственный новый голос',
      //   //     voice_settings: {
      //   //       similarity_boost: 0.9,
      //   //       stability: 0.9,
      //   //     },
      //   //   }),
      //   // }
      // )
      //   .then((data) => data.json())
      //   .then((data) => {
      //     console.log('data', data)
      //     // if (reCaptchaRes?.score > 0.5) {
      //     //   // Save data to the database from here
      //     res.status(200).json({
      //       success: true,
      //       message: data,
      //     })
      //     // } else {
      //     //   res.status(200).json({
      //     //     status: 'failure',
      //     //     message: 'Google ReCaptcha Failure',
      //     //   })
      //     // }
      //   })
      //   .catch((err) => console.error(err))
    } catch (err) {
      res.status(405).json({
        success: false,
        message: 'Error submitting the enquiry form',
      })
    }
  } else {
    res.status(405)
    res.end()
  }
}

export default handler
