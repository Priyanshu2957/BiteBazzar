import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req : Request)=>{
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
        const storeData={
            name,
            userId,
            createdAt:serverTimestamp()
        }
        //Adding data in firebase and retrieving its userId
        const storeRef = await addDoc(collection(db,"stores"),storeData)

        //get the id
        const id = storeRef.id

        await updateDoc(doc(db,"stores",id),{
            ...storeData,
            id,
            updatedAt: serverTimestamp()
        })
        return NextResponse.json({id,...storeData})
    } catch (error) {
        console.log(`STORES_POST:${error}`);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}