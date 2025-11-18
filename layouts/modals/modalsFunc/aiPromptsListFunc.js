import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import { deleteData, getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const aiPromptsListFunc = ({ section, onSelect, userId }) => {
  const AiPromptsListModal = ({ closeModal }) => {
    const location = useAtomValue(locationAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const [prompts, setPrompts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { error, success } = useSnackbar()

    const currentUserId = useMemo(
      () => userId || loggedUserActive?._id,
      [loggedUserActive?._id, userId]
    )

    useEffect(() => {
      let isMounted = true

      const loadPrompts = async () => {
        if (!currentUserId) {
          setIsLoading(false)
          return
        }

        try {
          setIsLoading(true)
          const response = await getData(`/api/${location}/ai-prompts`, {
            userId: currentUserId,
            section,
            sort: JSON.stringify({ createdAt: -1 }),
          })

          if (!isMounted) return

          if (!response) error('Не удалось загрузить сохраненные промпты')
          setPrompts(response || [])
        } catch (err) {
          console.error(err)
          if (isMounted) error('Не удалось загрузить сохраненные промпты')
        } finally {
          if (isMounted) setIsLoading(false)
        }
      }

      loadPrompts()

      return () => {
        isMounted = false
      }
    }, [currentUserId, error, location, section])

    const handleSelectPrompt = useCallback(
      (prompt) => {
        if (!onSelect) return
        onSelect(prompt)
        closeModal()
      },
      [closeModal, onSelect]
    )

    const handleDeletePrompt = useCallback(
      (promptId) => {
        if (!promptId || !modalsFunc?.confirm) return

        modalsFunc.confirm({
          title: 'Удаление промпта',
          text: 'Удалить сохраненный промпт?',
          onConfirm: async () => {
            try {
              const response = await deleteData(
                `/api/${location}/ai-prompts/${promptId}`,
                null,
                null,
                {},
                false,
                currentUserId
              )

              if (!response) {
                error('Не удалось удалить промпт')
                return
              }

              setPrompts((prev) => prev.filter((item) => item._id !== promptId))
              success('Промпт удален')
            } catch (err) {
              console.error(err)
              error('Не удалось удалить промпт')
            }
          },
        })
      },
      [currentUserId, error, location, modalsFunc, success]
    )

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
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold break-words">{prompt.title}</div>
                <button
                  type="button"
                  className="text-red-600 transition-transform duration-150 cursor-pointer hover:scale-110"
                  onClick={() => handleDeletePrompt(prompt._id)}
                  title="Удалить"
                >
                  <FontAwesomeIcon className="w-4 h-4" icon={faTrash} />
                </button>
              </div>
              {prompt.prompt && (
                <div className="text-sm text-gray-700 break-words whitespace-pre-line">
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
