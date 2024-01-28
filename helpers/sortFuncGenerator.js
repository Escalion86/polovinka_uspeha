import sortFunctions from './sortFunctions'

const sortFuncGenerator = (sort) => {
  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortFunc = sortFunctions[sortKey]
    ? sortFunctions[sortKey][sortValue]
    : undefined
  return sortFunc
}

export default sortFuncGenerator
