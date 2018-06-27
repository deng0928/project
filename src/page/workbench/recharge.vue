<template>
    <div class="add-client-box fillcontain DN" v-loading="loading">
        <header class="header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/manage/workbench' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>会员充值</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <div class="baseform">
            <el-form label-width="150px">
                <el-form-item label="客户信息获取：">
                    <el-autocomplete
                        popper-class="my-autocomplete"
                        placeholder="客户姓名，手机号码"
                        size="small"
                        :trigger-on-focus="false"
                        :fetch-suggestions="querySearchAsync"
                        @select="handleCstSelect"
                        style="width: 280px"
                    >
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.name }}&nbsp;{{item.mobile_phone}}</div>
                        </template>
                    </el-autocomplete>
                    <el-button type="text" @click="$router.push('/manage/client_main/addClient/undefined')">新建客户</el-button>
                </el-form-item>
                <el-form-item label="姓名：">
                    <span>{{activeCustm.name}}</span>
                </el-form-item>
                <el-form-item label="电话：">
                    <span>{{activeCustm.mobile_phone}}</span>
                </el-form-item>
                <el-form-item label="充值金额：">
                    <el-input v-model="chargeValue" placeholder="请输入充值金额" style="width:180px;" size="small"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额：">
                    <el-input v-model="bonusValue" placeholder="请输入赠送金额" style="width:180px;" size="small"></el-input>
                </el-form-item>
                <el-form-item label="制单人：">
                    <span>{{byWho.name}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">提交收银</el-button>
                    <el-button @click="$router.push('/manage/workbench')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {partner,handlecharge} from '@/api/getData'
    export default {
        data(){
            return{
                loading:false,
                activeCustm:{},
                chargeValue:'',
                bonusValue:'',
                byWho:''
            }
        },
        methods:{
            async querySearchAsync(queryString, cb) {
                const res = await partner({
                    where:queryString,
                    timestamp:new Date().getTime(),
                    active:true
                });
                console.log(res);
                if(res.count>0){
                    cb(res.results);
                }else{
                    cb([])
                }
            },
            handleCstSelect(item){
                this.activeCustm = item
            },
            async submit(){
                this.loading =true;
                const res = await handlecharge({
                    customer_id:this.activeCustm.id,
                    received_money:this.chargeValue,
                    gift_money:this.bonusValue,
                    making_people_id:this.byWho.id
                });
                if(res.state_code == "ok"){
                    this.loading =false;
                    this.$message.success('提交收银成功')
                    this.$router.push({
                        path:'/manage/orders/settlement',
                        query:{id:res.results[0].id, rmodel:'dn.member.charge', from:'working'}
                    })
                }else{
                    this.loading =false;
                    this.$message.error(res.err_message)
                }
            }

        },
        mounted(){
            this.byWho = JSON.parse(sessionStorage.getItem('userInfo'))
        }

    }
</script>

<style lang="less" scoped>
    @import "../../style/mixin.less";
    .add-client-box .header {
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding: 0 30px;
        font-size: 16px;
        color: #606266;
    }
    .baseform{
        padding:30px;
    }
    .el-form-item {
        margin-bottom: 10px;
    }

</style>
