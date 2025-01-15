'use client'

import { useState } from 'react'
import SelectFile from '@components/SelectFile'
import BackButton from '@components/IconToggleButtons/BackButton'

const ImagesServerContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)

  const [directory, setDirectory] = useState('')
  const [selectedFile, setSelectedFile] = useState()
  const [filesCount, setFilesCount] = useState()

  const goBack = () => {
    const parts = directory.split('/')
    const newDirectory = parts.slice(0, -1).join('/')
    setDirectory(newDirectory)
  }

  return (
    <div className="flex flex-col gap-y-0.5 max-h-full min-h-full">
      <div className="flex items-center p-1 gap-x-2">
        <BackButton onClick={goBack} disabled={!directory} />
        <div className="flex-1">/{directory}</div>
        <div>{filesCount} шт.</div>
      </div>
      <div className="flex-1 overflow-y-scroll">
        <SelectFile
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          onSelectDir={setDirectory}
          directory={directory}
          setFilesCount={setFilesCount}
          canDeleteFile
          // onDeleteFile={onDeleteFile}
          // aspect={aspect}
          // images={imagesNames.map(
          //   (imageName) =>
          //     `https://escalioncloud.ru/uploads/${imageFolder}/${directory}/preview/${imageName}`
          // )}
        />
      </div>
    </div>
  )
}

export default ImagesServerContent
