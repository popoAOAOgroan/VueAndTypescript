<template>
  <div>
    <div class="nav flex-left units-gap top-gap text-center">
				<button class='btn undo unit-0 site-box'>
					⤺ Undo
				</button>
        <div class="unit site-box" @click="onReload" style="line-height: 60px;">
          {{isComplete ? 'ok!' : 'reload'}}
        </div>
				<button class='btn clear unit-1-4 site-box'>
					⟲ Clear
				</button>
    </div>
    <div class="pad">
      <div class="flex-left col" v-bind:key="i" v-for="(line, i) in broad">
        <div class="cell" v-bind:key="j" v-for="(obj, j) in line">
          <span :class="(curI == i && curJ ==j) ? 'selected' : ''" :style="obj.isEmpty ? 'background: #efefef;' : ''" @click="onInput" :data-i="i" :data-j="j" :data-v="obj.num" :data-empty="obj.isEmpty">{{obj.num == -1 ? '' : obj.num}}</span>
        </div>
      </div>
    </div> 
    <div class="bar">
      <span class="btn" v-bind:key="num" v-for="num in 9" :data-v="num" @click="onNumberClick" >{{num}}</span>
    </div>
    <div v-if="isShowSolveBtn">
      <button class='btn btn-primary' @click="onSolve">
        ☺ Solve
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

type cell = {
  num: number,
  isEmpty: boolean
}
const defaultCell:cell = {
  num: -1,
  isEmpty: false
}

const t = Array.from(Array(9).keys()).map(i=>i+1);
let failNum = 0;
const getSquare = (c:cell[][], i:number, j:number): cell[] => {
  let r = [];
  for(let ci = 2; ci >= 0 ; ci--){
    const gong = Math.floor(j/3);
    for(let li = 0; li < 3; li ++){
      const lineNum = i + (ci - i % 3 );
      if(c[lineNum]){
        r.push(c[lineNum][3*gong+li]);
      }
    }
  }
  return r;
};
const getUniqueArray = (target: number[], row: number[]): (number)[] => {
  return target.filter(v => !row.includes(v));
}
const getRow = (c:cell[][], i:number): cell[]|boolean => {
  let row:cell[] = [];
  for(let j = 0; j < t.length; j++){
    // if(row[j]) row[j] = 0;
    // 列去重
    const aCol = c.map(l=>l[j]).filter(l=>l);
    const rangRC = getUniqueArray(t, aCol.map(a=>{if(a){ return a.num; }else{ return -1;}}));
    // t.filter(v => !aCol.map(a=>{if(a){ return a.num; }else{ return '';}}).includes(v));
    // 行去重
    const aRow = getUniqueArray(rangRC, row.map(a=>{if(a){ return a.num; }else{ return -1;}}));
    // rangRC.filter(v => !row.map(a=>{if(a){ return a.num; }else{ return '';}}).includes(v));
    // 宫去重
    const aSquare = getSquare(c, i, j);
    const rang = getUniqueArray(aRow, aSquare.map(a=>{if(a){ return a.num; }else{ return -1;}}));
    // aRow.filter(v => !aSquare.map(a=>{if(a){ return a.num; }else{ return '';}}).includes(v));
    const num = rang[Math.floor(Math.random() * rang.length)];
    // if(!num) return false;
    if(!num) {
      return false;
    }else{
      row.push({...defaultCell, num});
    }
  }
  return row;
}
const getChunk = (): cell[][] => {
  let c:cell[][] = [[]];
  for(let i = 0; i< t.length; i++){
    if(!c[i]) c.push([]);
    let row = getRow(c, i);
    while(!row) {
      row = getRow(c, i);
      failNum++;
    }
    c[i] = row as cell[];
  }
  console.log('failNum', failNum);
  return c;
};

const setMode = (board: cell[][], scope: number = 4): cell[][] => {
  let arr:cell[][] = board;
  for(let l = 0; l < 9; l++){
    for(let i = 0; i< scope ; i++){
      const r = Math.floor(Math.random() * 9);
      arr[l][r] = {...defaultCell, num: -1, isEmpty: true};
    }
  }
  return arr;
}

const detectEmpty = (broad: cell[][]): boolean => {
  return !broad.some(b=>b.some(c=>c.num==-1));
}

const detectBroad = (broad: cell[][]): boolean => {
  const lineCheck = broad.every(l=>getUniqueArray(l.map(c=>c.num), t).length==0);
  let aCols = [];
  for(let i = 0; i< 9; i++) {
    const col = broad.map(b=>b[i]);
    aCols.push(col);
  }
  const rowCheck = aCols.every(l=>getUniqueArray(l.map(c=>c.num), t).length==0);
  let aSquares:cell[][] = [];
  for(let i = 0; i< 9; i++) {
    const s = [[0,0], [0,3], [0,6], [3,0], [3,3], [3,6], [6,0], [6,3], [6,6] ].map(
      (g)=>getSquare(broad, g[0], g[1])
    );
    aSquares = s;
  }
  const squareCheck = aSquares.every(l=>getUniqueArray(l.map(c=>c.num), t).length==0);
  console.log('lineCheck', lineCheck);
  console.log('rowCheck', rowCheck);
  console.log('squareCheck', squareCheck);
  return lineCheck && rowCheck && squareCheck;
}

export default Vue.extend({
    props: [
      'mode'
    ],
    data() {
        return {
            broad: [[defaultCell]],
            curI: '',
            curJ: '',
            isShowSolveBtn: false,
            isComplete: false
        }
    },
    watch: {
      broad: function(v) {
        this.isShowSolveBtn = detectEmpty(v);
      }
    },
    methods: {
      onInput(e:Event) {
        const {i, j, v, empty} = (e.currentTarget as HTMLAnchorElement).dataset;
        if(!empty) return;
        this.curI = i as any;
        this.curJ = j as any;
      },
      onNumberClick(e: Event) {
        const {v} = (e.currentTarget as HTMLAnchorElement).dataset;
        const b = [...this.broad];
        b[parseInt(this.curI)][parseInt(this.curJ)].num = parseInt(v as string);
        this.broad = b;
      },
      onSolve() {
        this.isComplete = detectBroad(this.broad);
      },
      onReload() {
        this.broad = setMode(getChunk());
      }
    },
    created() {
      this.broad = setMode(getChunk());
      // this.broad = getChunk();
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
.cell>span{
  display: inline-block;
  width: 100%;
  height: 100%;
}
.cell .selected{
  background: #f6feff;
  box-shadow: 0px 1px 5px 1px #9cdcef;
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