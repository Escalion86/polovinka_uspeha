import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import { useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from './Button'
import ColorPicker from './ColorPicker'
import ComboBox from './ComboBox'
import Input from './Input'
import InputWrapper from './InputWrapper'
import { useEffect } from 'react'

export const SvgBackgroundComponent = ({
  backgroundType = 'color',
  backgroundColor = '#7a5151',
  angle = 45,
  gradient1Color = '#504436',
  gradient2Color = '#7a6a53',
  src = '',
}) => {
  var anglePI = angle * (Math.PI / 180)
  return (
    <>
      <defs>
        <linearGradient
          id="Gradient2"
          x1={Math.round(50 + Math.sin(anglePI) * 50) + '%'}
          y1={Math.round(50 + Math.cos(anglePI) * 50) + '%'}
          x2={Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%'}
          y2={Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%'}
        >
          <stop offset="0%" stopColor={gradient1Color} />
          <stop offset="100%" stopColor={gradient2Color} />
        </linearGradient>
      </defs>
      {(backgroundType === 'gradient' || backgroundType === 'color') && (
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={
            backgroundType === 'color' ? backgroundColor : 'url(#Gradient2)'
          }
        />
      )}
      {backgroundType === 'image' && (
        <image id={'preview'} href={src} height="100%" width="100%" />
      )}
    </>
  )
}

export const SvgBackgroundInput = ({
  value,
  onChange,
  imageAspect,
  rerender,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const hiddenFileInput = useRef(null)
  const addImageClick = () => {
    hiddenFileInput.current.click()
  }

  const [backgroundType, setBackgroundType] = useState(
    value?.backgroundType ?? 'color'
  )
  const [backgroundColor, setBackgroundColor] = useState(
    value?.backgroundColor ?? '#7a5151'
  )
  const [gradient1Color, setGradient1Color] = useState(
    value?.gradient1Color ?? '#7a6a53'
  )
  const [gradient2Color, setGradient2Color] = useState(
    value?.gradient2Color ?? '#504436'
  )
  const [angle, setAngle] = useState(value?.angle ?? 45)
  const [src, setSrc] = useState(value?.src ?? '')

  const set = (value) => {
    onChange({
      backgroundType,
      backgroundColor,
      gradient1Color,
      gradient2Color,
      angle,
      src,
      ...value,
    })
  }

  useEffect(() => {
    setBackgroundType(value?.backgroundType ?? 'color')
    setBackgroundColor(value?.backgroundColor ?? '#7a5151')
    setGradient1Color(value?.gradient1Color ?? '#7a6a53')
    setGradient2Color(value?.gradient2Color ?? '#504436')
    setAngle(value?.angle ?? 45)
    setSrc(value?.src ?? '')
  }, [rerender])

  return (
    <InputWrapper label="Фон" paddingX="small" paddingY={false} centerLabel>
      <div className="flex flex-wrap items-center flex-1 gap-x-2">
        <ComboBox
          label="Тип фона"
          className="w-[108px]"
          items={[
            { value: 'color', name: 'Цвет' },
            { value: 'gradient', name: 'Градиент' },
            { value: 'image', name: 'Картинка' },
          ]}
          value={backgroundType}
          onChange={(value) => {
            setBackgroundType(value)
            set({ backgroundType: value })
          }}
          paddingY="small"
          fullWidth={false}
        />
        {backgroundType === 'gradient' && (
          <div className="flex gap-x-2">
            <ColorPicker
              label="Цвет №1"
              value={gradient1Color}
              onChange={(value) => {
                setGradient1Color(value)
                set({ gradient1Color: value })
              }}
            />
            <ColorPicker
              label="Цвет №2"
              value={gradient2Color}
              onChange={(value) => {
                setGradient2Color(value)
                set({ gradient2Color: value })
              }}
            />
            <Input
              label="Угол"
              type="number"
              // className="w-[70px]"
              inputClassName="w-[36px]"
              value={angle}
              onChange={(value) => {
                setAngle(parseInt(value))
                set({ angle: parseInt(value) })
              }}
              min={0}
              max={359}
            />
          </div>
        )}
        {backgroundType === 'color' && (
          <ColorPicker
            label="Цвет"
            value={backgroundColor}
            onChange={(value) => {
              setBackgroundColor(value)
              set({ backgroundColor: value })
            }}
          />
        )}
        {backgroundType === 'image' && (
          <div className="flex items-center mt-4 mb-1 gap-x-1">
            <div>Фон:</div>
            <Button
              name={src ? 'Изменить фон' : 'Загрузить фон'}
              thin
              onClick={addImageClick}
            />
            <input
              ref={hiddenFileInput}
              className="hidden"
              type="file"
              onChange={(e) => {
                modalsFunc.cropImage(
                  e.target.files[0],
                  null,
                  imageAspect,
                  (newImage) => {
                    setSrc(newImage)
                    set({ src: newImage })
                  },
                  false
                )
              }}
            />
            {src && (
              <FontAwesomeIcon
                className="w-6 h-6 duration-200 transform cursor-pointer text-danger hover:scale-110"
                icon={faTimes}
                onClick={() => {
                  setSrc('')
                  set({ src: '' })
                }}
              />
            )}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}
