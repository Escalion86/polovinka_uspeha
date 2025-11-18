'use client'

import { selectAtom } from 'jotai/utils'

import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const sortRecursively = (value) => {
  if (Array.isArray(value)) return value.map(sortRecursively)

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortRecursively(value[key])
        return acc
      }, {})
  }

  return value
}

const normalizeById = (items) => {
  if (!Array.isArray(items)) return []

  return items
    .filter(Boolean)
    .slice()
    .sort((a, b) => String(a?._id ?? '').localeCompare(String(b?._id ?? '')))
    .map((item) => sortRecursively(item))
}

const newslettersSortedSelector = selectAtom(
  newslettersAtomAsync,
  (newsletters) => {
    if (!Array.isArray(newsletters)) return []

    return [...newsletters].sort(
      (a, b) =>
        new Date(b?.createdAt ?? 0).getTime() -
        new Date(a?.createdAt ?? 0).getTime()
    )
  },
  (prev, next) => {
    if (prev === next) return true

    const prevNormalized = normalizeById(prev)
    const nextNormalized = normalizeById(next)

    if (prevNormalized.length !== nextNormalized.length) return false

    try {
      return (
        JSON.stringify(prevNormalized) === JSON.stringify(nextNormalized)
      )
    } catch (error) {
      return false
    }
  }
)

export default newslettersSortedSelector
