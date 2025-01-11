import { NextResponse } from "next/server"
import { updateVectorStore } from "@/lib/update-vector-store"
import { Pinecone } from "@pinecone-database/pinecone"
import { DirectoryLoader } from "langchain/document_loaders/fs/directory"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { TextLoader } from "langchain/document_loaders/fs/text"
import path from "path"

interface UploadRequestBody {
    indexname: string;
    namespace: string;
}

type ProgressCallback = (
    filename: string,
    totalChunks: number,
    chunksUpserted: number,
    isComplete: boolean
) => void

export async function POST(request: Request) {
    try {
        const body: UploadRequestBody = await request.json()
        const { indexname, namespace } = body

        const stream = new TransformStream()
        const writer = stream.writable.getWriter()

        const loader = new DirectoryLoader(
            path.join(process.cwd(), "documents"),
            {
                ".pdf": (path: string) => new PDFLoader(path, { splitPages: false }),
                ".txt": (path: string) => new TextLoader(path),
            }
        )

        const docs = await loader.load()

        const client = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        })

        const progressCallback: ProgressCallback = async (
            filename,
            totalChunks,
            chunksUpserted,
            isComplete
        ) => {
            const update = JSON.stringify({
                filename,
                totalChunks,
                chunksUpserted,
                isComplete,
            })

            if (!isComplete) {
                await writer.write(
                    new TextEncoder().encode(`data: ${update}\n\n`)
                )
            } else {
                await writer.close()
            }
        }

        updateVectorStore(client, indexname, namespace, docs, progressCallback)

        return new NextResponse(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        })
    } catch (error) {
        console.error("Error processing upload:", error)
        return NextResponse.json(
            { error: "Failed to process upload" },
            { status: 500 }
        )
    }
}