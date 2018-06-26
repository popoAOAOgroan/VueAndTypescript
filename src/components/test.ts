import Vue from 'vue';

export default Vue.extend({
  template: `
    <div>
      test: <a href="javascript: void(0)" @click="onClickTest">click me!</a>
      <div style="width: 100px; height: 100px; background: red; overflow: scroll; ">
        <div style="width: 300%; height: 300%; background: yellow;">123</div>
      </div>
    </div>
  `,
  props: [],
  data: function() {
    return {}
  },
  methods: {
    onClickTest() {console.log('test');}
  },
  computed: {

  }
})