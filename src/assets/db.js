
import Dexie from 'dexie';
import { isFilter } from './filter'

const version = 1;
const db = new Dexie("article_baseDB");

db.version(version).stores({
    base:'init',
    article:'key,title,article,uploaded',
    articleCN:'key,titleCN,articleCN,uploadedCN',
    vocabulary:'word,count,learning,ban',
    filter:'vocabulary'
});
 
db.open();

function storesArticle(fileList,articleList,callback){
    let fileName = fileList.title.replace(/\.md$/,'')
    let file = fileList.file

    articleList.forEach((element, index)=>{
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
        }else{
            callback('保存失败，请检查文件列表与文件名是否对应')
        }
    });
}

function storesVocabulary(vocalbulary){
    vocalbulary.result.forEach((element, i)=>{
        db.vocabulary.put({
            word:element,
            count:vocalbulary.count[i],
            ban:isFilter(element)
        }).catch((err)=>{
            console.log(err)
        })
    })
}

function readVocabulary(){
    return db.vocabulary.where('count').above(2).and((element)=> element.ban == "false").reverse().toArray()
}

function init(list){
    db.article.put({
        key:list[0].key,
        title:list[0].title,
    });
    db.articleCN.put({
        key:list[0].key,
        titleCN:list[0].titleCN,
    })
}

export { db, storesArticle, storesVocabulary, readVocabulary, init }