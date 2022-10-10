const sortFunctions = {
  date: {
    asc: (a, b) =>
      new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1,
    desc: (a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1,
  },
  name: {
    asc: (a, b) =>
      a.firstName.toLowerCase() < b.firstName.toLowerCase() ? -1 : 1,
    desc: (a, b) =>
      a.firstName.toLowerCase() > b.firstName.toLowerCase() ? -1 : 1,
  },
  birthday: {
    asc: (a, b) =>
      new Date(a.birthday).getTime() > new Date(b.birthday).getTime() ? -1 : 1,
    desc: (a, b) =>
      new Date(a.birthday).getTime() < new Date(b.birthday).getTime() ? -1 : 1,
  },
  createdAt: {
    asc: (a, b) =>
      new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
        ? -1
        : 1,
    desc: (a, b) =>
      new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
        ? -1
        : 1,
  },
}

export default sortFunctions
