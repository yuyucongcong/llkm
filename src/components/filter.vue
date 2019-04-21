<template>
    <div class="filter">
        <span>be 动词</span>
        <p>{{ filter.be }}</p>
        <span>动词</span>
        <p>{{ filter.verb }}</p>
        <span>代词</span>
        <p>{{ filter.pron }}</p>
        <span>副词</span>
        <p>{{ filter.adv }}</p>
        <span>副词</span>
        <p>{{ filter.adv }}</p>
        <span>形容词</span>
        <p>{{ filter.adj }}</p>
        <span>冠词</span>
        <p>{{ filter.art }}</p>
        <span>介词</span>
        <p>{{ filter.prep }}</p>
        <span>连词</span>
        <p>{{ filter.conj }}</p>
        <span>助词</span>
        <p>{{ filter.aux }}</p>
        <span>连词</span>
        <p>{{ filter.conj }}</p>
        <span>人名</span>
        <p>{{ filter.named }}</p>
        <span>其他</span>
        <p>{{ filter.other }}</p>
        <span>数字</span>
        <p>{{ filter.nub }}</p>
        <span>字母</span>
        <p>{{ filter.alphabet }}</p>
    </div>
</template>
<script>
export default {
  name: 'document',
  props:['filterData'],
    data(){
      return {
        filter:this.filterData
      }
  },
}
</script>
<style>
  .filter{
    height: 400px;
    overflow-y: scroll;
  }
</style>

