
import Vue from 'vue';
// import TestTs from './components/test';
import TestVue from './components/test.vue';

let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  template: `
    <TestVue />
  `,
  components: {
    TestVue
  }
})