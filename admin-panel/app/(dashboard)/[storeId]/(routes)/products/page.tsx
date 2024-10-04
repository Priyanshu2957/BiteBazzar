import React from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {Product } from '@/types-db'
import { ProductColumns } from './components/columns'
import {format} from "date-fns"

import ProductsClient from './components/client'
import { formatter } from '@/lib/utils'

const ProductsPage = async({params}:{params:{storeId:string}}) => {
  const productsData = (
    await getDocs(
      collection(doc(db,"stores",params.storeId),"products")
    )
  ).docs.map(doc=>doc.data()) as Product[]
  const optimProducts: ProductColumns[] = productsData.map(item=>({
    id:item.id,
    name:item.name,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category,
    size: item.size,
    kitchen: item.kitchen,
    cuisine: item.cuisine,
    images:item.images,
    createdAt:item.createdAt? format(item.createdAt.toDate(),"MMMM do,yyyy"):""
  }))
  // console.log(productsData)
  return (
    <div className=' flex-col '>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <ProductsClient data={optimProducts}/>
        </div>
    </div>
  )
}

export default ProductsPage