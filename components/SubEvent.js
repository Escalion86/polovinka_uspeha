import Ages from '@components/Ages'
import InputWrapper from '@components/InputWrapper'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import UserStatusIcon from '@components/UserStatusIcon'
import {
  faCopy,
  faInfinity,
  faMars,
  faTrash,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import Image from 'next/legacy/image'
import { useRecoilValue } from 'recoil'
import SvgSigma from 'svg/SvgSigma'

const Infinity = () => (
  <FontAwesomeIcon icon={faInfinity} className="w-4 h-3 text-gray-600" />
)

const Counter = ({ gender, maxNovice, maxMember, max, minAge, maxAge }) => {
  return (
    <div className="flex flex-col items-center">
      <Ages minAge={minAge} maxAge={maxAge} />
      {typeof maxNovice === 'number' || typeof maxMember === 'number' ? (
        <div className="flex items-center gap-x-0.5">
          <div className="flex flex-col">
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="novice" />
              <div className="flex tablet:gap-x-0.5">
                {maxNovice ?? <Infinity />}
              </div>
            </div>
            <div className="flex gap-x-0.5 items-center">
              <UserStatusIcon size="xs" status="member" />
              <div className="flex tablet:gap-x-0.5">
                {maxMember ?? <Infinity />}
              </div>
            </div>
          </div>
          <div className="flex gap-x-0.5 items-center">
            <div className="hidden min-w-[9px] h-[36px] tablet:block w-[9px]">
              <Image src="/img/other/bracet_left.png" width={9} height={36} />
            </div>
            <div className="min-w-[7px] h-[28px] tablet:hidden w-[8px]">
              <Image src="/img/other/bracet_left.png" width={7} height={28} />
            </div>
            <div className="flex flex-col items-center leading-[0.5rem] tablet:leading-3">
              <span className="text-xs">max</span>
              <span>{max ?? <Infinity />}</span>
              <span className="text-xs -mt-0.5">чел.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-x-0.5 items-center">
          {max ?? <Infinity className="h-5" />} чел.
        </div>
      )}
    </div>
  )
}

const LimitsAndAge = ({
  maxParticipants,
  maxMans,
  maxWomans,
  maxMansNovice,
  maxWomansNovice,
  maxMansMember,
  maxWomansMember,
  minMansAge,
  maxMansAge,
  minWomansAge,
  maxWomansAge,
}) => {
  const actualMaxMans =
    typeof maxMansNovice === 'number' && typeof maxMansMember === 'number'
      ? typeof maxMans === 'number'
        ? Math.min(maxMansNovice + maxMansMember, maxMans)
        : maxMansNovice + maxMansMember
      : typeof maxMans === 'number'
        ? maxMans
        : undefined

  const actualMaxWomans =
    typeof maxWomansNovice === 'number' && typeof maxWomansMember === 'number'
      ? typeof maxWomans === 'number'
        ? Math.min(maxWomansNovice + maxWomansMember, maxWomans)
        : maxWomansNovice + maxWomansMember
      : typeof maxWomans === 'number'
        ? maxWomans
        : undefined

  return (
    <div className="flex justify-between text-sm leading-4 border-gray-300 laptop:text-base laptop:leading-5 laptop:justify-start">
      <div className="flex items-center px-1 border-l border-r laptop:px-2 gap-x-1">
        <FontAwesomeIcon
          icon={faMars}
          className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="mans"
          maxNovice={maxMansNovice}
          maxMember={maxMansMember}
          minAge={minMansAge}
          maxAge={maxMansAge}
          max={actualMaxMans}
        />
      </div>
      <div className="flex items-center px-1 border-r laptop:px-2 gap-x-1">
        <FontAwesomeIcon
          icon={faVenus}
          className="w-5 h-5 text-red-600 laptop:w-6 laptop:h-6"
        />
        <Counter
          gender="womans"
          maxNovice={maxWomansNovice}
          maxMember={maxWomansMember}
          minAge={minWomansAge}
          maxAge={maxWomansAge}
          max={actualMaxWomans}
        />
      </div>
      <div className="flex items-center px-2 py-1 gap-x-1 laptop:gap-x-1">
        <div className="w-5 h-5 min-w-5">
          <SvgSigma className="fill-general" />
        </div>
        <div className="flex laptop:gap-x-0.5">
          <span>{maxParticipants ?? <Infinity />}</span>
        </div>
        <span className="hidden laptop:block">чел.</span>
      </div>
    </div>
  )
}

const SubEvent = ({ id, onItemChange, deleteItem, addItem, ...props }) => {
  const modalFunc = useRecoilValue(modalsFuncAtom)

  return (
    <InputWrapper
      label={props.title} //title
      paddingX="small"
      paddingY={false}
      centerLabel
      className="relative"
    >
      <div
        className={cn(
          'flex items-center w-full pb-2 pt-3 gap-x-1',
          onItemChange ? 'cursor-pointer' : ''
        )}
        onClick={
          id && onItemChange
            ? () =>
                modalFunc.event.subEventEdit(props, (data) =>
                  onItemChange(id, data)
                )
            : undefined
        }
      >
        {id && deleteItem && (
          <div className="absolute bg-white rounded-full right-1 -top-3">
            <FontAwesomeIcon
              className="h-6 p-1 text-red-700 duration-300 cursor-pointer hover:scale-125"
              icon={faTrash}
              onClick={(e) => {
                e.stopPropagation()
                deleteItem(id)
              }}
            />
          </div>
        )}
        {id && addItem && (
          <div className="absolute bg-white rounded-full right-7 -top-3">
            <FontAwesomeIcon
              className="h-6 p-1 text-blue-500 duration-300 cursor-pointer hover:scale-125"
              icon={faCopy}
              onClick={(e) => {
                e.stopPropagation()
                modalFunc.event.subEventEdit(props, addItem)
              }}
            />
          </div>
        )}
        <div className="flex flex-col text-sm gap-x-1 laptop:text-base">
          <div className="flex gap-x-0.5 items-center">
            <UserStatusIcon size="xs" status="novice" />
            <div className="text-center min-w-20 whitespace-nowrap">
              {props.usersStatusDiscountResult?.noviceFrom && 'от '}
              {Math.floor(
                (typeof props.usersStatusDiscountResult?.novice === 'number'
                  ? props.usersStatusDiscountResult.novice
                  : (props.price ?? 0) -
                    (props.usersStatusDiscount?.novice ?? 0)) / 100
              )}{' '}
              ₽
            </div>
          </div>
          <div className="flex gap-x-0.5 items-center">
            <UserStatusIcon size="xs" status="member" />
            <div className="text-center min-w-20 whitespace-nowrap">
              {props.usersStatusDiscountResult?.memberFrom && 'от '}
              {Math.floor(
                (typeof props.usersStatusDiscountResult?.member === 'number'
                  ? props.usersStatusDiscountResult.member
                  : (props.price ?? 0) -
                    (props.usersStatusDiscount?.member ?? 0)) / 100
              )}{' '}
              ₽
            </div>
          </div>
        </div>
        <LimitsAndAge {...props} />
        {props.usersRelationshipAccess &&
          props.usersRelationshipAccess !== 'yes' && (
            <div className="absolute bg-white rounded-full left-1 -top-3">
              <UserRelationshipIcon
                relationship={props.usersRelationshipAccess === 'only'}
                nameForEvent
                size="s"
              />
            </div>
          )}
      </div>
    </InputWrapper>
  )
}

export default SubEvent
