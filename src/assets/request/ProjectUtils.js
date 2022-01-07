export const setTitle = (title) => {
    document.title = `${title} - OpenNga`
}

export const antiHeXieUrl = (url) => {
    // noinspection HttpUrlsUsage
    return url
        .replace("https://", "")
        .replace("http://", "")
        .replace(/img/g, '[b]i[/b]mg')
        .replace(/jpg/g, '[b]j[/b]pg')
        .replace(/png/g, '[b]p[/b]ng')
        .replace(/gif/g, '[b]g[/b]if')
        .replace(/zip/g, '[b]z[/b]ip')
        .replace(/mp3/g, '[b]m[/b]p3')
        .replace(/mp4/g, '[b]m[/b]p4')
        .replace(/attachments/g, '[b]att[/b]achments')

        ;
}