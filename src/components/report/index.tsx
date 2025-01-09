"use client"

import React, { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type ReportProps = {
    onReportConfirmation: (data: string) => void
}

export default function Report({ onReportConfirmation }: ReportProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [reportData, setReportData] = useState("")

    const handleReportSelection = () => {}

    const extractDetails = () => {}

    return (
        <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
            <fieldset className='relative grid gap-6 rounded-lg border p-4'>
                <legend className="text-sm font-medium">Report</legend>
                {isLoading && (
                    <div className="absolute z-10 h-full w-full bg-card/90 rounded-lg flex flex-row items-center justify-center">
                        extracting...
                    </div>
                )}
                <Input type='file' onChange={handleReportSelection} />
                <Button onClick={extractDetails}>1. Upload File</Button>
                <Label>Report Summary</Label>
                <Textarea
                    value={reportData}
                    onChange={(e) => setReportData(e.target.value)}
                    placeholder="Extracted data from the report will appear here. Get better recommendations by providing additional patient history and symptoms..."
                    className="min-h-72 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                    <Button
                        variant="destructive"
                        className="bg-[#D90013]"
                        onClick={() => onReportConfirmation(reportData)}
                    >
                        2. Looks Good
                    </Button>
            </fieldset>
        </div>
    )
}