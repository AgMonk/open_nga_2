import {handleAttachs, requestUnity} from "@/assets/request/nga-request";
import {htmlDecode, unEscape} from "@/assets/utils/StringUtils";

export const postRequest = (data) => requestUnity({
    url: "post.php",
    data
}).then(res => {
    const {data} = res;
    handleAttachs(data)
    const r = {
        attachUrl: data.attach_url,
        content: htmlDecode(unEscape(data.content)),
        forum: data.forum,
        auth: data.auth,
        attachs: data.attachs,
    };
    const {__MESSAGE} = data;
    if (__MESSAGE) {
        console.log(__MESSAGE)
        const message = {text: __MESSAGE["1"]}
        const array = __MESSAGE["6"]
            .replace("/read.php?", "")
            .replace("Anchor", "")
            .replace("_ff", "fid")
            .replace("#pid", "&pid=")
            .split("&")
            .map(i => i.split('='))
        array.forEach(i => {
            message[i[0]] = i[1]
        })
        return message;
    }
    return r
})

