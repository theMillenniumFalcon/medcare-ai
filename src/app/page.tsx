"use client"

import { useState } from "react"
import Report from "@/components/report"
import Chat from "@/components/chat"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function Home() {
  const { toast } = useToast()
  const [reportData, setreportData] = useState("")
  const onReportConfirmation = (data: string) => {
    setreportData(data)
    toast({
      description: "Updated!"
    })
  }

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <Navbar isHomePage onReportConfirmation={onReportConfirmation} />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="hidden md:flex flex-col">
            <Report onReportConfirmation={onReportConfirmation} />
          </div>
          <div className="lg:col-span-2">
            <Chat reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  )
}
