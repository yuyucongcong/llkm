import Dexie from 'dexie';
import { isFilter } from './filter'

const version = 1;
const db = new Dexie("article_baseDB");

db.version(version).stores({
    base:'init',
    article:'key,title,article,uploaded,total,quantity',
    articleCN:'key,titleCN,articleCN,uploadedCN',
    vocalbulary:'++key,word,count,learning,ban',
    filter:'vocalbulary'
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

async function storesArticle(fileList, articleList){
    let fileName = fileList.title.replace(/\.md$/,'')
    let file = fileList.file
    let [data,i] = []
    let compared = articleList.some((element, index)=>{
        if(element.title == fileName){
            [data,i] = [element,index]
            return true
        }else if(element.titleCN == fileName){
            [data,i] = [element,index]
            return true
        }
        return false
    })

    if(data.title == fileName){
        try{
            await db.article.put({
                key:data.key,
                title:data.title,
                article:file,
                total:fileList.total,
                quantity:fileList.quantity,
                uploaded:true
            })
            return {
                status:true,
                src:{
                    key:data.key,
                    index:i,
                    name:'uploaded'
                },
                text:'保存成功'
            }
        }catch(e){
            return {
                status:false,
                src:{
                    key:data.key,
                    index:i,
                    name:'uploaded'
                },
                text:'保存失败'
            }
        }
    }else if(data.titleCN == fileName){
        try{
            await db.articleCN.put({
                key:data.key,
                titleCN:data.titleCN,
                articleCN:file,
                uploadedCN:true
            })
            return {
                status:true,
                src:{
                    key:data.key,
                    index:i,
                    name:'uploadedCN'
                },
                text:'保存成功'
            }
        }catch(e){
            return {
                status:false,
                src:{
                    key:data.key,
                    index:i,
                    name:'uploadedCN'
                },
                text:'保存失败'
            }
        }
    }
    
    return {
        status:compared,
        text:compared ? '保存失败，请检查文件列表与文件名是否对应':''
    }
}

async function storesVocabulary(vocalbulary){
    let data = await db.vocalbulary.toArray()
    if(data.length){
        let newData = []
        vocalbulary.result.forEach((element,index)=>{
            let key = 0;
            let word = data.find((e, i)=>{
                key = i
                return e.word == element
            })

            if(word){
                db.vocalbulary.where('word').equals(word.word).modify({
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
        db.vocalbulary.bulkAdd(newData)
    } else {
        let result = vocalbulary.result.map((element, i)=>{
            return {
                word:element,
                count:vocalbulary.count[i],
                ban:isFilter(element)
            }
        })
        db.vocalbulary.bulkAdd(result).catch((err)=>{
            console.log(err)
        })

    }

    return {
        total:vocalbulary.total,
        quantity:vocalbulary.quantity
    }
}

function readVocabulary(len = 2){
    return db.vocalbulary.where('count').above(len).and((element)=> element.ban == "false").reverse().toArray()
}

function init(list){
    db.article.bulkAdd(list)
    db.articleCN.bulkAdd(list)
}

export { db, storesArticle, storesVocabulary, readVocabulary, init, checkUploaded }