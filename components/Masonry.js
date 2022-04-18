import useWindowDimensions from '@helpers/useWindowDimensions'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
// phoneV: '320px',
//         phoneH: '480px',
//         tablet: '640px',
//         laptop: '960px',
//         desktop: '1200px',

const Masonry = ({
  cols = {
    // 420: 1,
    640: 2,
    960: 3,
    // 1120:3
    // if (width < 620) return 'phoneH'
    // if (width < 940) return 'tablet'
    // if (width < 1120) return 'laptop'
  },
  gap = 0,
  children,
}) => {
  // const [prerender, setPrerender] = useState(true)
  const isInitialMount = useRef(true)
  const [readyElements, setReadyElements] = useState(null)
  const { width } = useWindowDimensions()
  const childrenRef = useRef([])

  let columns = 1
  // console.log('typeof cols', typeof cols)
  if (typeof cols === 'number') columns = cols
  else {
    const sortedKeys = Object.keys(cols).sort((a, b) => (a > b ? -1 : 1))
    // console.log('sortedKeys', sortedKeys)
    const key = sortedKeys.find((key) => key <= width)
    if (key) columns = cols[key]
  }

  const flexes = []
  // let k = 0
  for (let i = 0; i < columns; i++) {
    flexes.push(
      <div key={'flex' + i} className="flex flex-col flex-1" style={{ gap }}>
        {/* {children
          .filter((child, index) => index % cols === i)
          .map((children) => {React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              ref: (ref) => (childrenRef.current[index] = ref)
            })
          )}
          // (
          //   <Child ref={(ref, index) => (elements.current[index] = ref)} />
          // )
          )} */}
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
          : // React.Children.map(
            //     children.filter(
            //       (child, childIndex) => childIndex % columns === i
            //     ),
            //     (child, childIndex) => {
            //       const newChild = forwardRef((props, ref) => (
            //         <div ref={ref}>{child}</div>
            //       ))
            //       console.log('child', child)
            //       return (
            //         <div
            //           ref={(ref) =>
            //             (childrenRef.current[i + columns * childIndex] = ref)
            //           }
            //           key={'masonry' + (i + columns * childIndex)}
            //         >
            //           {React.cloneElement(
            //             child
            //             // , {
            //             //   ref: (ref) =>
            //             //     (childrenRef.current[i + columns * childIndex] = ref),
            //             // }
            //           )}
            //         </div>
            //       )
            //     }
            //   )
            readyElements[i]}
      </div>
    )
  }

  // const getRef = (ref, i) => {
  //   blocks[i] = ref
  // }

  // console.log('children', children)

  // useEffect(() => {
  //   console.log('Form Children', childrenRef.current)
  // }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setReadyElements(null)
    }
  }, [width])

  useEffect(() => {
    if (!readyElements) {
      // console.log('childrenRef', childrenRef.current)
      const elementsOffsetHeight = childrenRef.current.map(
        (childRef) => childRef?.offsetHeight
      )
      // for (let i = 0; i < childrenRef.current.length; i++) {
      //   console.log(i, childrenRef.current[i].offsetHeight)
      // }

      const colsHeights = Array.from({ length: columns }, () => 0) // [].fill(0, 0, cols)
      const colsElements = Array.from({ length: columns }, () => null) //[].fill([], 0, cols)
      for (let i = 0; i < childrenRef.current.length; i++) {
        const minCol = Math.min(...colsHeights)
        console.log('colsHeights', colsHeights)

        const indexOfMinCol = colsHeights.indexOf(minCol)
        // console.log('indexOfMinCol', indexOfMinCol)
        // console.log('children[i]', children[i])
        // console.log('elementsOffsetHeight[i]', elementsOffsetHeight[i])
        if (!colsElements[indexOfMinCol]) colsElements[indexOfMinCol] = []
        colsElements[indexOfMinCol].push(children[i])
        // console.log('colsElements', colsElements)
        colsHeights[indexOfMinCol] += elementsOffsetHeight[i] + gap
      }
      // console.log('colsElements', colsElements)
      // setElementsHeight(colsHeights)
      setReadyElements(colsElements)
      // setPrerender(false)
    }
    // console.log('elementsOffsetHeight', elementsOffsetHeight)
  }, [readyElements])

  return (
    <div className="flex w-full" style={{ gap }}>
      {flexes}
    </div>
  )
  // <div
  //         style={{
  //           display: 'grid',
  //           gap: 20,
  //           gridTemplateColumns: 'repeat(3,1fr)',
  //           gridTemplateRows: 'masonry',
  //         }}
  //       >
  //         {otzivi.map((otziv, index) => (
  //           <div key={'otziv' + index}>
  //             <div ref={(ref) => (otziviRef.current[index] = ref)}>
  //               <Otziv author={otziv.author} text={otziv.text} />
  //             </div>
  //           </div>
  //         ))}
  //       </div>
}

export default Masonry
