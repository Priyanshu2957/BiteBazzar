"use client"

import { useParams, useRouter } from "next/navigation"
import { BillboardColumn } from "./columns"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Delete, Edit, MoreVertical, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/lib/firebase"
import axios from "axios"
import DeleteModal from "@/components/modal/delete-modal"

interface CellActionProps{
    data:BillboardColumn
}
const CellAction = ({data}:CellActionProps) => {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const onCopy =(id:string)=>{
        navigator.clipboard.writeText(id)
        toast.success("Copied!")
    }
    const onDeleteStore = async()=>{
        try {
            setIsLoading(true)
            
            await deleteObject(ref(storage,data.imageUrl)).then(async()=>{
                await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            })
            toast.success("Billboard Removed...")
            // window.location.assign(`/${resp.data.id}`)
            router.push(`/${params.storeId}/billboards`)
            location.reload();
            
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!!")
            
        }finally{
            setIsLoading(false)
            setOpen(false)
            router.refresh();
        }
    }
  return (
    <>
    <DeleteModal 
        isOpen={open}
        onClose={()=> setOpen(false)}
        onDelete={onDeleteStore}
        loading={isLoading}
    />  
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className=" w-8 h-8 p-0" variant={"ghost"}>
                <span className=" sr-only">Open</span>
                <MoreVertical className=" h-4 w-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/billboards/${data.id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{setOpen(true)}}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction