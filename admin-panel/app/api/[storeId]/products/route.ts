import { db } from "@/lib/firebase";
import { Billboards, Category, Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, and, collection, doc, getDoc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST=async(req: Request,
    {params}:{params:{storeId:string}}
)=>{
    try {
        const {userId} = auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {
            name,
            price,
            images,
            isFeatured,
            isArchived,
            category,
            size,
            kitchen,
            cuisine,
        } = body;
        if(!name){
            return new NextResponse("Product name is missing",{status:400})
        }
        if(!price){
            return new NextResponse("Price is missing",{status:400})
        }
        if(!images || !images.length){
            return new NextResponse("No images!!",{status:400})
        }
        if(!category){
            return new NextResponse("Category is missing",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }
        const store = await getDoc(doc(db,"stores",params.storeId))
        if(store.exists()){
            let storeData = store.data();
            if (storeData?.userId != userId){
                return new NextResponse("Un-Authorized Acess",{status:500})
            }
        }
        const ProductData = {
            name,
            price,
            images,
            isFeatured,
            isArchived,
            category,
            size,
            kitchen,
            cuisine,
            createdAt:serverTimestamp()
        }
        const productRef = await addDoc(
            collection(db,"stores",params.storeId,"products"),ProductData
        )
        const id = productRef.id
        await updateDoc(doc(db,"stores",params.storeId,"products",id),{
            ...ProductData,
            id,
            updatedAt:serverTimestamp()
        }
    )
    return NextResponse.json({id,ProductData})
    } catch (error) {
        console.log(`PRODUCTS_POST:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}
export const GET=async(req: Request,
    {params}:{params:{storeId:string}}
)=>{
    try {
        if(!params.storeId){
            return new NextResponse("Store Id is missing",{status:400})
        }
        //search param

        const {searchParams} = new URL(req.url)

        const productRef = collection(doc(db,"stores",params.storeId),"products")
        let productQuery;

        let queryConstrains = []
        if(searchParams.has("size")){
            queryConstrains.push(where("size","==",searchParams.get('size')))
        }
        if(searchParams.has("category")){
            queryConstrains.push(where("category","==",searchParams.get('category')))
        }
        if(searchParams.has("kitchens")){
            queryConstrains.push(where("kitchens","==",searchParams.get('kitchens')))
        }
        if(searchParams.has("cuisines")){
            queryConstrains.push(where("cuisines","==",searchParams.get('cuisines')))
        }
        if(searchParams.has("isFeatured")){
            queryConstrains.push(where("isFeatured","==",searchParams.get('isFeatured') === 'true'?true:false))
        }
        if(searchParams.has("isArchived")){
            queryConstrains.push(where("isArchived","==",searchParams.get('isArchived') === 'true'?true:false))
        }
        if(queryConstrains.length>0){
            productQuery=query(productRef,and(...queryConstrains))
        }
        else{
            productQuery=query(productRef)
        }
        //execute query
        const querySnapshot = await getDocs(productQuery)

        const productData : Product[] = querySnapshot.docs.map((doc)=>doc.data() as Product)
        return NextResponse.json(productData)
    
    } catch (error) {
        console.log(`PRODUCTS_GET:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}