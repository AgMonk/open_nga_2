// bit数据解析
//主题(回复)类型bit
// https://bbs.nga.cn/read.php?tid=6406100&authorid=58

export const parseThreadTypeBit = (num) => {
    if (!num || num === 0) {
        return {};
    }
    let binaryString = parseBitData(num)
    const [isComment, hidden, hasComment, , extraUserInfo, , noHint, freeEdit, selfReply, verifying, locked, , hasAutoTranslate, hasUpload] = binaryString
    const notVerified = binaryString[26];
    const obj = {
        hasUpload, hasAutoTranslate, locked, selfReply, verifying, freeEdit, noHint, extraUserInfo, hasComment, hidden, isComment, notVerified
    }
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key] === "1"
    })
    return {...obj,binaryString};
}

//解析bit数据到二进制
export const parseBitData = (num) => {
    return num.toString(2).split('').reverse().join('');
}

export const parseTitleFont = (data) => {
    const s = window.atob(data).split("");
    const array = s
        .map(i => bin2UInt(i).toString(2))
        .map(i => ('00000000' + i).slice(-8));

    const res = {}
    for (let i = 0; i < array.length - 1; i += 5) {
        const type = parseInt(array[i], 2) === 2 ? "stid" : 'bit'
        let bit = parseInt(array.slice(i + 1, i + 5).join(''), 2)
        if (type === 'stid') {
            res.stid = bit;
        }
        if (type === 'bit') {
            res.titleFont = bit.toString(2).split("").reverse().join('')
        }
    }
    return res
}

//二进制字符串转为多字节整数(big-endian)
export const bin2UInt = (x) => {
    let z = 0, y = 0;
    for (let i = 0; i < x.length; i++) {
        y = x.charCodeAt(i)
        //如果输入字符串中有utf16字符则一次移动两字节
        z = (z << (y > 255 ? 16 : 8)) + y
    }
    return z
}
