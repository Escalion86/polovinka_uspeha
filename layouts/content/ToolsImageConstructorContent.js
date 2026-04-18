'use client'

import Button from '@components/Button'
import IconButtonMenu from '@components/ButtonMenu'
import CheckBox from '@components/CheckBox'
import ColorPicker from '@components/ColorPicker'
import ComboBox from '@components/ComboBox'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputNumber from '@components/InputNumber'
import InputWrapper from '@components/InputWrapper'
import { EventItem } from '@components/ItemCards'
import Textarea from '@components/Textarea'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import Templates from '@components/Templates'
import base64ToBlob from '@helpers/base64ToBlob'
import { sendImage } from '@helpers/cloudinary'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import arrayMove from '@helpers/arrayMove'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk'
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
import { uid } from 'uid'

const layerTypeTitles = {
  text: 'Текст',
  rect: 'Прямоугольник',
  circle: 'Круг',
  line: 'Линия',
  image: 'Картинка',
}

const eventBindingSourceItems = [
  { value: 'title', name: 'Заголовок' },
  { value: 'date_weekday', name: 'Дата + день недели' },
  { value: 'date_only', name: 'Только дата' },
  { value: 'time_range', name: 'Время' },
]

const eventBindingCaseItems = [
  { value: 'normal', name: 'Обычный' },
  { value: 'upper', name: 'Только заглавные' },
  { value: 'lower', name: 'Только строчные' },
]

const eventBindingSourceTitles = {
  title: 'Заголовок',
  date_weekday: 'Дата + день недели',
  date_only: 'Только дата',
  time_range: 'Время',
}

const eventBindingSourcePlaceholders = {
  title: '[название мероприятия]',
  date_weekday: '[дата]',
  date_only: '[дата]',
  time_range: '[время]',
}

const textAnchorItems = [
  { value: 'start', name: 'Слева' },
  { value: 'middle', name: 'По центру' },
  { value: 'end', name: 'Справа' },
]

const textVerticalAlignItems = [
  { value: 'legacy', name: 'Как сейчас' },
  { value: 'start', name: 'Сверху' },
  { value: 'middle', name: 'По центру' },
  { value: 'end', name: 'Снизу' },
]

const fontVariantItems = [
  { value: 'normal', name: 'Обычный' },
  { value: 'bold', name: 'Жирный' },
  { value: 'italic', name: 'Курсив' },
  { value: 'bold_italic', name: 'Жирный курсив' },
]

const fontFamilyItems = [
  { value: 'Arial', name: 'Arial' },
  { value: 'Verdana', name: 'Verdana' },
  { value: 'Georgia', name: 'Georgia' },
  { value: 'Tahoma', name: 'Tahoma' },
  { value: 'Trebuchet MS', name: 'Trebuchet MS' },
  { value: 'Futura PT', name: 'Futura PT' },
  { value: 'Futura PT Demi', name: 'Futura PT Demi' },
  { value: 'Futura PT Book', name: 'Futura PT Book' },
  { value: 'Futura PT Cond', name: 'Futura PT Cond' },
  { value: 'Futura PT Cond Book', name: 'Futura PT Cond Book' },
  { value: 'Futura PT Cond Extra', name: 'Futura PT Cond Extra' },
  { value: 'Futura PT Extra', name: 'Futura PT Extra' },
  { value: 'Lora', name: 'Lora' },
  { value: 'Lora-Italic', name: 'Lora Italic' },
  { value: 'CeraRoundPro', name: 'CeraRoundPro' },
  { value: 'AdleryProBlockletter', name: 'Adlery Blockletter' },
  { value: 'AdleryProSwash', name: 'Adlery Swash' },
  { value: 'Enchants', name: 'Enchants' },
  { value: 'Frankinity', name: 'Frankinity' },
]

const mobileMainTools = [
  { key: 'templates', name: 'Файл', icon: faImages },
  { key: 'elements', name: 'Элементы', icon: faPlus },
  { key: 'layers', name: 'Слои', icon: faUsers },
  { key: 'tools', name: 'Настр.', icon: faCog },
]

const IMAGE_CONSTRUCTOR_STORAGE_KEY = 'image_constructor_state_v1'
const RESIZABLE_LAYER_TYPES = new Set([
  'rect',
  'circle',
  'line',
  'text',
  'image',
])

const clampOpacity = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 100
  return Math.min(100, Math.max(0, value))
}

const clampZoom = (value) => Math.min(4, Math.max(0.25, value))

const getTouchDistance = (touchA, touchB) => {
  const dx = Number(touchA?.clientX || 0) - Number(touchB?.clientX || 0)
  const dy = Number(touchA?.clientY || 0) - Number(touchB?.clientY || 0)
  return Math.hypot(dx, dy)
}

const normalizeUploadsUrl = (url) => {
  if (typeof url !== 'string' || !url.includes('/uploads/')) return url || ''
  try {
    const parsed = new URL(url)
    const segments = parsed.pathname.split('/').map((segment) => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    parsed.pathname = segments.join('/')
    return parsed.toString()
  } catch {
    return url
  }
}

const normalizeImageLayerSources = (layers) =>
  Array.isArray(layers)
    ? layers.map((layer) =>
        layer?.type === 'image'
          ? {
              ...layer,
              params: {
                ...(layer.params || {}),
                src: normalizeUploadsUrl(layer.params?.src || ''),
              },
            }
          : layer
      )
    : []

const getTextVerticalAlign = (layer) => {
  const value = String(layer?.params?.textVerticalAlign || 'legacy')
  return ['legacy', 'start', 'middle', 'end'].includes(value) ? value : 'legacy'
}

const isTextWidthLocked = (layer) =>
  Boolean(layer?.params?.textWidthLocked || false)

const getTextMaxWidth = (layer, fallback = 640) =>
  Math.max(20, Number(layer?.params?.textMaxWidth || fallback))

const splitWordByWidth = (word, measureWidth, maxWidth) => {
  const chunks = []
  let current = ''
  for (const char of String(word || '')) {
    const next = `${current}${char}`
    if (measureWidth(next) <= maxWidth || current.length === 0) {
      current = next
    } else {
      chunks.push(current)
      current = char
    }
  }
  if (current) chunks.push(current)
  return chunks.length ? chunks : ['']
}

const wrapTextLinesByWidth = (rawLines, maxWidth, measureWidth) => {
  if (!Array.isArray(rawLines) || !rawLines.length) return ['']

  return rawLines.flatMap((rawLine) => {
    const line = String(rawLine || '')
    if (!line) return ['']

    const words = line.split(/\s+/).filter(Boolean)
    if (!words.length) return ['']

    const wrapped = []
    let current = ''

    words.forEach((word) => {
      const parts = splitWordByWidth(word, measureWidth, maxWidth)
      parts.forEach((part, partIndex) => {
        const candidate = current ? `${current} ${part}` : part
        if (measureWidth(candidate) <= maxWidth) {
          current = candidate
          return
        }

        if (current) {
          wrapped.push(current)
          current = part
          return
        }

        if (partIndex < parts.length - 1) {
          wrapped.push(part)
          current = ''
        } else {
          current = part
        }
      })
    })

    if (current) wrapped.push(current)
    return wrapped.length ? wrapped : ['']
  })
}

const getTextLayoutMetrics = (layer, overrideText) => {
  const text = String(
    typeof overrideText === 'string' ? overrideText : layer?.params?.text || ''
  )
  const rawLines = text.split('\n')
  const fontSize = Number(layer?.params?.fontSize || 32)
  const lineHeight = Number(layer?.params?.lineHeight || 1.2)
  const textWidthLocked = isTextWidthLocked(layer)
  const textMaxWidth = getTextMaxWidth(layer)

  const canvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : null
  const ctx = canvas ? canvas.getContext('2d') : null
  if (ctx) {
    const fontWeight = layer?.params?.fontWeight || 'normal'
    const fontStyle = layer?.params?.fontStyle || 'normal'
    const fontFamily = layer?.params?.fontFamily || 'Arial'
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
  }
  const measureWidth = (value) => {
    const textValue = String(value || '')
    if (ctx) return ctx.measureText(textValue).width
    return textValue.length * fontSize * 0.62
  }

  const lines = textWidthLocked
    ? wrapTextLinesByWidth(rawLines, textMaxWidth, measureWidth)
    : rawLines

  const measuredMaxWidth = lines.reduce(
    (acc, line) => Math.max(acc, measureWidth(line)),
    0
  )
  const width = textWidthLocked
    ? Math.max(10, textMaxWidth)
    : Math.max(10, measuredMaxWidth)
  const height = Math.max(fontSize, lines.length * fontSize * lineHeight)
  const x = Number(layer?.params?.x || 0)
  const y = Number(layer?.params?.y || 0)
  const textAnchor = layer?.params?.textAnchor || 'start'
  const textVerticalAlign = getTextVerticalAlign(layer)

  const left =
    textAnchor === 'middle'
      ? x - width / 2
      : textAnchor === 'end'
        ? x - width
        : x

  const top =
    textVerticalAlign === 'start'
      ? y
      : textVerticalAlign === 'middle'
        ? y - height / 2
        : textVerticalAlign === 'end'
          ? y - height
          : y - fontSize

  const startY =
    textVerticalAlign === 'start'
      ? y + fontSize
      : textVerticalAlign === 'middle'
        ? y - height / 2 + fontSize
        : textVerticalAlign === 'end'
          ? y - height + fontSize
          : y

  return {
    text,
    lines,
    fontSize,
    lineHeight,
    width,
    height,
    textWidthLocked,
    textMaxWidth,
    x,
    y,
    left,
    top,
    startY,
    textAnchor,
    textVerticalAlign,
  }
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

  if (type === 'line') {
    return {
      key,
      type,
      show: true,
      name: 'Линия',
      params: {
        x: 160,
        y: 240,
        x2: 420,
        y2: 240,
        stroke: '#FFFFFF',
        strokeWidth: 6,
        opacity: 100,
      },
    }
  }

  if (type === 'image') {
    return {
      key,
      type,
      show: true,
      name: 'Картинка',
      params: {
        x: 180,
        y: 180,
        width: 320,
        height: 220,
        src: '',
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
      fontStyle: 'normal',
      fontFamily: 'Arial',
      textAnchor: 'middle',
      textVerticalAlign: 'legacy',
      textWidthLocked: false,
      textMaxWidth: 640,
      lineHeight: 1.2,
      rotate: 0,
      opacity: 100,
    },
  }
}

const to2Digits = (value) => String(value).padStart(2, '0')

const buildEventBoundDateText = (event) => {
  if (!event?.dateStart) return ''
  const [dayStart, monthStart, weekStart] = dateToDateTimeStr(
    event?.dateStart,
    true,
    true,
    false,
    true,
    true
  )
  const [dayEnd, monthEnd] = dateToDateTimeStr(
    event?.dateEnd,
    true,
    true,
    false,
    true,
    true
  )

  const sameDay = dayStart === dayEnd && monthStart === monthEnd
  if (sameDay) {
    return `${dayStart} ${monthStart}${weekStart ? ` (${weekStart})` : ''}`
  }

  return `${dayStart} ${monthStart} - ${dayEnd} ${monthEnd}`
}

const buildEventBoundDateOnlyText = (event) => {
  if (!event?.dateStart) return ''
  const [dayStart, monthStart] = dateToDateTimeStr(
    event?.dateStart,
    true,
    true,
    false,
    true,
    true
  )
  const [dayEnd, monthEnd] = dateToDateTimeStr(
    event?.dateEnd,
    true,
    true,
    false,
    true,
    true
  )
  const sameDay = dayStart === dayEnd && monthStart === monthEnd
  if (sameDay) return `${dayStart} ${monthStart}`
  return `${dayStart} ${monthStart} - ${dayEnd} ${monthEnd}`
}

const buildEventBoundTimeRangeText = (event) => {
  const start = event?.dateStart ? new Date(event.dateStart) : null
  const end = event?.dateEnd ? new Date(event.dateEnd) : null
  if (!start || Number.isNaN(start.getTime())) return ''
  if (!end || Number.isNaN(end.getTime())) {
    return `${to2Digits(start.getHours())}:${to2Digits(start.getMinutes())}`
  }
  return `${to2Digits(start.getHours())}:${to2Digits(start.getMinutes())} - ${to2Digits(end.getHours())}:${to2Digits(end.getMinutes())}`
}

const getEventBindingSource = (binding) => {
  if (binding?.source) return binding.source
  if (binding?.field === 'title') return 'title'
  if (binding?.field === 'date') return 'date_weekday'
  return 'title'
}

const getEventBindingCaseMode = (binding) => {
  const mode = String(binding?.caseMode || 'normal')
  return mode === 'upper' || mode === 'lower' ? mode : 'normal'
}

const applyEventCaseMode = (text, caseMode) => {
  const value = String(text || '')
  if (caseMode === 'upper') return value.toUpperCase()
  if (caseMode === 'lower') return value.toLowerCase()
  return value
}

const resolveEventBoundFieldText = (source, event, caseMode = 'normal') => {
  const applyCase = (value) => applyEventCaseMode(value, caseMode)
  if (!event) {
    return applyCase(eventBindingSourcePlaceholders[source] || '[значение]')
  }
  if (source === 'title') return applyCase(String(event?.title || ''))
  if (source === 'date_weekday')
    return applyCase(buildEventBoundDateText(event))
  if (source === 'date_only')
    return applyCase(buildEventBoundDateOnlyText(event))
  if (source === 'time_range')
    return applyCase(buildEventBoundTimeRangeText(event))
  return applyCase(eventBindingSourcePlaceholders[source] || '')
}

const estimateTextBounds = (layer) => {
  const { left, top, width, height } = getTextLayoutMetrics(layer)

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

  if (layer.type === 'line') {
    const x1 = Number(layer.params?.x || 0)
    const y1 = Number(layer.params?.y || 0)
    const x2 = Number(layer.params?.x2 || 0)
    const y2 = Number(layer.params?.y2 || 0)
    return {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    }
  }

  if (layer.type === 'image') {
    return {
      x: Number(layer.params?.x || 0),
      y: Number(layer.params?.y || 0),
      width: Number(layer.params?.width || 0),
      height: Number(layer.params?.height || 0),
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

  if (layer.type === 'line') {
    return {
      x: Number(layer.params?.x || 0),
      y: Number(layer.params?.y || 0),
    }
  }

  return {
    x: Number(layer.params?.x || 0),
    y: Number(layer.params?.y || 0),
  }
}

const getLayerBoundsByTypeAndCoords = (layer, layerType, x, y) => {
  if (!layer) return null

  if (layerType === 'rect') {
    return {
      x,
      y,
      width: Number(layer.params?.width || 0),
      height: Number(layer.params?.height || 0),
    }
  }

  if (layerType === 'circle') {
    const r = Number(layer.params?.r || 0)
    return {
      x: x - r,
      y: y - r,
      width: r * 2,
      height: r * 2,
    }
  }

  if (layerType === 'line') {
    const x2 = Number(layer.params?.x2 || 0)
    const y2 = Number(layer.params?.y2 || 0)
    return {
      x: Math.min(x, x2),
      y: Math.min(y, y2),
      width: Math.abs(x2 - x),
      height: Math.abs(y2 - y),
    }
  }

  if (layerType === 'image') {
    return {
      x,
      y,
      width: Number(layer.params?.width || 0),
      height: Number(layer.params?.height || 0),
    }
  }

  const virtualLayer = {
    ...layer,
    params: {
      ...(layer?.params || {}),
      x,
      y,
    },
  }
  const { left, top, width, height } = getTextLayoutMetrics(virtualLayer)
  const safeLeft = typeof left === 'number' ? left : x
  const safeTop = typeof top === 'number' ? top : y

  return {
    x: safeLeft,
    y: safeTop,
    width,
    height,
  }
}

const getLayerCenterByTypeAndCoords = (layer, layerType, x, y) => {
  const bounds = getLayerBoundsByTypeAndCoords(layer, layerType, x, y)
  if (!bounds) return { x: 0, y: 0 }

  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
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
    {/* {index > 0 && <Divider thin />} */}
    <div className="flex items-center px-1 py-0.5 gap-x-2">
      <button
        type="button"
        className="flex items-center flex-1 gap-1 italic font-bold text-left text-gray-700 cursor-pointer"
        onClick={onSelect}
      >
        <span>{item.name || layerTypeTitles[item.type]}</span>
        {item?.binding?.kind === 'event' && (
          <span
            className={`rounded-full px-1.5 py-0 text-[10px] not-italic font-semibold ${
              item.binding?.isManual
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            {item.binding?.isManual ? 'изм.' : 'event'}
          </span>
        )}
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

const TextLayerEditor = ({
  item,
  setLayerState,
  onChangeEventBinding,
  onResetEventBindingText,
  onChangeEventBindingSource,
  onChangeEventBindingCaseMode,
  boundEvent,
}) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    {item?.binding?.kind === 'event' && (
      <InputWrapper label="Связь с мероприятием" fitWidth>
        <div className="flex flex-col w-full gap-1">
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                item.binding?.isManual
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-sky-100 text-sky-700'
              }`}
            >
              {`Поле: ${
                eventBindingSourceTitles[getEventBindingSource(item.binding)] ||
                'Связанное'
              }`}
              {item.binding?.isManual ? ' (изменено)' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex-1">
              {boundEvent ? (
                <EventItem
                  item={boundEvent}
                  bordered
                  classNameHeight="h-[40px]"
                  className="w-full"
                />
              ) : (
                <div className="h-[40px] w-full border border-gray-300 rounded-sm px-2 flex items-center text-xs text-gray-500">
                  Мероприятие не выбрано
                </div>
              )}
            </div>
            <button
              type="button"
              className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110 text-primary"
              onClick={onChangeEventBinding}
              title="Сменить мероприятие"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <ComboBox
              label="Формат"
              className="w-[200px]"
              items={eventBindingSourceItems}
              value={getEventBindingSource(item.binding)}
              onChange={onChangeEventBindingSource}
            />
            <ComboBox
              label="Написание"
              className="w-[220px]"
              items={eventBindingCaseItems}
              value={getEventBindingCaseMode(item.binding)}
              onChange={onChangeEventBindingCaseMode}
            />
            {item.binding?.isManual && (
              <Button
                name="Сбросить текст"
                thin
                onClick={onResetEventBindingText}
              />
            )}
          </div>
        </div>
      </InputWrapper>
    )}
    <Textarea
      label="Текст"
      value={item.params?.text || ''}
      onChange={(value) => setLayerState({ params: { text: value } })}
      rows={4}
      inputClassName="w-full max-w-full resize-y"
      wrapperClassName="w-full"
    />
    <ComboBox
      label="Шрифт"
      className="w-[170px]"
      items={fontFamilyItems}
      value={item.params?.fontFamily || 'Arial'}
      onChange={(value) => setLayerState({ params: { fontFamily: value } })}
    />
    <div className="flex flex-wrap gap-x-1">
      {false && (
        <>
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
        </>
      )}
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
        label="Вертикаль"
        className="w-[160px]"
        items={textVerticalAlignItems}
        value={getTextVerticalAlign(item)}
        onChange={(value) =>
          setLayerState({ params: { textVerticalAlign: value } })
        }
      />
      <CheckBox
        checked={Boolean(item.params?.textWidthLocked)}
        onClick={() =>
          setLayerState({
            params: { textWidthLocked: !Boolean(item.params?.textWidthLocked) },
          })
        }
        label="Фикс. ширина текста"
        noMargin
        wrapperClassName="h-7 pr-2"
      />
      {false && (
        <InputNumber
          label="Ширина текста"
          className="w-[150px]"
          inputClassName="w-[70px]"
          value={Math.max(20, Number(item.params?.textMaxWidth || 640))}
          onChange={(value) =>
            setLayerState({ params: { textMaxWidth: Math.max(20, value) } })
          }
          min={20}
          max={5000}
        />
      )}
      <ComboBox
        label="Начертание"
        className="w-[128px]"
        items={fontVariantItems}
        value={
          item.params?.fontWeight === 'bold' &&
          item.params?.fontStyle === 'italic'
            ? 'bold_italic'
            : item.params?.fontStyle === 'italic'
              ? 'italic'
              : item.params?.fontWeight === 'bold'
                ? 'bold'
                : 'normal'
        }
        onChange={(value) =>
          setLayerState({
            params:
              value === 'bold_italic'
                ? { fontWeight: 'bold', fontStyle: 'italic' }
                : value === 'italic'
                  ? { fontWeight: 'normal', fontStyle: 'italic' }
                  : value === 'bold'
                    ? { fontWeight: 'bold', fontStyle: 'normal' }
                    : { fontWeight: 'normal', fontStyle: 'normal' },
          })
        }
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
      {false && (
        <>
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
        </>
      )}
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
      {false && (
        <>
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
        </>
      )}
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

const LineLayerEditor = ({ item, setLayerState }) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    <div className="flex flex-wrap gap-x-1">
      <InputNumber
        label="Поворот"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={(() => {
          const x = Number(item.params?.x || 0)
          const y = Number(item.params?.y || 0)
          const x2 = Number(item.params?.x2 || 0)
          const y2 = Number(item.params?.y2 || 0)
          return Math.round((Math.atan2(y2 - y, x2 - x) * 180) / Math.PI)
        })()}
        onChange={(value) => {
          const x = Number(item.params?.x || 0)
          const y = Number(item.params?.y || 0)
          const x2 = Number(item.params?.x2 || 0)
          const y2 = Number(item.params?.y2 || 0)
          const length = Math.max(
            1,
            Math.hypot(x2 - x, y2 - y) || Number(item.params?.length || 260)
          )
          const angleRad = (Number(value || 0) * Math.PI) / 180
          setLayerState({
            params: {
              x2: Number((x + Math.cos(angleRad) * length).toFixed(2)),
              y2: Number((y + Math.sin(angleRad) * length).toFixed(2)),
            },
          })
        }}
        min={-360}
        max={360}
      />
      <InputNumber
        label="Толщина"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.strokeWidth ?? 6}
        onChange={(value) => setLayerState({ params: { strokeWidth: value } })}
        min={1}
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
        label="Цвет линии"
        value={item.params?.stroke || '#FFFFFF'}
        onChange={(value) => setLayerState({ params: { stroke: value } })}
      />
    </div>
  </FormWrapper>
)

const ImageLayerEditor = ({ item, setLayerState, onSelectImage }) => (
  <FormWrapper className="flex flex-col gap-y-1">
    <Input
      label="Название слоя"
      value={item.name || ''}
      onChange={(value) => setLayerState({ name: value })}
      smallMargin
    />
    <div className="flex flex-wrap gap-x-1">
      <InputNumber
        label="Ширина"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.width ?? 320}
        onChange={(value) => setLayerState({ params: { width: value } })}
        min={1}
        max={5000}
      />
      <InputNumber
        label="Высота"
        className="w-[120px]"
        inputClassName="w-[50px]"
        value={item.params?.height ?? 220}
        onChange={(value) => setLayerState({ params: { height: value } })}
        min={1}
        max={5000}
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
    </div>
    <div className="flex flex-wrap gap-1">
      <Button
        name="Выбрать картинку"
        icon={faPlus}
        thin
        onClick={onSelectImage}
      />
      {item.params?.src && (
        <Button
          name="Очистить"
          icon={faTrash}
          thin
          onClick={() => setLayerState({ params: { src: '' } })}
          classBgColor="bg-danger"
          classHoverBgColor="hover:bg-red-700"
        />
      )}
    </div>
  </FormWrapper>
)

const MobileMainToolButton = ({ icon, name, isActive, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center min-w-[72px] gap-y-1 px-2 py-1 text-[11px] font-bold transition-colors ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : isActive
          ? 'text-general'
          : 'text-gray-600'
    }`}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    <span>{name}</span>
  </button>
)

const ToolsImageConstructorContent = () => {
  const { imageFolder } = useAtomValue(locationPropsSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const events = useAtomValue(eventsAtom)

  const [templateName, setTemplateName] = useState('Изображение')
  const [size, setSize] = useState({ w: 1080, h: 1080 })
  const [data, setData] = useState([])
  const [selectedLayerKey, setSelectedLayerKey] = useState(null)
  const [backgroundProps, setBackgroundProps] = useState()
  const [rerenderState, setRerenderState] = useState(false)
  const [mobilePanel, setMobilePanel] = useState(null)
  const [isDraggingLayer, setIsDraggingLayer] = useState(false)
  const [mobilePanelRendered, setMobilePanelRendered] = useState(null)
  const [mobilePanelVisible, setMobilePanelVisible] = useState(false)
  const [resizeModeLayerKey, setResizeModeLayerKey] = useState(null)
  const [isResizingLayer, setIsResizingLayer] = useState(false)
  const [inlineTextEditLayerKey, setInlineTextEditLayerKey] = useState(null)
  const [inlineTextDraft, setInlineTextDraft] = useState('')
  const [undoDepth, setUndoDepth] = useState(0)
  const [redoDepth, setRedoDepth] = useState(0)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isWorkspacePanning, setIsWorkspacePanning] = useState(false)
  const [dragGuides, setDragGuides] = useState({
    vertical: [],
    horizontal: [],
    corner: null,
  })

  const svgRef = useRef(null)
  const canvasWrapperRef = useRef(null)
  const workspaceRef = useRef(null)
  const inlineTextInputRef = useRef(null)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)
  const pinchZoomRef = useRef(null)
  const workspacePanRef = useRef(null)
  const canvasZoomRef = useRef(1)
  const canvasOffsetRef = useRef({ x: 0, y: 0 })
  const lastTextTapRef = useRef({ layerKey: null, at: 0 })
  const mobilePanelOpenTimerRef = useRef(null)
  const mobilePanelCloseTimerRef = useRef(null)
  const hasLoadedFromStorageRef = useRef(false)
  const historyRef = useRef([])
  const redoRef = useRef([])
  const restoreFromHistoryRef = useRef(false)
  const lastSnapshotRef = useRef(null)
  const isTransformingRef = useRef(false)
  const pendingTransformSnapshotRef = useRef(null)
  const skipNextStorageWriteRef = useRef(false)

  const selectedLayer = useMemo(
    () => data.find((item) => item.key === selectedLayerKey) || null,
    [data, selectedLayerKey]
  )
  const layersForPanel = useMemo(
    () => data.map((item, dataIndex) => ({ item, dataIndex })).reverse(),
    [data]
  )
  const inlineTextEditLayer = useMemo(
    () =>
      inlineTextEditLayerKey
        ? data.find((item) => item.key === inlineTextEditLayerKey) || null
        : null,
    [data, inlineTextEditLayerKey]
  )
  const canUndo = undoDepth > 0
  const canRedo = redoDepth > 0
  const hasEventBoundLayers = useMemo(
    () => data.some((item) => item?.binding?.kind === 'event'),
    [data]
  )

  const rerender = () => setRerenderState((state) => !state)

  useEffect(() => {
    canvasZoomRef.current = canvasZoom
  }, [canvasZoom])

  useEffect(() => {
    canvasOffsetRef.current = canvasOffset
  }, [canvasOffset])

  const updateLayer = useCallback((key, patch, options = {}) => {
    setData((state) =>
      state.map((item) => {
        if (item.key !== key) return item
        const nextItem = {
          ...item,
          ...patch,
          params: {
            ...item.params,
            ...(patch.params || {}),
          },
        }

        if (
          options.markEventTextManual &&
          item?.binding?.kind === 'event' &&
          patch?.params &&
          Object.prototype.hasOwnProperty.call(patch.params, 'text')
        ) {
          nextItem.binding = {
            ...item.binding,
            isManual: true,
          }
        }

        return nextItem
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

  const clearSelection = useCallback(() => {
    setSelectedLayerKey(null)
    setResizeModeLayerKey(null)
    setDragGuides({ vertical: [], horizontal: [], corner: null })
  }, [])

  const handleWorkspacePointerDown = useCallback(
    (event) => {
      const isLayerTarget = event.target?.closest?.('[data-layer-node="true"]')
      const isInlineEditor = event.target?.closest?.(
        '[data-inline-text-editor="true"]'
      )
      const isLayerToolbar = event.target?.closest?.(
        '[data-layer-toolbar="true"]'
      )
      if (!isLayerTarget && !isInlineEditor && !isLayerToolbar) {
        clearSelection()
        const workspace = workspaceRef.current
        if (workspace && (event.button === undefined || event.button === 0)) {
          workspacePanRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startOffsetX: canvasOffsetRef.current.x,
            startOffsetY: canvasOffsetRef.current.y,
          }
          setIsWorkspacePanning(true)
          if (typeof workspace.setPointerCapture === 'function') {
            try {
              workspace.setPointerCapture(event.pointerId)
            } catch {
              // ignore setPointerCapture errors
            }
          }
        }
      }
    },
    [clearSelection]
  )

  const handleWorkspacePointerMove = useCallback((event) => {
    const pan = workspacePanRef.current
    const workspace = workspaceRef.current
    if (!pan || !workspace) return
    if (pan.pointerId !== event.pointerId) return

    event.preventDefault()
    const deltaX = event.clientX - pan.startX
    const deltaY = event.clientY - pan.startY
    setCanvasOffset({
      x: pan.startOffsetX + deltaX,
      y: pan.startOffsetY + deltaY,
    })
  }, [])

  const finishWorkspacePan = useCallback((event) => {
    const pan = workspacePanRef.current
    const workspace = workspaceRef.current
    if (!pan || !workspace) return
    if (event && pan.pointerId !== event.pointerId) return

    workspacePanRef.current = null
    setIsWorkspacePanning(false)
    if (
      event &&
      typeof workspace.releasePointerCapture === 'function' &&
      workspace.hasPointerCapture?.(event.pointerId)
    ) {
      try {
        workspace.releasePointerCapture(event.pointerId)
      } catch {
        // ignore releasePointerCapture errors
      }
    }
  }, [])

  const handleWorkspaceWheel = useCallback((event) => {
    const target = event.target
    if (
      target &&
      typeof target.closest === 'function' &&
      target.closest('[data-mobile-panel="true"]')
    ) {
      return
    }
    event.preventDefault()
    const canvasWrapper = canvasWrapperRef.current
    if (!canvasWrapper) return

    const prevRect = canvasWrapper.getBoundingClientRect()
    const prevZoom = canvasZoomRef.current
    const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92
    const nextZoom = clampZoom(prevZoom * zoomFactor)
    if (Math.abs(nextZoom - prevZoom) < 0.0001) return

    const ratioX = (event.clientX - prevRect.left) / Math.max(1, prevRect.width)
    const ratioY = (event.clientY - prevRect.top) / Math.max(1, prevRect.height)

    const zoomRatio = nextZoom / Math.max(0.0001, prevZoom)
    const nextWidth = prevRect.width * zoomRatio
    const nextHeight = prevRect.height * zoomRatio
    const prevCenterX = prevRect.left + prevRect.width / 2
    const prevCenterY = prevRect.top + prevRect.height / 2
    const baseCenterX = prevCenterX - canvasOffsetRef.current.x
    const baseCenterY = prevCenterY - canvasOffsetRef.current.y
    const desiredCenterX = event.clientX - ratioX * nextWidth + nextWidth / 2
    const desiredCenterY = event.clientY - ratioY * nextHeight + nextHeight / 2

    setCanvasOffset({
      x: desiredCenterX - baseCenterX,
      y: desiredCenterY - baseCenterY,
    })
    canvasZoomRef.current = nextZoom
    setCanvasZoom(nextZoom)
  }, [])

  useEffect(() => {
    const workspace = workspaceRef.current
    if (!workspace) return

    const onWheel = (event) => {
      handleWorkspaceWheel(event)
    }

    workspace.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      workspace.removeEventListener('wheel', onWheel)
    }
  }, [handleWorkspaceWheel])

  useEffect(() => {
    const onPointerMove = (event) => {
      handleWorkspacePointerMove(event)
    }
    const onPointerUp = (event) => {
      finishWorkspacePan(event)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [finishWorkspacePan, handleWorkspacePointerMove])

  const addItem = useCallback((type) => {
    const newLayer = createLayerByType(type)
    setData((state) => [...state, newLayer])
    setSelectedLayerKey(newLayer.key)
  }, [])

  const applyEventToBoundGroup = useCallback(
    (groupId, eventId) => {
      if (!groupId || !eventId) return
      const event = events.find(({ _id }) => String(_id) === String(eventId))
      if (!event) return

      setData((state) =>
        state.map((layer) => {
          if (layer?.binding?.kind !== 'event') return layer
          if (String(layer.binding.groupId || '') !== String(groupId)) {
            return layer
          }

          const source = getEventBindingSource(layer.binding)
          const caseMode = getEventBindingCaseMode(layer.binding)
          return {
            ...layer,
            params: {
              ...layer.params,
              text: resolveEventBoundFieldText(source, event, caseMode),
            },
            binding: {
              ...layer.binding,
              source,
              caseMode,
              eventId: String(eventId),
              isManual: false,
            },
          }
        })
      )
    },
    [events]
  )

  const openEventPickerForBoundLayer = useCallback(
    (layer) => {
      const groupId = layer?.binding?.groupId
      if (!groupId) return
      const selectedEventId = layer?.binding?.eventId
      const selectedIds = selectedEventId ? [String(selectedEventId)] : []

      modalsFunc.selectEvents(
        selectedIds,
        {},
        (selected) => {
          const nextEventId = selected?.[0]
          if (!nextEventId) return
          applyEventToBoundGroup(groupId, nextEventId)
        },
        null,
        null,
        1,
        false
      )
    },
    [applyEventToBoundGroup, modalsFunc]
  )

  const restoreBoundLayerTextFromEvent = useCallback(
    (layer) => {
      const binding = layer?.binding
      if (binding?.kind !== 'event') return
      const event = events.find(
        ({ _id }) => String(_id) === String(binding.eventId)
      )
      const source = getEventBindingSource(binding)
      const caseMode = getEventBindingCaseMode(binding)
      const nextText = resolveEventBoundFieldText(source, event, caseMode)
      updateLayer(layer.key, {
        params: { text: nextText },
        binding: {
          ...binding,
          source,
          caseMode,
          isManual: false,
        },
      })
    },
    [events, updateLayer]
  )

  const setEventBindingSourceForLayer = useCallback(
    (layer, source) => {
      if (layer?.binding?.kind !== 'event') return
      const event = events.find(
        ({ _id }) => String(_id) === String(layer.binding.eventId)
      )
      const caseMode = getEventBindingCaseMode(layer.binding)
      updateLayer(layer.key, {
        params: {
          text: resolveEventBoundFieldText(source, event, caseMode),
        },
        binding: {
          ...layer.binding,
          source,
          caseMode,
          isManual: false,
        },
      })
    },
    [events, updateLayer]
  )

  const setEventBindingCaseModeForLayer = useCallback(
    (layer, caseMode) => {
      if (layer?.binding?.kind !== 'event') return
      const normalizedCaseMode =
        caseMode === 'upper' || caseMode === 'lower' ? caseMode : 'normal'
      const source = getEventBindingSource(layer.binding)
      const event = events.find(
        ({ _id }) => String(_id) === String(layer.binding.eventId)
      )
      updateLayer(layer.key, {
        params: {
          text: resolveEventBoundFieldText(source, event, normalizedCaseMode),
        },
        binding: {
          ...layer.binding,
          source,
          caseMode: normalizedCaseMode,
          isManual: false,
        },
      })
    },
    [events, updateLayer]
  )

  const addEventGroup = useCallback(() => {
    if (hasEventBoundLayers) {
      modalsFunc.error({
        title: 'Мероприятие уже добавлено',
        text: 'В макете уже есть связанная группа мероприятия. Можно добавить только одну группу.',
      })
      return
    }

    modalsFunc.selectEvents(
      [],
      {},
      (selected) => {
        const eventId = selected?.[0]
        if (!eventId) return
        const event = events.find(({ _id }) => String(_id) === String(eventId))
        if (!event) return

        const groupId = uid(18)
        const titleLayer = createLayerByType('text')
        titleLayer.name = 'Мероприятие: заголовок'
        titleLayer.params = {
          ...titleLayer.params,
          x: 540,
          y: 470,
          fontSize: 64,
          textAnchor: 'middle',
          text: resolveEventBoundFieldText('title', event),
        }
        titleLayer.binding = {
          kind: 'event',
          groupId,
          field: 'title',
          source: 'title',
          caseMode: 'normal',
          eventId: String(eventId),
          isManual: false,
        }

        const dateLayer = createLayerByType('text')
        dateLayer.name = 'Мероприятие: дата'
        dateLayer.params = {
          ...dateLayer.params,
          x: 540,
          y: 560,
          fontSize: 42,
          textAnchor: 'middle',
          text: resolveEventBoundFieldText('date_weekday', event),
        }
        dateLayer.binding = {
          kind: 'event',
          groupId,
          field: 'date',
          source: 'date_weekday',
          caseMode: 'normal',
          eventId: String(eventId),
          isManual: false,
        }

        setData((state) => [...state, titleLayer, dateLayer])
        setSelectedLayerKey(titleLayer.key)
        setMobilePanel(null)
      },
      null,
      null,
      1,
      false
    )
  }, [events, hasEventBoundLayers, modalsFunc])

  const openSelectImageForLayer = useCallback(
    (layerKey) => {
      modalsFunc.selectImage(
        'templates',
        undefined,
        (newImage) => {
          if (!newImage) {
            updateLayer(layerKey, { params: { src: '' } })
            return
          }
          const normalizedImageUrl = normalizeUploadsUrl(newImage)

          const targetLayer = data.find((item) => item.key === layerKey)
          const baseWidth = Math.max(
            1,
            Number(targetLayer?.params?.width || 320)
          )
          const baseHeight = Math.max(
            1,
            Number(targetLayer?.params?.height || 220)
          )
          const boxAspect = baseWidth / baseHeight

          const img = new Image()
          img.onload = () => {
            const naturalWidth = Math.max(1, Number(img.naturalWidth || 1))
            const naturalHeight = Math.max(1, Number(img.naturalHeight || 1))
            const imgAspect = naturalWidth / naturalHeight

            let nextWidth = baseWidth
            let nextHeight = baseHeight
            if (imgAspect > boxAspect) {
              nextHeight = Number((baseWidth / imgAspect).toFixed(2))
            } else {
              nextWidth = Number((baseHeight * imgAspect).toFixed(2))
            }

            updateLayer(layerKey, {
              params: {
                src: normalizedImageUrl,
                width: Math.max(1, nextWidth),
                height: Math.max(1, nextHeight),
              },
            })
          }
          img.onerror = () => {
            updateLayer(layerKey, { params: { src: normalizedImageUrl } })
          }
          img.src = normalizedImageUrl
        },
        {
          allowFolders: true,
          disableUploadInRoot: true,
          hiddenFolderNames: ['preview'],
        }
      )
    },
    [data, modalsFunc, updateLayer]
  )

  const addImageLayer = useCallback(() => {
    const newLayer = createLayerByType('image')
    setData((state) => [...state, newLayer])
    setSelectedLayerKey(newLayer.key)
    openSelectImageForLayer(newLayer.key)
  }, [openSelectImageForLayer])

  const addItemFromMobile = useCallback(
    (type) => {
      if (type === 'image') addImageLayer()
      else if (type === 'event') addEventGroup()
      else addItem(type)
      setMobilePanel(null)
    },
    [addEventGroup, addImageLayer, addItem]
  )

  const deleteLayer = useCallback((key) => {
    setData((state) => state.filter((item) => item.key !== key))
    setSelectedLayerKey((state) => (state === key ? null : state))
  }, [])

  const toggleLayerVisibility = useCallback(
    (key) => {
      const layer = data.find((item) => item.key === key)
      if (!layer) return
      const nextShow = !layer.show
      updateLayer(key, { show: nextShow })
    },
    [data, updateLayer]
  )

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
            : source.type === 'line'
              ? {
                  x: Number(source.params?.x || 0) + 18,
                  y: Number(source.params?.y || 0) + 18,
                  x2: Number(source.params?.x2 || 0) + 18,
                  y2: Number(source.params?.y2 || 0) + 18,
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

  const bringLayerForward = useCallback((dataIndex) => {
    setData((state) => {
      if (dataIndex >= state.length - 1) return state
      return arrayMove(state, dataIndex, dataIndex + 1)
    })
  }, [])

  const sendLayerBackward = useCallback((dataIndex) => {
    setData((state) => {
      if (dataIndex <= 0) return state
      return arrayMove(state, dataIndex, dataIndex - 1)
    })
  }, [])

  const getSvgPoint = useCallback((event) => {
    const svg = svgRef.current
    if (!svg) return null
    const ctm = svg.getScreenCTM()
    if (!ctm) return null

    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const transformedPoint = point.matrixTransform(ctm.inverse())

    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    }
  }, [])

  const startDragLayer = useCallback(
    (event, layer) => {
      if (!layer?.show) return
      if (event.button !== undefined && event.button !== 0) return
      if (inlineTextEditLayerKey) return
      if (
        resizeModeLayerKey === layer.key &&
        RESIZABLE_LAYER_TYPES.has(layer.type)
      ) {
        return
      }

      const point = getSvgPoint(event)
      if (!point) return

      // First click only selects the layer. Drag starts only for already selected layer.
      if (selectedLayerKey !== layer.key) {
        setSelectedLayerKey(layer.key)
        return
      }

      event.preventDefault()
      isTransformingRef.current = true
      pendingTransformSnapshotRef.current = null
      setSelectedLayerKey(layer.key)
      setIsDraggingLayer(false)
      setDragGuides({ vertical: [], horizontal: [], corner: null })
      const coords = getLayerXY(layer)

      dragRef.current = {
        layerKey: layer.key,
        type: layer.type,
        startPointerX: point.x,
        startPointerY: point.y,
        startLayerX: coords.x,
        startLayerY: coords.y,
        startLayerX2: Number(layer.params?.x2 || 0),
        startLayerY2: Number(layer.params?.y2 || 0),
      }
    },
    [getSvgPoint, inlineTextEditLayerKey, resizeModeLayerKey, selectedLayerKey]
  )

  const startResizeLayer = useCallback(
    (event, layer, handle) => {
      if (!layer?.show || !RESIZABLE_LAYER_TYPES.has(layer.type)) return
      if (event.button !== undefined && event.button !== 0) return

      const point = getSvgPoint(event)
      if (!point) return

      event.preventDefault()
      event.stopPropagation()
      isTransformingRef.current = true
      pendingTransformSnapshotRef.current = null
      setSelectedLayerKey(layer.key)
      setIsResizingLayer(false)
      setDragGuides({ vertical: [], horizontal: [], corner: null })

      if (layer.type === 'line') {
        resizeRef.current = {
          layerKey: layer.key,
          type: layer.type,
          handle,
        }
        return
      }

      if (layer.type === 'text') {
        const bounds = getLayerBounds(layer)
        if (!bounds) return
        const fixedX = handle === 'w' ? bounds.x + bounds.width : bounds.x
        resizeRef.current = {
          layerKey: layer.key,
          type: layer.type,
          handle,
          fixedX,
          textAnchor: layer.params?.textAnchor || 'start',
        }
        return
      }

      const bounds = getLayerBounds(layer)
      if (!bounds) return
      const left = bounds.x
      const right = bounds.x + bounds.width
      const top = bounds.y
      const bottom = bounds.y + bounds.height

      const anchors = {
        nw: { x: right, y: bottom },
        ne: { x: left, y: bottom },
        se: { x: left, y: top },
        sw: { x: right, y: top },
      }

      const fixed = anchors[handle]
      if (!fixed) return

      resizeRef.current = {
        layerKey: layer.key,
        type: layer.type,
        handle,
        fixedX: fixed.x,
        fixedY: fixed.y,
      }
    },
    [getSvgPoint]
  )

  useEffect(() => {
    const onPointerMove = (event) => {
      if (resizeRef.current) {
        const point = getSvgPoint(event)
        if (!point) return

        const resize = resizeRef.current
        setIsResizingLayer(true)
        setDragGuides({ vertical: [], horizontal: [], corner: null })

        if (resize.type === 'line') {
          if (resize.handle === 'start') {
            updateLayer(resize.layerKey, {
              params: {
                x: Number(point.x.toFixed(2)),
                y: Number(point.y.toFixed(2)),
              },
            })
          } else {
            updateLayer(resize.layerKey, {
              params: {
                x2: Number(point.x.toFixed(2)),
                y2: Number(point.y.toFixed(2)),
              },
            })
          }
          return
        }

        if (resize.type === 'text') {
          const minTextWidth = 20
          let nextWidth =
            resize.handle === 'w'
              ? resize.fixedX - point.x
              : point.x - resize.fixedX
          nextWidth = Math.max(minTextWidth, nextWidth)

          const left =
            resize.handle === 'w' ? resize.fixedX - nextWidth : resize.fixedX
          const nextX =
            resize.textAnchor === 'middle'
              ? left + nextWidth / 2
              : resize.textAnchor === 'end'
                ? left + nextWidth
                : left

          updateLayer(resize.layerKey, {
            params: {
              x: Number(nextX.toFixed(2)),
              textWidthLocked: true,
              textMaxWidth: Number(nextWidth.toFixed(2)),
            },
          })
          return
        }

        const nextLeft = Math.min(point.x, resize.fixedX)
        const nextTop = Math.min(point.y, resize.fixedY)
        const nextWidth = Math.max(1, Math.abs(point.x - resize.fixedX))
        const nextHeight = Math.max(1, Math.abs(point.y - resize.fixedY))

        if (resize.type === 'rect') {
          updateLayer(resize.layerKey, {
            params: {
              x: Number(nextLeft.toFixed(2)),
              y: Number(nextTop.toFixed(2)),
              width: Number(nextWidth.toFixed(2)),
              height: Number(nextHeight.toFixed(2)),
            },
          })
          return
        }

        if (resize.type === 'image') {
          updateLayer(resize.layerKey, {
            params: {
              x: Number(nextLeft.toFixed(2)),
              y: Number(nextTop.toFixed(2)),
              width: Number(nextWidth.toFixed(2)),
              height: Number(nextHeight.toFixed(2)),
            },
          })
          return
        }

        const diameter = Math.max(nextWidth, nextHeight)
        updateLayer(resize.layerKey, {
          params: {
            cx: Number(((point.x + resize.fixedX) / 2).toFixed(2)),
            cy: Number(((point.y + resize.fixedY) / 2).toFixed(2)),
            r: Number((Math.max(2, diameter) / 2).toFixed(2)),
          },
        })
        return
      }

      if (!dragRef.current) return
      setIsDraggingLayer(true)

      const point = getSvgPoint(event)
      if (!point) return

      const drag = dragRef.current
      let nextX = drag.startLayerX + (point.x - drag.startPointerX)
      let nextY = drag.startLayerY + (point.y - drag.startPointerY)

      const layer = data.find((item) => item.key === drag.layerKey)
      const bounds = getLayerBoundsByTypeAndCoords(
        layer,
        drag.type,
        nextX,
        nextY
      )
      if (!bounds) return
      const centerPoint = {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      }
      const canvasCenterX = size.w / 2
      const canvasCenterY = size.h / 2
      const rect = svgRef.current?.getBoundingClientRect()
      const snapThresholdX = rect?.width > 0 ? (5 * size.w) / rect.width : 5
      const snapThresholdY = rect?.height > 0 ? (5 * size.h) / rect.height : 5

      const otherVisibleBounds = data
        .filter((item) => item?.show && item.key !== drag.layerKey)
        .map((item) => getLayerBounds(item))
        .filter(Boolean)

      const verticalTargets = [0, size.w, canvasCenterX]
      const horizontalTargets = [0, size.h, canvasCenterY]

      otherVisibleBounds.forEach((itemBounds) => {
        verticalTargets.push(itemBounds.x, itemBounds.x + itemBounds.width)
        horizontalTargets.push(itemBounds.y, itemBounds.y + itemBounds.height)
      })

      const movingLeft = bounds.x
      const movingRight = bounds.x + bounds.width
      const movingTop = bounds.y
      const movingBottom = bounds.y + bounds.height

      let bestSnapX = null
      let bestGuideX = null
      verticalTargets.forEach((targetX) => {
        const deltaByLeft = targetX - movingLeft
        const deltaByRight = targetX - movingRight
        const absLeft = Math.abs(deltaByLeft)
        const absRight = Math.abs(deltaByRight)
        const delta = absLeft <= absRight ? deltaByLeft : deltaByRight
        const absDelta = Math.abs(delta)
        if (
          absDelta <= snapThresholdX &&
          (bestSnapX === null || absDelta < Math.abs(bestSnapX))
        ) {
          bestSnapX = delta
          bestGuideX = targetX
        }
      })

      let bestSnapY = null
      let bestGuideY = null
      horizontalTargets.forEach((targetY) => {
        const deltaByTop = targetY - movingTop
        const deltaByBottom = targetY - movingBottom
        const absTop = Math.abs(deltaByTop)
        const absBottom = Math.abs(deltaByBottom)
        const delta = absTop <= absBottom ? deltaByTop : deltaByBottom
        const absDelta = Math.abs(delta)
        if (
          absDelta <= snapThresholdY &&
          (bestSnapY === null || absDelta < Math.abs(bestSnapY))
        ) {
          bestSnapY = delta
          bestGuideY = targetY
        }
      })

      const centerSnapX = canvasCenterX - centerPoint.x
      if (
        Math.abs(centerSnapX) <= snapThresholdX &&
        (bestSnapX === null || Math.abs(centerSnapX) < Math.abs(bestSnapX))
      ) {
        bestSnapX = centerSnapX
        bestGuideX = canvasCenterX
      }

      const centerSnapY = canvasCenterY - centerPoint.y
      if (
        Math.abs(centerSnapY) <= snapThresholdY &&
        (bestSnapY === null || Math.abs(centerSnapY) < Math.abs(bestSnapY))
      ) {
        bestSnapY = centerSnapY
        bestGuideY = canvasCenterY
      }

      if (bestSnapX !== null) nextX += bestSnapX
      if (bestSnapY !== null) nextY += bestSnapY

      const isEdgeX =
        bestGuideX !== null &&
        (Math.abs(bestGuideX - 0) < 0.001 ||
          Math.abs(bestGuideX - size.w) < 0.001)
      const isEdgeY =
        bestGuideY !== null &&
        (Math.abs(bestGuideY - 0) < 0.001 ||
          Math.abs(bestGuideY - size.h) < 0.001)

      setDragGuides({
        vertical: bestGuideX === null ? [] : [bestGuideX],
        horizontal: bestGuideY === null ? [] : [bestGuideY],
        corner:
          isEdgeX && isEdgeY
            ? {
                x: bestGuideX,
                y: bestGuideY,
              }
            : null,
      })

      updateLayer(drag.layerKey, {
        params:
          drag.type === 'circle'
            ? {
                cx: Number(nextX.toFixed(2)),
                cy: Number(nextY.toFixed(2)),
              }
            : drag.type === 'line'
              ? {
                  x: Number(nextX.toFixed(2)),
                  y: Number(nextY.toFixed(2)),
                  x2: Number(
                    (
                      drag.startLayerX2 +
                      (point.x - drag.startPointerX)
                    ).toFixed(2)
                  ),
                  y2: Number(
                    (
                      drag.startLayerY2 +
                      (point.y - drag.startPointerY)
                    ).toFixed(2)
                  ),
                }
              : {
                  x: Number(nextX.toFixed(2)),
                  y: Number(nextY.toFixed(2)),
                },
      })
    }

    const onPointerUp = () => {
      const wasTransforming = isTransformingRef.current
      isTransformingRef.current = false
      dragRef.current = null
      resizeRef.current = null
      setIsDraggingLayer(false)
      setIsResizingLayer(false)
      setDragGuides({ vertical: [], horizontal: [], corner: null })

      if (wasTransforming && pendingTransformSnapshotRef.current) {
        commitSnapshotToHistory(pendingTransformSnapshotRef.current)
        pendingTransformSnapshotRef.current = null
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [data, getSvgPoint, size.h, size.w, updateLayer])

  useEffect(() => {
    if (!selectedLayer) {
      setResizeModeLayerKey(null)
      return
    }
    if (!RESIZABLE_LAYER_TYPES.has(selectedLayer.type)) {
      setResizeModeLayerKey(null)
      return
    }
    if (resizeModeLayerKey && resizeModeLayerKey !== selectedLayer.key) {
      setResizeModeLayerKey(null)
    }
  }, [resizeModeLayerKey, selectedLayer])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(IMAGE_CONSTRUCTOR_STORAGE_KEY)
      if (!raw) {
        hasLoadedFromStorageRef.current = true
        return
      }

      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        skipNextStorageWriteRef.current = true
        if (typeof parsed.templateName === 'string') {
          setTemplateName(parsed.templateName)
        }

        if (
          parsed.size &&
          typeof parsed.size.w === 'number' &&
          typeof parsed.size.h === 'number'
        ) {
          setSize({
            w: Math.max(1, parsed.size.w),
            h: Math.max(1, parsed.size.h),
          })
        }

        if (Array.isArray(parsed.data)) {
          setData(normalizeImageLayerSources(parsed.data))
        }

        if (
          parsed.selectedLayerKey === null ||
          typeof parsed.selectedLayerKey === 'string'
        ) {
          setSelectedLayerKey(parsed.selectedLayerKey)
        }

        if (
          parsed.backgroundProps &&
          typeof parsed.backgroundProps === 'object'
        ) {
          setBackgroundProps(parsed.backgroundProps)
        }
      }
    } catch {
      // Ignore corrupted localStorage payload and keep defaults.
    } finally {
      hasLoadedFromStorageRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return
    if (skipNextStorageWriteRef.current) {
      skipNextStorageWriteRef.current = false
      return
    }

    try {
      window.localStorage.setItem(
        IMAGE_CONSTRUCTOR_STORAGE_KEY,
        JSON.stringify({
          templateName,
          size,
          data,
          selectedLayerKey,
          backgroundProps,
        })
      )
    } catch {
      // Ignore localStorage quota/private mode errors.
    }
  }, [backgroundProps, data, selectedLayerKey, size, templateName])

  const currentConstructorSnapshot = useMemo(
    () => ({
      templateName,
      size,
      data,
      backgroundProps,
    }),
    [backgroundProps, data, size, templateName]
  )

  function commitSnapshotToHistory(serialized) {
    if (lastSnapshotRef.current === null) {
      lastSnapshotRef.current = serialized
      return
    }
    if (serialized === lastSnapshotRef.current) return

    historyRef.current.push(lastSnapshotRef.current)
    if (historyRef.current.length > 120) {
      historyRef.current = historyRef.current.slice(-120)
    }
    if (redoRef.current.length) {
      redoRef.current = []
      setRedoDepth(0)
    }
    lastSnapshotRef.current = serialized
    setUndoDepth(historyRef.current.length)
  }

  useEffect(() => {
    if (!hasLoadedFromStorageRef.current) return

    const serialized = JSON.stringify(currentConstructorSnapshot)

    if (restoreFromHistoryRef.current) {
      restoreFromHistoryRef.current = false
      lastSnapshotRef.current = serialized
      return
    }

    if (isTransformingRef.current) {
      pendingTransformSnapshotRef.current = serialized
      return
    }

    commitSnapshotToHistory(serialized)
  }, [currentConstructorSnapshot])

  const undoLastAction = useCallback(() => {
    if (!historyRef.current.length) return

    const currentSerialized =
      lastSnapshotRef.current || JSON.stringify(currentConstructorSnapshot)

    const prevSerialized = historyRef.current.pop()
    if (!prevSerialized) return

    redoRef.current.push(currentSerialized)
    if (redoRef.current.length > 120) {
      redoRef.current = redoRef.current.slice(-120)
    }

    let prevSnapshot
    try {
      prevSnapshot = JSON.parse(prevSerialized)
    } catch {
      setUndoDepth(historyRef.current.length)
      setRedoDepth(redoRef.current.length)
      return
    }

    restoreFromHistoryRef.current = true
    setTemplateName(prevSnapshot?.templateName || 'Изображение')
    setSize({
      w: Math.max(1, Number(prevSnapshot?.size?.w || 1080)),
      h: Math.max(1, Number(prevSnapshot?.size?.h || 1080)),
    })
    setData(normalizeImageLayerSources(prevSnapshot?.data))
    setSelectedLayerKey((currentSelectedKey) =>
      Array.isArray(prevSnapshot?.data) &&
      prevSnapshot.data.some((item) => item?.key === currentSelectedKey)
        ? currentSelectedKey
        : null
    )
    setBackgroundProps(prevSnapshot?.backgroundProps)
    setUndoDepth(historyRef.current.length)
    setRedoDepth(redoRef.current.length)
  }, [currentConstructorSnapshot])

  const redoLastAction = useCallback(() => {
    if (!redoRef.current.length) return

    const currentSerialized =
      lastSnapshotRef.current || JSON.stringify(currentConstructorSnapshot)

    const nextSerialized = redoRef.current.pop()
    if (!nextSerialized) return

    historyRef.current.push(currentSerialized)
    if (historyRef.current.length > 120) {
      historyRef.current = historyRef.current.slice(-120)
    }

    let nextSnapshot
    try {
      nextSnapshot = JSON.parse(nextSerialized)
    } catch {
      setUndoDepth(historyRef.current.length)
      setRedoDepth(redoRef.current.length)
      return
    }

    restoreFromHistoryRef.current = true
    setTemplateName(nextSnapshot?.templateName || 'Изображение')
    setSize({
      w: Math.max(1, Number(nextSnapshot?.size?.w || 1080)),
      h: Math.max(1, Number(nextSnapshot?.size?.h || 1080)),
    })
    setData(normalizeImageLayerSources(nextSnapshot?.data))
    setSelectedLayerKey((currentSelectedKey) =>
      Array.isArray(nextSnapshot?.data) &&
      nextSnapshot.data.some((item) => item?.key === currentSelectedKey)
        ? currentSelectedKey
        : null
    )
    setBackgroundProps(nextSnapshot?.backgroundProps)
    setUndoDepth(historyRef.current.length)
    setRedoDepth(redoRef.current.length)
  }, [currentConstructorSnapshot])

  useEffect(() => {
    const isTypingTarget = (target) => {
      const el = target
      if (!el || typeof el !== 'object') return false
      const tagName = String(el.tagName || '').toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select')
        return true
      if (el.isContentEditable) return true
      if (typeof el.closest === 'function') {
        return !!el.closest('[contenteditable="true"]')
      }
      return false
    }

    const onKeyDown = (event) => {
      const code = String(event.code || '')
      const key = String(event.key || '').toLowerCase()
      const mod = event.ctrlKey || event.metaKey
      if (!mod) return
      if (isTypingTarget(event.target)) return

      const isUndoKey = code === 'KeyZ' || key === 'z'
      const isRedoKey = code === 'KeyY' || key === 'y'

      if (isUndoKey && event.shiftKey) {
        if (!canRedo) return
        event.preventDefault()
        redoLastAction()
        return
      }

      if (isUndoKey) {
        if (!canUndo) return
        event.preventDefault()
        undoLastAction()
        return
      }

      if (isRedoKey) {
        if (!canRedo) return
        event.preventDefault()
        redoLastAction()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canRedo, canUndo, redoLastAction, undoLastAction])

  useEffect(() => {
    const workspace = workspaceRef.current
    if (!workspace) return

    const onTouchStart = (event) => {
      if (event.touches.length !== 2) return
      const [touchA, touchB] = event.touches
      pinchZoomRef.current = {
        distance: getTouchDistance(touchA, touchB),
      }
    }

    const onTouchMove = (event) => {
      if (event.touches.length !== 2 || !pinchZoomRef.current) return
      event.preventDefault()
      const canvasWrapper = canvasWrapperRef.current
      if (!canvasWrapper) return
      const [touchA, touchB] = event.touches
      const nextDistance = getTouchDistance(touchA, touchB)
      const prevDistance = pinchZoomRef.current.distance || nextDistance
      if (!prevDistance || !nextDistance) return

      const midpointX = (touchA.clientX + touchB.clientX) / 2
      const midpointY = (touchA.clientY + touchB.clientY) / 2
      const prevRect = canvasWrapper.getBoundingClientRect()
      const ratioX = (midpointX - prevRect.left) / Math.max(1, prevRect.width)
      const ratioY = (midpointY - prevRect.top) / Math.max(1, prevRect.height)

      const zoomFactor = nextDistance / prevDistance
      const prevZoom = canvasZoomRef.current
      const nextZoom = clampZoom(canvasZoomRef.current * zoomFactor)
      const zoomRatio = nextZoom / Math.max(0.0001, prevZoom)
      const nextWidth = prevRect.width * zoomRatio
      const nextHeight = prevRect.height * zoomRatio
      const prevCenterX = prevRect.left + prevRect.width / 2
      const prevCenterY = prevRect.top + prevRect.height / 2
      const baseCenterX = prevCenterX - canvasOffsetRef.current.x
      const baseCenterY = prevCenterY - canvasOffsetRef.current.y
      const desiredCenterX = midpointX - ratioX * nextWidth + nextWidth / 2
      const desiredCenterY = midpointY - ratioY * nextHeight + nextHeight / 2

      setCanvasOffset({
        x: desiredCenterX - baseCenterX,
        y: desiredCenterY - baseCenterY,
      })
      canvasZoomRef.current = nextZoom
      setCanvasZoom(nextZoom)
      pinchZoomRef.current.distance = nextDistance
    }

    const onTouchEnd = () => {
      if (pinchZoomRef.current) {
        pinchZoomRef.current = null
      }
    }

    workspace.addEventListener('touchstart', onTouchStart, { passive: true })
    workspace.addEventListener('touchmove', onTouchMove, { passive: false })
    workspace.addEventListener('touchend', onTouchEnd, { passive: true })
    workspace.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      workspace.removeEventListener('touchstart', onTouchStart)
      workspace.removeEventListener('touchmove', onTouchMove)
      workspace.removeEventListener('touchend', onTouchEnd)
      workspace.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [canvasZoom])

  const commitInlineTextEdit = useCallback(
    (mode = 'save') => {
      if (!inlineTextEditLayerKey) return
      const editingLayer = data.find(
        (item) => item.key === inlineTextEditLayerKey
      )
      if (
        mode === 'save' &&
        editingLayer?.type === 'text' &&
        String(editingLayer.params?.text || '') !== inlineTextDraft
      ) {
        updateLayer(
          inlineTextEditLayerKey,
          {
            params: { text: inlineTextDraft },
          },
          { markEventTextManual: editingLayer?.binding?.kind === 'event' }
        )
      }
      setInlineTextEditLayerKey(null)
      setInlineTextDraft('')
    },
    [data, inlineTextDraft, inlineTextEditLayerKey, updateLayer]
  )

  const startInlineTextEdit = useCallback((layer) => {
    if (!layer?.show || layer.type !== 'text') return
    setSelectedLayerKey(layer.key)
    setResizeModeLayerKey(null)
    setMobilePanel(null)
    setInlineTextEditLayerKey(layer.key)
    setInlineTextDraft(String(layer.params?.text || ''))
  }, [])

  const handleTextPointerDown = useCallback(
    (event, layer) => {
      if (event.pointerType === 'touch') {
        const now = Date.now()
        const sameLayer = lastTextTapRef.current.layerKey === layer.key
        const isDoubleTap = sameLayer && now - lastTextTapRef.current.at <= 320
        lastTextTapRef.current = { layerKey: layer.key, at: now }

        if (isDoubleTap) {
          event.preventDefault()
          event.stopPropagation()
          startInlineTextEdit(layer)
          return
        }
      }
      startDragLayer(event, layer)
    },
    [startDragLayer, startInlineTextEdit]
  )

  useEffect(() => {
    if (!inlineTextEditLayerKey) return
    const timer = setTimeout(() => {
      const input = inlineTextInputRef.current
      if (!input) return
      input.focus()
      const valueLength = String(input.value || '').length
      input.setSelectionRange(valueLength, valueLength)
    }, 0)
    return () => clearTimeout(timer)
  }, [inlineTextEditLayerKey])

  useEffect(() => {
    if (!inlineTextEditLayerKey) return
    if (!selectedLayerKey || selectedLayerKey !== inlineTextEditLayerKey) {
      commitInlineTextEdit('save')
    }
  }, [commitInlineTextEdit, inlineTextEditLayerKey, selectedLayerKey])

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

  useEffect(() => {
    if (!selectedLayer && mobilePanel === 'text') {
      setMobilePanel(null)
    }
  }, [mobilePanel, selectedLayer])

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(String(reader.result || ''))
      reader.onerror = () =>
        reject(new Error('Failed to convert blob to data URL'))
      reader.readAsDataURL(blob)
    })

  const buildExportSvgWithInlinedImages = useCallback(async () => {
    if (!svgRef.current) return
    const sourceSvg = svgRef.current
    const exportSvg = sourceSvg.cloneNode(true)
    const imageNodes = Array.from(exportSvg.querySelectorAll('image'))
    if (!imageNodes.length) return exportSvg

    await Promise.all(
      imageNodes.map(async (node) => {
        const rawHref =
          node.getAttribute('href') ||
          node.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
          ''
        const href = normalizeUploadsUrl(rawHref)
        if (
          !href ||
          href.startsWith('data:') ||
          href.startsWith('blob:') ||
          href.startsWith('#')
        ) {
          return
        }

        let absoluteUrl = href
        try {
          absoluteUrl = new URL(href, window.location.origin).toString()
        } catch {
          return
        }

        try {
          const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(absoluteUrl)}`
          const response = await fetch(proxyUrl, { cache: 'no-store' })
          if (!response.ok) return
          const blob = await response.blob()
          const dataUrl = await blobToDataUrl(blob)
          if (!dataUrl) return

          node.setAttribute('href', dataUrl)
          node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl)
        } catch {
          // Ignore failed image inlining and keep original URL.
        }
      })
    )

    return exportSvg
  }, [])

  const savePng = async () => {
    if (!svgRef.current) return
    const fileName = `${templateName?.trim() || 'image-constructor'}.png`
    try {
      const exportSvg = await buildExportSvgWithInlinedImages()
      await saveSvgAsPng(exportSvg, fileName, {
        scale: 1,
        encoderOptions: 1,
      })
    } catch {
      modalsFunc.error({
        title: 'Ошибка сохранения PNG',
        text: 'Не удалось подготовить изображение для PNG. Попробуйте снова.',
      })
    }
    setMobilePanel(null)
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
    setMobilePanel(null)
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
    const exportSvg = await buildExportSvgWithInlinedImages()
    const pngDataUrl = await svgAsPngUri(exportSvg || svgRef.current, {
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
  }, [
    backgroundProps,
    buildExportSvgWithInlinedImages,
    data,
    imageFolder,
    size,
    templateName,
  ])

  const selectedLayerBounds = useMemo(
    () => getLayerBounds(selectedLayer),
    [selectedLayer]
  )
  const inlineTextEditStyle = useMemo(() => {
    if (!inlineTextEditLayer || inlineTextEditLayer.type !== 'text') return null
    const bounds = getLayerBounds(inlineTextEditLayer)
    const draftMetrics = getTextLayoutMetrics(
      inlineTextEditLayer,
      inlineTextDraft
    )
    const svgElement = svgRef.current
    const svgClientWidth = Number(svgElement?.clientWidth || 0)
    const svgClientHeight = Number(svgElement?.clientHeight || 0)
    if (!bounds || !size.w || !size.h || !svgClientWidth || !svgClientHeight)
      return null

    // Use layout size (clientWidth/clientHeight) instead of getBoundingClientRect,
    // because the wrapper can be transformed (zoom/pan) and children are transformed together.
    const scaleX = svgClientWidth / size.w
    const scaleY = svgClientHeight / size.h
    const fontSize = Math.max(
      1,
      Number(inlineTextEditLayer.params?.fontSize || 32)
    )
    const renderedFontSize = Math.max(10, fontSize * scaleY)
    const lineHeight = Number(inlineTextEditLayer.params?.lineHeight || 1.2)
    const textAnchor = inlineTextEditLayer.params?.textAnchor || 'start'
    const textVerticalAlign = getTextVerticalAlign(inlineTextEditLayer)
    const initialText = String(inlineTextEditLayer.params?.text || '')
    const hasDraftChanged = inlineTextDraft !== initialText
    const textWidthByChars = Math.max(1, draftMetrics.width * scaleX)
    const textHeightByLines = Math.max(1, draftMetrics.height * scaleY)
    const isLockedWidth = isTextWidthLocked(inlineTextEditLayer)
    const baseLeft = bounds.x * scaleX
    const baseTop = bounds.y * scaleY
    const baseWidth = Math.max(1, bounds.width * scaleX)
    const baseHeight = Math.max(1, bounds.height * scaleY)
    const nextWidth = hasDraftChanged
      ? isLockedWidth
        ? baseWidth
        : Math.max(baseWidth, textWidthByChars)
      : baseWidth
    const nextHeight = hasDraftChanged
      ? Math.max(baseHeight, textHeightByLines)
      : baseHeight
    const widthGrowth = hasDraftChanged ? nextWidth - baseWidth : 0
    const heightGrowth = hasDraftChanged ? nextHeight - baseHeight : 0
    const adjustedLeft =
      textAnchor === 'middle'
        ? baseLeft - widthGrowth / 2
        : textAnchor === 'end'
          ? baseLeft - widthGrowth
          : baseLeft
    const adjustedTop =
      textVerticalAlign === 'middle'
        ? baseTop - heightGrowth / 2
        : textVerticalAlign === 'end'
          ? baseTop - heightGrowth
          : baseTop
    const inlineOffsetX = 0
    const inlineOffsetY = 0.3
    const inlineWidthAdjust = 0.5

    return {
      left: `${adjustedLeft + inlineOffsetX - 0.5}px`,
      top: `${adjustedTop + inlineOffsetY - 0.5}px`,
      width: `${nextWidth + inlineWidthAdjust + 1}px`,
      height: `${nextHeight + 1}px`,
      fontSize: `${renderedFontSize}px`,
      lineHeight: String(lineHeight),
      fontFamily: inlineTextEditLayer.params?.fontFamily || 'Arial',
      fontWeight: inlineTextEditLayer.params?.fontWeight || 'normal',
      fontStyle: inlineTextEditLayer.params?.fontStyle || 'normal',
      color: inlineTextEditLayer.params?.color || '#FFFFFF',
      textAlign:
        textAnchor === 'middle'
          ? 'center'
          : textAnchor === 'end'
            ? 'right'
            : 'left',
      opacity: clampOpacity(inlineTextEditLayer.params?.opacity ?? 100) / 100,
      overflow: 'hidden',
      overflowX: 'hidden',
      overflowY: 'hidden',
      whiteSpace: isLockedWidth ? 'pre-wrap' : 'pre',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '0.5px',
      paddingTop: '0px',
      margin: '0',
      boxSizing: 'border-box',
      border: '2px dashed #13B981',
      borderRadius: '0',
      verticalAlign: 'top',
    }
  }, [inlineTextDraft, inlineTextEditLayer, size.h, size.w])
  const isResizeModeActive =
    !!selectedLayer &&
    !!resizeModeLayerKey &&
    resizeModeLayerKey === selectedLayer.key
  const canResizeSelectedLayer =
    !!selectedLayer && RESIZABLE_LAYER_TYPES.has(selectedLayer.type)

  const selectedResizeHandles = useMemo(() => {
    if (!isResizeModeActive || !selectedLayer?.show) return []

    if (selectedLayer.type === 'line') {
      return [
        {
          key: 'start',
          x: Number(selectedLayer.params?.x || 0),
          y: Number(selectedLayer.params?.y || 0),
          cursor: 'nwse-resize',
        },
        {
          key: 'end',
          x: Number(selectedLayer.params?.x2 || 0),
          y: Number(selectedLayer.params?.y2 || 0),
          cursor: 'nwse-resize',
        },
      ]
    }

    if (selectedLayer.type === 'text') {
      if (!selectedLayerBounds) return []
      const left = selectedLayerBounds.x
      const right = selectedLayerBounds.x + selectedLayerBounds.width
      const middleY = selectedLayerBounds.y + selectedLayerBounds.height / 2
      return [
        { key: 'w', x: left, y: middleY, cursor: 'ew-resize' },
        { key: 'e', x: right, y: middleY, cursor: 'ew-resize' },
      ]
    }

    if (!selectedLayerBounds) return []
    const left = selectedLayerBounds.x
    const right = selectedLayerBounds.x + selectedLayerBounds.width
    const top = selectedLayerBounds.y
    const bottom = selectedLayerBounds.y + selectedLayerBounds.height

    return [
      { key: 'nw', x: left, y: top, cursor: 'nwse-resize' },
      { key: 'ne', x: right, y: top, cursor: 'nesw-resize' },
      { key: 'se', x: right, y: bottom, cursor: 'nwse-resize' },
      { key: 'sw', x: left, y: bottom, cursor: 'nesw-resize' },
    ]
  }, [isResizeModeActive, selectedLayer, selectedLayerBounds])

  const mobileSelectedLayerToolbarStyle = useMemo(() => {
    if (!selectedLayerBounds || !size.h || !size.w) return null

    const toolbarHeightPx = 40
    const layerGapPx = 12
    const safeZoom = Math.max(0.0001, canvasZoom)
    const centerX =
      ((selectedLayerBounds.x + selectedLayerBounds.width / 2) / size.w) * 100
    const layerTop = (selectedLayerBounds.y / size.h) * 100
    const layerBottom =
      ((selectedLayerBounds.y + selectedLayerBounds.height) / size.h) * 100
    const showAbove = layerTop > 14
    const safeCenter = Math.max(28, Math.min(72, centerX))
    const inverseScale = 1 / safeZoom
    const aboveOffsetPx = (toolbarHeightPx + layerGapPx) / safeZoom
    const belowOffsetPx = (layerGapPx * 2) / safeZoom

    return {
      left: `${safeCenter}%`,
      top: showAbove
        ? `calc(${Math.max(0, layerTop)}% - ${aboveOffsetPx}px)`
        : `calc(${Math.max(0, layerBottom)}% + ${belowOffsetPx}px)`,
      transform: `translateX(-50%) scale(${inverseScale})`,
      transformOrigin: 'center center',
    }
  }, [canvasZoom, selectedLayerBounds, size.h, size.w])

  const selectTemplate = (selectedTemplate) => {
    const template = selectedTemplate?.template
    if (!template) return
    setTemplateName(selectedTemplate?.name || template?.name || 'Изображение')
    if (template?.size?.w && template?.size?.h) {
      setSize({ w: template.size.w, h: template.size.h })
    }
    setData(normalizeImageLayerSources(template?.data))
    setSelectedLayerKey(null)
    setBackgroundProps(template?.backgroundProps)
    rerender()
    setMobilePanel(null)
  }

  const resetConstructor = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Стереть всё? Это удалит все слои и сбросит настройки.')
    ) {
      return
    }

    historyRef.current = []
    redoRef.current = []
    lastSnapshotRef.current = null
    pendingTransformSnapshotRef.current = null
    restoreFromHistoryRef.current = false
    setUndoDepth(0)
    setRedoDepth(0)

    setTemplateName('Изображение')
    setSize({ w: 1080, h: 1080 })
    setData([])
    setSelectedLayerKey(null)
    setBackgroundProps(undefined)
    setDragGuides({ vertical: [], horizontal: [], corner: null })
    rerender()
    setMobilePanel(null)
  }

  const renderLayerEditorByType = (item) => {
    if (!item) return null
    if (item.type === 'text') {
      const boundEvent =
        item?.binding?.kind === 'event'
          ? events.find(
              ({ _id }) => String(_id) === String(item.binding?.eventId)
            ) || null
          : null
      return (
        <TextLayerEditor
          item={item}
          boundEvent={boundEvent}
          setLayerState={(patch) =>
            updateLayer(item.key, patch, {
              markEventTextManual:
                item?.binding?.kind === 'event' &&
                !!patch?.params &&
                Object.prototype.hasOwnProperty.call(patch.params, 'text'),
            })
          }
          onChangeEventBinding={() => openEventPickerForBoundLayer(item)}
          onResetEventBindingText={() => restoreBoundLayerTextFromEvent(item)}
          onChangeEventBindingSource={(source) =>
            setEventBindingSourceForLayer(item, source)
          }
          onChangeEventBindingCaseMode={(caseMode) =>
            setEventBindingCaseModeForLayer(item, caseMode)
          }
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
    if (item.type === 'line') {
      return (
        <LineLayerEditor
          item={item}
          setLayerState={(patch) => updateLayer(item.key, patch)}
        />
      )
    }
    if (item.type === 'image') {
      return (
        <ImageLayerEditor
          item={item}
          setLayerState={(patch) => updateLayer(item.key, patch)}
          onSelectImage={() => openSelectImageForLayer(item.key)}
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

  const renderLayerEditor = (item) => {
    if (!item || item.key !== selectedLayerKey) return null
    return renderLayerEditorByType(item)
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
        const isLayerTarget = event.target?.closest?.(
          '[data-layer-node="true"]'
        )
        if (!isLayerTarget) {
          setSelectedLayerKey(null)
          setDragGuides({ vertical: [], horizontal: [], corner: null })
        }
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
              data-layer-node="true"
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
              data-layer-node="true"
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

        if (layer.type === 'line') {
          return (
            <line
              key={layer.key}
              data-layer-node="true"
              x1={Number(layer.params?.x || 0)}
              y1={Number(layer.params?.y || 0)}
              x2={Number(layer.params?.x2 || 0)}
              y2={Number(layer.params?.y2 || 0)}
              stroke={layer.params?.stroke || '#FFFFFF'}
              strokeWidth={Math.max(1, Number(layer.params?.strokeWidth || 1))}
              strokeOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
              strokeLinecap="round"
              style={{ cursor: getLayerPointerStyle(false) }}
              onPointerDown={(event) => startDragLayer(event, layer)}
            />
          )
        }

        if (layer.type === 'image') {
          const x = Number(layer.params?.x || 0)
          const y = Number(layer.params?.y || 0)
          const width = Math.max(1, Number(layer.params?.width || 0))
          const height = Math.max(1, Number(layer.params?.height || 0))
          const src = normalizeUploadsUrl(layer.params?.src || '')

          return src ? (
            <image
              key={layer.key}
              data-layer-node="true"
              href={src}
              x={x}
              y={y}
              width={width}
              height={height}
              preserveAspectRatio="xMidYMid meet"
              opacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
              style={{ cursor: getLayerPointerStyle(false) }}
              onPointerDown={(event) => startDragLayer(event, layer)}
            />
          ) : (
            <rect
              key={layer.key}
              data-layer-node="true"
              x={x}
              y={y}
              width={width}
              height={height}
              fill="#f3f4f6"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="8 6"
              fillOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
              style={{ cursor: getLayerPointerStyle(false) }}
              onPointerDown={(event) => startDragLayer(event, layer)}
            />
          )
        }

        const metrics = getTextLayoutMetrics(layer)
        const lines = metrics.lines
        const lineHeight = metrics.lineHeight
        const x = metrics.x
        const y = metrics.startY
        const fontSize = Math.max(1, Number(layer.params?.fontSize || 32))
        const rotate = Number(layer.params?.rotate || 0)

        if (inlineTextEditLayerKey === layer.key) return null

        return (
          <text
            key={layer.key}
            data-layer-node="true"
            x={x}
            y={y}
            fontSize={fontSize}
            fill={layer.params?.color || '#FFFFFF'}
            fontWeight={layer.params?.fontWeight || 'normal'}
            fontStyle={layer.params?.fontStyle || 'normal'}
            textAnchor={layer.params?.textAnchor || 'start'}
            fontFamily={layer.params?.fontFamily || 'Arial'}
            fillOpacity={clampOpacity(layer.params?.opacity ?? 100) / 100}
            transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
            style={{
              cursor: getLayerPointerStyle(false),
              userSelect: 'none',
            }}
            onPointerDown={(event) => handleTextPointerDown(event, layer)}
            onDoubleClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              startInlineTextEdit(layer)
            }}
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

      {isDraggingLayer && (
        <>
          <line
            x1={0.5}
            y1={0}
            x2={0.5}
            y2={size.h}
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            pointerEvents="none"
            opacity="0.55"
          />
          <line
            x1={size.w - 0.5}
            y1={0}
            x2={size.w - 0.5}
            y2={size.h}
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            pointerEvents="none"
            opacity="0.55"
          />
          <line
            x1={0}
            y1={0.5}
            x2={size.w}
            y2={0.5}
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            pointerEvents="none"
            opacity="0.55"
          />
          <line
            x1={0}
            y1={size.h - 0.5}
            x2={size.w}
            y2={size.h - 0.5}
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            pointerEvents="none"
            opacity="0.55"
          />
        </>
      )}

      {dragGuides.vertical.map((guideX) => (
        <line
          key={`guide_x_${guideX}`}
          x1={guideX}
          y1={0}
          x2={guideX}
          y2={size.h}
          stroke="#1D9BF0"
          strokeWidth="2"
          strokeDasharray="8 8"
          pointerEvents="none"
          opacity="0.9"
        />
      ))}
      {dragGuides.horizontal.map((guideY) => (
        <line
          key={`guide_y_${guideY}`}
          x1={0}
          y1={guideY}
          x2={size.w}
          y2={guideY}
          stroke="#1D9BF0"
          strokeWidth="2"
          strokeDasharray="8 8"
          pointerEvents="none"
          opacity="0.9"
        />
      ))}
      {dragGuides.corner && (
        <>
          <circle
            cx={dragGuides.corner.x}
            cy={dragGuides.corner.y}
            r="10"
            fill="none"
            stroke="#1D9BF0"
            strokeWidth="2"
            opacity="0.85"
            pointerEvents="none"
          />
          <circle
            cx={dragGuides.corner.x}
            cy={dragGuides.corner.y}
            r="4"
            fill="#1D9BF0"
            opacity="0.95"
            pointerEvents="none"
          />
        </>
      )}

      {selectedLayerBounds &&
        selectedLayer?.show &&
        !(inlineTextEditLayerKey && selectedLayer?.type === 'text') && (
          <rect
            x={selectedLayerBounds.x}
            y={selectedLayerBounds.y}
            width={Math.max(1, selectedLayerBounds.width)}
            height={Math.max(1, selectedLayerBounds.height)}
            fill="none"
            stroke="#1d9bf0"
            strokeWidth="2"
            strokeDasharray="8 6"
            pointerEvents="none"
          />
        )}

      {selectedResizeHandles.map((handle) => (
        <circle
          key={`resize_${handle.key}`}
          data-layer-node="true"
          cx={handle.x}
          cy={handle.y}
          r="10"
          fill="#ffffff"
          stroke="#13B981"
          strokeWidth="2"
          style={{ cursor: handle.cursor }}
          onPointerDown={(event) =>
            startResizeLayer(event, selectedLayer, handle.key)
          }
        />
      ))}
    </svg>
  )

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-[#d5d7dc]">
      <div
        ref={workspaceRef}
        className={`relative flex-1 px-3 pt-3 overflow-auto pb-15 ${
          isWorkspacePanning
            ? 'cursor-grabbing select-none'
            : canvasZoom > 1
              ? 'cursor-grab'
              : 'cursor-default'
        } touch-none`}
        onPointerDown={handleWorkspacePointerDown}
      >
        <div className="relative flex items-center justify-center min-w-full min-h-full">
          <div
            ref={canvasWrapperRef}
            className="relative w-full max-w-[560px] shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            style={{
              aspectRatio: `${size.w} / ${size.h}`,
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            {renderCanvas({
              wrapperClassName:
                'w-full h-full max-w-full bg-transparent touch-none',
              maxHeight: 'none',
            })}
            {inlineTextEditLayer && inlineTextEditStyle && (
              <textarea
                ref={inlineTextInputRef}
                data-inline-text-editor="true"
                value={inlineTextDraft}
                onChange={(event) => setInlineTextDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    commitInlineTextEdit('cancel')
                    return
                  }
                  if (
                    event.key === 'Enter' &&
                    (event.ctrlKey || event.metaKey)
                  ) {
                    event.preventDefault()
                    commitInlineTextEdit('save')
                  }
                }}
                onBlur={() => commitInlineTextEdit('save')}
                className="absolute z-30 bg-transparent outline-none resize-none"
                wrap={
                  inlineTextEditLayer && isTextWidthLocked(inlineTextEditLayer)
                    ? 'soft'
                    : 'off'
                }
                style={inlineTextEditStyle}
              />
            )}
            {selectedLayer &&
              !isDraggingLayer &&
              !isResizingLayer &&
              !inlineTextEditLayerKey &&
              mobileSelectedLayerToolbarStyle && (
                <div
                  data-layer-toolbar="true"
                  className="absolute z-20 rounded-full bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
                  style={mobileSelectedLayerToolbarStyle}
                >
                  <div className="flex items-center px-2 py-1 gap-x-1">
                    {isResizeModeActive ? (
                      <button
                        type="button"
                        className="w-8 h-8 text-[#13B981]"
                        onClick={() => setResizeModeLayerKey(null)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="w-8 h-8 text-orange-500"
                          onClick={() => setMobilePanel('text')}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 text-[#1d9bf0]"
                          onClick={() => duplicateLayer(selectedLayer.key)}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                        {selectedLayer.type === 'image' && (
                          <button
                            type="button"
                            className="w-8 h-8 text-sky-600"
                            onClick={() => openSelectImageForLayer(selectedLayer.key)}
                          >
                            <FontAwesomeIcon icon={faImages} />
                          </button>
                        )}
                        <button
                          type="button"
                          className={`w-8 h-8 ${
                            selectedLayer.show
                              ? 'text-[#7b4fb3]'
                              : 'text-gray-500'
                          }`}
                          onClick={() =>
                            toggleLayerVisibility(selectedLayer.key)
                          }
                        >
                          <FontAwesomeIcon
                            icon={selectedLayer.show ? faEye : faEyeSlash}
                          />
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 text-red-600"
                          onClick={() => deleteLayer(selectedLayer.key)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        {canResizeSelectedLayer && (
                          <button
                            type="button"
                            className="w-8 h-8 text-gray-700"
                            onClick={() => {
                              setResizeModeLayerKey(selectedLayer.key)
                              setMobilePanel(null)
                            }}
                          >
                            <FontAwesomeIcon icon={faExpand} />
                          </button>
                        )}
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
                      </>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {mobilePanelRendered && (
        <div
          data-mobile-panel="true"
          className={`fixed bottom-0 left-0 right-0 tablet:left-16 z-40 max-h-[68vh] overflow-auto rounded-t-2xl border border-gray-200 border-b-0 bg-white px-2 pt-0 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-2xl transition-all duration-300 ease-out ${
            mobilePanelVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-1 pt-2 pb-2 mb-2 bg-white border-b border-gray-200">
            <div className="text-sm font-bold text-gray-700">
              {mobilePanelRendered === 'templates' && 'Файл'}
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
                <Button name="SVG" icon={faFloppyDisk} onClick={saveSvg} thin />
                <Button
                  name="Стереть всё"
                  icon={faTrash}
                  onClick={resetConstructor}
                  thin
                  classBgColor="bg-danger"
                  classHoverBgColor="hover:bg-red-700"
                />
              </div>
              <Templates
                aspect={size.h > 0 ? size.w / size.h : 1}
                tool="imageconstructor"
                onSelect={selectTemplate}
                onSave={() => setMobilePanel(null)}
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
              <Button
                name="Линия"
                icon={faPlus}
                thin
                onClick={() => addItemFromMobile('line')}
              />
              <Button
                name="Картинка"
                icon={faPlus}
                thin
                onClick={() => addItemFromMobile('image')}
              />
              <Button
                name="Мероприятие"
                icon={faPlus}
                thin
                onClick={() => addItemFromMobile('event')}
                disabled={hasEventBoundLayers}
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
              {layersForPanel.map(({ item, dataIndex }, index) => (
                <ObjectItem
                  key={item.key}
                  item={item}
                  index={index}
                  isSelected={item.key === selectedLayerKey}
                  onSelect={() =>
                    setSelectedLayerKey((state) =>
                      state === item.key ? null : item.key
                    )
                  }
                  onDelete={() => deleteLayer(item.key)}
                  onToggleVisibility={() => toggleLayerVisibility(item.key)}
                  onClickUp={
                    dataIndex < data.length - 1
                      ? () => bringLayerForward(dataIndex)
                      : null
                  }
                  onClickDown={
                    dataIndex > 0 ? () => sendLayerBackward(dataIndex) : null
                  }
                >
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      item.key === selectedLayerKey
                        ? 'grid-rows-[1fr] opacity-100 mt-1'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      {renderLayerEditorByType(item)}
                    </div>
                  </div>
                </ObjectItem>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 tablet:left-16 bg-white/95 backdrop-blur">
        <div className="flex items-center px-1 py-1 overflow-x-auto justify-evenly">
          <MobileMainToolButton
            icon={faUndo}
            name="Отмена"
            isActive={false}
            disabled={!canUndo}
            onClick={undoLastAction}
          />
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

export default ToolsImageConstructorContent
