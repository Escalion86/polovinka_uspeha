import checkLocationValid from '@server/checkLocationValid'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'
import { getBaseUrl } from 'nextjs-url'

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    const location = query?.location
    if (!location)
      return res?.status(400).json({ success: false, error: 'No location' })

    if (!checkLocationValid(location))
      return res
        ?.status(400)
        .json({ success: false, error: 'Invalid location' })

    const {
      userId,
      content,
      usersFilter,
      allCandidatesIds,
      chosenCandidatesIds,
      aiResponseRaw,
    } = body

    const db = await dbConnect(location)
    if (!db) return res?.status(400).json({ success: false, error: 'db error' })

    let formattedContent = null
    let finalChosenCandidatesIds = null

    if (aiResponseRaw && Array.isArray(chosenCandidatesIds)) {
      formattedContent = aiResponseRaw
        .trim('\n')
        .trim(' ')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<i>$1</i>')
        .replace(/--(.*?)--/g, '<del>$1</del>')
        .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
        .replace(/\n/g, '<br>')
      finalChosenCandidatesIds = chosenCandidatesIds
    } else {
      const baseUrl = getBaseUrl(req).href

      const result = await fetch(baseUrl + 'api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          deep: true,
        }),
      })

      const json = await result.json()

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

      // console.log('json :>> ', json)

      if (!json?.success) {
        return res?.status(400).json({ success: false, error: 'result error' })
      } else {
        const content = json.data.choices[0].message.content.split('candidates=')
        const chosenCandidatesIdsString = content[1]
        formattedContent = content[0]
          .trim('\n')
          .trim(' ')
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/__(.*?)__/g, '<u>$1</u>')
          .replace(/~~(.*?)~~/g, '<i>$1</i>')
          .replace(/--(.*?)--/g, '<del>$1</del>')
          .replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>")
          .replace(/\n/g, '<br>')
        // setResponse(formatedContent)
        finalChosenCandidatesIds = chosenCandidatesIdsString
          ? JSON.parse(chosenCandidatesIdsString)
          : []
      }
    }

    const newIndividualWedding = await db.model('IndividualWeddings').create({
      userId,
      aiResponse: formattedContent,
      usersFilter,
      allCandidatesIds,
      chosenCandidatesIds: finalChosenCandidatesIds ?? [],
    })
    return res
      ?.status(200)
      .json({ success: true, data: newIndividualWedding })
  }

  return await CRUD('IndividualWeddings', req, res)
}
