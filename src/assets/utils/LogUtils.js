// 格式化输出字符串
import {getTypeOf} from "@/assets/utils/ObjectUtils";

let format = function (template, ...data) {
    if (data === undefined || data.length === 0) {
        return template;
    }
    let d = data[0];
    let s = template;
    if (data.length === 1 && getTypeOf(d) === 'Object') {
        for (let key in d) {
            if (d.hasOwnProperty(key)) {
                let re = "{" + key + "}";
                while (s.includes(re)) {
                    s = s.replace(re, d[key])
                }
            }
        }
        return s;
    }
    if (data.length > 1) {
        for (let i = 0; i < data.length; i++) {
            s = s.replace("{}", data[i]);
        }
        return s;
    }
    return template;
}

//格式化日志方法
console.slf4j = function (template, ...data) {
    const timestamp = new Date().format("yyyy-MM-dd hh:mm:ss");
    console.log(`[${timestamp}] ${format(template, ...data)}`)
}