import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import { DEFAULT_DIRECTION } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/itemsFuncAtom'
import directionFullSelectorAsync from '@state/selectors/directionFullSelectorAsync'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import ComboBox from '@components/ComboBox'
import compareObjects from '@helpers/compareObjects'
import CardButtons from '@components/CardButtons'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
import userSelector from '@state/selectors/userSelector'
import UsersFilter from '@components/Filter/UsersFilter'
import ContentHeader from '@components/ContentHeader'
import Note from '@components/Note'
import { getNounUsers } from '@helpers/getNoun'
import getUserFullName from '@helpers/getUserFullName'
import formatDate from '@helpers/formatDate'
import { postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const individualWeddingFunc = ({ userId, title, onConfirm, onFinished }) => {
  const IndividualWeddingModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const location = useAtomValue(locationAtom)
    const serviceId = '6421df68fa505d8e86b92166'
    const service = useAtomValue(serviceSelector(serviceId))
    const user = useAtomValue(userSelector(userId))

    const servicesUsers = useAtomValue(
      servicesUsersFullByServiceIdSelector(serviceId)
    )
    const servicesUsersWithoutClientUser = useMemo(
      () =>
        servicesUsers.filter((serviceUser) => serviceUser.userId !== userId),
      [servicesUsers]
    )
    // const users = servicesUsersWithoutClientUser.map(({ user }) => user)

    const setIndividualWeddings =
      useAtomValue(itemsFuncAtom).individualWedding.set

    const [filter, setFilter] = useState({
      gender: {
        male: user?.gender !== 'male',
        famale: user?.gender !== 'famale',
        // null: true,
      },
      status: {
        novice: true,
        member: true,
      },
      relationship: {
        havePartner: false,
        noPartner: true,
      },
    })

    // useEffect(() => {
    //   if (individualWeddings?.length > 0) {
    //     setResponse(individualWeddings[0].aiResponse)
    //     setCandidates(individualWeddings[0].candidates)
    //   } else {
    //     setResponse('')
    //     setCandidates([])
    //   }
    // }, [individualWeddings])

    // const acceptedUsersIds = servicesUsers.map((user) => user.userId)
    const selectedServiceUser = userId
      ? servicesUsers.find((serviceUser) => serviceUser.userId === userId)
      : null
    const selectedUser = selectedServiceUser?.user
    const selectedUserQuestionire = selectedServiceUser?.answers
    // const servicesUsersAnotherGender = selectedUser
    //   ? servicesUsers.filter(({ user }) => user.gender !== selectedUser.gender)
    //   : []

    const filteredServicesUsers = servicesUsersWithoutClientUser.filter(
      ({ user }) =>
        user &&
        (filter.gender[String(user.gender)] ||
          (filter.gender.null &&
            user.gender !== 'male' &&
            user.gender !== 'famale')) &&
        filter.status[user?.status ?? 'novice'] &&
        (user.relationship
          ? filter.relationship.havePartner
          : filter.relationship.noPartner)
    )

    const sendRequest = async () => {
      // setWaitForResponse(true)
      const questions = service.questionnaire.data
        .filter(
          ({ show, key }) =>
            show && key !== '96410c58-3b3b-400d-b209-4fbe1e1a465a' // Убираем из анкет ссылки на фотографии
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
        `Ниже приведены списки пользователей-кандидатов с анкетами:\n\n${filteredServicesUsers.map(({ user, answers }) => `ID: ${user._id}\nФИО: ${getUserFullName(user)}\nДата рождения: ${formatDate(user.birthday, false, false, true)}\n${questionsKeysArray.map((key, index) => `${index + 1}. ${answers[key]}`).join('\n')}`).join('\n\n')}`
      )
      formedContent.push(
        'Учитывай критерий возраста как приоритетный, желательно чтобы разница в возрасте была не существенной'
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
      // console.log('formedContent :>> ', formedContent)

      const result = postData(
        `/api/${location}/individualweddings`,
        {
          userId,
          content: formedContent.join('\n\n'),
          usersFilter: filter,
          allCandidatesIds: filteredServicesUsers.map(
            (serviceUser) => serviceUser.userId
          ),
        },
        (response) => {
          console.log('response :>> ', response)
          onFinished(response)
        },
        (error) => {
          console.log('error :>> ', error)
          onFinished(error)
        },
        true,
        null,
        true
      )
      // const result = await postData(
      //   '/api/deepseek',
      //   { content: formedContent.join('\n\n') },
      //   (response) => {
      //     console.log('response :>> ', response)
      //   },
      //   (error) => console.log('error :>> ', error),
      //   true,
      //   null,
      //   true
      // )

      // const result = {
      //   success: true,
      //   data: {
      //     id: '4c5aad67-0f66-40d9-9df1-23143b6c2f11',
      //     object: 'chat.completion',
      //     created: 1741582089,
      //     model: 'deepseek-chat',
      //     choices: [
      //       {
      //         index: 0,
      //         message: {
      //           role: 'assistant',
      //           content:
      //             '### Список подходящих кандидатов:\n\n1. **ФИО: Ольга Будяева**  \n   **Возраст:** 43 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает с Александром).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Разведена (как и Александр).  \n   - Есть дети: Несовершеннолетние (у Александра тоже).  \n   - Хочет детей: Затрудняется ответить (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Природа, спорт, животные (частично совпадают с интересами Александра).  \n   - Жизненные приоритеты: Семья, работа, друзья (совпадают).  \n   - Отношение к домашним животным: Любит всех животных (Александр нейтрален).  \n   - Ищет мужчину: Возраст не важен (Александр подходит по возрасту).  \n\n   **Аргументы:**  \n   Ольга живет в том же городе, что и Александр, имеет схожие жизненные приоритеты и интересы. Она разведена, как и Александр, и у нее есть дети, что может быть плюсом для построения отношений. Ее открытость к переезду и любовь к животным делают ее гибкой в вопросах совместной жизни.\n\n2. **ФИО: Ольга Перепелкина**  \n   **Возраст:** 42 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Не замужем (Александр разведен).  \n   - Есть дети: Нет (у Александра есть).  \n   - Хочет детей: Затрудняется ответить (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Природа, книги, путешествия (частично совпадают).  \n   - Жизненные приоритеты: Работа, отношения, отдых (частично совпадают).  \n   - Ищет мужчину: Возраст не важен (Александр подходит).  \n\n   **Аргументы:**  \n   Ольга живет в Красноярске, как и Александр, и имеет схожие интересы. Она не замужем и открыта к отношениям. Ее нейтральное отношение к детям и желание построить семью делают ее подходящей кандидатурой.\n\n3. **ФИО: Елена Фролова**  \n   **Возраст:** 43 года  \n   **Основные поля анкеты:**  \n   - Город проживания: Красноярск (совпадает).  \n   - Готова поменять место жительства: Да (Александр не готов, но это не критично).  \n   - Семейное положение: Разведена (как и Александр).  \n   - Есть дети: Несовершеннолетние (у Александра тоже).  \n   - Хочет детей: Нет (Александр хочет).  \n   - Религия: Христианство (совпадает).  \n   - Интересы: Театр, кино, природа (частично совпадают).  \n   - Жизненные приоритеты: Семья, здоровье, самореализация (совпадают).  \n   - Ищет мужчину: Возраст не важен (Александр подходит).  \n\n   **Аргументы:**  \n   Елена живет в том же городе, что и Александр, и имеет схожие жизненные приоритеты. Она разведена, как и Александр, и у нее есть дети. Ее интересы частично совпадают с интересами Александра, что может стать основой для общения.\n\n---\n\n### Итоги:\nДля Александра Перелыгина подходят кандидаты, которые живут в Красноярске, имеют схожие жизненные приоритеты (семья, здоровье, карьера) и интересы (природа, спорт, книги). Все кандидаты разведены или не замужем, что делает их открытыми для новых отношений. Некоторые из них имеют детей, что может быть плюсом для Александра, так как у него тоже есть ребенок. Религиозные взгляды всех кандидатов совпадают с взглядами Александра (христианство).\n\ncandidates=["63076cb5b1edf3c208b1d93b", "63325f67f43331805556b53a", "642d034365aee29391b61b64"]',
      //         },
      //         logprobs: null,
      //         finish_reason: 'stop',
      //       },
      //     ],
      //     usage: {
      //       prompt_tokens: 47007,
      //       completion_tokens: 1184,
      //       total_tokens: 48191,
      //       prompt_tokens_details: {
      //         cached_tokens: 768,
      //       },
      //       prompt_cache_hit_tokens: 768,
      //       prompt_cache_miss_tokens: 46239,
      //     },
      //     system_fingerprint: 'fp_3a5770e1b4_prod0225',
      //   },
      // }
      // console.log('result :>> ', result)
      // if (!result?.success) {
      //   alert('Произошла ошибка')
      //   setWaitForResponse(false)
      // } else {
      //   const content =
      //     result.data.choices[0].message.content.split('candidates=')
      //   const newCandidates = content[1]
      //   const formatedContent = content[0]
      //     .trim('\n')
      //     .trim(' ')
      //     .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      //     .replace(/__(.*?)__/g, '<u>$1</u>')
      //     .replace(/~~(.*?)~~/g, '<i>$1</i>')
      //     .replace(/--(.*?)--/g, '<del>$1</del>')
      //     .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
      //     .replace(/\n/g, '<br>')
      //   // setResponse(formatedContent)
      //   const parsedCandidates = newCandidates ? JSON.parse(newCandidates) : []
      //   // setCandidates(parsedCandidates)
      //   setIndividualWeddings({
      //     userId: selectedUser._id,
      //     aiResponse: formatedContent,
      //     candidates: parsedCandidates,
      //   })
      //   setWaitForResponse(false)
      // }
      onConfirm && onConfirm()
      closeModal()
    }

    useEffect(() => {
      setOnConfirmFunc(sendRequest)
    }, [userId, servicesUsersWithoutClientUser, filter])

    return (
      <div>
        <Note>Задайте фильтр по пользователям заполнившим анкеты</Note>
        <ContentHeader noBorder>
          <UsersFilter
            value={filter}
            onChange={setFilter}
            hideNullGender
            hideBanned
          />
        </ContentHeader>
        <div>{getNounUsers(filteredServicesUsers?.length)}</div>
      </div>
    )
  }

  return {
    title: title ?? `Подбор кандидатов`,
    confirmButtonName: 'Начать подбор',
    Children: IndividualWeddingModal,
  }
}

export default individualWeddingFunc
