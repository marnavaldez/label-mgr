import React, { useState } from 'react'

import { useQuery, useMutation } from '@tanstack/react-query'

const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file) // 'file' is the key the server expects

  const response = await fetch('/api/v1/parser/image/crop', {
    method: 'POST',
    body: formData, // The browser automatically sets the Content-Type header
  })

  if (!response.ok) {
    throw new Error('File upload failed')
  }

    return response
}

const FileForm = () => {

    const [file, setFile] = useState<File | null>(null)

    const { isPending, error, data } = useQuery({
        queryKey: ['file-upload'],
        queryFn: () => fetch("/api/v1/parser/version").then(
            (res) => res.json()
        ),
    })

    const mutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: (data) => {
            // Handle successful upload, by downloading the returned file
            data.blob().then((blob) => {

                let link = document.createElement('a')

                link.href = window.URL.createObjectURL(blob)
                link.download = 'file_result.png'
                link.click()
            })
        },
        onError: (error) => {
            console.error('Upload error:', error)
            alert(`Upload failed: ${error.message}`)
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        let { files } = event.target

        if (files == null || files.length < 1) {
            return
        }

        setFile(files[0])
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (file == null) {
            return
        }

        console.log('Uploading file:', file.name)

        mutation.mutate(file)
    }

    if (isPending) return <>Loading data...</>

    if (error) return <>Ooops, something went wrong</>

    return (
        <>
            <h1>Form component</h1>
            <div>Let's download some stuff</div>
            <p>Version: {data.version}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select File</label>
                    {/* Use a standard HTML input element */}
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" disabled={!file}>
                    Upload
                </button>
            </form>
        </>
    )
}

export default FileForm