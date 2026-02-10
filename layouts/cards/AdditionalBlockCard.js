import AdditionalBlockCardButtons from '@components/cardButtons/AdditionalBlockCardButtons'
import CardWrapper from '@components/CardWrapper'
import NoOrphanText from '@components/NoOrphanText'
import { ADDITIONAL_BLOCK_TILE_COLORS } from '@helpers/constants'
import modalsFuncAtom from '@state/modalsFuncAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useAtomValue } from 'jotai'
import snackbarAtom from '@state/atoms/snackbarAtom'

export const AdditionalBlockCardContent = ({
  block,
  showButtons = true,
  onToggleShowOnSite,
  onMoveUp,
  onMoveDown,
  buttonsAlwaysCompact = false,
  reveal = false,
}) => {
  if (!block) return null
  const tiles = Array.isArray(block.tiles) ? block.tiles : []
  const hasDescription = Boolean(block.description)
  const hasImage = Boolean(block.image)
  const blockStyle =
    block.blockBgMode === 'gradient'
      ? {
          background: `linear-gradient(135deg, ${
            block.blockBgColor1 || '#ffffff'
          }, ${block.blockBgColor2 || '#f6f3f1'})`,
        }
      : {
          backgroundColor: block.blockBgColor1 || '#ffffff',
        }

  return (
    <div className="w-full" {...(reveal ? { 'data-reveal': true } : {})}>
      <div className="flex items-center gap-2 px-2 pb-3">
        <div className="flex-1">
          <h3 className="font-lora text-[clamp(26px,3vw,38px)] font-bold text-[#6b1f2a]">
            {block.title}
          </h3>
        </div>
        {showButtons ? (
          <AdditionalBlockCardButtons
            item={block}
            showOnSiteOnClick={onToggleShowOnSite}
            onUpClick={onMoveUp}
            onDownClick={onMoveDown}
            alwaysCompact={buttonsAlwaysCompact}
          />
        ) : null}
      </div>
      <div
        className="rounded-3xl p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)]"
        style={blockStyle}
      >
        {hasDescription || hasImage ? (
          <div
            className={`flex flex-col gap-4 ${
              hasImage ? 'lg:flex-row lg:items-start' : ''
            }`}
          >
            {hasImage ? (
              <img
                src={block.image}
                alt=""
                className="w-full max-h-[220px] rounded-2xl object-cover lg:w-[280px] lg:h-[260px]"
              />
            ) : null}
            {hasDescription ? (
              <NoOrphanText
                as="div"
                className={`flex-1 rounded-2xl bg-white/70 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.08)] ${
                  hasImage ? 'lg:min-h-[220px]' : ''
                }`}
                html={DOMPurify.sanitize(block.description)}
              />
            ) : null}
          </div>
        ) : null}
        {tiles.length > 0 ? (
          <div
            className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
              hasDescription ? 'mt-6' : ''
            }`}
          >
            {tiles.map((tile, index) => (
              <AdditionalBlockTile
                key={`${tile.title ?? 'tile'}-${index}`}
                tile={tile}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const AdditionalBlockCard = ({ additionalBlockId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const additionalBlock = useAtomValue(
    additionalBlockSelector(additionalBlockId)
  )
  const loading = useAtomValue(
    loadingAtom('additionalBlock' + additionalBlockId)
  )
  const itemFunc = useAtomValue(itemsFuncAtom)

  const additionalBlocks = useAtomValue(additionalBlocksAtom)
  const snackbar = useAtomValue(snackbarAtom)

  const setUp = async () => {
    if (additionalBlock.index === 0) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = additionalBlocks
      .map((item) => {
        if (item.index === additionalBlock.index)
          if (!movedUp) {
            movedUp = true
            return { ...item, index: item.index - 1 }
          }

        if (item.index === additionalBlock.index - 1)
          if (!movedDown) {
            movedDown = true
            return { ...item, index: item.index + 1 }
          }
      })
      .filter((item) => item)
    const result = await Promise.all(
      itemsToChange.map(
        async (item) =>
          await itemFunc.additionalBlock.set(
            {
              _id: item._id,
              index: item.index,
            },
            false,
            true
          )
      )
    )
    if (result.filter((item) => item).length === itemsToChange.length)
      snackbar.success(`Доп. блок "${additionalBlock.title}" перемещен выше`)
    else
      snackbar.error(
        `Не удеалось переместить доп. блок "${additionalBlock.title}"`
      )
  }

  const setDown = async () => {
    if (additionalBlock.index >= additionalBlocks.length - 1) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = additionalBlocks
      .map((item) => {
        if (item.index === additionalBlock.index)
          if (!movedDown) {
            movedDown = true
            return { ...item, index: item.index + 1 }
          }
        if (item.index === additionalBlock.index + 1)
          if (!movedUp) {
            movedUp = true
            return { ...item, index: item.index - 1 }
          }
      })
      .filter((item) => item)
    const result = await Promise.all(
      itemsToChange.map(
        async (item) =>
          await itemFunc.additionalBlock.set(
            {
              _id: item._id,
              index: item.index,
            },
            false,
            true
          )
      )
    )
    if (result.filter((item) => item).length === itemsToChange.length)
      snackbar.success(`Доп. блок "${additionalBlock.title}" перемещен ниже`)
    else
      snackbar.error(
        `Не удеалось переместить доп. блок "${additionalBlock.title}"`
      )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.additionalBlock.edit(additionalBlock._id)}
      showOnSite={additionalBlock.showOnSite}
      hidden={hidden}
      style={style}
      outerClassName="px-3 tablet:px-4 py-3"
      className="rounded-2xl border border-[rgba(107,31,42,0.18)] shadow-[0_12px_26px_rgba(0,0,0,0.08)]"
      bgClassName="bg-white"
    >
      <AdditionalBlockCardContent
        block={additionalBlock}
        showButtons
        onToggleShowOnSite={() => {
          itemFunc.additionalBlock.set({
            _id: additionalBlock._id,
            showOnSite: !additionalBlock.showOnSite,
          })
        }}
        onMoveUp={additionalBlock.index > 0 ? setUp : undefined}
        onMoveDown={
          additionalBlock.index < additionalBlocks.length - 1 ? setDown : undefined
        }
        buttonsAlwaysCompact
      />
    </CardWrapper>
  )
}

export default AdditionalBlockCard

const AdditionalBlockTile = ({ tile }) => {
  const tileStyle = tile?.color
    ? ADDITIONAL_BLOCK_TILE_COLORS.find((option) => option.value === tile.color)
    : null
  const isCustomColor =
    typeof tile?.color === 'string' && tile.color.startsWith('#') && !tileStyle

  return (
    <div
      className={`rounded-2xl p-6 shadow-[0_16px_30px_rgba(0,0,0,0.08)] ${
        tileStyle
          ? tileStyle.bgClassName
          : tile?.color
            ? 'text-white'
            : 'bg-white'
      }`}
      style={isCustomColor ? { backgroundColor: tile.color } : undefined}
    >
      <div className="flex items-center gap-x-2">
        {tile?.image ? (
          <img
            src={tile.image}
            alt=""
            className="object-cover w-12 h-12 rounded-full"
          />
        ) : null}
        <h3
          className={`flex-1 text-center text-[18px] ${
            tileStyle?.titleClassName ?? (isCustomColor ? 'text-white' : '')
          }`}
        >
          {tile?.title}
        </h3>
      </div>
      <NoOrphanText
        as="p"
        className={`mt-2 ${
          tileStyle?.descriptionClassName ??
          (isCustomColor ? 'text-white/90' : '')
        }`}
        text={tile?.description}
      />
    </div>
  )
}
