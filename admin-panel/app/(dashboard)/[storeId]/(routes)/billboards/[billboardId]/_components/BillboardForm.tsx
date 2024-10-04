'use client'

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Billboards} from "@/types-db"
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

interface BillboardFormProps{
    initialData :Billboards;
}

const FormSchema = z.object({
        label: z.string().min(1),
        imageUrl: z.string().min(1),
    })
const BillboardForm = ({initialData}:BillboardFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver:zodResolver(FormSchema),
        defaultValues: initialData
    })
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const title = initialData? "Edit Billboard": "Create Billboard"
    const toastSucess = initialData? "Billboard Updated": "Billboard Created"
    const desc = initialData? "Edit an existing Billboard": "Add a new Billboard"
    const action = initialData? "Save Changes": "Create"

    const onSubmit = async(data:z.infer<typeof FormSchema>)=>{
        try {
            setIsLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);
                toast.success("Billbaord name updated...")
            }else{
               await axios.post(`/api/${params.storeId}/billboards`,data);
               toast.success("Billbaord Created")
            }
            
            // window.location.assign(`/${resp.data.id}`)
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            
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
            const {imageUrl} = form.getValues()
            await deleteObject(ref(storage,imageUrl)).then(async()=>{
                await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            })
            toast.success("Billboard Removed...")
            // window.location.assign(`/${resp.data.id}`)
            router.push(`/${params.storeId}/billboards`)
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
                    <FormField 
                        control={form.control}
                        name="imageUrl"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Billboard Image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value?[field.value]:[]}
                                        disabled={isLoading}
                                        onChange={(url)=>field.onChange(url)}
                                        onRemove={()=>field.onChange("")
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <div className=" grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" render={({field})=>(
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Your Billboard Label"
                                        {...field}
                                    />
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

export default BillboardForm