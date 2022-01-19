//反转义
export const unEscape = (text) => {
    let temp = document.createElement("div");
    temp.innerHTML = !text ? "" : text
        .replace(/<br\/>/g, '\n');
    let output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

//使用UTF-8编码一段字符串
export const encodeUTF8 = (str) => {
    let back = [];
    let byteSize = 0;
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1;
            back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff)
            || (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
    }
    for (let i = 0; i < back.length; i++) {
        back[i] &= 0xff;
    }
    return back;
}

//解析query参数
export const queryString2Obj = (query) => {
    const o = {}
    if (query) {
        query.split('&').forEach(item => {
            const [key, value] = item.split('=')
            o[key] = decodeURI(value);
        })
    }
    return o;
}

//解析url
export const parseUrl = (fullUrl) => {
    const [url, query] = fullUrl.split('?')
    return {
        url,
        query: queryString2Obj(query)
    }
}