"use client"

import StoreModal from "@/components/modal/store-modal"
import { useEffect, useState } from "react"

const ModalProvider = () => {
    const [IsMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!IsMounted){
        return null
    }
    return(
        <>
            <StoreModal />
        </>
    )
}

export default ModalProvider