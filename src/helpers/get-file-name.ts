export const getFilename = (filename: string): string => {
    const docname = filename.substring(filename.lastIndexOf("/") + 1)
    return docname.substring(0, docname.lastIndexOf(".")) || docname
}