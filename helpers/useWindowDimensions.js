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
  if (width < 420) return 'phoneV'
  if (width < 620) return 'phoneH'
  if (width < 940) return 'tablet'
  if (width < 1120) return 'laptop'
  return 'desktop'
}
