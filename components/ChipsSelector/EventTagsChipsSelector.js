import React from 'react'
import ChipsSelector from './ChipsSelector'

const EventTagsChipsSelector = ({ tags, onChange }) => {
  return (
    <ChipsSelector
      label="Тэги"
      items={[
        { text: 'поход', color: '#B6D8F2' },
        { text: 'природа', color: '#CCD4BF' },
        { text: 'настолки', color: '#D0BCAC' },
        { text: 'прогулка', color: '#F4CFDF' },
      ]}
      onChange={onChange}
      value={tags}
    />
  )
}

export default EventTagsChipsSelector
