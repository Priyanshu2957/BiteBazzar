"use client"
import UseOrigin from '@/hooks/use-origin'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import ApiAlert from '../api-alert'
interface ApiListProps{
    entityName : string
    entityId : string
}
const ApiList = ({entityId,entityName}:ApiListProps) => {
    const router = useRouter();
    const origin = UseOrigin();
    const params = useParams();
    const baseUrl = `${origin}/api/${params.storeId}`;
    return (
    <div>
        <ApiAlert 
            title='GET'
            variant='public'
            description={`${baseUrl}/${entityName}`}
        />
        <ApiAlert 
            title='GET'
            variant='public'
            description={`${baseUrl}/${entityName}/${entityId}`}
        />
        <ApiAlert 
            title='POST'
            variant='admin'
            description={`${baseUrl}/${entityName}`}
        />
        <ApiAlert 
            title='PATCH'
            variant='admin'
            description={`${baseUrl}/${entityName}/${entityId}`}
        />
        <ApiAlert 
            title='DELETE'
            variant='admin'
            description={`${baseUrl}/${entityName}/${entityId}`}
        />
    </div>
  )
}

export default ApiList