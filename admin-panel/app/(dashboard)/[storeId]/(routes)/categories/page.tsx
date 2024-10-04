import React from 'react'
import BillboardClient from './components/client'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Billboards, Category } from '@/types-db'
import { CategoryColumn } from './components/columns'
import {format} from "date-fns"
import CategoryClient from './components/client'

const CategoryPage = async({params}:{params:{storeId:string}}) => {
  const categoryData = (
    await getDocs(
      collection(doc(db,"stores",params.storeId),"categories")
    )
  ).docs.map(doc=>doc.data()) as Category[]
  const optimcategory : CategoryColumn[] = categoryData.map(item=>({
    id:item.id,
    name:item.name,
    billboardLabel: item.billboardLabel,
    createdAt:item.createdAt? format(item.createdAt.toDate(),"MMMM do,yyyy"):""
  }))
  // console.log(categoryData)
  return (
    <div className=' flex-col '>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <CategoryClient data={optimcategory}/>
        </div>
    </div>
  )
}

export default CategoryPage