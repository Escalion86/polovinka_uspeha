'use client'

import { useState } from 'react'
import { SelectUser } from '@components/SelectItem'
import { useAtomValue, useSetAtom } from 'jotai'
import InputWrapper from '@components/InputWrapper'
import Button from '@components/Button'
// import LoadingSpinner from '@components/LoadingSpinner'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
// import serviceSelector from '@state/selectors/serviceSelector'
import getUserFullName from '@helpers/getUserFullName'
// import Latex from 'react-latex-next'
// import formatDate from '@helpers/formatDate'
// import { postData } from '@helpers/CRUD'
// import { getNounAnkets } from '@helpers/getNoun'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import modalsFuncAtom from '@state/modalsFuncAtom'
import individualWeddingsByUserIdAtom from '@state/async/individualWeddingsByUserIdAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
// import { SelectUserList } from '@components/SelectItemList'
import IndividualWeddingCard from '@layouts/cards/IndividualWeddingCard'
import LoadingSpinner from '@components/LoadingSpinner'
import individualWeddingEditSelector from '@state/selectors/individualWeddingEditSelector'
import useSnackbar from '@helpers/useSnackbar'

const IndividualWeddingsContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const serviceId = '6421df68fa505d8e86b92166'
  // const service = useAtomValue(serviceSelector(serviceId))
  const [selectedUserId, setSelectedUserId] = useState(null)
  const individualWeddings = useAtomValue(
    individualWeddingsByUserIdAtom(selectedUserId)
  )
  const snackbar = useSnackbar()
  const [waitForResponse, setWaitForResponse] = useState(false)
  // const [response, setResponse] = useState(
  //   individualWeddings ? individualWeddings.aiResponse : ''
  // )
  // const [candidates, setCandidates] = useState(
  //   individualWeddings ? individualWeddings.candidates : []
  // )
  const servicesUsers = useAtomValue(
    servicesUsersFullByServiceIdSelector(serviceId)
  )
  // const setIndividualWeddings =
  //   useAtomValue(itemsFuncAtom).individualWedding.set

  const setIndividualWeddings = useSetAtom(individualWeddingEditSelector)

  // useEffect(() => {
  //   if (individualWeddings?.length > 0) {
  //     setResponse(individualWeddings[0].aiResponse)
  //     setCandidates(individualWeddings[0].candidates)
  //   } else {
  //     setResponse('')
  //     setCandidates([])
  //   }
  // }, [individualWeddings])

  const acceptedUsersIds = servicesUsers.map((user) => user.userId)
  const selectedServiceUser = selectedUserId
    ? servicesUsers.find(({ userId }) => userId === selectedUserId)
    : null
  const selectedUser = selectedServiceUser?.user

  // const selectedUserQuestionire = selectedUserId
  //   ? servicesUsers.find(({ userId }) => userId === selectedUserId)?.answers
  //   : null
  // const servicesUsersAnotherGender = selectedUser
  //   ? servicesUsers.filter(({ user }) => user.gender !== selectedUser.gender)
  //   : []

  // const sendRequest = async () => {
  //   setWaitForResponse(true)
  //   const questions = service.questionnaire.data
  //     .filter(
  //       ({ show, key }) =>
  //         show && key !== '96410c58-3b3b-400d-b209-4fbe1e1a465a'
  //     )
  //     .map(({ key, label }) => ({ key, label }))

  //   // const questionsLabelsArray = questions.map(({ label }) => label)
  //   const questionsKeysArray = questions.map(({ key }) => key)

  //   const formedContent = []
  //   formedContent.push(
  //     `Есть анкеты пользователей с вопросами: ${service.questionnaire.data.map(({ label }, index) => `${index + 1}. ${label}`)}}`
  //   )
  //   formedContent.push(
  //     `Необходимо подобрать три наиболее подходящие пары для выбранного пользователя:\nФИО: ${getUserFullName(selectedUser)}\nДата рождения: ${formatDate(selectedUser.birthday, false, false, true)}\n${questionsKeysArray.map((key, index) => `${index + 1}. ${selectedUserQuestionire[key]}`).join('\n')}`
  //   )
  //   formedContent.push(
  //     `Ниже приведены списки пользователей-кандидатов с анкетами:\n\n${servicesUsersAnotherGender.map(({ user, answers }) => `ID: ${user._id}\nФИО: ${getUserFullName(user)}\nДата рождения: ${formatDate(user.birthday, false, false, true)}\n${questionsKeysArray.map((key, index) => `${index + 1}. ${answers[key]}`).join('\n')}`).join('\n\n')}`
  //   )
  //   formedContent.push(
  //     'Учитывай критерий возраста как приоритетный, желательно чтобы разница в возрасте была не существенной'
  //   )
  //   formedContent.push(
  //     'Ответ напиши в виде списка с указанием ФИО кандидата, его возраста, основных полей анкет на которых ты сделал вывод, что это подходящий кандидат, а также аргументы - почему ты выбрал именно этих кандидатов'
  //   )
  //   formedContent.push(
  //     'После завершения списка кандидатов подведи итоги и в общих чертах опиши какие кандидаты подходят для выбранного пользователя'
  //   )
  //   formedContent.push(
  //     'Также в самом конце напиши ID кандидатов в формате: candidates=["id1", "id2", "id3"] и не выделяй этот список жирным шрифтом и не делай для него заголовка'
  //   )
  //   // console.log('formedContent :>> ', formedContent)

  //   const result = await postData(
  //     '/api/deepseek',
  //     { content: formedContent.join('\n\n') },
  //     (response) => {
  //       console.log('response :>> ', response)
  //     },
  //     (error) => console.log('error :>> ', error),
  //     true,
  //     null,
  //     true
  //   )
  //   // const result = {
  //   //   success: true,
  //   //   data: {
  //   //     id: '4c5aad67-0f66-40d9-9df1-23143b6c2f11',
  //   //     object: 'chat.completion',
  //   //     created: 1741582089,
  //   //     model: 'deepseek-chat',
  //   //     choices: [
  //   //       {
  //   //         index: 0,
  //   //         message: {
  //   //           role: 'assistant',
  //   //           content:
  //   //             '### Список подходящих кандидатов:\n\n1. **ФИО: Ольга Будяева**  \n   **Возраст:** 43 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает с Александром).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Разведена (как и Александр).  \n   - Есть дети: Несовершеннолетние (у Александра тоже).  \n   - Хочет детей: Затрудняется ответить (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Природа, спорт, животные (частично совпадают с интересами Александра).  \n   - Жизненные приоритеты: Семья, работа, друзья (совпадают).  \n   - Отношение к домашним животным: Любит всех животных (Александр нейтрален).  \n   - Ищет мужчину: Возраст не важен (Александр подходит по возрасту).  \n\n   **Аргументы:**  \n   Ольга живет в том же городе, что и Александр, имеет схожие жизненные приоритеты и интересы. Она разведена, как и Александр, и у нее есть дети, что может быть плюсом для построения отношений. Ее открытость к переезду и любовь к животным делают ее гибкой в вопросах совместной жизни.\n\n2. **ФИО: Ольга Перепелкина**  \n   **Возраст:** 42 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Не замужем (Александр разведен).  \n   - Есть дети: Нет (у Александра есть).  \n   - Хочет детей: Затрудняется ответить (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Природа, книги, путешествия (частично совпадают).  \n   - Жизненные приоритеты: Работа, отношения, отдых (частично совпадают).  \n   - Ищет мужчину: Возраст не важен (Александр подходит).  \n\n   **Аргументы:**  \n   Ольга живет в Красноярске, как и Александр, и имеет схожие интересы. Она не замужем и открыта к отношениям. Ее нейтральное отношение к детям и желание построить семью делают ее подходящей кандидатурой.\n\n3. **ФИО: Елена Фролова**  \n   **Возраст:** 43 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Разведена (как и Александр).  \n   - Есть дети: Несовершеннолетние (у Александра тоже).  \n   - Хочет детей: Нет (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Театр, кино, природа (частично совпадают).  \n   - Жизненные приоритеты: Семья, здоровье, самореализация (совпадают).  \n   - Ищет мужчину: Возраст не важен (Александр подходит).  \n\n   **Аргументы:**  \n   Елена живет в том же городе, что и Александр, и имеет схожие жизненные приоритеты. Она разведена, как и Александр, и у нее есть дети. Ее интересы частично совпадают с интересами Александра, что может стать основой для общения.\n\n---\n\n### Итоги:\nДля Александра Перелыгина подходят кандидаты, которые живут в Красноярске, имеют схожие жизненные приоритеты (семья, здоровье, карьера) и интересы (природа, спорт, книги). Все кандидаты разведены или не замужем, что делает их открытыми для новых отношений. Некоторые из них имеют детей, что может быть плюсом для Александра, так как у него тоже есть ребенок. Религиозные взгляды всех кандидатов совпадают с взглядами Александра (христианство).\n\ncandidates=["63076cb5b1edf3c208b1d93b", "63325f67f43331805556b53a", "642d034365aee29391b61b64"]',
  //   //         },
  //   //         logprobs: null,
  //   //         finish_reason: 'stop',
  //   //       },
  //   //     ],
  //   //     usage: {
  //   //       prompt_tokens: 47007,
  //   //       completion_tokens: 1184,
  //   //       total_tokens: 48191,
  //   //       prompt_tokens_details: {
  //   //         cached_tokens: 768,
  //   //       },
  //   //       prompt_cache_hit_tokens: 768,
  //   //       prompt_cache_miss_tokens: 46239,
  //   //     },
  //   //     system_fingerprint: 'fp_3a5770e1b4_prod0225',
  //   //   },
  //   // }
  //   // console.log('result :>> ', result)
  //   if (!result?.success) {
  //     alert('Произошла ошибка')
  //     setWaitForResponse(false)
  //   } else {
  //     const content =
  //       result.data.choices[0].message.content.split('candidates=')
  //     const newCandidates = content[1]
  //     const formatedContent = content[0]
  //       .trim('\n')
  //       .trim(' ')
  //       .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  //       .replace(/__(.*?)__/g, '<u>$1</u>')
  //       .replace(/~~(.*?)~~/g, '<i>$1</i>')
  //       .replace(/--(.*?)--/g, '<del>$1</del>')
  //       .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
  //       .replace(/\n/g, '<br>')
  //     // setResponse(formatedContent)
  //     const parsedCandidates = newCandidates ? JSON.parse(newCandidates) : []
  //     // setCandidates(parsedCandidates)
  //     setIndividualWeddings({
  //       userId: selectedUser._id,
  //       aiResponse: formatedContent,
  //       candidates: parsedCandidates,
  //     })
  //     setWaitForResponse(false)
  //   }
  // }

  return (
    <div className="flex flex-col gap-y-0.5 min-h-full max-h-full p-1">
      <InputWrapper label="Пользователь для которого будут выбираться пары">
        <SelectUser
          selectedId={selectedUserId}
          onChange={setSelectedUserId}
          acceptedIds={acceptedUsersIds}
          readOnly={waitForResponse}
          modalTitle="Пользователи с анкетами"
          buttons={
            selectedServiceUser
              ? [
                  (id) => ({
                    onClick: () => {
                      modalsFunc.serviceUser.view(
                        selectedServiceUser._id,
                        true,
                        `Анкета пользователя "${getUserFullName(selectedUser)}"`
                      )
                      // modalsFunc.questionnaire.open(
                      //   service.questionnaire,
                      //   selectedUserQuestionire,
                      //   undefined,
                      //   `Анкета пользователя "${getUserFullName(selectedUser)}"`
                      // )
                    },
                    icon: faIdCard,
                    iconClassName: 'text-purple-600',
                    tooltip: 'Анкета',
                  }),
                ]
              : undefined
          }
        />
      </InputWrapper>
      {selectedUserId && (
        <Button
          loading={waitForResponse}
          name={`Создать новую выборку кандидатов`}
          onClick={() =>
            modalsFunc.individualWedding.add({
              userId: selectedUser._id,
              title: `Создание подборки кандидатов для пользователя\n"${getUserFullName(selectedUser)}"`,
              onConfirm: () => {
                setWaitForResponse(true)
              },
              onFinished: (response) => {
                if (response.error) {
                  snackbar.error('Ошибка создания подборки кандидатов')
                } else {
                  snackbar.success('Подборка кандидатов создана')
                  setIndividualWeddings(response.data)
                }

                setWaitForResponse(false)
              },
            })
          }
        />
      )}
      {(individualWeddings?.length > 0 || waitForResponse) && (
        <InputWrapper
          label="Выборка кандидатов"
          className="flex-1"
          wrapperClassName="flex-col overflow-y-auto"
        >
          {individualWeddings.map((individualWedding) => (
            <IndividualWeddingCard
              key={individualWedding._id}
              individualWeddingId={individualWedding._id}
            />
          ))}
          {waitForResponse && (
            <div className="w-full h-8 border border-gray-400 rounded-md ">
              <LoadingSpinner size="xxs" />
            </div>
          )}
        </InputWrapper>
      )}

      {/* {!waitForResponse && candidates?.length > 0 && (
        <InputWrapper
          label="Кандидаты"
          className="w-full"
          wrapperClassName="flex-col min-h-full w-full flex items-stretch"
        >
          <SelectUserList
            // key={id}
            readOnly
            showCounter={false}
            usersId={candidates}
            buttons={[
              (id) => ({
                onClick: () => {
                  const seriviceUser = servicesUsersAnotherGender.find(
                    ({ userId }) => userId === id
                  )
                  modalsFunc.serviceUser.view(
                    seriviceUser._id,
                    true,
                    `Анкета кандидата "${getUserFullName(seriviceUser.user)}"`
                  )
                  // modalsFunc.questionnaire.open(
                  //   service.questionnaire,
                  //   seriviceUser.answers,
                  //   undefined,
                  //   `Анкета кандидата "${getUserFullName(seriviceUser.user)}"`
                  // )
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
        </InputWrapper>
      )} */}
      {/* {(waitForResponse || response) && (
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
              <div className="w-full max-h-full overflow-y-scroll">
                <Latex displayMode={true}>{response}</Latex>
              </div>
            )}
          </InputWrapper>
        </>
      )} */}
    </div>
  )
}

export default IndividualWeddingsContent
