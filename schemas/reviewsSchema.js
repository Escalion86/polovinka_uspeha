const reviewsSchema = {
  author: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Имя автора'],
    default: '',
  },
  review: {
    type: String,
    default: '',
  },
  authorAge: {
    type: Number,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
  index: {
    type: Number,
    default: null,
  },
}

export default reviewsSchema
