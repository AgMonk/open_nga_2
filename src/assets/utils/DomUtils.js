// 设置文本框的光标位置
export const setTextareaSelection = (textarea, start, end) => {
    textarea.focus()
    // console.log(start+":"+end)
    setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = end ? end : start;
    }, 50)
}

// 在文本框光标的当前位置插入指定文本
export const insertTextToTextarea = (
    textarea
    , {startText, endText = ""
        , startPosition = textarea.selectionStart
        , endPosition = textarea.selectionEnd
        , innerText = true
    }
) => {
    // console.log(startPosition+":"+endPosition)
    let text = textarea.value;
    let t1 = text.substring(0, startPosition);
    let t2 = innerText ? text.substring(startPosition, endPosition) : "";
    let t3 = text.substring(endPosition);
    textarea.value = t1 + startText + t2 + endText + t3
    textarea.focus();
    let index = t1.length + t2.length + startText.length;
    setTextareaSelection(textarea, index);
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