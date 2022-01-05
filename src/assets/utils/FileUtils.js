export const isImage = (file) => {
    return file && (file.type === '图片' || (file.raw && file.raw.type.startsWith('image'))) || file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.gif')
}

export const isZip = (file) => {
    return file && (file.type === '压缩包' || (file.raw && file.raw.type === 'application/x-zip-compressed'))
}

export const isMp3 = (file) => {
    return file && (file.type === 'mp3' || (file.raw && file.raw.type === 'audio/mpeg'))
}

export const isMp4 = (file) => {
    return file && (file.type === 'mp4' || (file.raw && file.raw.type === 'video/mp4'))
}
