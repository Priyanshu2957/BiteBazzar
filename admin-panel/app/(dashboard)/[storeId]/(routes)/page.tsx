import { db } from "@/lib/firebase"
import { Store } from "@/types-db"
import { doc, getDoc } from "firebase/firestore"

interface DashboardOverviewPropss{
  params: {storeId : string}
}

const DashboardOverview = async({params}: DashboardOverviewPropss) => {
  const store = (await getDoc(doc(db,"stores",params.storeId))).data() as Store
  return (
    <div>DashboardOverview :{store.name}</div>
  )
}

export default DashboardOverview