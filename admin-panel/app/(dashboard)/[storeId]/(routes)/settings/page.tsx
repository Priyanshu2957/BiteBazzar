import { db } from '@/lib/firebase'
import { Store } from '@/types-db'
import { auth } from '@clerk/nextjs/server'
import { doc, getDoc } from 'firebase/firestore'
import { redirect } from 'next/navigation'
import FormSettings from './components/FormSettings'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

interface PageSettingsProps{
    params:{
        storeId : string
    }
}
const PageSettings = async({params}:PageSettingsProps) => {
    const {userId} = auth();
    if(!userId){
        redirect('/sign-in')
    }
    const store = (await getDoc(doc(db,"stores",params.storeId))).data() as Store
    if(!store || store.userId!=userId){
        redirect("/");
    }
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-5 p-8 pt-6'>
            <FormSettings initialData={store} />
        </div>
    </div>
  )
}

export default PageSettings