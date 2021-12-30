// 快捷输入论坛代码

export const bbsCodeLibrary = [
    {
        cn: "颜色", en: "color",
        props: [
            {cn: "红", en: "red"},
            {cn: "蓝", en: "blue"},
            {cn: "天蓝", en: "skyblue"},
            {cn: "绿", en: "green"},
            {cn: "橙", en: "orange"},
            {cn: "粉", en: "deeppink"},
            {cn: "紫", en: "purple"},
            {cn: "银", en: "silver"},
        ],
    },
    {
        cn: "字号", en: "size",
        props: [
            {cn: "100", en: "100%"},
            {cn: "120", en: "120%"},
            {cn: "150", en: "150%"},
            {cn: "200", en: "200%"},
        ],
    },
    {cn: "加粗", en: "b"},
    {cn: "删除线", en: "del"},
    {cn: "标题", en: "h"},
    {cn: "列表", en: "list"},
    {cn: "列表项", en: "*"},
    {cn: "图片", en: "img"},
    {cn: "链接", en: "url"},
    {cn: "引用", en: "quote"},
    {cn: "代码", en: "code"},
    {cn: "表格", en: "table"},
    {cn: "行", en: "tr"},
    {cn: "列", en: "td"},
    {cn: "折叠", short: ["col"], en: "collapse"},
]

const nameEquals = (name, item) => name === item.cn || name === item.en || (item.short && item.short.includes(name))

export const searchBbsCode = (key) => {
    key = key.replace(`：`, `:`);
    const name = key.includes(":") ? key.split(":")[0] : key;
    const prop = key.includes(":") ? key.split(":")[1] : undefined;
    console.log(`搜索代码:${name} ${prop}`)
    return bbsCodeLibrary
        .filter(item => nameEquals(name, item))
        .map(item => {
            const {props} = item;
            const p = props ? props.filter(i => nameEquals(prop, i))[0] : undefined
            return {
                code: item.en,
                props: p ? p.en : prop,
            }
        })[0]


}