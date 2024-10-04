"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Billboards } from "@/types-db"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderColumns, columns } from "./columns"
import ApiList from "@/components/ui/ApiList"
interface OrdersClientProps{
  data : OrderColumns[]
}
const OrdersClient = ({data}:OrdersClientProps) => {
    const params = useParams()
    const router = useRouter()
  return (
    <div>
        <div className=" flex items-center justify-between">
            <Heading title={`Orders (${data.length})`} desc="Manage Orders" />
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />

    </div>
  )
}

export default OrdersClient