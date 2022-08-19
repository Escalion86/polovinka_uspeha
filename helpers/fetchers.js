export async function fetchingAll(setState = () => {}) {
  // console.log('Запущен fetchingAll')
  const urls = ['/api/admin']
  const result = await Promise.all(
    urls.map(async (url) => {
      const resp = await fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)
      return resp
    })
  )
  setState(result[0])
  return result[0]
}

export async function fetchingEvents(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingEvents')
  const resp = await fetch(`${domen}/api/events`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingDirections(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingDirections')
  const resp = await fetch(`${domen}/api/directions`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingReviews(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingReviews')
  const resp = await fetch(`${domen}/api/reviews`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingAdditionalBlocks(
  domen = process.env.NEXTAUTH_SITE
) {
  // console.log('Запущен fetchingAdditionalBlocks')
  const resp = await fetch(`${domen}/api/additionalBlocks`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingPayments(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingPayments')
  const resp = await fetch(`${domen}/api/payments`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingUsers(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingUsers')
  const resp = await fetch(`${domen}/api/users`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingUsersById(id, domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingUsersById')
  const resp = await fetch(`${domen}/api/users/byId/${id}`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingUserByEmail(
  email,
  domen = process.env.NEXTAUTH_SITE
) {
  // console.log('Запущен fetchingUserByEmail')
  const resp = await fetch(`${domen}/api/users/byEmail/${email}`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingUserByPhone(
  phone,
  domen = process.env.NEXTAUTH_SITE
) {
  // console.log('Запущен fetchingUserByPhone')
  const resp = await fetch(`${domen}/api/users/byPhone/${phone}`)
    .then((res) => res.json())
    .then((json) => json.data)
    .catch((error) => console.log(error))
  return resp
}

export async function fetchingLog(data, domen = process.env.NEXTAUTH_SITE) {
  console.log('Запущен fetchingLog')
  const resp = await fetch(`${domen}/api/events`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
    // 'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingEventsUsers(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingEventsUsers')
  const resp = await fetch(`${domen}/api/eventsusers`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

export async function fetchingSiteSettings(domen = process.env.NEXTAUTH_SITE) {
  // console.log('Запущен fetchingSiteSettings')
  const resp = await fetch(`${domen}/api/site`)
    .then((res) => res.json())
    .then((json) => json.data)
  return resp
}

// export async function fetchingUsersCourses(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingUsersCourses')
//   const resp = await fetch(`${domen}/api/userscourses`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingUsersCoursesByUserId(
//   userId,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingUsersCoursesByUserId')
//   const resp = await fetch(`${domen}/api/userscourses/byUser/${userId}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingCourses(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingCourses')
//   const resp = await fetch(`${domen}/api/courses`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingCourse(id, domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingCourse')
//   const resp = await fetch(`${domen}/api/courses/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingCourseAndHisChaptersAndLecturesAndTasks(
//   courseId,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingCourseAndHisChaptersAndLectures')
//   const course = await fetchingCourse(courseId, domen)
//   const chapters = await fetchingChaptersByCourseId(courseId, domen)
//   const lectures = await fetchingLectures(domen)
//   const tasks = await fetchingTasks(domen)

//   const courseChaptersIds = chapters.map((chapter) => chapter._id)

//   const courseLectures = lectures.filter((lecture) =>
//     courseChaptersIds.includes(lecture.chapterId)
//   )

//   const courseLecturesIds = courseLectures.map((lecture) => lecture._id)

//   const courseTasks = tasks.filter((task) =>
//     courseLecturesIds.includes(task.lectureId)
//   )

//   return {
//     course,
//     chapters,
//     lectures: courseLectures,
//     tasks: courseTasks,
//   }
// }

// export async function fetchingChapters(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingChapters')
//   const resp = await fetch(`${domen}/api/chapters`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingChapter(id, domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingChapter')
//   const resp = await fetch(`${domen}/api/chapters/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingChaptersByCourseId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingChapterByCourseId')
//   const resp = await fetch(`${domen}/api/chapters/byCourse/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingLectures(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingLectures')
//   const resp = await fetch(`${domen}/api/lectures`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingLecturesByChapterId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingLectureByChapterId')
//   const resp = await fetch(`${domen}/api/lectures/byChapter/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingTasks(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingTasks')
//   const resp = await fetch(`${domen}/api/tasks`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingTask(id, domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingTask')
//   const resp = await fetch(`${domen}/api/tasks/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingTasksByLectureId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingTasksByLectureId')
//   const resp = await fetch(`${domen}/api/tasks/byLecture/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingAnswers(domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingAnswers')
//   const resp = await fetch(`${domen}/api/answers`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingAnswer(id, domen = process.env.NEXTAUTH_SITE) {
//   console.log('Запущен fetchingAnswer')
//   const resp = await fetch(`${domen}/api/answers/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingAnswersByTaskId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingAnswersByTaskId')
//   const resp = await fetch(`${domen}/api/answers/byTask/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingAnswersByUserId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingAnswersByUserId')
//   const resp = await fetch(`${domen}/api/answers/byUser/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingUserViewedLecturesByUserId(
//   id,
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingUserViewedLecturesByUserId')
//   const resp = await fetch(`${domen}/api/userviewedlectures/byUser/${id}`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }

// export async function fetchingUserViewedLectures(
//   domen = process.env.NEXTAUTH_SITE
// ) {
//   console.log('Запущен fetchingUserViewedLectures')
//   const resp = await fetch(`${domen}/api/userviewedlectures`)
//     .then((res) => res.json())
//     .then((json) => json.data)
//   return resp
// }
