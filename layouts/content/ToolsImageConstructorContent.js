'use client'

import Button from '@components/Button'
import IconButtonMenu from '@components/ButtonMenu'
import ColorPicker from '@components/ColorPicker'
import ComboBox from '@components/ComboBox'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputNumber from '@components/InputNumber'
import InputWrapper from '@components/InputWrapper'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import Templates from '@components/Templates'
import base64ToBlob from '@helpers/base64ToBlob'
import { sendImage } from '@helpers/cloudinary'
import arrayMove from '@helpers/arrayMove'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk'
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
import { uid } from 'uid'

const layerTypeTitles = {
  text: 'Текст',
  rect: 'Прямоугольник',
  circle: 'Круг',
}

const textAnchorItems = [
  { value: 'start', name: 'Слева' },
  { value: 'middle', name: 'По центру' },
  { value: 'end', name: 'Справа' },
]

const fontWeightItems = [
  { value: 'normal', name: 'Обычный' },
  { value: 'bold', name: 'Жирный' },
]

const fontFamilyItems = [
  { value: 'Arial', name: 'Arial' },
  { value: 'Verdana', name: 'Verdana' },
  { value: 'Georgia', name: 'Georgia' },
  { value: 'Tahoma', name: 'Tahoma' },
  { value: 'Trebuchet MS', name: 'Trebuchet MS' },
]

const mobileMainTools = [
  { key: 'templates', name: 'Сохр.', icon: faImages },
  { key: 'elements', name: 'Элементы', icon: faPlus },
  { key: 'tools', name: 'Настр.', icon: faCog },
  { key: 'layers', name: 'Слои', icon: faUsers },
]

const clampOpacity = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 100
  return Math.min(100, Math.max(0, value))
}

const createLayerByType = (type) => {
  const key = uid(24)
  if (type === 'rect') {
    return {
      key,
      type,
      show: true,
      name: 'Прямоугольник',
      params: {
        x: 120,
        y: 120,
        width: 260,
        height: 140,
        rx: 12,
        fill: '#FFFFFF',
        stroke: '#262626',
        strokeWidth: 2,
        opacity: 100,
        rotate: 0,
      },
    }
  }

  if (type === 'circle') {
    return {
      key,
      type,
      show: true,
      name: 'Круг',
      params: {
        cx: 240,
        cy: 240,
        r: 90,
        fill: '#FFFFFF',
        stroke: '#262626',
        strokeWidth: 2,
        opacity: 100,
      },
    }
  }

  return {
    key,
    type: 'text',
    show: true,
    name: 'Текст',
    params: {
      text: 'Новый текст',
      x: 240,
      y: 240,
      fontSize: 38,
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      textAnchor: 'middle',
      lineHeight: 1.2,
      rotate: 0,
      opacity: 100,
    },
  }
}

const estimateTextBounds = (layer) => {
  const text = String(layer?.params?.text || '')
  const lines = text.split('\n')
  const fontSize = Number(layer?.params?.fontSize || 32)
  const lineHeight = Number(layer?.params?.lineHeight || 1.2)
  const maxLineLength = lines.reduce(
    (acc, line) => Math.max(acc, line.length),
    0
  )
  const width = Math.max(10, maxLineLength * fontSize * 0.62)
  const height = Math.max(fontSize, lines.length * fontSize * lineHeight)

  const x = Number(layer?.params?.x || 0)
  const y = Number(layer?.params?.y || 0)
  const textAnchor = layer?.params?.textAnchor || 'start'

  const left =
    textAnchor === 'middle'
      ? x - width / 2
      : textAnchor === 'end'
        ? x - width
        : x
  const top = y - fontSize

  return {
    x: left,
    y: top,
    width,
    height,
  }
}

const getLayerBounds = (layer) => {
  if (!layer) return null
  if (layer.type === 'rect') {
    return {
      x: Number(layer.params?.x || 0),
      y: Number(layer.params?.y || 0),
      width: Number(layer.params?.width || 0),
      height: Number(layer.params?.height || 0),
    }
  }

  if (layer.type === 'circle') {
    const cx = Number(layer.params?.cx || 0)
    const cy = Number(layer.params?.cy || 0)
    const r = Number(layer.params?.r || 0)
    return {
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2,
    }
  }

  return estimateTextBounds(layer)
}

const getLayerXY = (layer) => {
  if (!layer) return { x: 0, y: 0 }
  if (layer.type === 'circle') {
    return {
      x: Number(layer.params?.cx || 0),
      y: Number(layer.params?.cy || 0),
    }
  }

  return {
    x: Number(layer.params?.x || 0),
    y: Number(layer.params?.y || 0),
  }
}

const getLayerPointerStyle = (isLocked) => (isLocked ? 'default' : 'grab')

const ObjectItem = ({
  item,
  index,
  isSelected,
  onSelect,
  onDelete,
  onToggleVisibility,
  onClickUp,
  onClickDown,
  children,
}) => (
  <FormWrapper
    className={
      isSelected
        ? 'border border-general/40 rounded-sm'
        : 'border border-transparent'
    }
  >
    {index > 0 && <Divider thin />}
    <div className="flex items-center px-1 py-0.5 gap-x-2">
      <button
        type="button"
        className="flex-1 italic font-bold text-left text-gray-700 cursor-pointer"
        onClick={onSelect}
      >
        {item.name || layerTypeTitles[item.type]}
      </button>
      {onClickUp && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-disabled"
            icon={faArrowUp}
            size="1x"
            onClick={onClickUp}
          />
        </div>
      )}
      {onClickDown && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-disabled"
            icon={faArrowDown}
            size="1x"
            onClick={onClickDown}
          />
        </div>
      )}
      <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-[#7b4fb3]"
          icon={item.show ? faEye : faEyeSlash}
          size="1x"
          onClick={onToggleVisibility}
        />
      </div>
      <div className="ml-1 flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-danger"
          icon={faTrash}
          size="1x"
          onClick={onDelete}
        />
      </div>
    </div>
    <div className="px-1">{children}</div>
  </FormWrapper>
)

const TextLayerEditor = ({ item, setLayerState }) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    <Input
      label="Текст"
      value={item.params?.text || ''}
      onChange={(value) => setLayerState({ params: { text: value } })}
      fullWidth
      smallMargin
    />
    <div className="flex flex-wrap gap-x-1">
      <InputNumber
        label="X"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.x ?? 0}
        onChange={(value) => setLayerState({ params: { x: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Y"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.y ?? 0}
        onChange={(value) => setLayerState({ params: { y: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Размер"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.fontSize ?? 38}
        onChange={(value) => setLayerState({ params: { fontSize: value } })}
        min={6}
        max={500}
      />
      <InputNumber
        label="Интервал"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={Math.round(Number(item.params?.lineHeight || 1.2) * 100)}
        onChange={(value) =>
          setLayerState({ params: { lineHeight: Math.max(0.7, value / 100) } })
        }
        min={70}
        max={400}
      />
      <InputNumber
        label="Поворот"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.rotate ?? 0}
        onChange={(value) => setLayerState({ params: { rotate: value } })}
        min={-360}
        max={360}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={clampOpacity(item.params?.opacity ?? 100)}
        onChange={(value) =>
          setLayerState({ params: { opacity: clampOpacity(value) } })
        }
        min={0}
        max={100}
      />
      <ColorPicker
        label="Цвет"
        value={item.params?.color || '#FFFFFF'}
        onChange={(value) => setLayerState({ params: { color: value } })}
      />
      <ComboBox
        label="Выравнивание"
        className="w-[140px]"
        items={textAnchorItems}
        value={item.params?.textAnchor || 'start'}
        onChange={(value) => setLayerState({ params: { textAnchor: value } })}
      />
      <ComboBox
        label="Вес"
        className="w-[128px]"
        items={fontWeightItems}
        value={item.params?.fontWeight || 'normal'}
        onChange={(value) => setLayerState({ params: { fontWeight: value } })}
      />
      <ComboBox
        label="Шрифт"
        className="w-[170px]"
        items={fontFamilyItems}
        value={item.params?.fontFamily || 'Arial'}
        onChange={(value) => setLayerState({ params: { fontFamily: value } })}
      />
    </div>
  </FormWrapper>
)

const RectLayerEditor = ({ item, setLayerState }) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    <div className="flex flex-wrap gap-x-1">
      <InputNumber
        label="X"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.x ?? 0}
        onChange={(value) => setLayerState({ params: { x: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Y"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.y ?? 0}
        onChange={(value) => setLayerState({ params: { y: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Ширина"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.width ?? 260}
        onChange={(value) => setLayerState({ params: { width: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Высота"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.height ?? 140}
        onChange={(value) => setLayerState({ params: { height: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Скругление"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.rx ?? 0}
        onChange={(value) => setLayerState({ params: { rx: value } })}
        min={0}
        max={2000}
      />
      <InputNumber
        label="Обводка"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.strokeWidth ?? 0}
        onChange={(value) => setLayerState({ params: { strokeWidth: value } })}
        min={0}
        max={200}
      />
      <InputNumber
        label="Поворот"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.rotate ?? 0}
        onChange={(value) => setLayerState({ params: { rotate: value } })}
        min={-360}
        max={360}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={clampOpacity(item.params?.opacity ?? 100)}
        onChange={(value) =>
          setLayerState({ params: { opacity: clampOpacity(value) } })
        }
        min={0}
        max={100}
      />
      <ColorPicker
        label="Заливка"
        value={item.params?.fill || '#FFFFFF'}
        onChange={(value) => setLayerState({ params: { fill: value } })}
      />
      <ColorPicker
        label="Цвет обводки"
        value={item.params?.stroke || '#262626'}
        onChange={(value) => setLayerState({ params: { stroke: value } })}
      />
    </div>
  </FormWrapper>
)

const CircleLayerEditor = ({ item, setLayerState }) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    <div className="flex flex-wrap gap-x-1">
      <InputNumber
        label="Центр X"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.cx ?? 0}
        onChange={(value) => setLayerState({ params: { cx: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Центр Y"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.cy ?? 0}
        onChange={(value) => setLayerState({ params: { cy: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Радиус"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.r ?? 90}
        onChange={(value) => setLayerState({ params: { r: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Обводка"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.strokeWidth ?? 0}
        onChange={(value) => setLayerState({ params: { strokeWidth: value } })}
        min={0}
        max={200}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={clampOpacity(item.params?.opacity ?? 100)}
        onChange={(value) =>
          setLayerState({ params: { opacity: clampOpacity(value) } })
        }
        min={0}
        max={100}
      />
      <ColorPicker
        label="Заливка"
        value={item.params?.fill || '#FFFFFF'}
        onChange={(value) => setLayerState({ params: { fill: value } })}
      />
      <ColorPicker
        label="Цвет обводки"
        value={item.params?.stroke || '#262626'}
        onChange={(value) => setLayerState({ params: { stroke: value } })}
      />
    </div>
  </FormWrapper>
)

const MobileMainToolButton = ({ icon, name, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center min-w-[72px] gap-y-1 px-2 py-1 text-[11px] font-bold ${
      isActive ? 'text-general' : 'text-gray-600'
    }`}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    <span>{name}</span>
  </button>
)

const ToolsImageConstructorContent = () => {
  const { imageFolder } = useAtomValue(locationPropsSelector)

  const [templateName, setTemplateName] = useState('Изображение')
  const [size, setSize] = useState({ w: 1080, h: 1080 })
  const [data, setData] = useState([])
  const [selectedLayerKey, setSelectedLayerKey] = useState(null)
  const [backgroundProps, setBackgroundProps] = useState()
  const [rerenderState, setRerenderState] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [mobilePanel, setMobilePanel] = useState(null)
  const [isDraggingLayer, setIsDraggingLayer] = useState(false)
  const [mobilePanelRendered, setMobilePanelRendered] = useState(null)
  const [mobilePanelVisible, setMobilePanelVisible] = useState(false)

  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const mobilePanelOpenTimerRef = useRef(null)
  const mobilePanelCloseTimerRef = useRef(null)

  const selectedLayer = useMemo(
    () => data.find((item) => item.key === selectedLayerKey) || null,
    [data, selectedLayerKey]
  )

  const rerender = () => setRerenderState((state) => !state)

  const updateLayer = useCallback((key, patch) => {
    setData((state) =>
      state.map((item) => {
        if (item.key !== key) return item
        return {
          ...item,
          ...patch,
          params: {
            ...item.params,
            ...(patch.params || {}),
          },
        }
      })
    )
  }, [])

  const setSelectedLayerState = useCallback(
    (patch) => {
      if (!selectedLayerKey) return
      updateLayer(selectedLayerKey, patch)
    },
    [selectedLayerKey, updateLayer]
  )

  const addItem = useCallback((type) => {
    const newLayer = createLayerByType(type)
    setData((state) => [...state, newLayer])
    setSelectedLayerKey(newLayer.key)
  }, [])

  const addItemFromMobile = useCallback(
    (type) => {
      addItem(type)
      setMobilePanel(null)
    },
    [addItem]
  )

  const deleteLayer = useCallback((key) => {
    setData((state) => state.filter((item) => item.key !== key))
    setSelectedLayerKey((state) => (state === key ? null : state))
  }, [])

  const duplicateLayer = useCallback(
    (key) => {
      const source = data.find((item) => item.key === key)
      if (!source) return

      const newLayer = {
        ...source,
        key: uid(24),
        name: `${source.name || layerTypeTitles[source.type] || 'Слой'} (копия)`,
        params: {
          ...source.params,
          ...(source.type === 'circle'
            ? {
                cx: Number(source.params?.cx || 0) + 18,
                cy: Number(source.params?.cy || 0) + 18,
              }
            : {
                x: Number(source.params?.x || 0) + 18,
                y: Number(source.params?.y || 0) + 18,
              }),
        },
      }

      setData((state) => [...state, newLayer])
      setSelectedLayerKey(newLayer.key)
    },
    [data]
  )

  const onClickUp = useCallback((index) => {
    setData((state) => arrayMove(state, index, index - 1))
  }, [])

  const onClickDown = useCallback((index) => {
    setData((state) => arrayMove(state, index, index + 1))
  }, [])

  const getSvgPoint = useCallback(
    (event) => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      if (!rect.width || !rect.height) return null

      return {
        x: ((event.clientX - rect.left) * size.w) / rect.width,
        y: ((event.clientY - rect.top) * size.h) / rect.height,
      }
    },
    [size.h, size.w]
  )

  const startDragLayer = useCallback(
    (event, layer) => {
      if (!layer?.show) return
      if (event.button !== undefined && event.button !== 0) return

      const point = getSvgPoint(event)
      if (!point) return

      event.preventDefault()
      setSelectedLayerKey(layer.key)
      setIsDraggingLayer(false)
      const coords = getLayerXY(layer)

      dragRef.current = {
        layerKey: layer.key,
        type: layer.type,
        startPointerX: point.x,
        startPointerY: point.y,
        startLayerX: coords.x,
        startLayerY: coords.y,
      }
    },
    [getSvgPoint]
  )

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragRef.current) return
      setIsDraggingLayer(true)

      const point = getSvgPoint(event)
      if (!point) return

      const drag = dragRef.current
      const nextX = Math.round(
        drag.startLayerX + (point.x - drag.startPointerX)
      )
      const nextY = Math.round(
        drag.startLayerY + (point.y - drag.startPointerY)
      )

      updateLayer(drag.layerKey, {
        params:
          drag.type === 'circle'
            ? { cx: nextX, cy: nextY }
            : { x: nextX, y: nextY },
      })
    }

    const onPointerUp = () => {
      dragRef.current = null
      setIsDraggingLayer(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [getSvgPoint, updateLayer])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsMobileView(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (mobilePanelOpenTimerRef.current) {
      clearTimeout(mobilePanelOpenTimerRef.current)
      mobilePanelOpenTimerRef.current = null
    }
    if (mobilePanelCloseTimerRef.current) {
      clearTimeout(mobilePanelCloseTimerRef.current)
      mobilePanelCloseTimerRef.current = null
    }

    if (mobilePanel) {
      setMobilePanelVisible(false)
      setMobilePanelRendered(mobilePanel)
      mobilePanelOpenTimerRef.current = setTimeout(() => {
        setMobilePanelVisible(true)
        mobilePanelOpenTimerRef.current = null
      }, 24)
      return undefined
    }

    setMobilePanelVisible(false)
    if (mobilePanelRendered) {
      mobilePanelCloseTimerRef.current = setTimeout(() => {
        setMobilePanelRendered(null)
        mobilePanelCloseTimerRef.current = null
      }, 260)
    }
  }, [mobilePanel, mobilePanelRendered])

  const savePng = () => {
    if (!svgRef.current) return
    const fileName = `${templateName?.trim() || 'image-constructor'}.png`
    saveSvgAsPng(svgRef.current, fileName, {
      scale: 1,
      encoderOptions: 1,
    })
  }

  const saveSvg = () => {
    if (!svgRef.current) return

    const serializedSvg = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([serializedSvg], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${templateName?.trim() || 'image-constructor'}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const buildTemplatePayload = useCallback(async () => {
    if (!svgRef.current) {
      return {
        name: templateName,
        size,
        backgroundProps,
        data,
        preview: '',
      }
    }

    const maxSide = Math.max(size.w, size.h)
    const previewScale = maxSide > 0 ? Math.min(1, 480 / maxSide) : 1
    const pngDataUrl = await svgAsPngUri(svgRef.current, {
      scale: previewScale,
    })

    let preview = ''
    if (pngDataUrl) {
      const blob = base64ToBlob(pngDataUrl.split(',')[1], 'image/png')
      const uploaded = await sendImage(
        blob,
        undefined,
        'templates/imageconstructor/preview',
        null,
        imageFolder
      )
      preview = uploaded || ''
    }

    return {
      name: templateName,
      size,
      backgroundProps,
      data,
      preview,
    }
  }, [backgroundProps, data, imageFolder, size, templateName])

  const selectedLayerBounds = useMemo(
    () => getLayerBounds(selectedLayer),
    [selectedLayer]
  )

  const mobileSelectedLayerToolbarStyle = useMemo(() => {
    if (!selectedLayerBounds || !selectedLayer?.show || !size.h || !size.w)
      return null

    const toolbarHeightPx = 40
    const layerGapPx = 12
    const centerX =
      ((selectedLayerBounds.x + selectedLayerBounds.width / 2) / size.w) * 100
    const layerTop = (selectedLayerBounds.y / size.h) * 100
    const layerBottom =
      ((selectedLayerBounds.y + selectedLayerBounds.height) / size.h) * 100
    const showAbove = layerTop > 14
    const safeCenter = Math.max(28, Math.min(72, centerX))

    return {
      left: `${safeCenter}%`,
      top: showAbove
        ? `calc(${Math.max(0, layerTop)}% - ${toolbarHeightPx + layerGapPx}px)`
        : `calc(${Math.max(0, layerBottom)}% + ${layerGapPx}px * 2)`,
      transform: 'translateX(-50%)',
    }
  }, [selectedLayer?.show, selectedLayerBounds, size.h, size.w])

  const selectTemplate = (selectedTemplate) => {
    const template = selectedTemplate?.template
    if (!template) return
    setTemplateName(selectedTemplate?.name || template?.name || 'Изображение')
    if (template?.size?.w && template?.size?.h) {
      setSize({ w: template.size.w, h: template.size.h })
    }
    setData(Array.isArray(template?.data) ? template.data : [])
    setSelectedLayerKey(null)
    setBackgroundProps(template?.backgroundProps)
    rerender()
  }

  const renderLayerEditor = (item) => {
    if (!item || item.key !== selectedLayerKey) return null
    if (item.type === 'text') {
      return (
        <TextLayerEditor
          item={item}
          setLayerState={(patch) => updateLayer(item.key, patch)}
        />
      )
    }
    if (item.type === 'rect') {
      return (
        <RectLayerEditor
          item={item}
          setLayerState={(patch) => updateLayer(item.key, patch)}
        />
      )
    }
    return (
      <CircleLayerEditor
        item={item}
        setLayerState={(patch) => updateLayer(item.key, patch)}
      />
    )
  }

  const renderCanvas = ({
    wrapperClassName = 'w-full max-w-full bg-transparent border border-gray-500 touch-none',
    maxHeight = 'calc(100vh - 260px)',
  } = {}) => (
    <svg
      ref={svgRef}
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      className={wrapperClassName}
      style={{ maxHeight }}
      onPointerDown={(event) => {
        if (event.target === svgRef.current) setSelectedLayerKey(null)
      }}
    >
      <SvgBackgroundComponent {...backgroundProps} />

      {data.map((layer) => {
        if (!layer?.show) return null

        if (layer.type === 'rect') {
          const x = Number(layer.params?.x || 0)
          const y = Number(layer.params?.y || 0)
          const width = Number(layer.params?.width || 0)
          const height = Number(layer.params?.height || 0)
          const rotate = Number(layer.params?.rotate || 0)
          return (
            <rect
              key={layer.key}
              x={x}
              y={y}
              width={Math.max(1, width)}
              height={Math.max(1, height)}
              rx={Math.max(0, Number(layer.params?.rx || 0))}
              fill={layer.params?.fill || '#FFFFFF'}
              stroke={layer.params?.stroke || '#262626'}
              strokeWidth={Math.max(0, Number(layer.params?.strokeWidth || 0))}
              fillOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
              transform={
                rotate
                  ? `rotate(${rotate} ${x + width / 2} ${y + height / 2})`
                  : undefined
              }
              style={{ cursor: getLayerPointerStyle(false) }}
              onPointerDown={(event) => startDragLayer(event, layer)}
            />
          )
        }

        if (layer.type === 'circle') {
          return (
            <circle
              key={layer.key}
              cx={Number(layer.params?.cx || 0)}
              cy={Number(layer.params?.cy || 0)}
              r={Math.max(1, Number(layer.params?.r || 0))}
              fill={layer.params?.fill || '#FFFFFF'}
              stroke={layer.params?.stroke || '#262626'}
              strokeWidth={Math.max(0, Number(layer.params?.strokeWidth || 0))}
              fillOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
              style={{ cursor: getLayerPointerStyle(false) }}
              onPointerDown={(event) => startDragLayer(event, layer)}
            />
          )
        }

        const text = String(layer.params?.text || '')
        const lines = text.split('\n')
        const lineHeight = Number(layer.params?.lineHeight || 1.2)
        const x = Number(layer.params?.x || 0)
        const y = Number(layer.params?.y || 0)
        const fontSize = Math.max(1, Number(layer.params?.fontSize || 32))
        const rotate = Number(layer.params?.rotate || 0)

        return (
          <text
            key={layer.key}
            x={x}
            y={y}
            fontSize={fontSize}
            fill={layer.params?.color || '#FFFFFF'}
            fontWeight={layer.params?.fontWeight || 'normal'}
            textAnchor={layer.params?.textAnchor || 'start'}
            fontFamily={layer.params?.fontFamily || 'Arial'}
            fillOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
            transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
            style={{
              cursor: getLayerPointerStyle(false),
              userSelect: 'none',
            }}
            onPointerDown={(event) => startDragLayer(event, layer)}
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={`${layer.key}_${lineIndex}`}
                x={x}
                dy={lineIndex === 0 ? 0 : `${lineHeight}em`}
              >
                {line}
              </tspan>
            ))}
          </text>
        )
      })}

      {selectedLayerBounds && selectedLayer?.show && (
        <rect
          x={selectedLayerBounds.x}
          y={selectedLayerBounds.y}
          width={Math.max(1, selectedLayerBounds.width)}
          height={Math.max(1, selectedLayerBounds.height)}
          fill="none"
          stroke="#13B981"
          strokeWidth="2"
          strokeDasharray="8 6"
          pointerEvents="none"
        />
      )}
    </svg>
  )

  if (isMobileView) {
    return (
      <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-[#d5d7dc]">
        <div className="relative flex-1 px-3 pt-5 pb-56 overflow-auto">
          <div className="relative flex items-center justify-center min-h-full">
            <div className="relative w-full max-w-[560px] border border-gray-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              {renderCanvas({
                wrapperClassName: 'w-full max-w-full bg-transparent touch-none',
                maxHeight: 'calc(100vh - 300px)',
              })}
              {selectedLayer &&
                !isDraggingLayer &&
                mobileSelectedLayerToolbarStyle && (
                  <div
                    className="absolute z-20 rounded-full bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
                    style={mobileSelectedLayerToolbarStyle}
                  >
                    <div className="flex items-center px-2 py-1 gap-x-1">
                      <button
                        type="button"
                        className="w-8 h-8 text-[#1d9bf0]"
                        onClick={() => setMobilePanel('text')}
                      >
                        <FontAwesomeIcon icon={faCog} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 text-gray-700"
                        onClick={() => duplicateLayer(selectedLayer.key)}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 text-red-600"
                        onClick={() => deleteLayer(selectedLayer.key)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 text-gray-600"
                        onClick={() => setMobilePanel('layers')}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 text-gray-700"
                        onClick={() => {
                          setSelectedLayerKey(null)
                          setMobilePanel(null)
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {mobilePanelRendered && (
          <div
            className={`fixed bottom-0 left-0 right-0 z-40 max-h-[68vh] overflow-auto rounded-t-2xl border border-gray-200 border-b-0 bg-white px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-2xl transition-all duration-300 ease-out ${
              mobilePanelVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="text-sm font-bold text-gray-700">
                {mobilePanelRendered === 'templates' && 'Сохранение'}
                {mobilePanelRendered === 'elements' && 'Элементы'}
                {mobilePanelRendered === 'text' && 'Редактирование'}
                {mobilePanelRendered === 'tools' && 'Настройки'}
                {mobilePanelRendered === 'layers' && 'Слои'}
              </div>
              <button
                type="button"
                className="text-gray-500 w-7 h-7"
                onClick={() => setMobilePanel(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {mobilePanelRendered === 'templates' && (
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-wrap gap-1">
                  <Button name="PNG" icon={faDownload} onClick={savePng} thin />
                  <Button
                    name="SVG"
                    icon={faFloppyDisk}
                    onClick={saveSvg}
                    thin
                  />
                </div>
                <Templates
                  aspect={size.h > 0 ? size.w / size.h : 1}
                  tool="imageconstructor"
                  onSelect={selectTemplate}
                  templateFunc={buildTemplatePayload}
                />
              </div>
            )}

            {mobilePanelRendered === 'elements' && (
              <div className="flex flex-wrap gap-2 p-1">
                <Button
                  name="Текст"
                  icon={faPlus}
                  thin
                  onClick={() => addItemFromMobile('text')}
                />
                <Button
                  name="Прямоугольник"
                  icon={faPlus}
                  thin
                  onClick={() => addItemFromMobile('rect')}
                />
                <Button
                  name="Круг"
                  icon={faPlus}
                  thin
                  onClick={() => addItemFromMobile('circle')}
                />
              </div>
            )}

            {mobilePanelRendered === 'text' && (
              <>
                {selectedLayer ? (
                  renderLayerEditor(selectedLayer)
                ) : (
                  <div className="p-2 text-sm text-gray-600">
                    Выберите слой или добавьте новый текст.
                  </div>
                )}
              </>
            )}

            {mobilePanelRendered === 'tools' && (
              <FormWrapper className="flex flex-col gap-y-1">
                <Input
                  label="Название макета"
                  value={templateName}
                  onChange={setTemplateName}
                  className="w-full"
                  smallMargin
                />
                <div className="flex items-end gap-x-1">
                  <InputNumber
                    label="Ширина"
                    className="w-[128px]"
                    inputClassName="w-[64px]"
                    value={size.w}
                    onChange={(w) =>
                      setSize((state) => ({ ...state, w: Math.max(1, w) }))
                    }
                    min={1}
                    max={4000}
                    smallMargin
                  />
                  <InputNumber
                    label="Высота"
                    className="w-[128px]"
                    inputClassName="w-[64px]"
                    value={size.h}
                    onChange={(h) =>
                      setSize((state) => ({ ...state, h: Math.max(1, h) }))
                    }
                    min={1}
                    max={4000}
                    smallMargin
                  />
                </div>
                <SvgBackgroundInput
                  value={backgroundProps}
                  onChange={setBackgroundProps}
                  imageAspect={size.h > 0 ? size.w / size.h : 1}
                  rerender={rerenderState}
                  imagesFolder="templates/imageconstructor"
                />
              </FormWrapper>
            )}

            {mobilePanelRendered === 'layers' && (
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between px-1">
                  <div className="text-sm font-bold text-gray-700">
                    Порядок слоев
                  </div>
                  <IconButtonMenu
                    name="Добавить"
                    icon={faPlus}
                    items={[
                      { name: 'Текст', value: 'text' },
                      { name: 'Прямоугольник', value: 'rect' },
                      { name: 'Круг', value: 'circle' },
                    ]}
                    onChange={addItem}
                  />
                </div>
                {data.map((item, index) => (
                  <ObjectItem
                    key={item.key}
                    item={item}
                    index={index}
                    isSelected={item.key === selectedLayerKey}
                    onSelect={() => setSelectedLayerKey(item.key)}
                    onDelete={() => deleteLayer(item.key)}
                    onToggleVisibility={() =>
                      updateLayer(item.key, {
                        show: !item.show,
                      })
                    }
                    onClickUp={index > 0 ? () => onClickUp(index) : null}
                    onClickDown={
                      index < data.length - 1 ? () => onClickDown(index) : null
                    }
                  >
                    {renderLayerEditor(item)}
                  </ObjectItem>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-1 py-1 overflow-x-auto">
            {mobileMainTools.map((tool) => (
              <MobileMainToolButton
                key={tool.key}
                icon={tool.icon}
                name={tool.name}
                isActive={mobilePanel === tool.key}
                onClick={() =>
                  setMobilePanel((state) =>
                    state === tool.key ? null : tool.key
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 h-full gap-y-2">
      <FormWrapper className="flex flex-col gap-y-1">
        <div className="flex flex-wrap items-end gap-x-1">
          <Input
            label="Название макета"
            value={templateName}
            onChange={setTemplateName}
            className="w-56"
            smallMargin
          />
          <InputNumber
            label="Ширина"
            className="w-[128px]"
            inputClassName="w-[64px]"
            value={size.w}
            onChange={(w) =>
              setSize((state) => ({ ...state, w: Math.max(1, w) }))
            }
            min={1}
            max={4000}
            smallMargin
          />
          <InputNumber
            label="Высота"
            className="w-[128px]"
            inputClassName="w-[64px]"
            value={size.h}
            onChange={(h) =>
              setSize((state) => ({ ...state, h: Math.max(1, h) }))
            }
            min={1}
            max={4000}
            smallMargin
          />
          <Button
            name="PNG"
            icon={faDownload}
            onClick={savePng}
            thin
            className="mb-0.5"
          />
          <Button
            name="SVG"
            icon={faFloppyDisk}
            onClick={saveSvg}
            thin
            className="mb-0.5"
          />
        </div>

        <SvgBackgroundInput
          value={backgroundProps}
          onChange={setBackgroundProps}
          imageAspect={size.h > 0 ? size.w / size.h : 1}
          rerender={rerenderState}
          imagesFolder="templates/imageconstructor"
        />

        <Templates
          aspect={size.h > 0 ? size.w / size.h : 1}
          tool="imageconstructor"
          onSelect={selectTemplate}
          templateFunc={buildTemplatePayload}
        />
      </FormWrapper>

      <div className="grid grid-cols-1 gap-2 laptop:grid-cols-[420px_minmax(0,1fr)]">
        <FormWrapper className="flex flex-col gap-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="flex items-center justify-between px-1">
            <div className="text-lg font-bold">Слои</div>
            <IconButtonMenu
              name="Добавить"
              icon={faPlus}
              items={[
                { name: 'Текст', value: 'text' },
                { name: 'Прямоугольник', value: 'rect' },
                { name: 'Круг', value: 'circle' },
              ]}
              onChange={addItem}
            />
          </div>

          {data.length === 0 && (
            <div className="px-2 py-6 text-center text-gray-500">
              Добавьте первый слой через кнопку "Добавить".
            </div>
          )}

          {data.map((item, index) => (
            <ObjectItem
              key={item.key}
              item={item}
              index={index}
              isSelected={item.key === selectedLayerKey}
              onSelect={() => setSelectedLayerKey(item.key)}
              onDelete={() => deleteLayer(item.key)}
              onToggleVisibility={() =>
                updateLayer(item.key, {
                  show: !item.show,
                })
              }
              onClickUp={index > 0 ? () => onClickUp(index) : null}
              onClickDown={
                index < data.length - 1 ? () => onClickDown(index) : null
              }
            >
              {renderLayerEditor(item)}
            </ObjectItem>
          ))}

          {selectedLayer && (
            <>
              <Divider thin />
              <InputWrapper
                label="Перемещение"
                paddingX="small"
                paddingY={false}
                centerLabel
              >
                <div className="px-1 pb-1 text-sm text-gray-600">
                  Перетаскивайте слой мышью прямо на холсте.
                </div>
              </InputWrapper>
              <Button
                name="Удалить выбранный слой"
                icon={faTrash}
                thin
                onClick={() => deleteLayer(selectedLayer.key)}
                classBgColor="bg-danger"
                classHoverBgColor="hover:bg-red-700"
              />
            </>
          )}
        </FormWrapper>

        <div className="overflow-auto border-2 border-gray-400 rounded-sm bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]">
          <div className="flex items-center justify-center min-h-[420px] p-2">
            {renderCanvas()}
          </div>
        </div>
      </div>

      <Divider thin />
      <div className="px-1 text-sm text-gray-600">
        Холст: {size.w}x{size.h}px. Порядок слоев в списке соответствует порядку
        отрисовки.
      </div>
    </div>
  )
}

export default ToolsImageConstructorContent
