"use client"

import { Store } from "@/types-db"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Check, ChevronsUpDown, StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import StoreListItem from "./storeListItem"
import { useStoreModal } from "@/hooks/use-store-modal"
import { CommandSeparator } from "cmdk"
import CreateNewStore from "./CreateNewStore"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface storeSwitcherProps extends PopoverTriggerProps{
    items : Store[]
}
const StoreSwitcher = ({items}:storeSwitcherProps) => {
    const params = useParams();
    const router = useRouter();
    const storeModal =useStoreModal();
    const formattedStore = items.map(item=>({
        label : item.name,
        value : item.id
    }))
    const currentStore = formattedStore.find(item=> item.value === params.storeId)
    const [searchTerm, setSearchTerm] = useState("")
    const [filtered, setFiltered] = useState<{label:string,value:string}[]>([])
    const [open, setOpen] = useState(false)
    const onStoreSelect = (store : {value:string,label:string}) =>{
        setOpen(false)
        router.push(`/${store.value}`)
    }

    const handleSearchTerm=(e:any)=>{
        setSearchTerm(e.target.value)
        setFiltered(
            formattedStore.filter(item=>item.label.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
        <StoreIcon className=" mr-2 h-4 w-4" />
          {currentStore?.value
            ? formattedStore.find((store) => store.value === currentStore?.value)?.label
            : "Select store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className=" w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
          <StoreIcon className=" mr-2 h-4 w-4 min-w-4" />
          <input type="text" placeholder="Search Store.." onChange={handleSearchTerm} className=" flex-1 w-full outline-none"/>
          </div>
          <CommandList>
            <CommandGroup heading="Stores">
              {
                searchTerm===""?(
                    formattedStore.map((item,i)=>(
                        <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStore?.value==item.value} />
                    ))
                ) : filtered.length>0?(
                    filtered.map((item,i)=>(
                        <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStore?.value==item.value} />
                    ))
                ): <CommandEmpty>No Store Found</CommandEmpty>
              }
            </CommandGroup>
          </CommandList>
          <CommandSeparator>
            <CommandList>
                <CommandGroup>
                    <CreateNewStore 
                        onClick={()=>{
                            setOpen(false)
                            storeModal.onOpen()
                        }}
                    />
                </CommandGroup>
            </CommandList>
          </CommandSeparator>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher