"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import CellAction from "./CellAction"
import CellImage from "./cellImage"

export type OrderColumns = {
    id: string;
    isPaid: boolean;
    phone: string;
    address: string;
    order_status: string;
    products: string;
    totalPrice:string;
    images:string[];
    createdAt: string;
}

export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({row})=>{
      <div className=" grid grid-cols-2 gap-2">
        <CellImage data={row.original.images} />
      </div>
    }
  },
  {
    accessorKey: "products",
    header: "Items"
  },
  {
    accessorKey: "phone",
    header: "Contact"
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "totalPrice",
    header: "Total"
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Paid
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Order Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id:"actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]
