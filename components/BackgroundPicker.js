import ColorPicker from '@components/ColorPicker'
import cn from 'classnames'

const BackgroundPicker = ({
  label = 'Фон карточки',
  mode,
  onModeChange,
  color1,
  color2,
  onColor1Change,
  onColor2Change,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold">{label}</div>
      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            'rounded-lg border px-3 py-1 text-sm',
            mode === 'solid'
              ? 'border-gray-700 bg-white'
              : 'border-gray-300 bg-gray-100'
          )}
          onClick={() => onModeChange?.('solid')}
        >
          Один цвет
        </button>
        <button
          type="button"
          className={cn(
            'rounded-lg border px-3 py-1 text-sm',
            mode === 'gradient'
              ? 'border-gray-700 bg-white'
              : 'border-gray-300 bg-gray-100'
          )}
          onClick={() => onModeChange?.('gradient')}
        >
          Градиент
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorPicker
          label="Цвет 1"
          value={color1}
          onChange={onColor1Change}
          fullWidth
        />
        {mode === 'gradient' ? (
          <ColorPicker
            label="Цвет 2"
            value={color2}
            onChange={onColor2Change}
            fullWidth
          />
        ) : null}
      </div>
    </div>
  )
}

export default BackgroundPicker
