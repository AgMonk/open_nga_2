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
    //将字串使用base64解码，并切割为单字节数组
    const s = window.atob(data).split("");
    //将各字节转换为8位二进制数组（补齐位数）
    const array = s
        .map(i => bin2UInt(i).toString(2))
        .map(i => ('00000000' + i).slice(-8));
    const res = {}
    //以5为步长循环该数组（如果为合集主题array长度为10，否则为5）
    for (let i = 0; i < array.length - 1; i += 5) {
        //首字节表示数据类型
        const type = parseInt(array[i], 2) === 2 ? "stid" : 'bit'
        //将后续4个字节数据拼接并转换为十进制数
        let bit = parseInt(array.slice(i + 1, i + 5).join(''), 2)
        if (type === 'stid') {
            //如果数据类型为1 ， 表示bit为集合id
            res.stid = bit;
        }
        if (type === 'bit') {
            //如果是字体数据，把数据转换为2进制字符串，并反向方便后续处理
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
