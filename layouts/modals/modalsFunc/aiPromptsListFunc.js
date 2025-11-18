import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const aiPromptsListFunc = ({ section, onSelect, userId }) => {
  const AiPromptsListModal = ({ closeModal }) => {
    const location = useAtomValue(locationAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const [prompts, setPrompts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const snackbar = useSnackbar()

    const currentUserId = useMemo(
      () => userId || loggedUserActive?._id,
      [loggedUserActive?._id, userId]
    )

    const loadPrompts = useCallback(async () => {
      if (!currentUserId) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const response = await getData(`/api/${location}/ai-prompts`, {
        userId: currentUserId,
        section,
        sort: JSON.stringify({ createdAt: -1 }),
      })
      if (!response) snackbar.error('Не удалось загрузить сохраненные промпты')
      setPrompts(response || [])
      setIsLoading(false)
    }, [currentUserId, location, section, snackbar])

    useEffect(() => {
      loadPrompts()
    }, [loadPrompts])

    const handleSelectPrompt = (prompt) => {
      if (!onSelect) return
      onSelect(prompt)
      closeModal()
    }

    if (!currentUserId)
      return <div>Не удалось определить пользователя для загрузки промптов</div>

    if (isLoading) return <LoadingSpinner />

    return (
      <div className="space-y-3">
        {prompts?.length ? (
          prompts.map((prompt) => (
            <div
              key={prompt._id}
              className="p-3 space-y-2 border rounded-md bg-general-ultralight"
            >
              <div className="font-semibold break-words">{prompt.title}</div>
              {prompt.prompt && (
                <div className="text-sm text-gray-700 whitespace-pre-line break-words">
                  {prompt.prompt}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  name="Использовать промпт"
                  onClick={() => handleSelectPrompt(prompt)}
                  thin
                />
              </div>
            </div>
          ))
        ) : (
          <div>Нет сохраненных промптов</div>
        )}
      </div>
    )
  }

  return {
    title: 'Сохраненные промпты',
    closeButtonShow: true,
    declineButtonShow: false,
    onlyCloseButtonShow: true,
    Children: AiPromptsListModal,
  }
}

export default aiPromptsListFunc
