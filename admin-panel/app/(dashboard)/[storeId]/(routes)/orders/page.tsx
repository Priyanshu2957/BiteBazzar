import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {Order } from '@/types-db'
import { OrderColumns } from './components/columns'
import {format} from "date-fns"

import OrdersClient from './components/client'
import { formatter } from '@/lib/utils'

const OrdersPage = async({params}:{params:{storeId:string}}) => {
  const ordersData = (
    await getDocs(
      collection(doc(db,"stores",params.storeId),"orders")
    )
  ).docs.map(doc=>doc.data()) as Order[]
  const optimOrders: OrderColumns[] = ordersData.map(item=>({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    address: item.address,
    order_status: item.order_status,
    products: item.orderItems.map(item=>item.name).join(", "),
    totalPrice:formatter.format(
      item.orderItems.reduce((total,item)=>{
        if(item && item.qty !== undefined){
          return total+ Number(item.price*item.qty)
        }
        return total
      },0)
    ),
    images:item.orderItems.map(item=>item.images[0].url),
    createdAt:item.createdAt? format(item.createdAt.toDate(),"MMMM do,yyyy"):""
  }))
  // console.log(ordersData)
  return (
    <div className=' flex-col '>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <OrdersClient data={optimOrders}/>
        </div>
    </div>
  )
}

export default OrdersPage