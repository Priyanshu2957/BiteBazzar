"use client"

import { useEffect, useState } from "react"
import Modal from "../modal"
import { Button } from "../ui/button"

interface DeleteModalProps{
    isOpen:boolean,
    onClose:()=>void,
    onDelete:()=>void
    loading:boolean
}

const DeleteModal = ({isOpen,onClose,onDelete,loading}:DeleteModalProps) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)

    },[])
    if(!isMounted){
        return null;
    }
  return (
    <Modal title="Are you sure??" description="Once Deleted It cannot be recovered!!" isOpen={isOpen} onClose={onClose}>
        <div className=" pt-6 space-x-2 flex items-center justify-end w-full">
            <Button disabled={loading} variant={"outline"} onClick={onClose}>
                Cancel
            </Button>
            <Button disabled={loading} variant={"destructive"} onClick={onDelete}>
                Delete
            </Button>
        </div>
    </Modal>
  )
}

export default DeleteModal