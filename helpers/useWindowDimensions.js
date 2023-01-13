import { useState, useEffect } from 'react'

function getWindowDimensions() {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  } else {
    return { width: 0, height: 0 }
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    // getWindowDimensions()
    { width: undefined, height: undefined }
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(
        // getWindowDimensions()
        {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      )
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export const useWindowDimensionsTailwind = () => {
  const { width } = useWindowDimensions()
  if (!width) return null
  if (width < 480) return 'phoneV'
  if (width < 640) return 'phoneH'
  if (width < 960) return 'tablet'
  if (width < 1200) return 'laptop'
  return 'desktop'
}

export const useWindowDimensionsTailwindNum = () => {
  const { width } = useWindowDimensions()
  if (!width) return 0
  if (width < 480) return 1
  if (width < 640) return 2
  if (width < 960) return 3
  if (width < 1200) return 4
  return 5
}
