'use client'

import LoadingSpinner from '@components/LoadingSpinner'
import PWAChecker from '@components/PWAChecker'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { renderTimeViewClock } from '@mui/x-date-pickers'
import { LazyMotion, domAnimation } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import { SnackbarProvider } from 'notistack'
import { Suspense, useEffect } from 'react'
import { Provider as JotaiProvider } from 'jotai'
import store from '@state/store'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { LOCATIONS_KEYS } from '@server/serverConstants'

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: '',
  },
  palette: {
    primary: {
      main: '#7a5151',
    },
    general: {
      main: '#7a5151',
    },
    secondary: {
      main: '#2A323B',
    },
    error: {
      main: '#ff1744',
    },
    red: { main: '#f87171' },
    blue: { main: '#60a5fa' },
    green: { main: '#4ade80' },
    gray: { main: '#9ca3af' },
    yellow: { main: '#FEE100' },
    orange: { main: '#fb923c' },
    purple: { main: '#c084fc' },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiDesktopTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
    MuiDesktopDateTimePicker: {
      defaultProps: {
        viewRenderers: {
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock,
        },
      },
    },
  },
})

const ClientViewport = () => {
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)

    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  return null
}

const ClientErrorReporter = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let isMounted = true
    let isReporting = false
    const queue = []
    const signatures = new Set()

    const safeStringify = (value) => {
      try {
        return JSON.stringify(value)
      } catch (error) {
        return String(value)
      }
    }

    const guessLocationFromPath = () => {
      const pathname = window.location?.pathname ?? ''
      const [, firstSegment] = pathname.split('/')
      if (firstSegment && LOCATIONS_KEYS.includes(firstSegment)) {
        return firstSegment
      }
      return null
    }

    const resolveLocation = () => {
      try {
        const location = store.get(locationAtom)
        if (location) return location
      } catch (error) {
        // ignore
      }
      return guessLocationFromPath()
    }

    const resolveUserInfo = () => {
      try {
        return store.get(loggedUserActiveAtom) ?? null
      } catch (error) {
        return null
      }
    }

    const serializeError = (error) => {
      if (!error) {
        return { message: 'Unknown error', stack: '', componentStack: '' }
      }
      if (error instanceof Error) {
        return {
          message: error.message ?? 'Error',
          stack: error.stack ?? '',
          componentStack: error.componentStack ?? '',
        }
      }
      if (typeof error === 'string') {
        return { message: error, stack: '', componentStack: '' }
      }
      if (typeof error === 'object') {
        return {
          message: error.message ?? safeStringify(error),
          stack: error.stack ?? '',
          componentStack: error.componentStack ?? '',
        }
      }
      return { message: String(error), stack: '', componentStack: '' }
    }

    const processQueue = async () => {
      if (!isMounted || isReporting || queue.length === 0) return
      isReporting = true
      const payload = queue.shift()

      try {
        const response = await fetch('/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          const result = await response.json()
          if (result?.data?.id) {
            console.info('Client error logged', result.data.id)
            try {
              sessionStorage.setItem('lastClientErrorLogId', result.data.id)
            } catch (error) {
              // ignore storage errors
            }
          }
        } else {
          console.warn('Failed to log client error', await response.text())
        }
      } catch (error) {
        console.warn('Error while sending client error log', error)
      } finally {
        isReporting = false
        if (queue.length > 0) {
          processQueue()
        }
      }
    }

    const enqueuePayload = (payload) => {
      queue.push(payload)
      void processQueue()
    }

    const handleError = (error, componentStack = '', meta = {}) => {
      const location = resolveLocation()
      if (!location) return

      const serialized = serializeError(error)
      const payload = {
        location,
        error: {
          message: serialized.message,
          stack: serialized.stack,
          componentStack:
            componentStack || serialized.componentStack || '',
          url: window.location?.href ?? '',
          userAgent: navigator?.userAgent ?? '',
        },
        user: resolveUserInfo(),
        meta: { ...meta, timestamp: new Date().toISOString() },
      }

      const signature = `${location}|${payload.error.message}|${payload.error.stack}|${payload.error.componentStack}`
      if (signatures.has(signature)) return
      signatures.add(signature)

      enqueuePayload(payload)
    }

    const handleWindowError = (message, source, lineno, colno, error) => {
      handleError(error ?? message, `Line ${lineno}:${colno}`, {
        type: 'window.onerror',
        source,
        lineno,
        colno,
      })
      return false
    }

    const handleUnhandledRejection = (event) => {
      handleError(event?.reason, 'Unhandled Promise Rejection', {
        type: 'unhandledrejection',
      })
    }

    const previousOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof previousOnError === 'function') {
        try {
          previousOnError(message, source, lineno, colno, error)
        } catch (prevError) {
          console.warn('Previous window.onerror handler failed', prevError)
        }
      }
      return handleWindowError(message, source, lineno, colno, error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      isMounted = false
      window.onerror = previousOnError ?? null
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <JotaiProvider store={store}>
        <ThemeProvider theme={theme}>
          <ClientViewport />
          <ClientErrorReporter />
          <SnackbarProvider maxSnack={4}>
            <LazyMotion features={domAnimation}>
              <Suspense
                fallback={
                  <div className="z-10 flex items-center justify-center w-screen h-screen">
                    <LoadingSpinner text="идет загрузка...." />
                  </div>
                }
              >
                <PWAChecker>{children}</PWAChecker>
              </Suspense>
            </LazyMotion>
          </SnackbarProvider>
        </ThemeProvider>
      </JotaiProvider>
    </SessionProvider>
  )
}
