'use client'

import { useEffect } from 'react'
import LocationLoginClient from './LocationLoginClient'

const LocationLogin2Client = (props) => {
  useEffect(() => {
    document.body.classList.add('login2-body')
    return () => document.body.classList.remove('login2-body')
  }, [])

  return (
    <div className="login2-root relative min-h-screen overflow-hidden">
      <div className="login2-orb login2-orb--blue" aria-hidden="true" />
      <div className="login2-orb login2-orb--burgundy" aria-hidden="true" />
      <div className="login2-grid" aria-hidden="true" />
      <LocationLoginClient {...props} />
      <style jsx global>{`
        .login2-root {
          background: radial-gradient(
              circle at top left,
              rgba(141, 207, 242, 0.45),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(107, 31, 42, 0.35),
              transparent 55%
            ),
            linear-gradient(160deg, #f8f9fb 0%, #eef3f8 100%);
        }
        .login2-root .box-border {
          background-image: none !important;
          background-color: transparent !important;
        }
        .login2-root .max-w-\\[360px\\] {
          background: rgba(255, 255, 255, 0.88);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.15);
          backdrop-filter: blur(12px);
          animation: login2-fade-up 0.6s ease both;
          border: 1px solid rgba(107, 31, 42, 0.12);
        }
        .login2-root .text-2xl {
          color: #2b1b21;
          font-weight: 700;
        }
        .login2-root input[type='text'],
        .login2-root input[type='password'],
        .login2-root input[type='tel'],
        .login2-root input[type='number'] {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(107, 31, 42, 0.2) !important;
          border-radius: 999px !important;
          padding: 10px 14px !important;
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
        }
        .login2-root button {
          border-radius: 999px !important;
          letter-spacing: 0.02em;
        }
        .login2-root button[class*='bg-general'] {
          background: linear-gradient(135deg, #6b1f2a, #8a3a45) !important;
          box-shadow: 0 12px 24px rgba(107, 31, 42, 0.25);
        }
        .login2-root button[class*='bg-success'] {
          background: linear-gradient(135deg, #2f965f, #4ade80) !important;
        }
        .login2-root button[class*='bg-danger'] {
          background: linear-gradient(135deg, #b02230, #e65a6c) !important;
        }
        .login2-root button[class*='bg-white'] {
          border: 1px solid rgba(107, 31, 42, 0.2) !important;
        }
        .login2-root .border-t,
        .login2-root .border-b,
        .login2-root .border {
          border-color: rgba(107, 31, 42, 0.15) !important;
        }
        .login2-root a {
          color: #6b1f2a;
        }
        .login2-root img[src='/img/logo.webp'] {
          width: 120px;
          height: 120px;
          object-fit: contain;
        }
        .login2-root .login2-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(0px);
          opacity: 0.8;
          animation: login2-float 8s ease-in-out infinite;
          z-index: 0;
        }
        .login2-root .login2-orb--blue {
          width: 320px;
          height: 320px;
          left: -80px;
          top: 80px;
          background: radial-gradient(
            circle,
            rgba(141, 207, 242, 0.7),
            rgba(141, 207, 242, 0.1)
          );
        }
        .login2-root .login2-orb--burgundy {
          width: 280px;
          height: 280px;
          right: -60px;
          bottom: 60px;
          background: radial-gradient(
            circle,
            rgba(107, 31, 42, 0.55),
            rgba(107, 31, 42, 0.08)
          );
          animation-delay: 1.2s;
        }
        .login2-root .login2-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(107, 31, 42, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(107, 31, 42, 0.04) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          opacity: 0.35;
          z-index: 0;
        }
        @keyframes login2-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes login2-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
        }
      `}</style>
    </div>
  )
}

export default LocationLogin2Client
