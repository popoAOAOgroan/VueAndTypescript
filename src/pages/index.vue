<template>
    <div class="flex-center">
        <div class="container-fluid">
            <SudocuBox mode="SIMPLE"/>
        </div>
    </div>

</template>

<script lang="ts">
import Vue from "vue";
import SudocuBox from '../components/SudocuBox';
export default Vue.extend({
    props: [],
    components: {
        SudocuBox
    },
    data() {
        return {
            
        }
    },
    methods: {
    },
    computed: {
    },
    mounted() {
    }
});
</script>

<style>
</style>