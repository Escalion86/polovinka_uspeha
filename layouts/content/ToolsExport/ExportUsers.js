import Button from '@components/Button'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import birthDateToAge from '@helpers/birthDateToAge'
import {
  GENDERS_WITH_NO_GENDER,
  USERS_ROLES,
  USERS_STATUSES,
} from '@helpers/constants'
import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import usersAtom from '@state/atoms/usersAtom'
import { useRecoilValue } from 'recoil'

const ExportUsers = () => {
  const users = useRecoilValue(usersAtom)

  const exportExcelFile = async () => {
    const ExcelJs = await import('exceljs')
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet('Пользователи')

    sheet.getRow(1).height = 30
    sheet.getRow(1).alignment = { wrapText: true }
    sheet.getRow(1).font = { bold: true }

    sheet.views = [{ state: 'frozen', ySplit: 1 }]

    // sheet.properties.defaultRowHeight = 80

    sheet.columns = [
      { header: 'ФИО', key: 'userName', width: 36 },
      { header: 'Пол', key: 'userGender', width: 10 },
      { header: 'Дата рождения', key: 'userBirthday', width: 11 },
      { header: 'Возраст', key: 'userAges', width: 8 },
      { header: 'Есть дети?', key: 'userHaveKids', width: 10 },
      { header: 'Статус', key: 'userStatus', width: 18 },
      { header: 'Роль', key: 'userRole', width: 16 },
      { header: 'Дата регистрации', key: 'userRegistrationDate', width: 12 },
      { header: 'Телефон', key: 'userPhone', width: 14 },
      { header: 'Whatsapp', key: 'userWhatsapp', width: 14 },
      { header: 'Viber', key: 'userViber', width: 14 },
      { header: 'Telegram', key: 'userTelegram', width: 18 },
      { header: 'Instagram', key: 'userInstagram', width: 18 },
      { header: 'Vk', key: 'userVk', width: 18 },
      { header: 'EMail', key: 'userEMail', width: 22 },
    ]

    for (let index = 0; index < users.length; index++) {
      const user = users[index]
      const userStatus = USERS_STATUSES.find(
        ({ value }) => value === (user.status ?? 'novice')
      )
      const userRole = USERS_ROLES.find(
        ({ value }) => value === (user.role ?? 'client')
      )

      sheet.addRow({
        userName: getUserFullName(user),
        userGender:
          GENDERS_WITH_NO_GENDER.find((item) => item.value === user.gender)
            ?.name ?? '?',
        userBirthday: formatDate(user.birthday),
        userAges: birthDateToAge(user.birthday, undefined, false, false),
        userStatus: userStatus.name,
        userRole: userRole.name,
        userHaveKids: user.haveKids ? 'Да' : 'Нет',
        userRegistrationDate: formatDate(user.createdAt),
        userPhone: '+' + user.phone,
        userWhatsapp: user.whatsapp ? '+' + user.whatsapp : '',
        userViber: user.viber ? '+' + user.viber : '',
        userTelegram: user.telegram ? '@' + user.telegram : '',
        userInstagram: user.instagram ? '@' + user.instagram : '',
        userVk: user.vk ? '@' + user.vk : '',
        userEMail: user.email ?? '',
      })
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
        column: 15,
      },
    }

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'Пользователи.xlsx'
      anchor.click()
      window.URL.revokeObjectURL(url)
    })
  }

  return (
    <Button
      name="Данные пользователей"
      onClick={exportExcelFile}
      icon={faUpload}
    />
  )
}

export default ExportUsers
