import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {Kitchen } from '@/types-db'
import KitchenForm from './_components/KitchenForm'

const KitchenPage = async({params}:{params:{storeId:string,kitchenId:string}}) => {
    const kitchen=(await getDoc(doc(db,"stores",params.storeId,"kitchens",params.kitchenId))).data() as Kitchen;
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <KitchenForm initialData={kitchen} />
        </div>
    </div>
  )
}

export default KitchenPage