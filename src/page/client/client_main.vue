<template>
    <div class="basics-box">
        <div class="basics-top">
            <span @click="clickClient" v-show="getJurisdiction('3001','2001','5001','5002','5003','5004')" :class="{active:active_client}">客户</span>
            <span @click="clickYhj" v-show="getJurisdiction('3001','3002','3003','5001','5002')" :class="{active:active_yhj}">优惠券</span>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                active_client: true,
                active_yhj: false,
            }
        },
        mounted(){
            if(this.$route.path=='/manage/client_main/coupon'){
                this.active_client = false;
                this.active_yhj = true;
            }else{
                this.active_client = true;
                this.active_yhj = false;

            }
        },
        methods: {
            clickClient() {
                this.$router.push('/manage/client_main');
                this.active_client = true;
                this.active_yhj = false;

            },
            clickYhj() {
                this.active_client = false;
                this.active_yhj = true;
                this.$router.push('/manage/client_main/coupon')
            },
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

