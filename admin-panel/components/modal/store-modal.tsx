"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../modal"
import {z} from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios, {} from "axios"
import toast from "react-hot-toast";
const FormSchema = z.object({
    name: z.string().min(3,{message:"Name should be minimum of 3 characters"})
})

const StoreModal = () => {
    const stModal = useStoreModal();
    const [IsLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver:zodResolver(FormSchema),
        defaultValues:{
            name:""
        }
    })
    const onSubmit= async(values:z.infer<typeof FormSchema>)=>{
        try {
            setIsLoading(true)
            const resp = await axios.post('/api/stores',values);
            const st_name = resp.data.name;
            toast.success(`${st_name}`+" store created...")
            window.location.assign(`/${resp.data.id}`)
            
        } catch (error) {
            // console.log(error);
            toast.error("Something went wrong!!")
            
        }finally{
            setIsLoading(false)
        }
        
    }
  return (
    <Modal
    title='Create a new store'
    description='Add a new store to manage the products'
    isOpen={stModal.isOpen}
    onClose={stModal.onClose}
    >
   <div>
        <div className=" space-y-4 py-7 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="name" render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={IsLoading}
                                    placeholder="Your Store Name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className=" pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button type="button"  disabled={IsLoading} variant={"outline"} size={"sm"}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={IsLoading} size={"sm"}>
                            Next
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
   </div>
    </Modal>
)
}

export default StoreModal