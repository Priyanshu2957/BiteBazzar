import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
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

        const {label,imageUrl} = body;
        if(!label){
            return new NextResponse("Billboard name is missing",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("Billboard image is missing",{status:400})
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
        const BillboardData = {
            label,
            imageUrl,
            createdAt: serverTimestamp()
        }
        const billboardRef = await addDoc(
            collection(db,"stores",params.storeId,"billboards"),BillboardData
        )
        const id = billboardRef.id
        await updateDoc(doc(db,"stores",params.storeId,"billboards",id),{
            ...BillboardData,
            id,
            updatedAt:serverTimestamp()
        }
    )
    return NextResponse.json({id,BillboardData})
    } catch (error) {
        console.log(`STORES_POST:${error}`);
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
        const BillboardData = (await getDocs(
            collection(doc(db,"stores",params.storeId),"billboards")
        )).docs.map(doc=>doc.data()) as Billboards[];

        return NextResponse.json(BillboardData)
    
    } catch (error) {
        console.log(`STORES_POST:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}