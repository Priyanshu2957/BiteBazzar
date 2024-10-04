import { cn } from '@/lib/utils'
import React from 'react'
interface containerProps{
    classname?: string,
    children : React.ReactNode
}
const Container = ({classname,children}:containerProps) => {
  return (
    <div className={cn("mx-auto max-w-7xl ", classname)}>
        {children}
    </div>
  )
}

export default Container