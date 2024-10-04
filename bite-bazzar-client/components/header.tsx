"use client"

import { cn } from "@/lib/utils"
import Container from "./container"
import Link from "next/link"

interface headerProps{
    userId: string | null
}
const Header = ({userId}:headerProps) => {
  return (
    <header className={cn("w-full z-50 transition")}>
        <Container>
            <div className=" relative px-4 sm:px-6 lg:px-12 flex h-16 items-center">
                <Link href={'/'} className=" uppercase flex gap-x-2 font-bold text-neutral-700 text-lg md:text-xl">
                    BITE BAZZAR
                </Link>
            </div>
        </Container>
    </header>
  )
}

export default Header