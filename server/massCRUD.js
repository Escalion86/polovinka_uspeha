import Answers from '@models/Answers'
import Chapters from '@models/Chapters'
import Courses from '@models/Courses'
import Lectures from '@models/Lectures'
import Tasks from '@models/Tasks'
import dbConnect from '@utils/dbConnect'

// Удаляет курс, а также его разделы, лекции, задания и ответы на задания
export async function deleteCourseAndHisBranch(
  courseId,
  res,
  deleteOnlyBranch = false
) {
  await dbConnect()

  try {
    if (courseId) {
      // Сначала получаем все разделы у курса
      const chapters = await Chapters.find({ courseId })
      const chaptersIds = chapters.map((chapter) => chapter._id)

      // Получаем все лекции у полученных разделов
      const lectures = await Lectures.find({ chapterId: { $in: chaptersIds } })
      const lecturesIds = lectures.map((lecture) => lecture._id)

      // Получаем все задания у полученных лекций
      const tasks = await Tasks.find({ lectureId: { $in: lecturesIds } })
      const tasksIds = tasks.map((task) => task._id)

      const data = {}
      if (!deleteOnlyBranch) {
        // Удаляем курс
        data.courses = await Courses.deleteOne({
          _id: courseId,
        })
        if (!data.courses) {
          return res?.status(400).json({ success: false })
        }
      }

      // Удаляем разделы
      data.chapters = await Chapters.deleteMany({ courseId })
      if (!data.chapters) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем лекции
      data.lectures = await Lectures.deleteMany({
        chapterId: { $in: chaptersIds },
      })
      if (!data.lectures) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем задания
      data.tasks = await Tasks.deleteMany({ lectureId: { $in: lecturesIds } })
      if (!data.tasks) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем все ответы на задания
      data.answers = await Answers.find({ taskId: { $in: tasksIds } })
      if (!data.answers) {
        return res?.status(400).json({ success: false })
      }

      return res?.status(200).json({ success: true, data })
    } else {
      return res?.status(400).json({ success: false })
    }
  } catch (error) {
    console.log(error)
    return res?.status(400).json({ success: false, error })
  }
}

// Удаляет раздел, а также его лекции, задания и ответы на задания
export async function deleteChapterAndHisBranch(
  chapterId,
  res,
  deleteOnlyBranch = false
) {
  await dbConnect()

  try {
    if (chapterId) {
      // Находим этот раздел, чтобы узнать к какой главе он относится
      const chapter = await Chapters.findById(chapterId)
      const courseId = chapter.courseId

      console.log('chapter', chapter)

      // Находим все главы курса
      const chapters = await Chapters.find({ courseId })

      // Смотрим индексы разделов и обновляем их по необходимости
      const sortedChapters = chapters.sort((a, b) =>
        a.index < b.index ? -1 : 1
      )

      for (let i = 0; i < sortedChapters.length; i++) {
        if (i === chapter.index) continue
        if (i > chapter.index) {
          await Chapters.findByIdAndUpdate(sortedChapters[i]._id, {
            index: i - 1,
          })
        } else if (sortedChapters[i].index !== i) {
          await Chapters.findByIdAndUpdate(sortedChapters[i]._id, { index: i })
        }
      }

      // Сначала получаем все лекции у раздела
      const lectures = await Lectures.find({ chapterId })
      const lecturesIds = lectures.map((lecture) => lecture._id)

      // Получаем все задания у полученных лекций
      const tasks = await Tasks.find({ lectureId: { $in: lecturesIds } })
      const tasksIds = tasks.map((task) => task._id)

      const data = {}
      if (!deleteOnlyBranch) {
        // Удаляем раздел
        data.chapters = await Chapters.deleteOne({
          _id: chapterId,
        })
        if (!data.chapters) {
          return res?.status(400).json({ success: false })
        }
      }

      // Удаляем лекции
      data.lectures = await Lectures.deleteMany({ chapterId })
      if (!data.lectures) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем задания
      data.tasks = await Tasks.deleteMany({ lectureId: { $in: lecturesIds } })
      if (!data.tasks) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем все ответы на задания
      data.answers = await Answers.find({ taskId: { $in: tasksIds } })
      if (!data.answers) {
        return res?.status(400).json({ success: false })
      }

      return res?.status(200).json({ success: true, data })
    } else {
      return res?.status(400).json({ success: false })
    }
  } catch (error) {
    console.log(error)
    return res?.status(400).json({ success: false, error })
  }
}

// Удаляет лекцию, а также её задания и ответы на задания
export async function deleteLectureAndHisBranch(
  lectureId,
  res,
  deleteOnlyBranch = false
) {
  await dbConnect()

  try {
    if (lectureId) {
      // Сначала получаем все задания у лекции
      const tasks = await Tasks.find({ lectureId })
      const tasksIds = tasks.map((task) => task._id)

      const data = {}
      if (!deleteOnlyBranch) {
        // Удаляем лекцию
        data.lectures = await Lectures.deleteOne({
          _id: lectureId,
        })
        if (!data.lectures) {
          return res?.status(400).json({ success: false })
        }
      }

      // Удаляем задания
      data.tasks = await Tasks.deleteMany({ lectureId })
      if (!data.tasks) {
        return res?.status(400).json({ success: false })
      }

      // Удаляем все ответы на задания
      data.answers = await Answers.find({ taskId: { $in: tasksIds } })
      if (!data.answers) {
        return res?.status(400).json({ success: false })
      }

      return res?.status(200).json({ success: true, data })
    } else {
      return res?.status(400).json({ success: false })
    }
  } catch (error) {
    console.log(error)
    return res?.status(400).json({ success: false, error })
  }
}

// Удаляет задание, а также ответы на него
export async function deleteTaskAndHisAnswers(
  taskId,
  res,
  deleteOnlyAnswers = false
) {
  await dbConnect()

  try {
    if (taskId) {
      const data = {}
      if (!deleteOnlyAnswers) {
        // Удаляем задание
        data.tasks = await Tasks.deleteOne({
          _id: taskId,
        })
        if (!data.tasks) {
          return res?.status(400).json({ success: false })
        }
      }

      // Удаляем все ответы на задания
      data.answers = await Answers.find({ taskId })
      if (!data.answers) {
        return res?.status(400).json({ success: false })
      }

      return res?.status(200).json({ success: true, data })
    } else {
      return res?.status(400).json({ success: false })
    }
  } catch (error) {
    console.log(error)
    return res?.status(400).json({ success: false, error })
  }
}

// Создает раздел, а также одну лекцию в нем
export async function createChapterAndHisLecture(req, res) {
  const { query, method, body } = req
  await dbConnect()

  try {
    const data = {}
    data.chapter = await Chapters.create(body)
    if (!data.chapter) {
      return res?.status(400).json({ success: false })
    }
    data.lecture = await Lectures.create({ chapterId: data.chapter._id })
    if (!data.lecture) {
      return res?.status(400).json({ success: false })
    }
    return res?.status(201).json({ success: true, data })
  } catch (error) {
    console.log(error)
    return res?.status(400).json({ success: false, error })
  }
}
