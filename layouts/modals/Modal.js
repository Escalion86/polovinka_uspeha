import Tooltip from '@components/Tooltip'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalButtons from '@layouts/modals/ModalButtons'
import modalsAtom from '@state/atoms/modalsAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import cn from 'classnames'
import { m } from 'framer-motion'
import useRouter from '@utils/useRouter'
import { useEffect, useRef, useCallback } from 'react'
import { Suspense, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAtomValue, useSetAtom } from 'jotai'
import { useWindowDimensionsTailwindNum } from '@helpers/useWindowDimensions'

const Modal = ({
  Children,
  id,
  // onClose = () => {},
  // onDelete = null,
  // twoCols = false,
  // noPropsToChildren = false,
  // editMode = null,
  // setEditMode = null,
  title,
  text,
  subModalText = null,
  // modals = null,
  onClose,
  onConfirm,
  onConfirm2,
  onDecline,
  confirmButtonName,
  confirmButtonName2,
  declineButtonName,
  closeButtonName,
  // showConfirm,
  // showConfirm2,
  // showDecline,
  closeButtonShow = true,
  declineButtonShow = true,
  onlyCloseButtonShow,
  TopLeftComponent,
  bottomLeftButtonProps,
  bottomLeftComponent,
  declineButtonBgClassName,
  crossShow = true,
}) => {
  // const [rendered, setRendered] = useState(false)
  // const [preventCloseFunc, setPreventCloseFunc] = useState(null)
  const widthNum = useWindowDimensionsTailwindNum()
  const effectRan = useRef(false)
  const modals = useAtomValue(modalsAtom)
  const [titleState, setTitleState] = useState(title)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [disableConfirm, setDisableConfirm] = useState(false)
  const [disableDecline, setDisableDecline] = useState(false)
  const [closeButtonNameState, setCloseButtonNameState] =
    useState(closeButtonName)
  const [confirmButtonNameState, setConfirmButtonNameState] =
    useState(confirmButtonName)
  const [confirmButtonName2State, setConfirmButtonName2State] =
    useState(confirmButtonName2)
  const [onShowOnCloseConfirmDialog, setOnShowOnCloseConfirmDialog] =
    useState(false)
  const [onConfirmFunc, setOnConfirmFunc] = useState(null)
  const [onConfirm2Func, setOnConfirm2Func] = useState(null)
  const [onDeclineFunc, setOnDeclineFunc] = useState(null)
  const setModals = useSetAtom(modalsAtom)
  const [close, setClose] = useState(false)
  const [ComponentInFooter, setComponentInFooter] = useState(null)
  const [closeButtonShowState, setCloseButtonShowState] =
    useState(closeButtonShow)
  const [declineButtonShowState, setDeclineButtonShowState] =
    useState(declineButtonShow)
  const [onlyCloseButtonShowState, setOnlyCloseButtonShowState] =
    useState(onlyCloseButtonShow)
  const [TopLeftComponentState, setTopLeftComponentState] =
    useState(TopLeftComponent)
  const [bottomLeftButton, setBottomLeftButton] = useState(
    bottomLeftButtonProps
  )
  const [bottomLeftComponentState, setBottomLeftComponent] =
    useState(bottomLeftComponent)

  const router = useRouter()

  const closeModal = useCallback(
    (routerBack = true) => {
      onClose && typeof onClose === 'function' && onClose()
      setClose(true)
      setTimeout(
        () => setModals((modals) => modals.filter((modal) => modal.id !== id)),
        200
      )
      // window.history.back()
      // if (routerBack) router.back()
    },
    [id, onClose, setModals]
  )

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  // useEffect(() => {
  //   console.log('modals :>> ', modals)
  //   const currentPath = router.asPath
  //   if (id === modals.length) window.history.pushState(null, '', currentPath)

  //   router.beforePopState(({ url, as, options }) => {
  //     // console.log('as :>> ', as)
  //     // console.log('currentPath :>> ', currentPath)
  //     // alert(currentPath + ' --- ' + as)
  //     alert(currentPath + ' --- ' + as)
  //     if (as !== currentPath) {
  //       alert('!')
  //       //   console.log(
  //       //     `currentPath + '?modal=' + id :>> `,
  //       //     currentPath + '?modal=' + id
  //       //   )
  //       // Will run when leaving the current page; on back/forward actions
  //       // Add your logic here, like toggling the modal state
  //       // for example
  //       // if(confirm("Are you sure?") return true;
  //       // else {
  //       if (onDeclineClick) onDeclineClick()
  //       else if (closeModal) closeModal()
  //       window.history.pushState(null, '', currentPath)
  //       return false
  //     }
  //     return false
  //     // }
  //     // return true
  //   })

  //   return id === 0
  //     ? () => {
  //         return router.beforePopState(() => true)
  //       }
  //     : () => {
  //         return undefined
  //       }

  //   // console.log('window.history. :>> ', window.history.state)

  //   // console.log('id :>> ', id)
  //   // return () => {
  //   //   router.beforePopState(() => true)
  //   //   if (modals.length > 1) window.history.pushState(null, '', currentPath)
  //   // }
  //   // console.log('1modals.length :>> ', modals.length)
  //   // const onClose = () => {
  //   //   // console.log('2modals.length :>> ', modals.length)
  //   //   if (id === 0) {
  //   //     // window.history.pushState(null, '', currentPath + '?modal=' + id)
  //   //     // return router.beforePopState(() => true)
  //   //   } else return
  //   // }

  //   // return onClose
  // }, [modals, router])
  //   router.beforePopState(({ as }) => {
  //     if (as !== router.asPath) {
  //       if (onDeclineClick) onDeclineClick()
  //       else if (closeModal) closeModal()
  //     }
  //     return true
  //   })

  //   return () => {
  //     router.beforePopState(() => true)
  //   }
  // }, [router])

  // const onConfirmClick = () => {
  //   if (onConfirmFunc) return onConfirmFunc(refreshPage)
  //   onConfirm && typeof onConfirm === 'function' && onConfirm(refreshPage)
  //   closeModal()
  // }

  const onConfirmClick =
    typeof onConfirmFunc === 'function'
      ? () => onConfirmFunc(refreshPage)
      : typeof onConfirm === 'function'
        ? () => {
            onConfirm(refreshPage)
            closeModal()
          }
        : undefined

  const onConfirm2Click =
    typeof onConfirm2Func === 'function'
      ? () => onConfirm2Func(refreshPage)
      : typeof onConfirm2 === 'function'
        ? () => {
            onConfirm2(refreshPage)
            closeModal()
          }
        : undefined

  // const onConfirm2Click = () => {
  //   if (onConfirm2Func) return onConfirm2Func(refreshPage)
  //   onConfirm2 && typeof onConfirm2 === 'function' && onConfirm2(refreshPage)
  //   closeModal()
  // }

  const onDeclineClick =
    onShowOnCloseConfirmDialog ||
    typeof onDeclineFunc === 'function' ||
    typeof onDecline === 'function'
      ? (routerBack) => {
          const decline =
            typeof onDeclineFunc === 'function'
              ? () => onDeclineFunc()
              : typeof onDecline === 'function'
                ? () => {
                    onDecline(refreshPage)
                    closeModal(routerBack)
                  }
                : undefined

          if (onShowOnCloseConfirmDialog) {
            modalsFunc.confirm({
              onConfirm: () => {
                if (typeof decline === 'function') decline()
                else closeModal(routerBack)
                // setOnShowOnCloseConfirmDialog(false)
              },
            })
          } else {
            decline()
          }
        }
      : undefined

  useEffect(() => {
    const onBackButtonEvent = (e) => {
      e.preventDefault()
      // window.history.pushState(null, null, window.location.pathname)
      if (id === modals.length - 1) {
        // window.history.pushState(null, null, window.location.pathname)
        if (typeof onDeclineClick === 'function') onDeclineClick(false)
        else closeModal(false)
      }
    }

    window.addEventListener('popstate', onBackButtonEvent)

    return () => {
      window.removeEventListener('popstate', onBackButtonEvent)
    }
  }, [modals])

  useEffect(() => {
    if (!effectRan.current) {
      window.history.pushState(null, null, window.location.pathname)
    }
    return () => {
      effectRan.current = true
    }
  }, [])

  // const closeFunc = () => {
  //   setRendered(false)
  //   setTimeout(() => {
  //     onClose()
  //   }, 200)
  // }
  // const onCloseWithDelay = () => {
  //   if (formChanged && modals) {
  //     modals.openConfirmModal(
  //       'Отмена изменений',
  //       'Вы уверены что хотите закрыть окно без сохранения изменений?',
  //       closeFunc
  //     )
  //   } else closeFunc()
  // }

  // useEffect(() => {
  //   setTimeout(() => {
  //     setRendered(true)
  //   }, 10)
  // }, [])

  const handleSetOnConfirmFunc = useCallback(
    (func) => setOnConfirmFunc(func ? () => func : null),
    [setOnConfirmFunc]
  )

  const handleSetOnConfirm2Func = useCallback(
    (func) => setOnConfirm2Func(func ? () => func : null),
    [setOnConfirm2Func]
  )

  const handleSetOnDeclineFunc = useCallback(
    (func) => setOnDeclineFunc(func ? () => func : null),
    [setOnDeclineFunc]
  )

  return (
    <m.div
      className={
        cn(
          'absolute transform duration-200 top-0 left-0 z-50 flex tablet:items-center justify-center w-full h-screen tablet:overflow-y-auto bg-gray-800/80',
          subModalText ? 'tablet:pt-10 tablet:pb-5' : 'tablet:py-5'
        )
        //  + (rendered ? ' opacity-100' : ' opacity-0')
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: close ? 0 : 1 }}
      transition={{ duration: 0.1 }}
      onMouseDown={(e) => {
        if (e.clientX >= e.target.clientWidth) return
        if (crossShow) {
          if (typeof onDeclineClick === 'function') onDeclineClick()
          else if (typeof closeModal === 'function') closeModal()
        }
      }}
    >
      <m.div
        className={
          cn(
            'flex flex-col tablet:h-auto relative min-w-84 pb-1 tablet:pb-2 w-full tablet:w-[95%] laptop:w-9/12 tablet:min-w-156 duration-300 tablet:my-auto bg-white border-l tablet:rounded-lg border-primary',
            titleState ? 'pt-3' : 'pt-12',
            widthNum <= 2 ? 'real-screen-height' : ''
          )
          // + (rendered ? '' : ' scale-50')
        }
        initial={{ scale: 0.5 }}
        animate={{ scale: close ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
        // onClick={(e) => e?.stopPropagation()}
        onMouseDown={(e) => e?.stopPropagation()}
      >
        {subModalText && (
          <div className="absolute left-0 flex justify-center w-full -top-9">
            <div className="px-2 py-0.5 bg-white rounded-md">
              {subModalText}
            </div>
          </div>
        )}
        {TopLeftComponentState && (
          <div className="absolute left-2 top-2">{TopLeftComponentState}</div>
        )}
        {crossShow && (
          <Tooltip title="Закрыть">
            <div className="absolute right-2 top-2">
              <FontAwesomeIcon
                className="w-8 h-8 text-black duration-200 transform cursor-pointer min-h-8 hover:scale-110"
                icon={faTimes}
                // size="1x"
                onClick={onDeclineClick || closeModal}
              />
            </div>
          </Tooltip>
        )}
        {titleState && (
          <div className="mx-10 mt-8 mb-2 text-lg font-bold leading-4 text-center whitespace-pre-line tablet:mb-3 tablet:mt-2 tablet:mx-24">
            {titleState}
          </div>
        )}
        {text && <div className="px-2 mb-3 leading-4 tablet:px-3">{text}</div>}
        {/* {editMode && onDelete && (
          <FontAwesomeIcon
            className="absolute w-5 h-5 text-red-700 duration-200 transform cursor-pointer top-4 left-4 hover:scale-110"
            icon={faTrash}
            size="1x"
            onClick={() => {
              onDelete(closeModal)
            }}
          />
        )} */}
        {/* {!editMode && editMode !== null && (
          <FontAwesomeIcon
            className="absolute w-5 h-5 duration-200 transform cursor-pointer text-primary top-4 left-4 hover:scale-110"
            icon={faPencilAlt}
            size="1x"
            onClick={
              setEditMode
                ? () => {
                    setEditMode(true)
                  }
                : null
            }
          />
        )} */}
        {/* {noPropsToChildren
          ? children
          : cloneElement(children, { onClose: closeModal, setBeforeCloseFunc })} */}
        <div className="flex-1 px-2 overflow-x-hidden overflow-y-auto tablet:px-3">
          {Children && (
            <Suspense fallback={<Skeleton count={12} />}>
              <Children
                closeModal={closeModal}
                setOnConfirmFunc={handleSetOnConfirmFunc}
                setOnConfirm2Func={handleSetOnConfirm2Func}
                setOnDeclineFunc={handleSetOnDeclineFunc}
                setOnShowOnCloseConfirmDialog={setOnShowOnCloseConfirmDialog}
                setDisableConfirm={setDisableConfirm}
                setDisableDecline={setDisableDecline}
                setComponentInFooter={setComponentInFooter}
                setOnlyCloseButtonShow={setOnlyCloseButtonShowState}
                setTopLeftComponent={setTopLeftComponentState}
                setBottomLeftButtonProps={setBottomLeftButton}
                setBottomLeftComponent={setBottomLeftComponent}
                setCloseButtonShow={setCloseButtonShowState}
                setDeclineButtonShow={setDeclineButtonShowState}
                setConfirmButtonName={setConfirmButtonNameState}
                setConfirmButtonName2={setConfirmButtonName2State}
                setCloseButtonName={setCloseButtonNameState}
                setTitle={setTitleState}
                TopLeftComponent={TopLeftComponentState}
              />
            </Suspense>
          )}
        </div>

        {(onConfirmClick ||
          onConfirm2Click ||
          // showConfirm ||
          closeButtonShowState ||
          // showDecline ||
          ComponentInFooter ||
          onlyCloseButtonShowState ||
          bottomLeftButton ||
          bottomLeftComponentState) && (
          <ModalButtons
            closeButtonShow={
              onlyCloseButtonShowState ||
              (!onDeclineClick && closeButtonShowState)
            }
            declineButtonShow={declineButtonShowState}
            confirmName={confirmButtonNameState}
            confirmName2={confirmButtonName2State}
            declineName={declineButtonName}
            closeButtonName={closeButtonNameState}
            onConfirmClick={!onlyCloseButtonShowState && onConfirmClick}
            onConfirm2Click={!onlyCloseButtonShowState && onConfirm2Click}
            onDeclineClick={!onlyCloseButtonShowState && onDeclineClick}
            // showConfirm={!onlyCloseButtonShow && showConfirm}
            // showConfirm2={!onlyCloseButtonShow && showConfirm2}
            // showDecline={!onlyCloseButtonShowState && showDecline}
            disableConfirm={disableConfirm}
            disableDecline={disableDecline}
            closeModal={closeModal}
            bottomLeftButton={bottomLeftButton}
            bottomLeftComponent={bottomLeftComponentState}
            declineButtonBgClassName={declineButtonBgClassName}
          >
            {ComponentInFooter}
          </ModalButtons>
        )}
      </m.div>
    </m.div>
  )
}

export default Modal
