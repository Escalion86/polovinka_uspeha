const sertificatesSchema = {
  title: {
    type: String,
    // required: [true, 'Введите название курса. Давай включи фантазию!'],
    maxlength: [100, 'Название сертификата не может превышать 100 символов'],
    default: 'Сертификат',
    formOptions: {
      name: 'Название',
      type: 'text',
    },
  },
  description: {
    type: String,
    maxlength: [
      2000,
      'Описание не может превышать 2000 символов. Краткость - сестра таланта!',
    ],
    default: 'Описание сертификата',
    formOptions: {
      name: 'Описание',
      type: 'editabletextarea',
    },
  },
  image: {
    type: String,
    default: '',
    formOptions: {
      name: 'Картинка',
      type: 'image',
    },
  },
  showOnSite: {
    type: Boolean,
    default: true,
    formOptions: {
      name: 'Показывать на сайте',
      type: 'checkbox',
    },
  },
}

export default sertificatesSchema
