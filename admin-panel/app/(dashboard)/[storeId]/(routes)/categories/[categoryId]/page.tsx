import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { Billboards, Category } from '@/types-db'
import CategoryForm from './_components/CategoryForm'

const BillboardPage = async({params}:{params:{storeId:string,categoryId:string}}) => {
    const category=(await getDoc(doc(db,"stores",params.storeId,"categories",params.categoryId))).data() as Category;
    const billboardData = (
      await getDocs(
        collection(doc(db,"stores",params.storeId),"billboards")
      )
    ).docs.map(doc=>doc.data()) as Billboards[]
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <CategoryForm initialData={category} billboards={billboardData} />
        </div>
    </div>
  )
}

export default BillboardPage