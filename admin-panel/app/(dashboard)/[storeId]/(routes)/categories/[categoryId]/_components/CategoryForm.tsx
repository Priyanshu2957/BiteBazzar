'use client'

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Billboards, Category} from "@/types-db"
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "@/components/modal/delete-modal";
import ImageUpload from "@/components/imageUpload";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps{
    initialData :Category;
    billboards: Billboards[];
}

const FormSchema = z.object({
        name: z.string().min(1),
        billboardId: z.string().min(1),
    })
const CategoryForm = ({initialData,billboards}:CategoryFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver:zodResolver(FormSchema),
        defaultValues: initialData
    })
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const title = initialData? "Edit Category": "Create Category"
    const toastSucess = initialData? "Category Updated": "Category Created"
    const desc = initialData? "Edit an existing Category": "Add a new Category"
    const action = initialData? "Save Changes": "Create"

    const onSubmit = async(data:z.infer<typeof FormSchema>)=>{
        try {
            setIsLoading(true)
            const {billboardId: formBill} = form.getValues();
            const matchingBill = billboards.find((item)=> item.id===formBill)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,{
                    ...data,
                billboardLabel : matchingBill?.label,
                });
                toast.success("Category name updated...")
            }else{
               await axios.post(`/api/${params.storeId}/categories`,{
                ...data,
                billboardLabel : matchingBill?.label,
               });

               toast.success("Category Created")
            }
            
            // window.location.assign(`/${resp.data.id}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!!")
            
        }finally{
            setIsLoading(false)
        }
    }
    const onDeleteStore = async()=>{
        try {
            setIsLoading(true)
           await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            toast.success("Category Removed...")
            // window.location.assign(`/${resp.data.id}`)
            router.push(`/${params.storeId}/categories`)
            router.refresh();
            
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!!")
            
        }finally{
            setIsLoading(false)
            setOpen(false)
            router.refresh();
        }
    }
  return (
    <div className=" flex flex-col gap-4">
        <DeleteModal 
            isOpen={open}
            onClose={()=> setOpen(false)}
            onDelete={onDeleteStore}
            loading={isLoading}
        />
        <div className=" flex items-center justify-center">
            <Heading title={title} desc={desc}/>
            {initialData && (
                <Button variant={"destructive"} size={"icon"} disabled={isLoading} onClick={()=>setOpen(true)}>
                <Trash className=' h-4 w-4' />
            </Button>
            )}
        </div>
        <Separator />
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className=" grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Your category Label"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="billboardId" render={({field})=>(
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map(billboard=>(
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                        <Button type="submit" disabled={isLoading} size={"sm"} className=" mt-4" >
                            Save Changes
                        </Button>
                </form>
            </Form>
    </div>
  )
}

export default CategoryForm