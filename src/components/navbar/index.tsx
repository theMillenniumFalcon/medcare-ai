import Link from "next/link"
import { Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme/toggle"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import Report from "../report"

type NavbarProps = {
    isHomePage?: boolean
    onReportConfirmation?: (data: string) => void
}

export default function Navbar({ isHomePage, onReportConfirmation }: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 flex h-[57px] bg-background items-center gap-1 border-b px-4">
            <h1 className="text-lg md:text-xl font-semibold w-[160px] md:w-[130px]">
                <Link href="/">
                    <span className="flex flex-row">Medcare-AI</span>
                </Link>
            </h1>
            <div className="w-full flex flex-row justify-end gap-2">
                <ThemeToggle />
                {isHomePage && (
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
                )}
            </div>
        </header>
    )
}