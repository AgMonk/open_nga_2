// 设置文本框的光标位置
export const setTextareaSelection = (textarea, start, end) => {
    textarea.focus()
    // console.log(start+":"+end)
    setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = end ? end : start;
    }, 50)
}

export const setSelection = (dom, i1, i2) => {
    dom.focus()
    setTimeout(() => {
    dom.focus()
        dom.selectionStart = i1;
        dom.selectionEnd = i2;
    }, 50)
};

/**
 * 向文本框中添加文本
 * @param dom 文本框
 * @param startText 插入的开头文本
 * @param endText   插入的结束文本
 * @param startPosition 插入开头文本的位置
 * @param endPosition   插入结束文本的位置
 * @param useInnerText 是否保留 startPosition~endPosition 位置的文本
 */
export const addTextInToTextarea = (dom, {
    startText,
    endText = "",
    startPosition = dom.selectionStart,
    endPosition = dom.selectionEnd,
    useInnerText = true,
}) => {
    const text = dom.value;
    const innerText = useInnerText ? text.substring(startPosition, endPosition) : "";
    let t1 = text.substring(0, startPosition);
    let t3 = text.substring(endPosition);
    dom.value = t1 + startText + innerText + endText + t3;

    const i1 = t1.length + startText.length;
    const i2 = i1 + innerText.length;
    setSelection(dom, i1, i2);
}

export const scrollToId = (id) => {
    if (id) {
        const element = document.getElementById(id);
        console.log(element)
        if (element) {
            console.log(`滚动到${id}`)
            element.scrollIntoView()
            return true
        }
    }
    return false
}

export const scrollY = (y) => {
    document.documentElement.scrollTop += parseInt(y)
    document.body.scrollTop += parseInt(y)
}

export const scrollYToBottom = () => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight
}

export const scrollYToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/**
 * 按键响应
 * @param e 事件
 * @param methods 方法列表
 */
export const keypressEvent = (e, methods) => {
    const {key} = e;
    console.log(key)
    if (methods.hasOwnProperty(key)) {
        methods[key]();
    }

}

export const scrollMethods = {
    s: () => scrollY(150),
    S: () => scrollYToBottom(),
    w: () => scrollY(-150),
    W: () => scrollYToTop(),
}