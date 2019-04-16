import { filter } from './filter'

export function calculate( article ){
    // replace code
    let clear = article.replace(/[\r\n]/g, "")
                // 清理 markdown 语法和数字
                .replace(/```.*```|\*\*|[0-9]/g,'')
                // 清理符号
                .replace(/\.|\(\)|;|\#|"|'|\]|\[|`|\)|\(|:|,|!|\?/g,'')
                // 清理运算符
                .replace(/\<|\>|\*|\+|\-|\!==|=/g,'')
                // 清理零宽字符
                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                // 转换大小写
                .toLowerCase()
    let vocabulary = clear.split(' ')
    let result = []
    let count = []

    vocabulary.forEach((element)=>{
        let index = result.indexOf(element)
        if( index < 0 ){
            result.push(element)
            count.push(1)
        }else{
            count[index] = ++count[index]
        }
    })

    return {
        result:result,
        count:count
    }
}