<template>
  <div>
    <div class="nav flex-left units-gap top-gap text-center">
				<button class='btn undo unit-0 site-box'>
					⤺ Undo
				</button>
        <div class="unit site-box"></div>
				<button class='btn clear unit-1-4 site-box'>
					⟲ Clear
				</button>
    </div>
    <div class="pad">
      <div class="flex-left col" v-bind:key="index" v-for="(line, index) in broad">
        <div class="cell" v-bind:key="num" v-for="num in line">
          <input :value="num" readonly/>
        </div>
      </div>
    </div> 
    <div class="bar">
      <span class="btn" v-bind:key="num" v-for="num in 9">{{num}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const t = Array.from(Array(9).keys()).map(i=>i+1);

const getSquare = (c:number[][], i:number, j:number): number[] => {
  // console.log('行', i, '列', j);
  let r = [];
  for(let ci = i % 3; ci >= 0 ; ci--){
    const gong = Math.floor(j/3);
    for(let li = 0; li < 3; li ++){
      r.push(c[i - ci][3*gong+li]);
    }
  }
  // console.log('r', r);
  return r;
};

const getChunk = (): number[][]|boolean => {
  let c:number[][] = [[]];
  for(let i = 0; i< t.length; i++){
    if(!c[i]) c.push([]);
    let row = c[i];
    for(let j = 0; j < t.length; j++){
      if(!row[j]) {
        // 列去重
        const aCol = c.map(l=>l[j]).filter(l=>l);
        const rangRC = t.filter(v => !aCol.includes(v));
        // 行去重
        const aRow = rangRC.filter(v => !row.includes(v));
        // 宫去重
        const aSquare = getSquare(c, i, j);
        const rang = aRow.filter(v => !aSquare.includes(v));
        const num = rang[Math.floor(Math.random() * rang.length)];
        if(!num) return false;
        row.push(num);
      }
    }
  }
  return c;
  // return [[8, 0, 0, 4, 0, 6, 0, 0, 7],
	// [0, 0, 0, 0, 0, 0, 4, 0, 0],
	// [0, 1, 0, 0, 0, 0, 6, 5, 0],
	// [5, 0, 9, 0, 3, 0, 7, 8, 0],
	// [0, 0, 0, 0, 7, 0, 0, 0, 0],
	// [0, 4, 8, 0, 2, 0, 1, 0, 3],
	// [0, 5, 2, 0, 0, 0, 0, 9, 0],
	// [0, 0, 1, 0, 0, 0, 0, 0, 0],
	// [3, 0, 0, 9, 0, 2, 0, 0, 5]];
};

export default Vue.extend({
    props: [],
    data() {
        return {
            broad: [[0]]
        }
    },
    methods: {

    },
    computed: {
    },
    mounted() {
    },
    created() {
      let isFull:any = false;
      let i = 0;
      while(!isFull){
        console.log(i++);
        isFull = getChunk();
      }
      this.broad = isFull;
      // getSquare(this.broad, 5, 6);
    }
});
</script>

<style>
.bar{
  display: flex;
  justify-content: space-between;
}

.bar>span{
  width: auto;
}

.pad{
  margin: 20px 0;
}

.col{
  justify-content: center;
  
}
.cell{
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    display: inline-block;
    text-align: center;
    border: 1px solid #eaeaea;
    padding: 0px;
}
.cell>input{
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 0px;
    padding: 0px;
    border: 0px;
    background: transparent;
    font-size: 18px;
    color: #666;
}
.col:first-child .cell{
  border-top: 2px solid #999;
}
.cell:first-child{
  border-left: 2px solid #999;
}
.cell:last-child{
  border-right: 2px solid #999;
}
.col:last-child .cell{
  border-bottom: 2px solid #999;
}
.cell:nth-child(3),.cell:nth-child(6){
  border-right: 2px solid #999;
}
.col:nth-child(3) .cell,.col:nth-child(6) .cell{
  border-bottom: 2px solid #999;
}
</style>