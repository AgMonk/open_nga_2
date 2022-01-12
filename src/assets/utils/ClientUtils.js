//客户端工具

export const getClientSize = () => {
    const {clientHeight, clientWidth} = document.body
    return {
        clientWidth,
        clientHeight
    }
}