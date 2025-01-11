"use client"

import React, { useState } from "react"
import { LucideLoader2, RefreshCcw } from "lucide-react"
import Navbar from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function Update() {
    const { toast } = useToast()
    const [isAuthorized, setIsAuthorized] = useState(true)
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isUploading, setisUploading] = useState(false)
    const [indexname, setIndexname] = useState("")
    const [namespace, setNamespace] = useState("")
    const [fileListAsText, setfileListAsText] = useState("")
    const [filename, setFilename] = useState("")
    const [progress, setProgress] = useState(0)

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if (password === process.env.ADMIN_PASSWORD) {
            setIsAuthorized(true)
            setError("")
        } else {
            setError("Incorrect password")
        }
    }

    const onFileListRefresh = async () => {}

    const onStartUpload = async () => {
        setProgress(0)
        setFilename("")
        setisUploading(true)
        const response = await fetch("/api/update-database", {
            method: 'POST', body: JSON.stringify({ indexname, namespace })
        })
        await processStreamedProgress(response)
    }

    const processStreamedProgress = async (response: Response) => {
        const reader = response.body?.getReader()
        if (!reader) {
            toast({
                variant: "destructive",
                description: "error updating database",
            })
            return
        }
        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    setisUploading(false)
                    break
                }

                const data = new TextDecoder().decode(value)
                const { filename, totalChunks, chunksUpserted, isComplete } = JSON.parse(data)
                const currentProgress = (chunksUpserted / totalChunks) * 100
                setProgress(currentProgress)
                setFilename(`${filename} [${chunksUpserted}/${totalChunks}]`)
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                description: `${error}`,
            })
        } finally {
            reader.releaseLock()
        }
    }

    if (!isAuthorized) {
        return (
            <div className="h-screen w-full">
            <Navbar />
            <main className="flex flex-col items-center p-24">
                <Card className="p-8">
                    <CardHeader>
                        <CardTitle>Admin Access Required</CardTitle>
                        <CardDescription>Enter the admin password to access this page</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-6">
                            <div className="grid gap-2">
                                <Label>Password</Label>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="disabled:cursor-default" />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                        </div>
                        <Button
                            onClick={handleSubmit}
                            variant="destructive"
                            className="bg-[#D90013] w-full h-full mt-4"
                        >
                            Access Update Page
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
        )
    }

    return (
        <div className="h-screen w-full">
            <Navbar />
            <main className="flex flex-col items-center p-24">
                <Card>
                    <CardHeader>
                        <CardTitle>Update Knowledge Base</CardTitle>
                        <CardDescription>Add new docuemnts to your vector DB</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-6">
                            <div className="gap-4 relative">
                                <Button onClick={onFileListRefresh} className="absolute -right-4 -top-4 h-8 w-8" variant={"ghost"} size={"icon"}>
                                    <RefreshCcw className="h-4 w-4" />
                                </Button>
                                <Label>Files List:</Label>
                                <Textarea
                                    readOnly
                                    value={fileListAsText}
                                    className="min-h-24 resize-none border p-3 shadow-none disabled:cursor-default focus-visible:ring-0 text-sm text-muted-foreground"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="grid gap-2">
                                    <Label>
                                        Index Name
                                    </Label>
                                    <Input value={indexname} onChange={e => setIndexname(e.target.value)} placeholder="index name" disabled={isUploading} className="disabled:cursor-default" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>
                                        Namespace
                                    </Label>
                                    <Input value={namespace} onChange={e => setNamespace(e.target.value)} placeholder="namespace" disabled={isUploading} className="disabled:cursor-default" />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={onStartUpload}
                            variant="destructive"
                            className="bg-[#D90013] w-full h-full mt-4"
                            disabled={isUploading}
                        >
                            Upload
                        </Button>
                        {isUploading && (
                            <div className="mt-4">
                                <Label>File Name: {filename}</Label>
                                <div className="flex flex-row items-center gap-4">
                                    <Progress value={progress} />
                                    <LucideLoader2 className="stroke-[#D90013] animate-spin" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}