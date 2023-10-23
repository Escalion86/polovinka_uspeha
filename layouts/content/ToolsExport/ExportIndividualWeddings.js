import Button from '@components/Button'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import birthDateToAge from '@helpers/birthDateToAge'
import { GENDERS_WITH_NO_GENDER } from '@helpers/constants'
import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import servicesAtom from '@state/atoms/servicesAtom'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import usersAtom from '@state/atoms/usersAtom'
import { useRecoilValue } from 'recoil'

const ExportIndividualWeddings = () => {
  const services = useRecoilValue(servicesAtom)
  const users = useRecoilValue(usersAtom)
  const serviceIS = services.find(
    (service) => service.title === 'Индивидуальные свидания'
  )

  const servicesUsers = useRecoilValue(servicesUsersAtom)
  const serviceUsers = servicesUsers.filter(
    (serviceUser) => serviceUser.serviceId === serviceIS?._id
  )

  const questionnaire = serviceIS?.questionnaire?.data

  const exportExcelFile = async () => {
    const ExcelJs = await import('exceljs')
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet('ИС Анкеты')

    sheet.getRow(1).height = 80
    sheet.getRow(1).alignment = { wrapText: true }
    sheet.getRow(1).font = { bold: true }

    sheet.views = [{ state: 'frozen', ySplit: 1 }]

    // sheet.properties.defaultRowHeight = 80

    sheet.columns = [
      { header: 'ФИО', key: 'userName', width: 36 },
      { header: 'Пол', key: 'userGender', width: 10 },
      { header: 'Дата рождения', key: 'userBirthday', width: 11 },
      { header: 'Возраст', key: 'userAges', width: 8 },
      { header: 'Телефон', key: 'userPhone', width: 14 },
      ...questionnaire.map((data) => ({
        header: data.label,
        key: data.key,
        width: Math.max(Math.min(data.label.length, 80), 15),
      })),
    ]

    for (let index = 0; index < serviceUsers.length; index++) {
      const serviceUser = serviceUsers[index]

      const user = users.find((user) => user._id === serviceUser.userId)
      const answers = { ...serviceUser.answers }
      for (const key in answers) {
        const answer = answers[key]
        if (typeof answer === 'object' && answer !== null)
          answers[key] = answer.join(';\n')
      }
      sheet.addRow({
        userName: getUserFullName(user),
        userGender:
          GENDERS_WITH_NO_GENDER.find((item) => item.value === user.gender)
            ?.name ?? '?',
        userBirthday: formatDate(user.birthday),
        userAges: birthDateToAge(user.birthday, undefined, false, false),
        userPhone: '+' + user.phone,
        ...answers,
      })
      // const endRow = sheet.lastRow._number + 1

      // sheet.getCell(`D${endRow - 1}`).value = {
      //   formula: `=ГОД(ТДАТА())-ГОД(C${endRow - 1})`,
      //   result: undefined,
      // }

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
        column: questionnaire.length + 5,
      },
    }

    // serviceUsers.map((serviceUser) => sheet.addRow(serviceUser.ansvers))

    // var XLSX_CALC = require('xlsx-calc')
    // XLSX_CALC(workbook)
    // XLSX_CALC(workbook, { continue_after_error: true, log_error: true })

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'Индивидуальные свидания.xlsx'
      anchor.click()
      window.URL.revokeObjectURL(url)
    })
  }

  if (!serviceIS) return null

  return (
    <Button
      name="Анкеты Индивидуальных свиданий"
      onClick={exportExcelFile}
      icon={faUpload}
    />
  )
}

export default ExportIndividualWeddings
