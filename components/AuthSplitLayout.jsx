'use client'

import PropTypes from 'prop-types'

export default function AuthSplitLayout({
  leftPanel,
  rightPanel,
  rightClassName,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7fb] text-[#1d1b1f]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#f8f9fb_0%,#eef3f8_100%)]" />
        <div className="absolute -left-20 top-28 h-84 w-84 rounded-full bg-[radial-gradient(circle,rgba(141,207,242,0.7),rgba(141,207,242,0.1))] login3-orb login3-orb--blue" />
        <div className="absolute -right-16 bottom-4 h-76 w-76 rounded-full bg-[radial-gradient(circle,rgba(107,31,42,0.55),rgba(107,31,42,0.08))] login3-orb login3-orb--burgundy" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(107,31,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(107,31,42,0.04)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 py-12">
        <div className="grid w-full max-w-[980px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="hidden flex-col justify-center gap-6 lg:flex">
            {leftPanel}
          </div>
          <div className={rightClassName}>{rightPanel}</div>
        </div>
      </div>

      <style jsx global>{`
        .login3-orb {
          animation: login3-float 8s ease-in-out infinite;
        }
        .login3-orb--burgundy {
          animation-delay: 2.5s;
        }
        @keyframes login3-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-125px);
          }
        }
      `}</style>
    </div>
  )
}

AuthSplitLayout.propTypes = {
  leftPanel: PropTypes.node.isRequired,
  rightPanel: PropTypes.node.isRequired,
  rightClassName: PropTypes.string,
}

AuthSplitLayout.defaultProps = {
  rightClassName:
    'w-full max-w-[450px] justify-self-center rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white/25 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.15)] backdrop-blur',
}
