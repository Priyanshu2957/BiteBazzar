'use client'
import Modal from '@/components/modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import { UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const SetupPage = () => {
  const onOpen = useStoreModal((state)=>state.onOpen)
  const isOpen = useStoreModal((state)=>state.isOpen)
  useEffect(()=>{
    if(!isOpen){
      onOpen()
    }
  },[isOpen,onOpen])
  return (
    <div>
      
    </div>
  )
}

export default SetupPage