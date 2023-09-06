const eventsTagsSchema = {
  text: {
    type: String,
    default: 'Новое мероприятие',
    required: [true, 'Необходимо ввести текст'],
  },
  color: {
    type: String,
    default: '#ffffff',
  },
}

export default eventsTagsSchema
