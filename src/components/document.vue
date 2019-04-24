<template>
  <div class="document" v-html="content">
  </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'

var md = require('markdown-it')({
  highlight: function (code, lang) {
    try {
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    } catch (__) {
      
    }
    return ''; // use external default escaping
  }
});

export default {
  name: 'document',
  props:['art'],
  watch:{
    art(){
      if(this.art){
        this.content = md.render(this.art);
      } else {
        this.content = ''
      }
    }
  },
  data(){
    return {
      content:this.art
    }
  },
}
</script>

<style>
  .document{
    position: fixed;
    width: 50%;
    height: 100%;
    padding: 20px 20px 150px 20px;
    overflow-y: scroll;
  }
  pre {
    background: #fafafa;
    padding: 20px;
    border-radius: 5px;
  }
  code {
    padding: 0 8px;
    background: #fafafa;
    border-radius: 3px;
  }
</style>
