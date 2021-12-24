import {obj2Array} from "@/assets/utils/ObjectUtils";
import {requestUnity} from "@/assets/request/nga-request";

//查询版面
export const forumRequest = ({key, page=1}) => {
    return requestUnity({
        url: "forum.php",
        data: {key, page},
    }).then(res => {
        if (typeof res.data !== 'object') {
            return []
        }

        res.data = obj2Array(res.data).filter(i => !i.error)
        res.data.forEach(f => {
            delete f.url;
            delete f.descrip;
            delete f._fid;
            const parent = f.parent
            if (parent) {
                delete parent.descrip;
            }
            if (f.stid){
                delete f.fid
            }
        })
        return res.data;
    })
}