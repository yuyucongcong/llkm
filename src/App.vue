<style>
 /* reset */
html,body,div,p,ul,li,dl,dt,dd,em,i,span,a,img,input,h1,h2,h3,h4,h5 {margin:0;padding:0}
a,img,input {border:none;}
body{font: 14px/1.75 \5FAE\8F6F\96C5\9ED1, arial, sans-serif;}
a {text-decoration:none;}
ul,li{list-style: none}
#app{
  height: 100%;
}
.content{
  height: 100%;
}
Header{
  padding: 10px 10px 10px 20px;
  border-bottom: 1px solid rgba(0,0,0,.2);
}
Header button{
  margin-right:10px
}
</style>

<template>
  <div id="app">
    <Layout class="content">
      <Header>
        <a-button @click="showArticleList">文章列表</a-button>
        <a-button @click="showFilter">过滤器</a-button>
        <a-button @click="showVocabulary">词库</a-button>
      </Header>
      <Layout>
        <Content>
          <a-row>
            <a-col :span="12">
              <document v-bind:art="articleCN"></document>
            </a-col>
            <a-col :span="12">
              <document v-bind:art="article"></document>
            </a-col>
          </a-row>
        </Content>
      </Layout>
    </Layout>
    <a-modal
      title="文章列表"
      :visible="showArticleListModal"
      width="900px"
      @cancel="closeArticleList"
      :footer="null"
    >
      <div>
        <p>单词总数：{{ this.vocabularyOfTotal }}，总单词量：{{ this.vacabularyOfAmount }}</p>
        <a-table :dataSource="articlelist" size="small" >
          <a-table-column
            title="标题"
            key="title"
            dataIndex="title">
            <template slot-scope="tags, record">
              <p>
                {{ record.title }}
              </p>
              <p>
                {{ record.titleCN }}
              </p>
            </template>
          </a-table-column>
          <a-table-column
            title="上传"
            key="update">
            <template slot-scope="text, record">
              <p>
                <a-icon v-if="record.uploaded" type="check" />
                <a-icon v-else type="close" />
              </p>
              <p>
                <a-icon v-if="record.uploadedCN" type="check" />
                <a-icon v-else type="close" />
              </p>
            </template>
          </a-table-column>
          <a-table-column
            title="单词总数"
            key="total">
            <template slot-scope="text, record">
              <p>
                {{record.total}}
              </p>
            </template>
          </a-table-column>
          <a-table-column
            title="词汇量"
            key="quantity">
            <template slot-scope="text, record">
              <p>
                {{record.quantity}}
              </p>
            </template>
          </a-table-column>
          <a-table-column
            title="显示"
            key="show">
            <template slot-scope="text, record">
              <p>
                <a-checkbox @change="onChangeShowArticle" :value="record.key"></a-checkbox>
              </p>
            </template>
          </a-table-column>
        </a-table>
        <a-upload-dragger name="file" :multiple="true" :customRequest="nothing" :showUploadList="false">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">Click or drag file to this area to upload</p>
          <p class="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
        </a-upload-dragger>
      </div>
    </a-modal>
    <a-modal
      title="词库"
      :visible="showVocabularyModal"
      width="900px"
      @cancel="closeVocabulary"
      :footer="null"
    >
    <div>
      <p>单词出现频率 <a-input-number :min="2" :max="100" v-model="timeOfNamber" @change="onTimes" style={margin-left:10px} size="small"/> - 总单词量 {{this.vocabularyOfTimes}}</p>
      <a-table :columns="vocabularyColumns" :dataSource="vocabulary" :pagination="{ pageSize: 50 }" :scroll="{ y: 440 }" />
    </div>
    </a-modal>
    <a-modal
      title="过滤器"
      :visible="showFilterModal"
      width="900px"
      @cancel="closeFilter"
      :footer="null"
    >
      <filterView v-bind:filterData="filterData"></filterView>
    </a-modal>
  </div>
</template>

<script>
import document from './components/document.vue'
import filter from './components/filter.vue'
import { articlelist } from './assets/articlelist'
import { filterData } from './assets/filter'
import { Header, Layout, Footer, Content } from 'ant-design-vue';
import { db, storesArticle, storesVocabulary, readVocabulary, init, checkUploaded } from './assets/db';
import { calculate } from './assets/calculate'

export default {
  name: 'app',
  components: {
    Header,
    Layout,
    Content,
    document,
    filterView:filter
  },
  data(){
    return {
      showArticleListModal:false,
      showVocabularyModal: false,
      showFilterModal:false,
      articlelist:[],
      article: '',
      articleCN: '',
      filterData:[],
      timeOfNamber:2,
      vocabularyOfTimes:0,
      vocabularyOfTotal:0,
      vacabularyOfAmount:0,
      columns:[{
        title: '英文标题',
        dataIndex: 'title',
      }, {
        title: '中文标题',
        dataIndex: 'titleCN',
      },{
        title:'英文文章上传',
        width:'100px'
      },{
        title:'中文文章上传',
        width:'100px'
      },{
        title:'单词总数',
        dataIndex:'total'
      },{
        title:'词汇量',
        dataIndex:'quantity'
      }],
      vocabularyColumns:[{
        title:'单词',
        dataIndex:'word',
        width:'200px'
      },{
        title:'出现次数',
        dataIndex:'count'
      }],
      vocabulary:[]
    }
  },
  async mounted(){
    let data = await db.base.where('init').equals('true').toArray()
    if(!data.length){
      db.base.put({
          init:'true'
      })
      init(articlelist)
      this.articlelist = articlelist
    } else {
      let data = await db.article.toArray()
      let data2 = await db.articleCN.toArray()
      this.articlelist = data.map((element,index)=>{
        return data2.map((ele)=>{
          if(element.key == ele.key){
            return Object.assign({},element,ele)
          } 
        })[index]
      })

      let total = 0;
      data.forEach(element => {
        if(element.total && element.total > 0){
          total = total + element.total
        }
      })

      this.vocabularyOfTotal = total
    }

    let vocal = await readVocabulary()
    vocal.shift()
    this.vocabulary = vocal
    this.vocabularyOfTimes = vocal.length

    let vacabularyOfAmount = await readVocabulary(1)
    this.vacabularyOfAmount = vacabularyOfAmount.length
  },
  methods:{
    showArticleList(){
      this.showArticleListModal = true
    },
    async showVocabulary(){
      this.showVocabularyModal = true
    },
    async onTimes(e){
      let vocal = await readVocabulary(e)
      vocal.shift()
      this.vocabulary = vocal
      this.vocabularyOfTimes = vocal.length
    },
    showFilter(){
      this.filterData = filterData
      this.showFilterModal = true
    },
    closeArticleList(){
      this.showArticleListModal = false
    },
    closeVocabulary(){
      this.showVocabularyModal = false
    },
    closeFilter(){
      this.showFilterModal = false
    },
    async onChangeShowArticle(e){
      if(e.target.checked){
        try{
          let data = await db.article.where('key').equals(e.target.value).toArray()
          let dataCN = await db.articleCN.where('key').equals(e.target.value).toArray()
          this.article = data[0].article
          this.articleCN = dataCN[0].articleCN
          if(!data[0].article || !dataCN[0].articleCN){
            this.$message.warn('请检查文章是否已经上传');
          }
        }catch(__){
          this.$message.warn('请检查文章是否已经上传');
        }
      } else {
        this.article = false
        this.articleCN = false
      }
    },
    nothing(info){
      let that = this;
      const reader = new FileReader();
      reader.onload = async function(){
        let check = await checkUploaded(info.file.name, articlelist)
        if(check){
          that.$message.warn(`文章已经上传过了`)
        }else{
          let data = await storesArticle({
              title:info.file.name,
              file:this.result},
              articlelist)

          let src = data.src
          let text = data.text

          if(data.status){
            if(src.name == 'uploaded'){
              let success = await storesVocabulary(calculate(this.result))
              await db.article.where('key').equals(src.key).modify({
                  total:success.total,
                  quantity:success.quantity
              }) 
              that.articlelist[src.index]['total'] = success.total
              that.articlelist[src.index]['quantity'] = success.quantity
            }
            that.articlelist[src.index][src.name] = true
            that.$set(that.articlelist,src.index,that.articlelist[src.index])
            that.$message.success(`${info.file.name} ${text}`)
          }else{
            that.$message.warn(`${info.file.name} ${text}`);
          }
        }
      }
      reader.readAsText(info.file);
    }
  },
  computed: {
    rowSelection() {
      return {
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
            title:'展示'
          }
        }),
      }
    }
  },
}
</script>