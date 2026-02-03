// import CheckBox from '@components/CheckBox'
// import EditableTextarea from '@components/EditableTextarea'
// import ErrorsList from '@components/ErrorsList'
// import FormWrapper from '@components/FormWrapper'
// import Input from '@components/Input'
// import InputImage from '@components/InputImage'
// import Textarea from '@components/Textarea'
// import { DEFAULT_DIRECTION } from '@helpers/constants'
// import useErrors from '@helpers/useErrors'
// import itemsFuncAtom from '@state/itemsFuncAtom'
// import directionFullSelectorAsync from '@state/selectors/directionFullSelectorAsync'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
// import TabContext from '@components/Tabs/TabContext'
// import TabPanel from '@components/Tabs/TabPanel'
// import ComboBox from '@components/ComboBox'
// import compareObjects from '@helpers/compareObjects'
// import CardButtons from '@components/CardButtons'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
import userSelector from '@state/selectors/userSelector'
import UsersFilter from '@components/Filter/UsersFilter'
import ContentHeader from '@components/ContentHeader'
import Note from '@components/Note'
import { getNounUsers } from '@helpers/getNoun'
import getUserFullName from '@helpers/getUserFullName'
import formatDate from '@helpers/formatDate'
import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const individualWeddingFunc = ({
  userId,
  title,
  onConfirm,
  onFinished,
  onStageChange,
}) => {
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

    // const setIndividualWeddings =
    //   useAtomValue(itemsFuncAtom).individualWedding.set

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

    const QUESTION_KEYS = {
      city: '4ab8336e-b86c-4d28-b5f9-cd4db42d0827',
      wantsChildren: 'ebbba081-5414-4c51-adb4-b80c2cc771b7',
      hasChildren: 'fb1913a5-7a63-46bc-acac-ea6c3e8cfcb1',
      relationship: '8a4694bc-19d0-48af-af01-cf58aaf6ce7f',
      interests: '443e9b3d-092c-4ff3-8f82-1c636947853b',
      priorities: '1c062ebe-1965-4dd9-afc0-d87c5b4cad62',
      partnerGender: 'dc67f470-3c8d-4335-a0b6-76f0bfcd4ab7',
      partnerAge: 'f9c3723f-4d42-4a52-8222-a7d0801d2f71',
      partnerLocation: '0436e451-15ac-4157-8ce2-4914b860801c',
      partnerWithChildren: 'b9363f30-19ce-4514-bf74-96fc413c3a58',
      additional: '11b8ea39-71f1-4625-903a-5965634c87d0',
    }

    const formatGender = (gender) => {
      if (gender === 'male') return 'М'
      if (gender === 'famale') return 'Ж'
      return '-'
    }

    const normalizeValue = (value, maxItems = null, maxLen = null) => {
      if (value === null || value === undefined || value === '') return '-'
      if (Array.isArray(value)) {
        const normalized = value.filter(Boolean)
        const limited =
          typeof maxItems === 'number'
            ? normalized.slice(0, maxItems)
            : normalized
        return limited.length > 0 ? limited.join(', ') : '-'
      }
      const text = String(value)
      if (maxLen && text.length > maxLen)
        return text.slice(0, maxLen).trim() + '...'
      return text
    }

    const getAnswer = (answers, key, maxItems = null, maxLen = null) =>
      normalizeValue(answers?.[key], maxItems, maxLen)

    const getAge = (birthday) => {
      if (!birthday) return '-'
      const age = birthDateToAge(birthday, new Date(), false)
      return typeof age === 'number' && !Number.isNaN(age) ? age : '-'
    }

    const parseCandidatesIds = (content) => {
      if (!content) return []
      const parts = content.split('candidates=')
      if (parts.length < 2) return []
      const raw = parts[1]
      const match = raw.match(/\[[\s\S]*\]/)
      const json = match ? match[0] : raw
      try {
        const parsed = JSON.parse(json)
        return Array.isArray(parsed) ? parsed : []
      } catch (error) {
        console.log('parseCandidatesIds error :>> ', error)
        return []
      }
    }

    const sendRequest = async () => {
      onConfirm && onConfirm()
      closeModal()
      try {
        if (!selectedUser || !selectedUserQuestionire)
          throw new Error('No selected user data')
        if (!filteredServicesUsers?.length)
          throw new Error('No candidates')

        const todayStr = formatDate(new Date(), false, false, true)
        const stage1Limit = 20
        const finalCandidatesCount = 3

        console.log('individualWedding: начат 1 этап')
        onStageChange &&
          onStageChange('Этап 1/2: быстрый отбор кандидатов')

        const stage1Content = []
        stage1Content.push(`Сегодня ${todayStr}.`)
        stage1Content.push(
          `Этап 1 из 2. Выбери до ${stage1Limit} кандидатов, которые лучше всего подходят пользователю.`
        )
        stage1Content.push(
          'Критерии приоритета: возраст (главный), город, желание иметь детей, пол.'
        )
        stage1Content.push(
          'Ответ строго в формате: candidates=["id1","id2",...]. Без лишнего текста.'
        )
        stage1Content.push(
          `Пользователь: ${getUserFullName(
            selectedUser
          )} | Возраст: ${getAge(
            selectedUser.birthday
          )} | Пол: ${formatGender(
            selectedUser.gender
          )} | Город: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.city
          )} | Хочет детей: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.wantsChildren
          )} | Ищет: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerGender
          )} | Возраст партнера: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerAge
          )} | Место партнера: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerLocation
          )} | Партнер с детьми: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerWithChildren
          )}`
        )

        const stage1CandidatesText = filteredServicesUsers
          .map(({ user, answers }) => {
            const candidateId = user?._id ?? user?.id ?? '-'
            return `${candidateId} | ${getAge(
              user?.birthday
            )} | ${formatGender(user?.gender)} | ${getAnswer(
              answers,
              QUESTION_KEYS.city
            )} | ${getAnswer(answers, QUESTION_KEYS.wantsChildren)}`
          })
          .join('\n')
        stage1Content.push(
          `Кандидаты (ID | Возраст | Пол | Город | Хочет детей):\n${stage1CandidatesText}`
        )

        console.log(
          'individualWedding: данные этапа 1 (отправка ИИ) :>> ',
          stage1Content.join('\n\n')
        )
        const stage1Response = await postData(
          '/api/deepseek',
          { content: stage1Content.join('\n\n'), deep: true },
          null,
          null,
          true,
          null,
          true
        )

        if (!stage1Response?.success)
          throw new Error('Stage 1 request failed')

        const stage1Message =
          stage1Response?.data?.choices?.[0]?.message?.content ?? ''
        console.log(
          'individualWedding: ответ ИИ этапа 1 :>> ',
          stage1Message
        )
        const stage1Ids = parseCandidatesIds(stage1Message)
        const stage1IdsSet = new Set(stage1Ids.map(String))

        const stage1Candidates =
          stage1Ids.length > 0
            ? filteredServicesUsers.filter(({ user }) => {
                const candidateId = user?._id ?? user?.id
                return stage1IdsSet.has(String(candidateId))
              })
            : filteredServicesUsers

        const stage1CandidatesLimited = stage1Candidates.slice(0, stage1Limit)

        console.log('individualWedding: начат 2 этап')
        onStageChange &&
          onStageChange('Этап 2/2: детальный анализ кандидатов')

        const stage2Content = []
        stage2Content.push(`Сегодня ${todayStr}.`)
        stage2Content.push(
          `Этап 2 из 2. Выбери ${finalCandidatesCount} лучших кандидатов.`
        )
        stage2Content.push(
          'Критерии приоритета: возраст (главный), город, желание иметь детей.'
        )
        stage2Content.push(
          'Ответ напиши в формате:\nN. ФИО: [ФИО кандидата]\nВозраст: [возраст кандидата] ([дата рождения])\nОсновные поля анкеты: [поля, на основании которых сделан выбор, с указанием запроса пользователя]\nАргументы: [почему выбран кандидат]'
        )
        stage2Content.push(
          'После списка подведи итоги и кратко опиши, какие кандидаты подходят.'
        )
        stage2Content.push(
          'Также в самом конце напиши ID кандидатов в формате: candidates=["id1", "id2", "id3"] без заголовка и без выделения.'
        )
        stage2Content.push(
          `Пользователь (сжато): ${getUserFullName(
            selectedUser
          )} | Возраст: ${getAge(
            selectedUser.birthday
          )} (${formatDate(
            selectedUser.birthday,
            false,
            false,
            true
          )}) | Пол: ${formatGender(
            selectedUser.gender
          )} | Город: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.city
          )} | Дети: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.hasChildren
          )} | Хочет детей: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.wantsChildren
          )} | Сем. положение: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.relationship
          )} | Ищет: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerGender
          )} | Возраст партнера: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerAge
          )} | Место партнера: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerLocation
          )} | Партнер с детьми: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.partnerWithChildren
          )} | Интересы: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.interests,
            5
          )} | Приоритеты: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.priorities,
            3
          )} | Доп: ${getAnswer(
            selectedUserQuestionire,
            QUESTION_KEYS.additional,
            null,
            160
          )}`
        )

        const stage2CandidatesText = stage1CandidatesLimited
          .map(({ user, answers }) => {
            const candidateId = user?._id ?? user?.id ?? '-'
            return `${candidateId} | ${getUserFullName(user)} | ${getAge(
              user?.birthday
            )} (${formatDate(
              user?.birthday,
              false,
              false,
              true
            )}) | ${formatGender(user?.gender)} | ${getAnswer(
              answers,
              QUESTION_KEYS.city
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.wantsChildren
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.hasChildren
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.relationship
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.partnerGender
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.partnerAge
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.partnerLocation
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.partnerWithChildren
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.interests,
              5
            )} | ${getAnswer(
              answers,
              QUESTION_KEYS.priorities,
              3
            )} | ${getAnswer(answers, QUESTION_KEYS.additional, null, 160)}`
          })
          .join('\n')
        stage2Content.push(
          'Кандидаты (формат: ID | ФИО | Возраст (дата) | Пол | Город | Хочет детей | Дети | Сем. положение | Ищет | Возраст партнера | Место партнера | Партнер с детьми | Интересы | Приоритеты | Доп):'
        )
        stage2Content.push(stage2CandidatesText)

        console.log(
          'individualWedding: данные этапа 2 (отправка ИИ) :>> ',
          stage2Content.join('\n\n')
        )
        const stage2Response = await postData(
          '/api/deepseek',
          { content: stage2Content.join('\n\n'), deep: true },
          null,
          null,
          true,
          null,
          true
        )

        if (!stage2Response?.success)
          throw new Error('Stage 2 request failed')

        const stage2Message =
          stage2Response?.data?.choices?.[0]?.message?.content ?? ''
        console.log(
          'individualWedding: ответ ИИ этапа 2 :>> ',
          stage2Message
        )
        const stage2Parts = stage2Message.split('candidates=')
        const aiResponseRaw = stage2Parts[0]?.trim?.() ?? stage2Message
        const chosenCandidatesIds = parseCandidatesIds(stage2Message)

        console.log(
          'individualWedding: сохранение результата :>> ',
          chosenCandidatesIds
        )
        const saveResponse = await postData(
          `/api/${location}/individualweddings`,
          {
            userId,
            usersFilter: filter,
            allCandidatesIds: filteredServicesUsers.map(
              (serviceUser) => serviceUser.userId
            ),
            chosenCandidatesIds,
            aiResponseRaw,
          },
          null,
          null,
          true,
          null,
          true
        )

        console.log('individualWedding: ответ сохранения :>> ', saveResponse)
        onFinished && onFinished(saveResponse ?? { error: true })
      } catch (error) {
        console.log('individualWedding sendRequest error :>> ', error)
        onFinished && onFinished({ error: true })
      }
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
