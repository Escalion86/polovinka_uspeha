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
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
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
        className="w-[100px]"
        inputClassName="w-[56px]"
        value={item.params?.x ?? 0}
        onChange={(value) => setLayerState({ params: { x: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Y"
        className="w-[100px]"
        inputClassName="w-[56px]"
        value={item.params?.y ?? 0}
        onChange={(value) => setLayerState({ params: { y: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Размер"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.fontSize ?? 38}
        onChange={(value) => setLayerState({ params: { fontSize: value } })}
        min={6}
        max={500}
      />
      <InputNumber
        label="Интервал"
        className="w-[120px]"
        inputClassName="w-[66px]"
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
        inputClassName="w-[66px]"
        value={item.params?.rotate ?? 0}
        onChange={(value) => setLayerState({ params: { rotate: value } })}
        min={-360}
        max={360}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[146px]"
        inputClassName="w-[76px]"
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
        className="w-[100px]"
        inputClassName="w-[56px]"
        value={item.params?.x ?? 0}
        onChange={(value) => setLayerState({ params: { x: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Y"
        className="w-[100px]"
        inputClassName="w-[56px]"
        value={item.params?.y ?? 0}
        onChange={(value) => setLayerState({ params: { y: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Ширина"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.width ?? 260}
        onChange={(value) => setLayerState({ params: { width: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Высота"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.height ?? 140}
        onChange={(value) => setLayerState({ params: { height: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Скругление"
        className="w-[130px]"
        inputClassName="w-[70px]"
        value={item.params?.rx ?? 0}
        onChange={(value) => setLayerState({ params: { rx: value } })}
        min={0}
        max={2000}
      />
      <InputNumber
        label="Обводка"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.strokeWidth ?? 0}
        onChange={(value) => setLayerState({ params: { strokeWidth: value } })}
        min={0}
        max={200}
      />
      <InputNumber
        label="Поворот"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.rotate ?? 0}
        onChange={(value) => setLayerState({ params: { rotate: value } })}
        min={-360}
        max={360}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[146px]"
        inputClassName="w-[76px]"
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
        className="w-[116px]"
        inputClassName="w-[66px]"
        value={item.params?.cx ?? 0}
        onChange={(value) => setLayerState({ params: { cx: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Центр Y"
        className="w-[116px]"
        inputClassName="w-[66px]"
        value={item.params?.cy ?? 0}
        onChange={(value) => setLayerState({ params: { cy: value } })}
        min={-5000}
        max={5000}
      />
      <InputNumber
        label="Радиус"
        className="w-[116px]"
        inputClassName="w-[66px]"
        value={item.params?.r ?? 90}
        onChange={(value) => setLayerState({ params: { r: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Обводка"
        className="w-[120px]"
        inputClassName="w-[66px]"
        value={item.params?.strokeWidth ?? 0}
        onChange={(value) => setLayerState({ params: { strokeWidth: value } })}
        min={0}
        max={200}
      />
      <InputNumber
        label="Прозрачность"
        className="w-[146px]"
        inputClassName="w-[76px]"
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

const ToolsImageConstructorContent = () => {
  const { imageFolder } = useAtomValue(locationPropsSelector)

  const [templateName, setTemplateName] = useState('Изображение')
  const [size, setSize] = useState({ w: 1080, h: 1080 })
  const [data, setData] = useState([])
  const [selectedLayerKey, setSelectedLayerKey] = useState(null)
  const [backgroundProps, setBackgroundProps] = useState()
  const [rerenderState, setRerenderState] = useState(false)

  const svgRef = useRef(null)
  const dragRef = useRef(null)

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

  const deleteLayer = useCallback((key) => {
    setData((state) => state.filter((item) => item.key !== key))
    setSelectedLayerKey((state) => (state === key ? null : state))
  }, [])

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
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [getSvgPoint, updateLayer])

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
          onSelect={(selectedTemplate) => {
            const template = selectedTemplate?.template
            if (!template) return
            setTemplateName(
              selectedTemplate?.name || template?.name || 'Изображение'
            )
            if (template?.size?.w && template?.size?.h) {
              setSize({ w: template.size.w, h: template.size.h })
            }
            setData(Array.isArray(template?.data) ? template.data : [])
            setSelectedLayerKey(null)
            setBackgroundProps(template?.backgroundProps)
            rerender()
          }}
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
              {item.type === 'text' && item.key === selectedLayerKey && (
                <TextLayerEditor
                  item={item}
                  setLayerState={(patch) => updateLayer(item.key, patch)}
                />
              )}
              {item.type === 'rect' && item.key === selectedLayerKey && (
                <RectLayerEditor
                  item={item}
                  setLayerState={(patch) => updateLayer(item.key, patch)}
                />
              )}
              {item.type === 'circle' && item.key === selectedLayerKey && (
                <CircleLayerEditor
                  item={item}
                  setLayerState={(patch) => updateLayer(item.key, patch)}
                />
              )}
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
            <svg
              ref={svgRef}
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              className="w-full max-w-full bg-transparent border border-gray-500 touch-none"
              style={{ maxHeight: 'calc(100vh - 260px)' }}
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
                      strokeWidth={Math.max(
                        0,
                        Number(layer.params?.strokeWidth || 0)
                      )}
                      fillOpacity={
                        clampOpacity(layer.params?.opacity ?? 100) / 100
                      }
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
                      strokeWidth={Math.max(
                        0,
                        Number(layer.params?.strokeWidth || 0)
                      )}
                      fillOpacity={
                        clampOpacity(layer.params?.opacity ?? 100) / 100
                      }
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
                const fontSize = Math.max(
                  1,
                  Number(layer.params?.fontSize || 32)
                )
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
                    fillOpacity={
                      clampOpacity(layer.params?.opacity ?? 100) / 100
                    }
                    transform={
                      rotate ? `rotate(${rotate} ${x} ${y})` : undefined
                    }
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
