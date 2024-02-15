import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormRow from '@components/FormRow'
import InfinityToggleButton from '@components/IconToggleButtons/InfinityToggleButton'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import PriceInput from '@components/PriceInput'
import Slider from '@components/Slider'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import UserStatusIcon from '@components/UserStatusIcon'
import EventRelationshipAccessPicker from '@components/ValuePicker/EventRelationshipAccessPicker'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import compareObjects from '@helpers/compareObjects'
import {
  DEFAULT_SUBEVENT,
  DEFAULT_USERS_STATUS_ACCESS,
  DEFAULT_USERS_STATUS_DISCOUNT,
} from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import useFocus from '@helpers/useFocus'
import directionsAtom from '@state/atoms/directionsAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import SvgSigma from 'svg/SvgSigma'

const subEventFunc = (props, onChange) => {
  const SubEventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const directions = useRecoilValue(directionsAtom)
    const [refPerticipantsMax, setFocusPerticipantsMax] = useFocus()
    const [refMansMax, setFocusMansMax] = useFocus()
    const [refWomansMax, setFocusWomansMax] = useFocus()
    const [refMansNoviceMax, setFocusMansNoviceMax] = useFocus()
    const [refWomansNoviceMax, setFocusWomansNoviceMax] = useFocus()
    const [refMansMemberMax, setFocusMansMemberMax] = useFocus()
    const [refWomansMemberMax, setFocusWomansMemberMax] = useFocus()

    const direction = props?.directionId
      ? directions.find(({ _id }) => _id === props.directionId)
      : undefined

    const [title, setTitle] = useState(props?.title ?? DEFAULT_SUBEVENT.title)
    const [description, setDescription] = useState(
      props?.description ?? DEFAULT_SUBEVENT.description
    )

    const [price, setPrice] = useState(props?.price ?? DEFAULT_SUBEVENT.price)

    const [maxParticipants, setMaxParticipants] = useState(
      props?.maxParticipants ?? DEFAULT_SUBEVENT.maxParticipants
    )
    const [maxMans, setMaxMans] = useState(
      props?.maxMans ?? DEFAULT_SUBEVENT.maxMans
    )
    const [maxWomans, setMaxWomans] = useState(
      props?.maxWomans ?? DEFAULT_SUBEVENT.maxWomans
    )
    const [maxParticipantsCheck, setMaxParticipantsCheck] = useState(
      typeof props?.maxParticipants !== 'number'
    )
    const [maxMansCheck, setMaxMansCheck] = useState(
      typeof props?.maxMans !== 'number'
    )
    const [maxWomansCheck, setMaxWomansCheck] = useState(
      typeof props?.maxWomans !== 'number'
    )
    const [maxMansNovice, setMaxMansNovice] = useState(
      props?.maxMansNovice ?? DEFAULT_SUBEVENT.maxMansNovice
    )
    const [maxMansMember, setMaxMansMember] = useState(
      props?.maxMansMember ?? DEFAULT_SUBEVENT.maxMansMember
    )
    const [maxWomansNovice, setMaxWomansNovice] = useState(
      props?.maxWomansNovice ?? DEFAULT_SUBEVENT.maxWomansNovice
    )
    const [maxWomansMember, setMaxWomansMember] = useState(
      props?.maxWomansMember ?? DEFAULT_SUBEVENT.maxWomansMember
    )
    const [maxMansNoviceCheck, setMaxMansNoviceCheck] = useState(
      typeof props?.maxMansNovice !== 'number'
    )
    const [maxMansMemberCheck, setMaxMansMemberCheck] = useState(
      typeof props?.maxMansMember !== 'number'
    )
    const [maxWomansNoviceCheck, setMaxWomansNoviceCheck] = useState(
      typeof props?.maxWomansNovice !== 'number'
    )
    const [maxWomansMemberCheck, setMaxWomansMemberCheck] = useState(
      typeof props?.maxWomansMember !== 'number'
    )

    const [minMansAge, setMinMansAge] = useState(
      props?.minMansAge ?? DEFAULT_SUBEVENT.minMansAge
    )
    const [minWomansAge, setMinWomansAge] = useState(
      props?.minWomansAge ?? DEFAULT_SUBEVENT.minWomansAge
    )
    const [maxMansAge, setMaxMansAge] = useState(
      props?.maxMansAge ?? DEFAULT_SUBEVENT.maxMansAge
    )
    const [maxWomansAge, setMaxWomansAge] = useState(
      props?.maxWomansAge ?? DEFAULT_SUBEVENT.maxWomansAge
    )
    const defaultUsersStatusAccess = {
      ...DEFAULT_USERS_STATUS_ACCESS,
      ...props?.usersStatusAccess,
    }
    const [usersStatusAccess, setUsersStatusAccess] = useState(
      defaultUsersStatusAccess
    )

    const defaultUsersStatusDiscount = {
      ...DEFAULT_USERS_STATUS_DISCOUNT,
      ...(props?.usersStatusDiscount ?? DEFAULT_SUBEVENT.usersStatusDiscount),
    }
    const [usersStatusDiscount, setUsersStatusDiscount] = useState(
      defaultUsersStatusDiscount
    )

    const [usersRelationshipAccess, setUsersRelationshipAccess] = useState(
      props?.usersRelationshipAccess ?? DEFAULT_SUBEVENT.usersRelationshipAccess
    )

    const [isReserveActive, setIsReserveActive] = useState(
      props?.isReserveActive ?? DEFAULT_SUBEVENT.isReserveActive
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      let isErrorsExists = checkErrors({
        title,
        usersRelationshipAccess,
      })
      if (!isErrorsExists) {
        closeModal()
        onChange({
          title: title.trim(),
          description,
          price,
          maxParticipants: maxParticipantsCheck ? null : maxParticipants ?? 0,
          maxMans: maxMansCheck ? null : maxMans ?? 0,
          maxWomans: maxWomansCheck ? null : maxWomans ?? 0,
          maxMansNovice: maxMansNoviceCheck ? null : maxMansNovice ?? 0,
          maxWomansNovice: maxWomansNoviceCheck ? null : maxWomansNovice ?? 0,
          maxMansMember: maxMansMemberCheck ? null : maxMansMember ?? 0,
          maxWomansMember: maxWomansMemberCheck ? null : maxWomansMember ?? 0,
          maxMansAge,
          minMansAge,
          maxWomansAge,
          minWomansAge,
          usersStatusAccess,
          usersStatusDiscount,
          usersRelationshipAccess,
          isReserveActive,
        })
      }
    }

    useEffect(() => {
      const isFormChanged =
        props?.title !== title ||
        (props?.description ?? DEFAULT_SUBEVENT.description) !== description ||
        props?.maxParticipants !==
          (maxParticipantsCheck ? null : maxParticipants ?? 0) ||
        props?.maxMans !== (maxMansCheck ? null : maxMans ?? 0) ||
        props?.maxWomans !== (maxWomansCheck ? null : maxWomans ?? 0) ||
        props?.maxMansNovice !==
          (maxMansNoviceCheck ? null : maxMansNovice ?? 0) ||
        props?.maxWomansNovice !==
          (maxWomansNoviceCheck ? null : maxWomansNovice ?? 0) ||
        props?.maxMansMember !==
          (maxMansMemberCheck ? null : maxMansMember ?? 0) ||
        props?.maxWomansMember !==
          (maxWomansMemberCheck ? null : maxWomansMember ?? 0) ||
        props?.minMansAge !== minMansAge ||
        props?.maxMansAge !== maxMansAge ||
        props?.minWomansAge !== minWomansAge ||
        props?.maxWomansAge !== maxWomansAge ||
        !compareObjects(defaultUsersStatusAccess, usersStatusAccess) ||
        !compareObjects(defaultUsersStatusDiscount, usersStatusDiscount) ||
        props?.usersRelationshipAccess !== usersRelationshipAccess ||
        props?.isReserveActive !== isReserveActive ||
        props?.price !== price

      // setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
    }, [
      title,
      description,
      price,
      maxParticipants,
      maxMans,
      maxWomans,
      maxMansNovice,
      maxWomansNovice,
      maxMansMember,
      maxWomansMember,
      maxMansAge,
      minMansAge,
      maxWomansAge,
      minWomansAge,
      maxParticipantsCheck,
      maxMansCheck,
      maxWomansCheck,
      maxMansNoviceCheck,
      maxWomansNoviceCheck,
      maxMansMemberCheck,
      maxWomansMemberCheck,
      usersStatusAccess,
      usersStatusDiscount,
      usersRelationshipAccess,
      isReserveActive,
    ])

    const handleFocus = (event) => event.target.select()

    useEffect(() => {
      if (!maxParticipantsCheck) setFocusPerticipantsMax()
    }, [maxParticipantsCheck])
    useEffect(() => {
      if (!maxMansCheck) setFocusMansMax()
    }, [maxMansCheck])
    useEffect(() => {
      if (!maxWomansCheck) setFocusWomansMax()
    }, [maxWomansCheck])
    useEffect(() => {
      if (!maxMansNoviceCheck) setFocusMansNoviceMax()
    }, [maxMansNoviceCheck])
    useEffect(() => {
      if (!maxWomansNoviceCheck) setFocusWomansNoviceMax()
    }, [maxWomansNoviceCheck])
    useEffect(() => {
      if (!maxMansMemberCheck) setFocusMansMemberMax()
    }, [maxMansMemberCheck])
    useEffect(() => {
      if (!maxWomansMemberCheck) setFocusWomansMemberMax()
    }, [maxWomansMemberCheck])

    return (
      <>
        <TabContext value="Общее">
          <TabPanel tabName="Общее" className="px-0">
            <Input
              label="Название типа участия"
              type="text"
              value={title}
              onChange={(value) => {
                removeError('title')
                setTitle(value)
              }}
              // labelClassName="w-40"
              error={errors.title}
              required
            />
            <EditableTextarea
              label="Описание типа участия (показывается при записи)"
              html={description}
              uncontrolled={false}
              onChange={setDescription}
              placeholder="Описание мероприятия..."
            />
          </TabPanel>
          <TabPanel tabName="Доступ и стоимость" className="px-0">
            <PriceInput
              value={price}
              onChange={(value) => {
                removeError('price')
                setPrice(value)
              }}
              error={errors.price}
            />
            <CheckBox
              checked={usersStatusAccess?.noReg}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, noReg: !usersStatusAccess?.noReg }
                })
              }
              label="Не авторизован (видно на главной странице)"
            />
            <CheckBox
              checked={usersStatusAccess?.novice}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, novice: !usersStatusAccess?.novice }
                })
              }
              label="Новичок"
              disabled={['any', 'novice', 'member'].includes(
                direction?.rules?.userStatus
              )}
            />
            {usersStatusAccess?.novice && (
              <FormRow>
                <PriceInput
                  label="Скидка новичкам"
                  value={usersStatusDiscount?.novice ?? 0}
                  onChange={(value) => {
                    setUsersStatusDiscount((state) => {
                      return { ...state, novice: value }
                    })
                  }}
                  noMargin
                />
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0">
                  Итого: {(price - usersStatusDiscount?.novice) / 100} ₽
                </div>
              </FormRow>
            )}
            <CheckBox
              checked={usersStatusAccess?.member}
              labelPos="left"
              onClick={() =>
                setUsersStatusAccess((state) => {
                  return { ...state, member: !usersStatusAccess?.member }
                })
              }
              label="Участник клуба"
              disabled={['any', 'novice', 'member'].includes(
                direction?.rules?.userStatus
              )}
            />
            {usersStatusAccess?.member && (
              <FormRow>
                <PriceInput
                  label="Скидка участникам клуба"
                  value={usersStatusDiscount?.member ?? 0}
                  onChange={(value) => {
                    setUsersStatusDiscount((state) => {
                      return { ...state, member: value }
                    })
                  }}
                  noMargin
                />
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0">
                  Итого: {(price - usersStatusDiscount?.member) / 100} ₽
                </div>
              </FormRow>
            )}
            <EventRelationshipAccessPicker
              required
              relationshipStatus={usersRelationshipAccess}
              onChange={setUsersRelationshipAccess}
              disabled={['any', 'alone', 'pair'].includes(
                direction?.rules?.userRelationship
              )}
            />
            {(direction?.rules?.userStatus &&
              direction?.rules?.userStatus !== 'select') ||
              (direction?.rules?.userRelationship &&
                direction?.rules?.userRelationship !== 'select' && (
                  <div className="pl-2 -mb-2 text-sm text-danger">
                    Выбранное направление ограничевает доступ на изменение
                    некоторых прав
                  </div>
                ))}
          </TabPanel>
          <TabPanel tabName="Ограничения" className="px-0">
            <CheckBox
              checked={isReserveActive}
              labelPos="left"
              onClick={() => setIsReserveActive((checked) => !checked)}
              label="Если мест нет, то возможно записаться в резерв"
            />
            <FormRow>
              <Input
                ref={refPerticipantsMax}
                label={
                  <div className="flex items-center gap-x-1">
                    <div className="w-3 h-3 min-w-3">
                      <SvgSigma className="fill-general" />
                    </div>
                    <span>max участников</span>
                  </div>
                }
                type={maxParticipantsCheck ? 'text' : 'number'}
                className="w-44"
                inputClassName="w-16 text-center"
                value={
                  maxParticipantsCheck
                    ? 'Без ограничений'
                    : maxParticipants ?? 0
                }
                onChange={setMaxParticipants}
                placeholder={maxParticipantsCheck ? '' : '0'}
                disabled={maxParticipantsCheck}
                min={0}
                labelPos="left"
                onFocus={handleFocus}
                fullWidth={false}
                noMargin
              />
              <InfinityToggleButton
                size="s"
                value={maxParticipantsCheck}
                onChange={() => {
                  setMaxParticipantsCheck((checked) => !checked)
                }}
              />
            </FormRow>
            <FormRow className="flex-wrap laptop:flex-nowrap">
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faMars}
                    className="w-6 h-6 text-blue-600 tablet:w-6 tablet:h-6"
                  />
                }
                fullWidth
                paddingY
                paddingX={false}
                centerLabel
              >
                <div className="flex-1 px-1">
                  <FormRow>
                    <Input
                      ref={refMansMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <div className="w-3 h-3 min-w-3">
                            <SvgSigma className="fill-general" />
                          </div>
                          <span>max</span>
                        </div>
                      }
                      type={maxMansCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={maxMansCheck ? 'Без ограничений' : maxMans ?? 0}
                      onChange={setMaxMans}
                      placeholder={maxMansCheck ? '' : '0'}
                      disabled={maxMansCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansCheck}
                      onChange={() => {
                        setMaxMansCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refMansNoviceMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="novice" />
                          <span>max</span>
                        </div>
                      }
                      type={maxMansNoviceCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxMansNoviceCheck
                          ? 'Без ограничений'
                          : maxMansNovice ?? 0
                      }
                      onChange={setMaxMansNovice}
                      placeholder={maxMansNoviceCheck ? '' : '0'}
                      disabled={maxMansNoviceCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansNoviceCheck}
                      onChange={() => {
                        setMaxMansNoviceCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refMansMemberMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="member" />
                          <span>max</span>
                        </div>
                      }
                      type={maxMansMemberCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxMansMemberCheck
                          ? 'Без ограничений'
                          : maxMansMember ?? 0
                      }
                      onChange={setMaxMansMember}
                      placeholder={maxMansMemberCheck ? '' : '0'}
                      disabled={maxMansMemberCheck}
                      min={0}
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxMansMemberCheck}
                      onChange={() => {
                        setMaxMansMemberCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <Slider
                    value={[minMansAge, maxMansAge]}
                    onChange={([min, max]) => {
                      setMinMansAge(min)
                      setMaxMansAge(max)
                    }}
                    min={18}
                    max={60}
                    label="Возраст"
                    labelClassName="w-16 min-w-16"
                  />
                </div>
              </InputWrapper>
              <InputWrapper
                label={
                  <FontAwesomeIcon
                    icon={faVenus}
                    className="w-6 h-6 text-red-600 tablet:w-6 tablet:h-6"
                  />
                }
                paddingX={false}
                paddingY
                centerLabel
                fullWidth
              >
                <div className="flex-1 px-1">
                  <FormRow>
                    <Input
                      ref={refWomansMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <div className="w-3 h-3 min-w-3">
                            <SvgSigma className="fill-general" />
                          </div>
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansCheck ? 'Без ограничений' : maxWomans ?? 0
                      }
                      onChange={setMaxWomans}
                      placeholder={maxWomansCheck ? '' : '0'}
                      disabled={maxWomansCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansCheck}
                      onChange={() => {
                        setMaxWomansCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refWomansNoviceMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="novice" />
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansNoviceCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansNoviceCheck
                          ? 'Без ограничений'
                          : maxWomansNovice ?? 0
                      }
                      onChange={setMaxWomansNovice}
                      placeholder={maxWomansNoviceCheck ? '' : '0'}
                      disabled={maxWomansNoviceCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansNoviceCheck}
                      onChange={() => {
                        setMaxWomansNoviceCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      ref={refWomansMemberMax}
                      label={
                        <div className="flex items-center gap-x-1">
                          <UserStatusIcon size="xs" status="member" />
                          <span>max</span>
                        </div>
                      }
                      type={maxWomansMemberCheck ? 'text' : 'number'}
                      className="w-44"
                      inputClassName="w-16 text-center"
                      value={
                        maxWomansMemberCheck
                          ? 'Без ограничений'
                          : maxWomansMember ?? 0
                      }
                      onChange={setMaxWomansMember}
                      placeholder={maxWomansMemberCheck ? '' : '0'}
                      disabled={maxWomansMemberCheck}
                      min={0}
                      labelPos="left"
                      onFocus={handleFocus}
                      fullWidth={false}
                      noMargin
                    />
                    <InfinityToggleButton
                      size="s"
                      value={maxWomansMemberCheck}
                      onChange={() => {
                        setMaxWomansMemberCheck((checked) => !checked)
                      }}
                    />
                  </FormRow>
                  <Slider
                    value={[minWomansAge, maxWomansAge]}
                    onChange={([min, max]) => {
                      setMinWomansAge(min)
                      setMaxWomansAge(max)
                    }}
                    min={18}
                    max={60}
                    label="Возраст"
                    labelClassName="w-16 min-w-16"
                  />
                </div>
              </InputWrapper>
            </FormRow>
          </TabPanel>
        </TabContext>
        <ErrorsList errors={errors} />
      </>
    )
  }

  return {
    title: `${props.id ? 'Редактирование' : 'Создание'} типа участия на мероприятии`,
    confirmButtonName: props.id ? 'Применить' : 'Создать',
    Children: SubEventModal,
  }
}

export default subEventFunc
