import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {Size } from '@/types-db'
import SizeForm from './_components/SizeForm'

const BillboardPage = async({params}:{params:{storeId:string,sizeId:string}}) => {
    const size=(await getDoc(doc(db,"stores",params.storeId,"sizes",params.sizeId))).data() as Size;
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <SizeForm initialData={size} />
        </div>
    </div>
  )
}

export default BillboardPage