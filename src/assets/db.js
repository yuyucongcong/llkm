import Dexie from 'dexie';
import { isFilter } from './filter'

const version = 1;
const db = new Dexie("article_baseDB");

db.version(version).stores({
    base:'init',
    article:'key,title,article,uploaded',
    articleCN:'key,titleCN,articleCN,uploadedCN',
    vocabulary:'++key,word,count,learning,ban',
    filter:'vocabulary'
});
 
db.open();

async function checkUploaded(title, articleList){
    let tit = title.replace(/\.md$/,'')
    let keys = articleList.find((element, index)=>{
        return element.title == tit || element.titleCN == tit
    })
    if(keys){
        let isUploaded = await db.article.where('key').equals(keys.key).toArray()
        let isUploadedCN = await db.articleCN.where('key').equals(keys.key).toArray()
        if(isUploadedCN[0].uploadedCN && isUploadedCN[0].titleCN == tit){
            return true
        }
        if(isUploaded[0].uploaded && isUploaded[0].title == tit){
            return true
        }
        return false
    } else{
        return false
    }
}

function storesArticle(fileList, articleList, callback){
    let fileName = fileList.title.replace(/\.md$/,'')
    let file = fileList.file
    let compared = articleList.some((element, index)=>{
        if(element.title == fileName){
            db.article.put({
                key:element.key,
                title:element.title,
                article:file,
                uploaded:true
            }).then((e)=>{
                callback('保存完成',{
                    key:element.key,
                    index:index,
                    name:'uploaded'
                })
            }).catch((e)=>{
                callback('保持失败')
            })
            return true
        }else if(element.titleCN == fileName){
            db.articleCN.put({
                key:element.key,
                titleCN:element.titleCN,
                articleCN:file,
                uploadedCN:true
            }).then((e)=>{
                callback('保存完成',{
                    key:element.key,
                    index:index,
                    name:'uploadedCN'
                })
            }).catch((e)=>{
                callback('保存失败')
            })
            return true
        }
        return false
    })

    !compared && callback('保存失败，请检查文件列表与文件名是否对应')
}

async function storesVocabulary(vocalbulary){
    let data = await db.vocabulary.toArray()
    if(data.length){
        let newData = []
        let oldData = []
        vocalbulary.result.forEach((element,index)=>{
            let key = 0;
            let word = data.find((e, i)=>{
                key = i
                return e.word == element
            })

            if(word){
                db.vocabulary.where('word').equals(word.word).modify({
                    count: 1*word.count + vocalbulary.count[index]
                });
                return
            }else{
                newData = [...newData,{
                    word:element,
                    count: vocalbulary.count[index],
                    ban:isFilter(element)
                }]
                return
            }
        })

        db.vocabulary.bulkAdd(newData)
    } else {
        let result = vocalbulary.result.map((element, i)=>{
            return {
                word:element,
                count:vocalbulary.count[i],
                ban:isFilter(element)
            }
        })
        db.vocabulary.bulkAdd(result).catch((err)=>{
            console.log(err)
        })
    }

}

function readVocabulary(){
    return db.vocabulary.where('count').above(2).and((element)=> element.ban == "false").reverse().toArray()
}

function init(list){
    db.article.bulkAdd(list)
    db.articleCN.bulkAdd(list)
}

export { db, storesArticle, storesVocabulary, readVocabulary, init, checkUploaded }