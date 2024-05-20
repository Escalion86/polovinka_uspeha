'use client'

import { useState } from 'react'
import SelectFile from '@components/SelectFile'
import BackButton from '@components/IconToggleButtons/BackButton'

const ImagesServerContent = () => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [directory, setDirectory] = useState('')
  const [selectedFile, setSelectedFile] = useState()
  const [filesCount, setFilesCount] = useState()

  console.log('directory :>> ', directory)
  console.log('selectedFile :>> ', selectedFile)

  const goBack = () => {
    const parts = directory.split('/')
    const newDirectory = parts.slice(0, -1).join('/')
    setDirectory(newDirectory)
  }

  return (
    <div className="flex flex-col gap-y-0.5 max-h-full">
      <div className="flex items-center p-1 gap-x-2">
        <BackButton onClick={goBack} disabled={!directory} />
        <div className="flex-1">/{directory}</div>
        <div>{filesCount} шт.</div>
      </div>
      <div className="max-h-[calc(100%-50px)] h-[calc(100%-50px)] overflow-scroll">
        <SelectFile
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          onSelectDir={setDirectory}
          directory={directory}
          setFilesCount={setFilesCount}
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
