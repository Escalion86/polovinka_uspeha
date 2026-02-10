import { ProductItem } from '@components/ItemCards'
import Search from '@components/Search'
import filterItems from '@helpers/filterItems'
import isObject from '@helpers/isObject'
import ListWrapper from '@layouts/lists/ListWrapper'
import productsAtom from '@state/atoms/productsAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

const selectProductsFunc = (
  state,
  filterRules,
  onConfirm,
  exceptedIds,
  acceptedIds,
  maxProducts,
  canSelectNone = true,
  title,
  showCountNumber
) => {
  const SelectProductsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const products = useAtomValue(productsAtom)
    const [selectedProducts, setSelectedProducts] = useState(
      isObject(state)
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')

    var filteredProducts = filterItems(products, searchText, exceptedIds, {}, [
      'title',
    ])

    if (exceptedIds) {
      filteredProducts = filteredProducts.filter(
        (direction) => !exceptedIds.includes(direction._id)
      )
    }

    const onClick = (directionId) => {
      const index = selectedProducts.indexOf(directionId)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedProducts((state) =>
          state.filter((item) => item !== directionId)
        ) //state.splice(index, 1)
      } else {
        if (!maxProducts || selectedProducts.length < maxProducts) {
          setShowErrorMax(false)
          setSelectedProducts((state) => [...state, directionId])
        } else {
          if (maxProducts === 1) {
            setSelectedProducts([directionId])
          } else setShowErrorMax(true)
        }
      }
    }

    useEffect(() => {
      // const isFormChanged =
      //   assistantsIds !== eventAssistantsIds ||
      //   mansIds !== eventMansIds ||
      //   womansIds !== eventWomansIds ||
      //   reservedParticipantsIds !== eventReservedParticipantsIds ||
      //   bannedParticipantsIds !== eventBannedParticipantsIds
      // maxServices !== 1 &&
      setComponentInFooter(
        <div className="flex text-lg gap-x-1 teblet:text-base flex-nowrap">
          <span>Выбрано:</span>
          <span className="font-bold">{selectedProducts.length}</span>
          {maxProducts && (
            <>
              <span>/</span>
              <span>{maxProducts}</span>
            </>
          )}
          <span>тов.</span>
        </div>
      )
      setOnConfirmFunc(() => {
        onConfirm(selectedProducts)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedProducts,
      maxProducts,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedProducts.length === 0)
    }, [canSelectNone, selectedProducts])

    return (
      <div className="flex flex-col w-full h-full max-h-full gap-y-0.5">
        <Search
          searchText={searchText}
          show={true}
          onChange={setSearchText}
          className="h-[38px] min-h-[38px]"
        />
        <div
          style={{ height: filteredProducts.length * 51 + 2 }}
          className={`tablet:flex-none border-gray-700 border-t flex-col tablet:max-h-[calc(100vh-185px)]`}
        >
          <ListWrapper itemCount={filteredProducts.length} itemSize={51}>
            {({ index, style }) => (
              <div style={style} className="border-b border-gray-700">
                <ProductItem
                  key={filteredProducts[index]._id}
                  item={filteredProducts[index]}
                  active={selectedProducts.includes(
                    filteredProducts[index]._id
                  )}
                  onClick={() => onClick(filteredProducts[index]._id)}
                />
              </div>
            )}
          </ListWrapper>
        </div>
        {showErrorMax && (
          <div className="text-danger">
            Выбрано максимальное количество товаров
          </div>
        )}

        {/* <div className="flex-1 overflow-y-auto max-h-200">
          {filteredServices.map((direction) => (
            <DirectionItem
              key={direction._id}
              item={direction}
              active={selectedServices.includes(direction._id)}
              onClick={() => onClick(direction._id)}
            />
          ))}

          {showErrorMax && (
            <div className="text-danger">
              Выбрано максимальное количество товаров
            </div>
          )}
        </div> */}
      </div>
    )
  }

  return {
    title: title ?? (maxProducts === 1 ? `Выбор товара` : `Выбор товаров`),
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectProductsModal,
  }
}

export default selectProductsFunc

