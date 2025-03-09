import Button from '@components/Button'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import copyToClipboard from '@helpers/copyToClipboard'
import { getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import { useState } from 'react'
import Latex from 'react-latex-next'

const sendQuastion = async (quastion) => {
  // const response = await fetch('/api/deepseek', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ quastion }),
  // })
  const response = await getData(
    '/api/deepseek',
    { content: quastion },
    (response) => {
      console.log('response :>> ', response)
      // //{status: 'ok', message: 'File deleted!'}
      // if (response?.status === 'ok') {
      //   // console.log('response :>> ', response)
      //   setFiles((state) =>
      //     state.filter(
      //       (file) => file !== `https://escalioncloud.ru/uploads/${filePath}`
      //     )
      //   )
      // } else console.log('error response :>> ', response)
      // // setFiles(
      // //   response.map(
      // //     (fileName) =>
      // //       `https://escalioncloud.ru/uploads/${directory ? directory + '/' : ''}${fileName}`
      // //   ) || []
      // // )
      // // setFilesCount(response.length)
      // // setIsLoading(false)
    },
    (error) => console.log('error :>> ', error),
    true
  )
  // const data = await response.json()
  // console.log(data)
  return response
}

const aiFunc = () => {
  const AIModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [waitForResponse, setWaitForResponse] = useState(false)
    const [quastion, setQuastion] = useState('')
    const [response, setResponse] = useState('')
    const [tokensUsed, setTokensUsed] = useState(0)
    // const json = useMemo(() => JSON.stringify(response, null, 4), [response])
    const { info } = useSnackbar()

    const send = async () => {
      setWaitForResponse(true)
      const result = await sendQuastion(quastion)
      if (!result?.success) {
        alert('Произошла ошибка')
        waitForResponse(false)
      } else {
        const content = result.data.choices[0].message.content
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/__(.*?)__/g, '<u>$1</u>')
          .replace(/~~(.*?)~~/g, '<i>$1</i>')
          .replace(/--(.*?)--/g, '<del>$1</del>')
          .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
          .replace(/\n/g, '<br>')
        setResponse(content)
        setTokensUsed(result.data.usage.total_tokens)
        setWaitForResponse(false)
      }
    }

    const test =
      `Чтобы решить выражение \\(2 + 5 \\times 4\\), следуем порядку выполнения арифметических операций (сначала умножение, затем сложение):\n\n1. **Умножение:**\n   \\[\n   5 \\times 4 = 20\n   \\]\n\n2. **Сложение:**\n   \\[\n   2 + 20 = 22\n   \\]\n\n**Ответ:** \\(\\boxed{22}\\)`
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<i>$1</i>')
        .replace(/--(.*?)--/g, '<del>$1</del>')
        .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
        .replace(/\n/g, '<br>') // .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")

    return (
      <div>
        <Input label="Вопрос" value={quastion} onChange={setQuastion} />
        <Button loading={waitForResponse} name="Отправить" onClick={send} />
        <InputWrapper label="Ответ">
          <Latex displayMode={true}>{response}</Latex>
        </InputWrapper>
        <div>Использовано токенов: {tokensUsed}</div>

        <div
          onClick={() => {
            info('Данные скопированы в буфер обмена')
            copyToClipboard(response)
          }}
        >
          <div className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded-sm cursor-pointer group">
            Копировать в буфер обмена
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `AI`,
    declineButtonName: 'Закрыть',
    Children: AIModal,
    showDecline: true,
  }
}

export default aiFunc
