import Skeleton from 'react-loading-skeleton'
import CardWrapper from '@components/CardWrapper'

// itemSize={widthNum > 3 ? 165 : widthNum === 3 ? 176 : 224}
// itemSize={widthNum > 2 ? 98 : 101}

const UserCardSkeleton = ({ loading, hidden = false, style }) => {
  return (
    <CardWrapper
      loading={loading}
      hidden={hidden}
      style={style}
      className="rounded-[22px] border border-[rgba(107,31,42,0.16)] shadow-[0_16px_30px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
      outerClassName="px-3 py-2"
    >
      <div className="flex w-full h-[118px] tablet:h-[108px]">
        {/* <div className="flex items-center justify-center w-8 bg-gray-400" /> */}
        <Skeleton
          count={1}
          height="100%"
          borderRadius={0}
          containerClassName="pb-1 -mt-[3px] w-8 rounded-l-[22px] overflow-hidden"
        />
        <div className="flex flex-col flex-1 tablet:flex-row">
          <div className="flex flex-1 border-b tablet:border-b-0">
            <Skeleton
              count={1}
              height="100%"
              borderRadius={14}
              containerClassName="hidden w-[92px] h-[92px] min-w-[92px] min-h-[92px] tablet:block m-2 mt-[4px]"
            />
            <div className="flex flex-col flex-1 text-xl font-bold">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="tablet:rounded-bl-[30px] flex h-10 pl-3 max-h-10 flex-nowrap items-center px-2 py-0.5 leading-6 gap-x-2 rounded-tr-[22px] bg-[linear-gradient(135deg,rgba(107,31,42,0.08),rgba(79,176,232,0.12))]">
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
                      borderRadius={12}
                      containerClassName="w-[60px] h-[60px] min-w-[60px] min-h-[60px] tablet:hidden m-2 mt-[1px]"
                    />
                    <div className="flex flex-col justify-start h-full px-2 pb-1 mt-1">
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <Skeleton
                          height={14}
                          width={76}
                          borderRadius={999}
                          className="tablet:h-[18px] tablet:w-[88px]"
                        />
                        <Skeleton
                          height={14}
                          width={82}
                          borderRadius={999}
                          className="tablet:h-[18px] tablet:w-[96px]"
                        />
                      </div>
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
