"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Billboards } from "@/types-db"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import ApiList from "@/components/ui/ApiList"
interface CategoryClientProps{
  data : CategoryColumn[]
}
const CategoryClient = ({data}:CategoryClientProps) => {
    const params = useParams()
    const router = useRouter()
  return (
    <div>
        <div className=" flex items-center justify-between">
            <Heading title={`Categories (${data.length})`} desc="Manage Billboards" />
            <Button onClick={()=> router.push(`/${params.storeId}/categories/create`)}>
                <Plus className=" h-4 w-4 mr-2" />
                Add Now
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />

        <Heading title="API" desc="API calls for categories" />
        <Separator />
        <ApiList entityId="categoryId" entityName="categories" />

    </div>
  )
}

export default CategoryClient