"use client"
interface HeadingProps{
    title:string,
    desc:string
}
const Heading = ({title,desc}:HeadingProps) => {
  return (
    <div className=" w-full">
        <h2 className=" text-3xl font-bold tracking-tight">{title}</h2>
        <p className=" text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

export default Heading