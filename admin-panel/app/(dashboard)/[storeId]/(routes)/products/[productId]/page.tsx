import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {Category, Cuisine, Kitchen, Product, Size } from '@/types-db'
import ProductForm from './_components/ProductForm'

const ProductPage = async({params}:{params:{storeId:string,productId:string}}) => {
    const product=(await getDoc(doc(db,"stores",params.storeId,"products",params.productId))).data() as Product;
    const categoriesData = (
      await getDocs(collection(doc(db,"stores",params.storeId),"categories"))
    ).docs.map(doc=>doc.data()) as Category[]

    const sizesData = (
      await getDocs(collection(doc(db,"stores",params.storeId),"sizes"))
    ).docs.map(doc=>doc.data()) as Size[]

    const kitchensData = (
      await getDocs(collection(doc(db,"stores",params.storeId),"kitchens"))
    ).docs.map(doc=>doc.data()) as Kitchen[]

    const cuisinesData = (
      await getDocs(collection(doc(db,"stores",params.storeId),"cuisines"))
    ).docs.map(doc=>doc.data()) as Cuisine[]
  return (
    <div className=' flex-col m-6'>
        <div className=' flex-1'>
            <ProductForm initialData={product} categories={categoriesData} kitchens={kitchensData} sizes={sizesData} cuisines={cuisinesData} />
        </div>
    </div>
  )
}

export default ProductPage