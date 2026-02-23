'use client'

import PropTypes from 'prop-types'
import Link from 'next/link'

export default function CityAccessUnavailable({
  heading,
  description,
  cityTitle,
  location,
  cities,
  buildCityHref,
  emptyMessage,
  showHomeLink = true,
  className = '',
}) {
  return (
    <div
      className={`w-full max-w-[640px] rounded-[28px] border border-[rgba(107,31,42,0.16)] bg-white/80 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.15)] ${className}`.trim()}
    >
      <h1 className="text-2xl font-bold text-[#2b1b21]">{heading}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-[#3a2c33]">
        В городе <b>{cityTitle || location}</b> {description}
      </p>

      {cities.length > 0 ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={buildCityHref(city.slug)}
              className="rounded-full border border-[rgba(107,31,42,0.18)] bg-white px-4 py-2 text-center text-sm font-semibold text-[#6b1f2a] transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(107,31,42,0.12)]"
            >
              {city.title}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white p-4 text-sm text-[#5d4a52]">
          {emptyMessage}
        </div>
      )}

      {showHomeLink ? (
        <div className="mt-6 text-sm">
          <Link href="/" className="font-semibold text-[#6b1f2a]">
            Вернуться на главную
          </Link>
        </div>
      ) : null}
    </div>
  )
}

CityAccessUnavailable.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cityTitle: PropTypes.string,
  location: PropTypes.string.isRequired,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  buildCityHref: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  showHomeLink: PropTypes.bool,
  className: PropTypes.string,
}

CityAccessUnavailable.defaultProps = {
  cityTitle: '',
  cities: [],
  showHomeLink: true,
  className: '',
}
