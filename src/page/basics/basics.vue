<template>
    <div class="basics-box">
        <div class="basics-top">
            <span v-show="getJurisdiction('1001','2001','3001')" @click="clickCar" :class="{active:active_car}">车辆</span>
            <span v-show="getJurisdiction('3001','1001')" @click="clickWx" :class="{active:active_wx}">维修</span>
            <span v-show="getJurisdiction('3001','1001')" @click="clickdy" :class="{active:active_dy}">打印</span>
            <span @click="clickins" :class="{active:active_ins}">保险</span>
        </div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                active_car:true,
                active_wx:false,
                active_dy:false,
                active_ins:false
            }
        },
        mounted(){
            if(this.$route.path=='/manage/basics'){
                this.active_car = true;
                this.active_wx = false;
                this.active_dy = false;
                this.active_ins = false
            }else if(this.$route.path=='/manage/basics/basics_fix'){
                this.active_car = false;
                this.active_wx = true;
                this.active_dy = false;
                this.active_ins = false
            }else if(this.$route.path=='/manage/basics/basics_dy'){
                this.active_car = false;
                this.active_wx = false;
                this.active_dy = true;
                this.active_ins = false
            }else{
                this.active_car = false;
                this.active_wx = false;
                this.active_dy = false;
                this.active_ins = true
            }
        },
        methods:{
            clickCar(){
                this.active_car = true;
                this.active_wx = false;
                this.active_dy = false;
                this.active_ins = false;
                this.$router.push('/manage/basics')
            },
            clickWx(){
                this.active_car = false;
                this.active_wx = true;
                this.active_dy = false;
                this.active_ins = false;
                this.$router.push('/manage/basics/basics_fix')
            },
            clickdy(){
                this.active_car = false;
                this.active_wx = false;
                this.active_dy = true;
                this.active_ins = false;
                this.$router.push('/manage/basics/basics_dy')
            },
            clickins(){
                this.active_car = false;
                this.active_wx = false;
                this.active_dy = false;
                this.active_ins = true;
                this.$router.push('/manage/basics/insurance')
            }
        }
    }
</script>

<style lang="less" scoped>
    .basics-box .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
    .basics-box>.header>.detail{
        color:#ff901d;
    }
    .basics-top{
        height: 48px;
        line-height: 48px;
        padding-left:20px;
    }
    .basics-top>span{
        display: inline-block;
        width:60px;
        font-size:16px;
        text-align: center;
        cursor: pointer;
    }
    .basics-top>span.active{
        border-bottom:2px solid #ff901d;
    }
    .section{
        padding:40px;
    }
    .client-header-box {
        background: #f8f8f8;
        height: 59px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }
    .client-search-box {
        display: inline-flex;
        justify-content: center;
    }
    .el-button--warning {
        background: #ff901d;
        border-color: #ff901d;
        color: #fff;
    }
    .el-button {
        padding: 0 15px;
        height: 34px;
        line-height: 34px;
    }
    .el-button:hover {
        background: #ff801d;
        color: #ffd
    }
</style>
