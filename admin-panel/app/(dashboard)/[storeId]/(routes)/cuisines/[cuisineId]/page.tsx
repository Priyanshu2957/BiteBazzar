import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {Cuisine } from '@/types-db'
import CuisineForm from './_components/CuisineForm'

const CuisinePage = async({params}:{params:{storeId:string,cuisineId:string}}) => {
    const cuisine=(await getDoc(doc(db,"stores",params.storeId,"cuisines",params.cuisineId))).data() as Cuisine;
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <CuisineForm initialData={cuisine} />
        </div>
    </div>
  )
}

export default CuisinePage