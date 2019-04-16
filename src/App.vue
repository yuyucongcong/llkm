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
      <p>
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
      </p>
    </a-modal>
    <a-modal
      title="词库"
      :visible="showVocabularyModal"
      width="900px"
      @cancel="closeVocabulary"
      :footer="null"
    >
    <p>
      <a-table :columns="vocabularyColumns" :dataSource="vocabulary" :pagination="{ pageSize: 50 }" :scroll="{ y: 440 }" />
    </p>
    </a-modal>
    <a-modal
      title="过滤器"
      :visible="showFilterModal"
      width="900px"
      @cancel="closeFilter"
      :footer="null"
    >
    <div>
      <span>be 动词</span>
      <p>{{ filterData.be }}</p>
      <span>动词</span>
      <p>{{ filterData.verb }}</p>
      <span>代词</span>
      <p>{{ filterData.pron }}</p>
    </div>
    </a-modal>
  </div>
</template>

<script>
import document from './components/document.vue'
import { articlelist } from './assets/articlelist'
import { filterData } from './assets/filter'
import { Header, Layout, Footer, Content } from 'ant-design-vue';
import { db, storesArticle, storesVocabulary, readVocabulary, init } from './assets/db';
import { calculate } from './assets/calculate'

export default {
  name: 'app',
  components: {
    Header,
    Layout,
    Footer,
    Content,
    document,
  },
  data(){
    
    return {
      showArticleListModal:false,
      showVocabularyModal: false,
      showFilterModal:false,
      articlelist:[],
      article: '',
      articleCN: '',
      filterData:{
        be:'',
        verb:'',
        pron:''
      },
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
      this.articlelist = data.map((element)=>{
        return data2.map((ele)=>{
          if(element.key == ele.key){
            return Object.assign({},element,ele)
          } 
        })[0]
      })
    }
    
  },
  methods:{
    showArticleList(){
      this.showArticleListModal = true
    },
    async showVocabulary(){
      this.vocabulary = await readVocabulary()
      this.showVocabularyModal = true
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
        let data = await db.article.where('key').equals(e.target.value).toArray()
        let dataCN = await db.articleCN.where('key').equals(e.target.value).toArray()
        this.article = data[0].article
        this.articleCN = dataCN[0].articleCN
      } else {
        this.article = false
        this.articleCN = false
      }
    },
    nothing(info){
      let that = this;
      const status = info.file.status;
      const reader = new FileReader();
      reader.onload = function(){
        storesArticle({
          title:info.file.name,
          file:this.result
        },articlelist,(text, status)=>{
          that.$message.success(`${info.file.name} ${text}`);
          if(status){
            let data = that.articlelist
            data[status.index][status.name] = true
            that.$set(articlelist,data)
          }
        })
        storesVocabulary(calculate(this.result))
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