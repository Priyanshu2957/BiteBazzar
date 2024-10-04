"use client"

import { PlusCircle } from "lucide-react"

interface CreateNewStoreProps{
    onClick:()=> void
}
const CreateNewStore = ({onClick}:CreateNewStoreProps) => {
  return (
    <div onClick={onClick} className="flex items-center px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary">
        <PlusCircle className=" mr-2 h-5 w-5" />
        Create Store
    </div>
  )
}

export default CreateNewStore