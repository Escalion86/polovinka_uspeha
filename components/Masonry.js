import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

const Masonry = ({
  cols = {
    640: 2,
    960: 3,
  },
  gap = 0,
  children,
}) => {
  const isInitialMount = useRef(true)
  const [readyElements, setReadyElements] = useState(null)
  const { width } = useRecoilValue(windowDimensionsAtom)
  const childrenRef = useRef([])

  let columns = 1
  if (!children || children?.length === 1) {
    columns = 1
  } else if (typeof cols === 'number') {
    columns = cols
  } else {
    const sortedKeys = Object.keys(cols).sort((a, b) => (a > b ? -1 : 1))
    const key = sortedKeys.find((key) => key <= width)
    if (key) columns = Math.min(cols[key], children?.length)
  }

  const flexes = []
  for (let i = 0; i < columns; i++) {
    flexes.push(
      <div
        key={'flex' + i}
        className="flex flex-col items-center flex-1"
        style={{ gap }}
      >
        {!readyElements
          ? children
              .filter((child, childIndex) => childIndex % columns === i)
              .map((child, childIndex) => (
                <div
                  ref={(ref) =>
                    (childrenRef.current[i + columns * childIndex] = ref)
                  }
                  key={'masonry' + (i + columns * childIndex)}
                >
                  {child}
                </div>
              ))
          : readyElements[i]}
      </div>
    )
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setReadyElements(null)
    }
  }, [width])

  useEffect(() => {
    if (!readyElements) {
      const elementsOffsetHeight = childrenRef.current.map(
        (childRef) => childRef?.offsetHeight
      )

      const colsHeights = Array.from({ length: columns }, () => 0)
      const colsElements = Array.from({ length: columns }, () => null)
      for (let i = 0; i < childrenRef.current.length; i++) {
        const minCol = Math.min(...colsHeights)

        const indexOfMinCol = colsHeights.indexOf(minCol)
        if (!colsElements[indexOfMinCol]) colsElements[indexOfMinCol] = []
        colsElements[indexOfMinCol].push(children[i])
        colsHeights[indexOfMinCol] += elementsOffsetHeight[i] + gap
      }
      setReadyElements(colsElements)
    }
  }, [readyElements])

  return (
    <div className="flex w-full" style={{ gap }}>
      {flexes}
    </div>
  )
}

export default Masonry
