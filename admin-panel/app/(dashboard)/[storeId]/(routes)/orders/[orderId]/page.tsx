import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {Order } from '@/types-db'
import KitchenForm from './_components/OrderForm'
import OrderForm from './_components/OrderForm'

const OrderPage = async({params}:{params:{storeId:string,orderId:string}}) => {
    const order=(await getDoc(doc(db,"stores",params.storeId,"orders",params.orderId))).data() as Order;
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <OrderForm initialData={order} />
        </div>
    </div>
  )
}

export default OrderPage