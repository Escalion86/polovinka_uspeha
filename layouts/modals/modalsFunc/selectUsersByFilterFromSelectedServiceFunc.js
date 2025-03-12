import ContentHeader from '@components/ContentHeader'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'

const selectUsersByFilterFromSelectedServiceFunc = (serviceId, onSelect) => {
  const SelectUsersByFilterFromSelectedServiceModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const service = useAtomValue(serviceSelector(serviceId))
    const servicesUsers = useAtomValue(
      servicesUsersFullByServiceIdSelector(serviceId)
    )

    const [filter, setFilter] = useState({
      gender: {
        male: true,
        famale: true,
        // null: true,
      },
      status: {
        novice: true,
        member: true,
      },
      relationship: {
        havePartner: true,
        noPartner: true,
      },
    })

    const usersGendersCount = useMemo(
      () => ({
        male: servicesUsers.filter(({ user }) => user.gender === 'male').length,
        famale: servicesUsers.filter(({ user }) => user.gender === 'famale')
          .length,
      }),
      [servicesUsers]
    )

    const usersStatusCount = useMemo(
      () => ({
        novice: servicesUsers.filter(
          ({ userStatus }) => userStatus === 'novice'
        ).length,
        member: servicesUsers.filter(
          ({ userStatus }) => userStatus === 'member'
        ).length,
        ban: servicesUsers.filter(({ userStatus }) => userStatus === 'ban')
          .length,
      }),
      [servicesUsers]
    )

    const usersRelationshipCount = useMemo(
      () => ({
        havePartner: servicesUsers.filter(({ user }) => user.relationship)
          .length,
        noPartner: servicesUsers.filter(({ user }) => !user.relationship)
          .length,
      }),
      [servicesUsers]
    )

    useEffect(() => {
      setOnConfirmFunc(() => {
        const fullyFilteredUsers = servicesUsers
          .filter(
            ({ user }) =>
              user &&
              filter.gender[String(user.gender)] &&
              filter.status[user?.status ?? 'novice'] &&
              (user.relationship
                ? filter.relationship.havePartner
                : filter.relationship.noPartner)
          )
          .map(({ user }) => user)
        // if (checkAddEventDescription)
        onSelect(fullyFilteredUsers, service)
        // else onSelect(fullyFilteredUsers)
        closeModal()
      })
    }, [servicesUsers, filter])

    // const usersGendersBottonsConfig = useMemo(
    //   () =>
    //     GENDERS.map((button) => ({
    //       ...button,
    //       name: (
    //         <div className="flex flex-col justify-center">
    //           <div>{button.name}</div>
    //           <div>{usersStatusesCount[button.value]} чел.</div>
    //         </div>
    //       ),
    //     })),
    //   [usersStatusesCount]
    // )

    // const selectedStatuses = Object.keys(value).filter((key) => value[key])

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-col items-center justify-center text-lg">
          <div className="flex justify-center w-full text-lg font-bold">
            {service?.title}
          </div>
        </div>
        {/* <div> */}
        <Divider title="Фильтр по пользователям" />
        <ContentHeader noBorder>
          <GenderToggleButtons
            value={filter.gender}
            onChange={(value) =>
              setFilter((state) => ({ ...state, gender: value }))
            }
            hideNullGender
            names={usersGendersCount}
          />
          <StatusUserToggleButtons
            value={filter.status}
            onChange={(value) =>
              setFilter((state) => ({ ...state, status: value }))
            }
            names={usersStatusCount}
          />
          <RelationshipUserToggleButtons
            value={filter.relationship}
            onChange={(value) =>
              setFilter((state) => ({ ...state, relationship: value }))
            }
            names={usersRelationshipCount}
          />
          {/* <UsersFilter value={filter} onChange={setFilter} /> */}
        </ContentHeader>
        {/* <div>
          Итого выбрано:{' '}
          {eventUsers.filter(({ status }) => statusInEvent[status]).length}
        </div> */}
        {/* <CheckBox
          checked={checkAddEventDescription}
          onChange={() => setCheckAddEventDescription}
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Выбор участников на подавших заявку на услугу по фильтру`,
    // declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: SelectUsersByFilterFromSelectedServiceModal,
  }
}

export default selectUsersByFilterFromSelectedServiceFunc
