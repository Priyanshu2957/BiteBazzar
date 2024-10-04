'use client'

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import {Category, Cuisine, Kitchen, Product, Size} from "@/types-db"
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
// import ImageUpload from "@/components/imageUpload";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImagesUpload from "@/components/imagesUpload";

interface ProductFormProps{
    initialData :Product;
    categories : Category[],
    sizes: Size[],
    kitchens : Kitchen[],
    cuisines : Cuisine[]
}

const FormSchema = z.object({
        name: z.string().min(1),
        price: z.coerce.number().min(1),
        images : z.object({url : z.string()}).array(),
        isFeatured : z.boolean().default(false).optional(),
        isArchived : z.boolean().default(false).optional(),
        category : z.string().min(1),
        size : z.string().min(1),
        cuisine : z.string().min(1),
        kitchen : z.string().min(1),
    })
const ProductForm = ({initialData,categories,sizes,kitchens,cuisines}:ProductFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver:zodResolver(FormSchema),
        defaultValues: initialData || {
            name :"",
            price:0,
            images:[],
            isFeatured:false,
            isArchived: false,
            category:"",
            size:"",
            kitchen:"",
            cuisine:""
        }
    })
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const title = initialData? "Edit Product": "Create Product"
    const toastSucess = initialData? "Product Updated": "Product Created"
    const desc = initialData? "Edit an existing Product": "Add a new Product"
    const action = initialData? "Save Changes": "Create"

    const onSubmit = async(data:z.infer<typeof FormSchema>)=>{
        try {
            setIsLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
                toast.success("Product name updated...")
            }else{
               await axios.post(`/api/${params.storeId}/products`,data);

               toast.success("Product Created")
            }
            
            // window.location.assign(`/${resp.data.id}`)
            router.push(`/${params.storeId}/products`)
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
           await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            toast.success("Product Removed...")
            // window.location.assign(`/${resp.data.id}`)
            router.push(`/${params.storeId}/products`)
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
                        name="images"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Billboard Image</FormLabel>
                                <FormControl>
                                    <ImagesUpload
                                        value={field.value.map(image => image.url)}
                                        onChange={(urls) =>{
                                            field.onChange(urls.map((url) => ({url})))
                                        }}
                                        onRemove = {(url)=>
                                            field.onChange(
                                                field.value.filter(current => current.url !== url)
                                            )
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}

                    />
                    <div className=" grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={isLoading}
                                        placeholder="Product Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="price" render={({field})=>(
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="number"
                                        disabled={isLoading}
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="category" render={({field})=>(
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(categories=>(
                                                <SelectItem key={categories.id} value={categories.name}>
                                                    {categories.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="size" render={({field})=>(
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map(size=>(
                                                <SelectItem key={size.id} value={size.name}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="kitchen" render={({field})=>(
                            <FormItem>
                                <FormLabel>Kitchen</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a kitchen">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {kitchens.map(kitchen=>(
                                                <SelectItem key={kitchen.id} value={kitchen.name}>
                                                    {kitchen.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="cuisine" render={({field})=>(
                            <FormItem>
                                <FormLabel>Cuisine</FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a cuisine">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cuisines.map(cuisine=>(
                                                <SelectItem key={cuisine.id} value={cuisine.name}>
                                                    {cuisine.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        

                        <FormField control={form.control} name="isFeatured" render={({field})=>(
                            <FormItem className=" flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className=" space-y-1 leading-none">
                                <FormLabel>
                                    Featured
                                </FormLabel>
                                <FormDescription>
                                    This product will be on homescreen under featured Section
                                </FormDescription>
                                </div>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="isArchived" render={({field})=>(
                            <FormItem className=" flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className=" space-y-1 leading-none">
                                <FormLabel>
                                    Archived
                                </FormLabel>
                                <FormDescription>
                                    This product will not be displayed amywhere
                                </FormDescription>
                                </div>
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

export default ProductForm