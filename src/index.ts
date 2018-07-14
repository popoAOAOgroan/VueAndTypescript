
import Vue from 'vue';
// import TestVue from './components/test.vue';
import index from './pages/index.vue';

let app = new Vue({
  el: '#app',
  data: {},
  template: `
    <index />
  `,
  components: {
    index
  }
})