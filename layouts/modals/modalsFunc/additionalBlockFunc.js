import AdditionalBlockCardButtons from '@components/cardButtons/AdditionalBlockCardButtons'
import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import {
  ADDITIONAL_BLOCK_TILE_COLORS,
  DEFAULT_ADDITIONAL_BLOCK,
} from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import cn from 'classnames'
import InputWrapper from '@components/InputWrapper'
import ColorPicker from '@components/ColorPicker'
import { uid } from 'uid'
import { Fort } from '@mui/icons-material'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const additionalBlockFunc = (additionalBlockId, clone = false) => {
  const AdditionalBlockModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const additionalBlocks = useAtomValue(additionalBlocksAtom)

    const additionalBlock = useAtomValue(
      additionalBlockSelector(additionalBlockId)
    )

    const setAdditionalBlock = useAtomValue(itemsFuncAtom).additionalBlock.set

    const [title, setTitle] = useState(
      additionalBlock?.title ?? DEFAULT_ADDITIONAL_BLOCK.title
    )
    const [description, setDescription] = useState(
      additionalBlock?.description ?? DEFAULT_ADDITIONAL_BLOCK.description
    )
    const [image, setImage] = useState(
      additionalBlock?.image ?? DEFAULT_ADDITIONAL_BLOCK.image
    )
    const [menuName, setMenuName] = useState(
      additionalBlock?.menuName ?? DEFAULT_ADDITIONAL_BLOCK.menuName
    )
    const [showOnSite, setShowOnSite] = useState(
      additionalBlock?.showOnSite ?? DEFAULT_ADDITIONAL_BLOCK.showOnSite
    )
    const [showOnIndex2, setShowOnIndex2] = useState(
      additionalBlock?.showOnIndex2 ?? DEFAULT_ADDITIONAL_BLOCK.showOnIndex2
    )
    const normalizeTiles = (value) =>
      (value ?? []).map((tile) => ({
        ...tile,
        id: tile.id ?? uid(10),
        colorMode:
          tile.colorMode ??
          (typeof tile.color === 'string' && tile.color.startsWith('#')
            ? 'custom'
            : 'preset'),
      }))

    const [tiles, setTiles] = useState(() =>
      normalizeTiles(additionalBlock?.tiles ?? DEFAULT_ADDITIONAL_BLOCK.tiles)
    )
    const [blockBgMode, setBlockBgMode] = useState(
      additionalBlock?.blockBgMode ?? DEFAULT_ADDITIONAL_BLOCK.blockBgMode
    )
    const [blockBgColor1, setBlockBgColor1] = useState(
      additionalBlock?.blockBgColor1 ?? DEFAULT_ADDITIONAL_BLOCK.blockBgColor1
    )
    const [blockBgColor2, setBlockBgColor2] = useState(
      additionalBlock?.blockBgColor2 ?? DEFAULT_ADDITIONAL_BLOCK.blockBgColor2
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const tileColorOptions = useMemo(() => ADDITIONAL_BLOCK_TILE_COLORS, [])

    const updateTile = (index, patch) => {
      setTiles((prev) =>
        prev.map((tile, tileIndex) =>
          tileIndex === index ? { ...tile, ...patch } : tile
        )
      )
    }

    const addTile = () => {
      setTiles((prev) => [
        ...prev,
        {
          id: uid(10),
          title: '',
          description: '',
          image: '',
          color: 'white',
          colorMode: 'preset',
        },
      ])
    }

    const removeTile = (index) => {
      setTiles((prev) => prev.filter((_, tileIndex) => tileIndex !== index))
    }

    const onClickConfirm = async () => {
      if (!checkErrors({ title, description, image })) {
        closeModal()
        setAdditionalBlock(
          {
            _id: additionalBlock?._id,
            title,
            description,
            showOnSite,
            showOnIndex2,
            image,
            menuName,
            index: additionalBlock?.index ?? additionalBlocks.length,
            tiles,
            blockBgMode,
            blockBgColor1,
            blockBgColor2,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        additionalBlock?.title !== title ||
        additionalBlock?.description !== description ||
        additionalBlock?.showOnSite !== showOnSite ||
        additionalBlock?.showOnIndex2 !== showOnIndex2 ||
        additionalBlock?.image !== image ||
        additionalBlock?.menuName !== menuName ||
        additionalBlock?.blockBgMode !== blockBgMode ||
        additionalBlock?.blockBgColor1 !== blockBgColor1 ||
        additionalBlock?.blockBgColor2 !== blockBgColor2 ||
        JSON.stringify(additionalBlock?.tiles ?? []) !==
          JSON.stringify(tiles ?? [])

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [
      title,
      description,
      showOnSite,
      showOnIndex2,
      image,
      menuName,
      tiles,
      blockBgMode,
      blockBgColor1,
      blockBgColor2,
    ])

    useEffect(() => {
      setTiles(
        normalizeTiles(additionalBlock?.tiles ?? DEFAULT_ADDITIONAL_BLOCK.tiles)
      )
      setBlockBgMode(
        additionalBlock?.blockBgMode ?? DEFAULT_ADDITIONAL_BLOCK.blockBgMode
      )
      setBlockBgColor1(
        additionalBlock?.blockBgColor1 ?? DEFAULT_ADDITIONAL_BLOCK.blockBgColor1
      )
      setBlockBgColor2(
        additionalBlock?.blockBgColor2 ?? DEFAULT_ADDITIONAL_BLOCK.blockBgColor2
      )
    }, [additionalBlockId])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <AdditionalBlockCardButtons
            item={additionalBlock}
            forForm
            showEditButton={false}
            showDeleteButton={false}
          />
        ))
    }, [setTopLeftComponent])

    return (
      <FormWrapper>
        <InputImage
          label="Картинка"
          directory="additionalBlocks"
          image={image}
          onChange={(value) => {
            removeError('image')
            setImage(value)
          }}
          required
          error={errors.image}
        />
        <Input
          label="Название"
          type="text"
          value={title}
          onChange={(value) => {
            removeError('title')
            setTitle(value)
          }}
          error={errors.title}
          required
        />
        <EditableTextarea
          label="Описание"
          html={description}
          onChange={(value) => {
            removeError('description')
            setDescription(value)
          }}
          error={errors.description}
          required
        />
        <Input
          label="Название в меню"
          type="text"
          value={menuName}
          onChange={(value) => {
            removeError('menuName')
            setMenuName(value)
          }}
          // labelClassName="w-40"
          error={errors.menuName}
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
        <CheckBox
          checked={showOnIndex2}
          labelPos="left"
          onClick={() => setShowOnIndex2((checked) => !checked)}
          label="Показывать на тестовой главной странице"
        />
        <div className="flex flex-col gap-3">
          <div className="font-semibold">Фон блока</div>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                'rounded-lg border px-3 py-1 text-sm',
                blockBgMode === 'solid'
                  ? 'border-gray-700 bg-white'
                  : 'border-gray-300 bg-gray-100'
              )}
              onClick={() => setBlockBgMode('solid')}
            >
              Один цвет
            </button>
            <button
              type="button"
              className={cn(
                'rounded-lg border px-3 py-1 text-sm',
                blockBgMode === 'gradient'
                  ? 'border-gray-700 bg-white'
                  : 'border-gray-300 bg-gray-100'
              )}
              onClick={() => setBlockBgMode('gradient')}
            >
              Градиент
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ColorPicker
              label="Цвет 1"
              value={blockBgColor1}
              onChange={setBlockBgColor1}
              fullWidth
            />
            {blockBgMode === 'gradient' ? (
              <ColorPicker
                label="Цвет 2"
                value={blockBgColor2}
                onChange={setBlockBgColor2}
                fullWidth
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-semibold">Плашки</div>
          {tiles?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {tiles.map((tile, index) => (
                <InputWrapper
                  key={tile.id ?? `tile-${index}`}
                  label={`Плашка #${index + 1}`}
                  centerLabel
                >
                  {/* <div
                  key={tile.id ?? `tile-${index}`}
                  className="p-3 border border-gray-300 rounded-lg"
                > */}
                  <button
                    type="button"
                    className="absolute p-2 text-sm text-red-600 transition duration-500 bg-white rounded-full cursor-pointer -top-4 right-2 hover:scale-125"
                    onClick={() => removeTile(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <div className="grid w-full">
                    <InputImage
                      label="Картинка (необязательно)"
                      directory="additionalBlocks"
                      image={tile.image ?? ''}
                      onChange={(value) => updateTile(index, { image: value })}
                    />
                    <Input
                      label="Заголовок плашки"
                      type="text"
                      value={tile.title ?? ''}
                      onChange={(value) => updateTile(index, { title: value })}
                    />
                    <Textarea
                      label="Описание плашки"
                      value={tile.description ?? ''}
                      onChange={(value) =>
                        updateTile(index, { description: value })
                      }
                    />

                    <InputWrapper label="Фон плашки">
                      <div className="flex flex-wrap gap-2">
                        {tileColorOptions.map((option) => (
                          <button
                            type="button"
                            key={option.value}
                            className={cn(
                              'rounded-lg border px-3 py-2 text-center text-xs',
                              option.bgClassName,
                              tile.color === option.value &&
                                tile.colorMode !== 'custom'
                                ? 'border-gray-700'
                                : 'border-transparent'
                            )}
                            onClick={() =>
                              updateTile(index, {
                                color: option.value,
                                colorMode: 'preset',
                              })
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={cn(
                            'rounded-lg border px-3 py-2 text-center text-xs',
                            tile.colorMode === 'custom'
                              ? 'border-gray-700 bg-white'
                              : 'border-transparent bg-white'
                          )}
                          onClick={() =>
                            updateTile(index, {
                              color:
                                tile.colorMode === 'custom' && tile.color
                                  ? tile.color
                                  : '#ffffff',
                              colorMode: 'custom',
                            })
                          }
                        >
                          Другой
                        </button>
                      </div>
                    </InputWrapper>
                    {tile.colorMode === 'custom' ? (
                      <ColorPicker
                        label="Цвет фона"
                        value={tile.color ?? '#ffffff'}
                        onChange={(value) =>
                          updateTile(index, {
                            color: value,
                            colorMode: 'custom',
                          })
                        }
                      />
                    ) : null}
                  </div>
                </InputWrapper>
              ))}
            </div>
          ) : (
            <div className="text-sm italic text-gray-500">Плашек пока нет</div>
          )}
          <button
            type="button"
            className="self-start px-3 py-1 text-sm border border-gray-400 rounded-md"
            onClick={addTile}
          >
            Добавить плашку
          </button>
        </div>
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      additionalBlockId && !clone ? 'Редактирование' : 'Создание'
    } блока`,
    confirmButtonName: additionalBlockId && !clone ? 'Применить' : 'Создать',
    Children: AdditionalBlockModal,
  }
}

export default additionalBlockFunc
