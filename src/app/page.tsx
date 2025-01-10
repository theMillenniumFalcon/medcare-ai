"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme/toggle"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import Report from "@/components/report"
import Chat from "@/components/chat"
import { useToast } from "@/hooks/use-toast"

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
        <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
          <h1 className="text-xl font-semibold w-[200px]">
            <span className="flex flex-row">Medcare-AI</span>
          </h1>
          <div className="w-full flex flex-row justify-end gap-2">
            <ThemeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <Report onReportConfirmation={onReportConfirmation} />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
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
