import { getImageFilePath, getImgDirectory } from '@/app/services/directoryService'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  console.log(JSON.stringify(file,null,2))

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location

  // const id = getImgDirectory();

  // const path = `/tmp/${file.name}`

  const fp = getImageFilePath(file.name);
  await writeFile(fp, buffer)
  // console.log(`open ${fp} to see the uploaded file`)

  return NextResponse.json({ success: true })
}