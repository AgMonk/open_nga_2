//dice标签结果计算方法

export const rnd = (seed) => {
    // 计算一个新种子
    let a = ((seed * 9301 + 49297) % 233280)
    let b = a / 233280.0
    // 返回一个结果
    return {
        seed: a,
        result: b,
    }
}