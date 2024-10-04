"use client"

import Image from "next/image";

interface CellImageProps{
    data:string[];
}

const CellImage = ({data}:CellImageProps) => {
  return (
    <div>
        {
            data.map((url,index)=>(
                <div key={index} className="overflow-hidden w-16 h-16 min-h-16 min-w-16 aspect-square rounded-md items-center justify-center">
                    <Image 
                        alt="image" fill className="object-contain" src={url}
                    />
                </div>
            ))
        }
    </div>
  )
}

export default CellImage