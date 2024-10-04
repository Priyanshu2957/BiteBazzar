import { db, storage } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (req : Request,{params}:{params:{storeId:string}})=>{
    try {
        const {userId} = auth()
        const body = await req.json()

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }

        const {name} = body;
        if(!name){
            return new NextResponse("No Store Name",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("Store ID is missing",{status:400})
        }
        const docRef = doc(db,"stores",params.storeId)
        await updateDoc(docRef,{name})
        const store = (await getDoc(docRef)).data() as Store
        return NextResponse.json(store)
    } catch (error) {
        console.log(`STORES_PATCH:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}
export const DELETE = async (req : Request,{params}:{params:{storeId:string}})=>{
    try {
        const {userId} = auth()
        

        if(!userId){
            return new NextResponse("Un-Authorized",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("Store ID is missing",{status:400})
        }
        const docRef = doc(db,"stores",params.storeId)

        //Delete Billboards

        const billboardsSnap = await getDocs(
            collection(db,`stores/${params.storeId}/billboards`)
        )
            billboardsSnap.forEach(async(billboardDoc)=>{
            await deleteDoc(billboardDoc.ref)
        
            const imageUrl = billboardDoc.data().imageUrl
            if(imageUrl){
                const imageRef= ref(storage,imageUrl)
                await deleteObject(imageRef)
            }
    })

        //Delete categories
        const categoriesSnap = await getDocs(
            collection(db,`stores/${params.storeId}/categories`)
        )
            categoriesSnap.forEach(async(categoryDoc)=>{
            await deleteDoc(categoryDoc.ref)
    })

        //Delete sizes
        const sizesSnap = await getDocs(
            collection(db,`stores/${params.storeId}/sizes`)
        )
            sizesSnap.forEach(async(sizeDoc)=>{
            await deleteDoc(sizeDoc.ref)
    })
        //Delete kitchens
        const kitchensSnap = await getDocs(
            collection(db,`stores/${params.storeId}/kitchens`)
        )
            kitchensSnap.forEach(async(kitchenDoc)=>{
            await deleteDoc(kitchenDoc.ref)
    })
        //Delete cuisines
        const cuisinesSnap = await getDocs(
            collection(db,`stores/${params.storeId}/cuisines`)
        )
            cuisinesSnap.forEach(async(cuisineDoc)=>{
            await deleteDoc(cuisineDoc.ref)
    })
        //Delete products
        const productsSnap = await getDocs(
            collection(db,`stores/${params.storeId}/products`)
        )
            productsSnap.forEach(async(productDoc)=>{
            await deleteDoc(productDoc.ref)

            const imagesUrl = productDoc.data().images;
            if(imagesUrl && Array.isArray(imagesUrl)){
                await Promise.all(
                    imagesUrl.map(async(image)=>{
                        const imageRef = ref(storage,image.url)
                        await deleteObject(imageRef);
                    })
                )
            }
    })
        //Delete orders

        const ordersSnap = await getDocs(
            collection(db,`stores/${params.storeId}/orders`)
        )
            ordersSnap.forEach(async(orderDoc)=>{
                await deleteDoc(orderDoc.ref)
            const itemsArray = orderDoc.data().orderItems;
            if(itemsArray && Array.isArray(itemsArray)){
                await Promise.all(
                    itemsArray.map(async(item)=>{
                        const imageArray = item.images;
                        if(imageArray && Array.isArray(imageArray)){
                            await Promise.all(
                                imageArray.map(async (image)=>{
                                    const imageRef = ref(storage,image.url)
                                    await deleteObject(imageRef)
                                })
                            )
                        }
                    })
                )
            }
    })
        await deleteDoc(docRef)
        return NextResponse.json({msg:"Store Deleted"})
    } catch (error) {
        console.log(`STORES_PATCH:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}