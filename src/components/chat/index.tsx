import { useChat } from "ai/react"
import { CornerDownLeft, Loader2, TextSearch } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import Messages from "../messages"
import Markdown from "../markdown"

type ChatProps = {
    reportData?: string
}

export default function Chat({ reportData }: ChatProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
        api: "/api/chat",
    })

    return (
        <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
            <Badge variant={'outline'} className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}>
                {reportData ? "✓ Report Added" : "No Report Added"}
            </Badge>
            <div className="flex-1" />
            <Messages messages={messages} isLoading={isLoading} />
            {(data?.length !== undefined && data.length > 0) && (
                <Accordion type="single" className="text-sm" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger dir="">
                            <span className="flex flex-row items-center gap-2"><TextSearch /> Relevant Info</span>
                        </AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap">
                            <Markdown text={(data[data.length - 1] as any).retrievals as string} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
            <form
                className="relative overflow-hidden rounded-lg border bg-background"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit(event, {
                        data: {
                            reportData: reportData as string,
                        },
                    })
                }}
            >
                <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your query here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                <Button
                    disabled={isLoading}
                    type="submit"
                    size="sm"
                    className="ml-auto"
                >
                    {isLoading ? "Analyzing..." : "3. Ask"}
                    {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                        <CornerDownLeft className="size-3.5" />
                    )}
                </Button>
                </div>
            </form>
        </div>
    )
}