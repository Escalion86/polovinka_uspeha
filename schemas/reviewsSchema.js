const reviewsSchema = {
  author: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Имя автора'],
    default: '',
  },
  review: {
    type: String,
    maxlength: [600, 'Отзыв не может превышать 600 символов'],
    default: '',
  },
  authorAge: {
    type: Number,
    default: null,
  },
  showOnSite: {
    type: Boolean,
    default: true,
  },
}

export default reviewsSchema
