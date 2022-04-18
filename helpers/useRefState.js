import { useEffect, useRef } from 'react'

const useRefState = (initialValue) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = initialValue
  }, [initialValue])

  return ref.current
}

export default useRefState
