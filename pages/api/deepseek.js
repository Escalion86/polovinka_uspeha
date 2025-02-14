import OpenAI from 'openai'

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'GET') {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_KEY,
    })

    const system_prompt = `The user will provide some exam text. Please parse the "question" and "answer" and output them in JSON format. 

EXAMPLE INPUT: 
Which is the highest mountain in the world? Mount Everest.

EXAMPLE JSON OUTPUT:
{
    "question": "Which is the highest mountain in the world?",
    "answer": "Mount Everest"
}`

    const user_prompt =
      'Which is the longest river in the world? The Nile River.'

    const messages = [
      { role: 'system', content: system_prompt },
      { role: 'user', content: user_prompt },
    ]

    async function main() {
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        response_format: {
          type: 'json_object',
        },
      })

      // console.log(completion.choices[0].message.content);
      return completion.choices[0].message.content
    }

    const res = await main()

    res?.status(200).json({ success: true, data: res })
  }

  return res?.status(400).json({ success: false, error: 'Wrong method' })
}
