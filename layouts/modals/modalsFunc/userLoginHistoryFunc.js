import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'

import FormWrapper from '@components/FormWrapper'
import { modalsFuncAtom } from '@state/atoms'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import { getData } from '@helpers/CRUD'
import { useState } from 'react'
import formatDate from '@helpers/formatDate'
import formatDateTime from '@helpers/formatDateTime'
import LoadingSpinner from '@components/LoadingSpinner'
import TextLine from '@components/TextLine'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'

const userLoginHistoryFunc = (userId, clone = false) => {
  const UserLoginHistoryModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const [loginHistories, setLoginHistories] = useState()

    const user = useRecoilValue(userSelector(userId))

    useEffect(() => {
      getData(`/api/loginhistory`, { userId }, setLoginHistories)
    }, [userId])

    if (!loginHistories)
      return (
        <div className="z-10 flex items-center justify-center h-24">
          <LoadingSpinner text="идет загрузка истории...." />
        </div>
      )
    if (loginHistories.length === 0)
      return <div>Пользователь ни разу на заходил на сайт</div>

    const unicLogins = loginHistories.filter(
      ({ createdAt, browser }, index, array) => {
        return !array.find(
          (item, i) =>
            index < i &&
            item.browser.platform === browser.platform &&
            item.browser.sUsrAg === browser.sUsrAg
        )
      }
    )

    return (
      <TabContext value="История">
        <TabPanel tabName="Устройства">
          <div className="flex flex-col bg-gray-200 border border-gray-400 gap-y-1">
            {unicLogins
              .slice(0)
              .reverse()
              .map(({ createdAt, browser }) => {
                return (
                  <div className="px-1 bg-white border-gray-400 shadow-md border-y-1">
                    <div className="text-sm font-bold">{browser.platform}</div>
                    <div className="text-sm">{browser.sUsrAg}</div>
                  </div>
                )
              })}
          </div>
        </TabPanel>
        <TabPanel tabName="История">
          <div className="flex flex-col bg-gray-200 border border-gray-400 gap-y-1">
            {loginHistories
              .slice(0)
              .reverse()
              .map(({ createdAt, browser }) => {
                return (
                  <div className="px-1 bg-white border-gray-400 shadow-md border-y-1">
                    <div className="flex justify-between text-sm font-bold gap-x-1">
                      <div>{formatDateTime(createdAt)}</div>
                      <div>{browser.platform}</div>
                    </div>
                    <div className="text-sm">{browser.sUsrAg}</div>
                  </div>
                )
              })}
          </div>
        </TabPanel>
      </TabContext>
    )
  }

  return {
    title: `История авторизаций пользователя`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserLoginHistoryModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: userId }}
    //     typeOfItem="user"
    //     forForm
    //     direction="right"
    //   />
    // ),
  }
}

export default userLoginHistoryFunc
