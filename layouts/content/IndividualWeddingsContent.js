'use client'

import { useState } from 'react'
import { SelectUser } from '@components/SelectItem'
import { useAtomValue } from 'jotai'
import InputWrapper from '@components/InputWrapper'
import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import getUserFullName from '@helpers/getUserFullName'
import Latex from 'react-latex-next'
import formatDate from '@helpers/formatDate'
import { postData } from '@helpers/CRUD'
import { getNounAnkets } from '@helpers/getNoun'
import { SelectUserList } from '@components/SelectItemList'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import modalsFuncAtom from '@state/modalsFuncAtom'

const IndividualWeddingsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const serviceId = '6421df68fa505d8e86b92166'
  const service = useAtomValue(serviceSelector(serviceId))
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [waitForResponse, setWaitForResponse] = useState(false)
  const [response, setResponse] = useState('')
  const [condidates, setCondidates] = useState([])
  const servicesUsers = useAtomValue(
    servicesUsersFullByServiceIdSelector(serviceId)
  )

  const acceptedUsersIds = servicesUsers.map((user) => user.userId)
  const selectedUser = selectedUserId
    ? servicesUsers.find(({ userId }) => userId === selectedUserId)?.user
    : null
  const selectedUserQuestionire = selectedUserId
    ? servicesUsers.find(({ userId }) => userId === selectedUserId)?.answers
    : null
  const servicesUsersAnotherGender = selectedUser
    ? servicesUsers.filter(({ user }) => user.gender !== selectedUser.gender)
    : []

  const sendRequest = async () => {
    setWaitForResponse(true)
    const questions = service.questionnaire.data
      .filter(
        ({ show, key }) =>
          show && key !== '96410c58-3b3b-400d-b209-4fbe1e1a465a'
      )
      .map(({ key, label }) => ({ key, label }))

    // const questionsLabelsArray = questions.map(({ label }) => label)
    const questionsKeysArray = questions.map(({ key }) => key)

    const formedContent = []
    formedContent.push(
      `Есть анкеты пользователей с вопросами: ${service.questionnaire.data.map(({ label }, index) => `${index + 1}. ${label}`)}}`
    )
    formedContent.push(
      `Необходимо подобрать три наиболее подходящие пары для выбранного пользователя:\nФИО: ${getUserFullName(selectedUser)}\nДата рождения: ${formatDate(selectedUser.birthday, false, false, true)}\n${questionsKeysArray.map((key, index) => `${index + 1}. ${selectedUserQuestionire[key]}`).join('\n')}`
    )
    formedContent.push(
      `Ниже приведены списки пользователей-кандидатов с анкетами:\n\n${servicesUsersAnotherGender.map(({ user, answers }) => `ID: ${user._id}\nФИО: ${getUserFullName(user)}\nДата рождения: ${formatDate(user.birthday, false, false, true)}\n${questionsKeysArray.map((key, index) => `${index + 1}. ${answers[key]}`).join('\n')}`).join('\n\n')}`
    )
    formedContent.push(
      'Ответ напиши в виде списка с указанием ФИО кандидата, его возраста, основных полей анкет на которых ты сделал вывод, что это подходящий кандидат, а также аргументы - почему ты выбрал именно этих кандидатов'
    )
    formedContent.push(
      'После завершения списка кандидатов подведи итоги и в общих чертах опиши какие кандидаты подходят для выбранного пользователя'
    )
    formedContent.push(
      'Также в самом конце напиши ID кандидатов в формате: candidates=["id1", "id2", "id3"] и не выделяй этот список жирным шрифтом и не делай для него заголовка'
    )
    console.log('formedContent :>> ', formedContent)

    const result = await postData(
      '/api/deepseek',
      { content: formedContent.join('\n\n') },
      (response) => {
        console.log('response :>> ', response)
      },
      (error) => console.log('error :>> ', error),
      true,
      null,
      true
    )
    if (!result?.success) {
      alert('Произошла ошибка')
      setWaitForResponse(false)
    } else {
      const content =
        result.data.choices[0].message.content.split('candidates=')
      const newCondidates = content[1]
      const formatedContent = content[0]
        .trim('\n')
        .trim(' ')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<i>$1</i>')
        .replace(/--(.*?)--/g, '<del>$1</del>')
        .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
        .replace(/\n/g, '<br>')
      setResponse(formatedContent)
      console.log('newCondidates :>> ', newCondidates)
      setCondidates(
        newCondidates
          ? JSON.parse(newCondidates)
          : // ?.map(
            //     (id) => servicesUsersAnotherGender[id - 1]?.userId
            //   )
            []
      )
      // setTokensUsed(result.data.usage.total_tokens)
      setWaitForResponse(false)
    }
    // setWaitForResponse(false)
  }

  return (
    <div className="flex flex-col gap-y-0.5 min-h-full max-h-full p-1">
      <InputWrapper label="Пользователь для которого будут выбираться пары">
        <SelectUser
          selectedId={selectedUserId}
          onChange={setSelectedUserId}
          acceptedIds={acceptedUsersIds}
          readOnly={waitForResponse}
          modalTitle="Пользователи с анкетами"
          buttons={[
            (id) => ({
              onClick: () => {
                modalsFunc.questionnaire.open(
                  service.questionnaire,
                  selectedUserQuestionire,
                  undefined,
                  `Анкета пользователя "${getUserFullName(selectedUser)}"`
                )
              },
              icon: faIdCard,
              iconClassName: 'text-purple-600',
              tooltip: 'Анкета',
            }),
          ]}
        />
      </InputWrapper>
      <Button
        loading={waitForResponse}
        name={`Подобрать пару (${getNounAnkets(servicesUsersAnotherGender?.length || 0)} противопол. пола)`}
        onClick={sendRequest}
      />
      {!waitForResponse && condidates?.length > 0 && (
        <InputWrapper
          label="Кандидаты"
          className="w-full"
          wrapperClassName="flex-col min-h-full w-full flex items-stretch"
        >
          {condidates.map((id) => (
            <SelectUser
              key={id}
              selectedId={id}
              buttons={[
                (id) => ({
                  onClick: () => {
                    const seriviceUser = servicesUsersAnotherGender.find(
                      ({ userId }) => userId === id
                    )
                    modalsFunc.questionnaire.open(
                      service.questionnaire,
                      seriviceUser.answers,
                      undefined,
                      `Анкета кандидата "${getUserFullName(seriviceUser.user)}"`
                    )
                  },
                  icon: faIdCard,
                  iconClassName: 'text-purple-600',
                  tooltip: 'Анкета',
                  // text,
                  // textClassName,
                  // thin,
                }),
              ]}
            />
          ))}
        </InputWrapper>
      )}
      {(waitForResponse || response) && (
        <>
          <InputWrapper
            label="Результат"
            className="flex-1"
            wrapperClassName="flex-col"
          >
            {waitForResponse ? (
              <div className="flex justify-center w-full h-full">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="max-h-full overflow-y-scroll">
                <Latex displayMode={true}>{response}</Latex>
              </div>
            )}
          </InputWrapper>
        </>
      )}
    </div>
  )
}

export default IndividualWeddingsContent
