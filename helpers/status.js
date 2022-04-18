export const taskStatus = (tasksId, answers = []) => {
  if (!tasksId || !answers || answers.length === 0) return 'none'
  if (
    answers.find(
      (answer) => answer.taskId === tasksId && answer.status === 'confirmed'
    )
  )
    return 'confirmed'
  if (
    answers.find(
      (answer) => answer.taskId === tasksId && answer.status === 'sended'
    )
  )
    return 'sended'
  if (
    answers.find(
      (answer) => answer.taskId === tasksId && answer.status === 'declined'
    )
  )
    return 'declined'

  return 'none'
}

export const tasksStatuses = (tasks, answers, lectureId) => {
  if (lectureId)
    return tasks
      .filter((task) => task.lectureId === lectureId)
      .map((task) => taskStatus(task._id, answers))
  return tasks.map((task) => taskStatus(task._id, answers))
}

export const lectureStatusByTasksStatusesArray = (tasksStatuses) => {
  // const tasksOfLecture = tasks.filter((task) => task.lectureId === lectureId)
  // const statusesOfTasksOfLecture = tasksStatuses(tasksOfLecture, answers)
  if (tasksStatuses.includes('declined')) return 'declined'
  if (tasksStatuses.includes('sended')) return 'sended'
  if (tasksStatuses.every((status) => status === 'confirmed'))
    return 'confirmed'
  return 'none'
}
