"use client"
import Image from 'next/image'
import React from 'react'
interface CellImageProps{
    data : string
}
const CellImage = ({data}:CellImageProps) => {
  return (
    <div className=' overflow-hidden w-32 h-16 max-h-16 min-w-32 relative rounded-md shadow-md'>
        <Image 
            src={data}
            fill
            alt='Billboard Image'
            className=' object-cover'
        />
    </div>
  )
}

export default CellImage