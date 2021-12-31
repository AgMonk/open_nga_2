import {requestUnity} from "@/assets/request/nga-request";

export const postRequest = (data) => requestUnity({
    url: "post.php",
    data
}).then(res => {
    const {data} = res;
    const r = {
        attachUrl: data.attach_url,
        content: data.content,
        forum: data.forum,
        auth: data.auth,
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

