import Skeleton from 'react-loading-skeleton'
import CardWrapper from '@components/CardWrapper'

// itemSize={widthNum > 3 ? 165 : widthNum === 3 ? 176 : 224}
// itemSize={widthNum > 2 ? 98 : 101}

const UserCardSkeleton = ({ loading, hidden = false, style }) => {
  return (
    <CardWrapper loading={loading} hidden={hidden} style={style}>
      <div className="flex w-full h-[92px]">
        {/* <div className="flex items-center justify-center w-8 bg-gray-400" /> */}
        <Skeleton
          count={1}
          height="100%"
          borderRadius={0}
          containerClassName="pb-1 -mt-[3px] w-8"
        />
        <div className="flex flex-col flex-1 tablet:flex-row">
          <div className="flex flex-1 border-b tablet:border-b-0">
            <Skeleton
              count={1}
              height="100%"
              borderRadius={0}
              containerClassName="hidden pb-1 -mt-[3px] w-full max-w-[92px] tablet:block"
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="flex h-8 max-h-8 flex-nowrap items-start pl-1 py-0.5 leading-6 gap-x-1">
                    <div className="flex items-center flex-1 h-7 max-h-7 flex-nowrap">
                      {/* <Skeleton
                        count={1}
                        // height="100%"
                        borderRadius={0}
                        containerClassName="-mt-[3px] w-5"
                      />
                      <Skeleton
                        count={1}
                        // height="100%"
                        borderRadius={0}
                        containerClassName="ml-2 -mt-[3px] w-5 "
                      /> */}
                      <Skeleton
                        count={1}
                        // height="100%"
                        // borderRadius={0}
                        containerClassName="-mt-[3px] w-full max-w-80"
                      />
                      {/* <UserRelationshipIcon
                        relationship={user.relationship}
                        showHavePartnerOnly
                      />
                      <UserStatusIcon status={user.status} size="m" />
                      <UserName
                        user={user}
                        className="h-8 text-base font-bold tablet:text-lg -mt-0.5 tablet:mt-0"
                      /> */}
                    </div>
                    <Skeleton
                      count={1}
                      // height="100%"
                      // borderRadius={0}
                      containerClassName="w-5 mr-1"
                    />
                    {/* <CardButtons item={user} typeOfItem="user" /> */}
                  </div>
                  <div className="flex tablet:h-full">
                    {/* <img
                      className="object-cover w-[60px] h-[60px] min-w-[60px] min-h-[60px] tablet:hidden"
                      src={getUserAvatarSrc(user)}
                      alt="user"
                    /> */}
                    <Skeleton
                      count={1}
                      height="100%"
                      borderRadius={0}
                      containerClassName="-mt-[5px] w-[60px] h-[60px] min-w-[60px] min-h-[60px] tablet:hidden"
                    />
                    <div className="flex flex-col justify-end h-full px-1">
                      {/* <div className="flex items-center flex-1">
                        <TextLinesLimiter
                          className="text-sm italic font-normal leading-[14px] text-general"
                          lines={2}
                          textCenter={false}
                        >
                          {user.personalStatus}
                        </TextLinesLimiter>
                      </div>
                      {user.birthday &&
                        (seeBirthday ||
                          user.security?.showBirthday === true ||
                          user.security?.showBirthday === 'full') && (
                          <div className="flex text-sm leading-4 gap-x-2 ">
                            <span className="flex items-center font-bold">
                              Возраст:
                            </span>
                            <div className="flex items-center text-sm font-normal whitespace-nowrap gap-x-2">
                              <span className="leading-4">
                                {birthDateToAge(
                                  user.birthday,
                                  serverDate,
                                  true,
                                  false,
                                  true
                                )}
                              </span>
                              <ZodiacIcon date={user.birthday} small />
                            </div>
                          </div>
                        )}
                      {typeof user.signedUpEventsCount === 'number' && (
                        <div className="flex text-sm leading-4 gap-x-2">
                          <span className="font-bold">
                            Посетил мероприятий:
                          </span>
                          <span className="font-normal">
                            {user.signedUpEventsCount}
                          </span>
                        </div>
                      )} */}
                    </div>
                    {/* <div className="flex items-end justify-end flex-1 py-1 pr-1 gap-x-1">
                      {seeNotificationIcon && (
                        <div className="flex items-center justify-end gap-x-1">
                          <FontAwesomeIcon
                            className={cn(
                              'h-3',
                              user.notifications?.telegram?.active &&
                                user.notifications?.telegram?.id
                                ? 'text-success'
                                : 'text-gray-800'
                            )}
                            icon={
                              user.notifications?.telegram?.active &&
                              user.notifications?.telegram?.id
                                ? faVolumeHigh
                                : faVolumeMute
                            }
                            size="xs"
                          />
                          {user.notifications?.telegram?.id && (
                            <FontAwesomeIcon
                              className="h-5 text-blue-600"
                              icon={faTelegram}
                              size="xs"
                            />
                          )}
                        </div>
                      )}
                      {seeSumOfPaymentsWithoutEventOnCard && (
                        <UserSumOfPaymentsWithoutEvent userId={userId} />
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default UserCardSkeleton
