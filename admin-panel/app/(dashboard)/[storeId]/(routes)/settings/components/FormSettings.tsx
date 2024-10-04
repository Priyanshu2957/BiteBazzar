'use client'

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Store } from "@/types-db"
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
import ApiAlert from "@/components/api-alert";
import UseOrigin from "@/hooks/use-origin";

interface FormSettingsProps{
    initialData :Store;
}

const FormSchema = z.object({
        name: z.string().min(3,{message:"Name should be minimum of 3 characters"})
    })
const FormSettings = ({initialData}:FormSettingsProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver:zodResolver(FormSchema),
        defaultValues: initialData
    })
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const origin = UseOrigin()
    const onSubmit = async(data:z.infer<typeof FormSchema>)=>{
        try {
            setIsLoading(true)
            const resp = await axios.patch(`/api/stores/${params.storeId}`,data);
            toast.success("Store name updated...")
            // window.location.assign(`/${resp.data.id}`)
            router.refresh();
            
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
            const resp = await axios.delete(`/api/stores/${params.storeId}`);
            toast.success("Store Deleted...")
            // window.location.assign(`/${resp.data.id}`)
            router.push('/')
            router.refresh();
            
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!!")
            
        }finally{
            setIsLoading(false)
            setOpen(false)
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
            <Heading title="Settings" desc="Manage Store Preferences" />
            <Button variant={"destructive"} size={"icon"} onClick={()=>setOpen(true)}>
                <Trash className=' h-4 w-4' />
            </Button>
        </div>
        <Separator />
        <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className=" grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Your Store Name"
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
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </div>
  )
}

export default FormSettings