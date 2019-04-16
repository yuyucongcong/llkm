<template>
  <div class="right" v-html="content">
  </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'

var md = require('markdown-it')({
  highlight: function (code, lang) {
    try {
      console.log(Prism.highlight(code, Prism.languages.javascript, 'javascript'))
      return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    } catch (__) {
      console.log(__)
    }
    return ''; // use external default escaping
  }
});

export default {
  name: 'right',
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
  .right{
    position: fixed;
    width: 50%;
    height: 100%;
    padding: 20px;
    overflow-y: scroll;
  }
  pre {
    background: #fafafa;
    padding: 20px;
    border-radius: 5px;
  }
</style>
