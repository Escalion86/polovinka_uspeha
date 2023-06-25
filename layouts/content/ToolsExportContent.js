import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import ExcelJs from 'exceljs'
import Button from '@components/Button'
import servicesAtom from '@state/atoms/servicesAtom'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import getUserFullName from '@helpers/getUserFullName'
import { GENDERS_WITH_NO_GENDER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'

const getBase64Image = async (imgUrl) => {
  return await new Promise(function (resolve, reject) {
    var img = new Image()
    img.src = imgUrl
    img.setAttribute('crossOrigin', 'anonymous')

    img.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL('image/png')
      resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''))
    }
    img.onerror = function () {
      reject('The image could not be loaded.')
    }
  }).then((data) => data)
}

// const getBase64ImageFromUrl = async (imageUrl) => {
//   var res = await fetch(imageUrl)
//   var blob = await res.blob()

//   return new Promise((resolve, reject) => {
//     var reader = new FileReader()
//     reader.addEventListener(
//       'load',
//       function () {
//         resolve(reader.result)
//       },
//       false
//     )

//     reader.onerror = () => {
//       return reject(this)
//     }
//     reader.readAsDataURL(blob)
//   })
// }

const ToolsExportContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const services = useRecoilValue(servicesAtom)
  const users = useRecoilValue(usersAtom)
  const serviceIS = services.find(
    (service) => service.title === 'Индивидуальные свидания'
  )

  const servicesUsers = useRecoilValue(servicesUsersAtom)
  const serviceUsers = servicesUsers.filter(
    (serviceUser) => serviceUser.serviceId === serviceIS._id
  )

  const questionnaire = serviceIS.questionnaire.data

  const exportExcelFile = async () => {
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet('ИС Анкеты')

    sheet.getRow(1).height = 80
    sheet.getRow(1).alignment = { wrapText: true }
    sheet.getRow(1).font = { bold: true }

    sheet.views = [{ state: 'frozen', ySplit: 1 }]

    // sheet.properties.defaultRowHeight = 80

    sheet.columns = [
      { header: 'Фото', key: 'foto', width: 20 },
      { header: 'ФИО', key: 'userName', width: 30 },
      { header: 'Пол', key: 'userGender', width: 10 },
      { header: 'Телефон', key: 'userPhone', width: 14 },
      ...questionnaire.map((data) => ({
        header: data.label,
        key: data.key,
        width: Math.max(Math.min(data.label.length * 0.66, 80), 15),
      })),
    ]

    for (let index = 0; index < serviceUsers.length; index++) {
      const serviceUser = serviceUsers[index]

      const user = users.find((user) => user._id === serviceUser.userId)
      const answers = { ...serviceUser.answers }
      if (answers['96410c58-3b3b-400d-b209-4fbe1e1a465a']) {
        const myBase64Image = await getBase64Image(
          answers['96410c58-3b3b-400d-b209-4fbe1e1a465a'][0]
        )
        const imageId2 = workbook.addImage({
          base64: myBase64Image,
          // buffer: fs.readFileSync(
          //   answers['96410c58-3b3b-400d-b209-4fbe1e1a465a'][0]
          // ),
          extension: 'jpeg',
        })
        sheet.addImage(imageId2, {
          tl: { col: 0, row: index + 1 },
          ext: { width: 500, height: 200 },
          // filename: answers['96410c58-3b3b-400d-b209-4fbe1e1a465a'][0],
          // extension: 'jpeg',
        })
      }
      for (const key in answers) {
        const answer = answers[key]
        if (typeof answer === 'object' && answer !== null)
          answers[key] = answer.join(';\n')
      }
      sheet.addRow({
        userName: getUserFullName(user),
        userGender: GENDERS_WITH_NO_GENDER.find(
          (item) => (item.value = user.gender)
        ).name,
        userPhone: '+' + user.phone,
        ...answers,
      })

      // sheet.addImage(imageId2, {
      //   tl: { col: 0, row: index + 1 },
      //   ext: { width: 500, height: 200 },
      //   hyperlinks: {
      //     hyperlink: answers['96410c58-3b3b-400d-b209-4fbe1e1a465a'][0],
      //     // tooltip: 'http://www.somewhere.com'
      //   },
      // })
      sheet.getRow(index + 2).alignment = {
        wrapText: true,
        vertical: 'middle',
      }
    }

    sheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: questionnaire.length + 3,
      },
    }

    // serviceUsers.map((serviceUser) => sheet.addRow(serviceUser.ansvers))

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'download.xlsx'
      anchor.click()
      window.URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="h-full max-h-full p-1 overflow-y-auto">
      <Button
        name="Скачать анкеты Индивидуальных свиданий"
        onClick={exportExcelFile}
      />
    </div>
  )
}

export default ToolsExportContent
