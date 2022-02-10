export function downloadJSON(filename: string, json: string) {
  const e = document.createElement('a')
  e.setAttribute('href',
    'data:text/json;charset=utf-8,' + encodeURIComponent(json))
  e.setAttribute('download', filename + '.json')
  e.style.display = 'none'
  document.body.appendChild(e)
  e.click()
  document.body.removeChild(e)
}

// export async function download(filename: string, blob: Blob): Promise<void> {
//   throw new Error('Not implemented')
// }

export async function openFile(accept: string): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = accept
    file.value = ''
    file.focus()
    file.multiple = false
    file.style.display = 'none'
    file.onchange = () => {
      if (!file.files || file.files.length === 0)
        reject('No files selected')
      else
        resolve(file.files[0])
    }
    document.body.appendChild(file)
    file.click()
    document.body.removeChild(file)
  })
}

export async function openFiles(accept: string): Promise<FileList> {
  return new Promise<FileList>((resolve, reject) => {
    const file  = document.createElement('input')
    file.type   = 'file'
    file.accept = accept
    file.value  = ''
    file.focus()
    file.multiple = true
    file.style.display = 'none'
    file.onchange = () => {
      if (!file.files || file.files.length === 0)
        reject('No files selected')
      else
        resolve(file.files)
    }
    document.body.appendChild(file)
    file.click()
    document.body.removeChild(file)
  })
}

export async function readBinaryFile(file: File): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = _ => {
      if (reader.result && reader.result instanceof ArrayBuffer)
        resolve(new Uint8Array(reader.result))
      else
        reject('File read error')
    }
    reader.onerror = _ => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

export async function readTextFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) resolve(reader.result.toString())
      else reject(`Error reading file`)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export async function copyTextToClipboard(text: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.value = text
      textarea.select()
      textarea.setSelectionRange(0, 99999)
      document.execCommand('copy')
      document.body.removeChild(textarea)
      resolve()
    } else {
      navigator.clipboard.writeText(text)
        .then(() => resolve())
        .catch(err => reject(err))
    }
  })
}

export async function readFromClipboard(): Promise<ClipboardItems> {
  return new Promise<ClipboardItems>((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard.read()
        .then(items => resolve(items))
        .catch(err => reject(err))
    } else {
      reject(`Clipboard API not supported`)
    }
  })
}
