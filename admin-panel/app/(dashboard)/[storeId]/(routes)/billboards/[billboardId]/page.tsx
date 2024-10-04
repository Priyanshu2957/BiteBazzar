import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import BillboardForm from './_components/BillboardForm'
import { Billboards } from '@/types-db'

const BillboardPage = async({params}:{params:{storeId:string,billboardId:string}}) => {
    const billB=(await getDoc(doc(db,"stores",params.storeId,"billboards",params.billboardId))).data() as Billboards;
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <BillboardForm initialData={billB} />
        </div>
    </div>
  )
}

export default BillboardPage