import { db } from "@/lib/firebase";
import { Billboards, Category, Size } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
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

        const {name,value} = body;
        if(!name){
            return new NextResponse("Size name is missing",{status:400})
        }
        if(!value){
            return new NextResponse("Store Value is missing",{status:400})
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
        const SizeData = {
            name,
            value,
            createdAt:serverTimestamp()
        }
        const sizeRef = await addDoc(
            collection(db,"stores",params.storeId,"sizes"),SizeData
        )
        const id = sizeRef.id
        await updateDoc(doc(db,"stores",params.storeId,"sizes",id),{
            ...SizeData,
            id,
            updatedAt:serverTimestamp()
        }
    )
    return NextResponse.json({id,SizeData})
    } catch (error) {
        console.log(`SIZES_POST:${error}`);
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
        const SizeData = (await getDocs(
            collection(doc(db,"stores",params.storeId),"sizes")
        )).docs.map(doc=>doc.data()) as Size[];

        return NextResponse.json(SizeData)
    
    } catch (error) {
        console.log(`SIZES_GET:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}