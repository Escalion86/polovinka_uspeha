import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import InputWrapper from '@components/InputWrapper'
import Textarea from '@components/Textarea'
import useSnackbar from '@helpers/useSnackbar'
import DOMPurify from 'isomorphic-dompurify'
import { useCallback, useEffect, useMemo, useState } from 'react'

const aiRequestFunc = ({
  title = 'Обработать текст с помощью ИИ',
  currentHtml = '',
  includeCurrentText = true,
  initialPrompt = '',
  onApply,
} = {}) => {
  const AiRequestModal = ({
    closeModal,
    setBottomLeftButtonProps,
  }) => {
    const { error } = useSnackbar()

    const [aiPrompt, setAIPrompt] = useState(initialPrompt)
    const [aiIncludeCurrentText, setAiIncludeCurrentText] =
      useState(includeCurrentText)
    const [aiResponse, setAIResponse] = useState('')
    const [aiIsLoading, setAiIsLoading] = useState(false)

    const canApplyAIResponse = !!aiResponse && !aiIsLoading

    const getCurrentMessageForAI = useCallback(() => {
      if (!currentHtml) return ''
      const prepared = currentHtml
        .replace(/<br\s*\/?\>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<li\b[^>]*>/gi, '\n• ')
        .replace(/<\/li>/gi, '')
      return DOMPurify.sanitize(prepared, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      })
        .replace(/&nbsp;/g, ' ')
        .trim()
    }, [currentHtml])

    const formatAIResponse = useCallback((content) => {
      if (!content) return ''
      const prepared = content
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<i>$1</i>')
        .replace(/--(.*?)--/g, '<del>$1</del>')
        .replace(
          /<<(.*?)>>/g,
          "<a href='$1' target='_blank' rel='noopener noreferrer'>$1</a>"
        )
        .replace(/\n/g, '<br>')
      return DOMPurify.sanitize(prepared, {
        ALLOWED_TAGS: ['b', 'br', 'i', 'u', 'del', 'strong', 'em', 'a'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      })
    }, [])

    const handleAISubmit = useCallback(async () => {
      const promptText = aiPrompt.trim()
      const promptParts = []

      if (aiIncludeCurrentText) {
        const currentText = getCurrentMessageForAI()
        if (currentText) {
          promptParts.push(
            `Есть описание мероприятия (текущий текст): ${currentText}`
          )
        }
      }

      if (!promptText && !promptParts.length) {
        error('Введите запрос для ИИ или включите передачу текущего текста')
        return
      }

      if (promptText) promptParts.push(promptText)

      const content = promptParts.join('\n\n')

      setAiIsLoading(true)
      setAIResponse('')
      try {
        const response = await fetch('/api/deepseek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        })
        if (!response.ok) throw new Error('Bad response')
        const result = await response.json()
        if (!result?.success) throw new Error('Request failed')
        const aiContent = result?.data?.choices?.[0]?.message?.content?.trim()
        if (!aiContent) throw new Error('Empty AI response')
        setAIResponse(formatAIResponse(aiContent))
      } catch (err) {
        console.error(err)
        error('Не удалось получить ответ от ИИ')
      } finally {
        setAiIsLoading(false)
      }
    }, [
      aiPrompt,
      aiIncludeCurrentText,
      getCurrentMessageForAI,
      formatAIResponse,
      error,
    ])

    const handleApplyAIResponse = useCallback(() => {
      if (!aiResponse || !onApply) return
      onApply(aiResponse)
      closeModal()
    }, [aiResponse, closeModal, onApply])

    useEffect(() => {
      if (!setBottomLeftButtonProps) return
      setBottomLeftButtonProps({
        name: 'Подставить в текст',
        onClick: handleApplyAIResponse,
        disabled: !canApplyAIResponse,
      })
    }, [setBottomLeftButtonProps, handleApplyAIResponse, canApplyAIResponse])

    const preview = useMemo(
      () => (aiResponse ? DOMPurify.sanitize(aiResponse) : ''),
      [aiResponse]
    )

    return (
      <div className="space-y-4">
        <Textarea
          label="Запрос к ИИ"
          value={aiPrompt}
          onChange={setAIPrompt}
          rows={5}
        />
        <CheckBox
          label="Передать ИИ существующий текст"
          checked={aiIncludeCurrentText}
          onChange={() => setAiIncludeCurrentText((state) => !state)}
          noMargin
        />
        <div className="flex flex-wrap gap-2">
          <Button
            name="Отправить запрос"
            onClick={handleAISubmit}
            loading={aiIsLoading}
          />
        </div>
        {aiResponse && (
          <InputWrapper label="Ответ ИИ" className="mt-2">
            <div
              className="w-full max-h-64 p-3 overflow-y-auto border rounded-md textarea ql"
              dangerouslySetInnerHTML={{
                __html: preview,
              }}
            />
          </InputWrapper>
        )}
      </div>
    )
  }

  return {
    title,
    closeButtonShow: true,
    declineButtonShow: false,
    onlyCloseButtonShow: true,
    Children: AiRequestModal,
  }
}

export default aiRequestFunc
