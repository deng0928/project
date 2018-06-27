<template>
    <div class="basics-box">
        <div class="basics-top">
            <span v-if="getJurisdiction('3001')" @click="switchActive('working')" :class="{'active':active==='working'}">工单</span>
            <span v-if="getJurisdiction('4001')" @click="switchActive('parts')" :class="{'active':active==='parts'}">配件单</span>
            <span v-if="getJurisdiction('5001','5002','5003')" @click="switchActive('cashier')" :class="{'active':active==='cashier'}">收银单</span>
        </div>
        <router-view
            v-on:changeActive="changeActive($event)"
            v-on:switchActive="switchActive($event)"
            :paymentStyle="paymentStyle"
            v-on:passTheCost="passTheCost($event)"
            v-on:openWindow="openWindow($event)"
            v-on:clearDocument="clearDocument()">
        </router-view>

        <!-- 支付方式弹出层 -->
        <div class="paymentWindow" v-if="open">
            <div class="priceInput">
                <p class="notice"><span>{{coverName}}</span><span class="close" @click="closeWindow(coverName)">&times;</span></p>
                <div class="controlBox">
                    <p class="notPay" v-if="coverName === '会员卡支付' && getPartner(partner_id)">会员余额：<span>¥{{customer_balance}}</span></p>
                    <p class="notPay">未付金额：<span>¥{{notPay}}</span></p>
                    <p class="toPay">
                        {{coverName === '抹零'?'抹零金额：':'支付金额：'}}
                        <el-input type="number" class="infoValue" v-model.trim.number="paymentStyle[coverName]" placeholder="最小输入金额为小数点后两位">
                            <template slot="prepend">¥</template>
                        </el-input>
                    </p>
                </div>
                <p style="float:left;color:#e11717;">{{confirmAlert}}</p>
                <el-button style="float:right;" type="warning" @click="confirmPay(coverName)">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {checkVIPCard,partner} from '@/api/getData';
    export default {
        data() {
            return {
                active:'',

                //弹出层相关
                open:false,
                coverName:'',
                cost:0,
                notPay:0,
                lastPay:0,
                confirmAlert:'',
                partner_id:'',
                customer_balance:'',
                paymentStyle:{
                    '现金支付':'',
                    '微信支付':'',
                    '支付宝支付':'',
                    '银行卡支付':'',
                    '会员卡支付':'',
                    '挂账':'',
                    '内转':'',
                    '抹零':''
                },
            }
        },
        methods:{
            //会员余额
            async getPartner(id) {
                let res = await partner({rid:id,timestamp:new Date().getTime()});
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                }else{
                    this.customer_balance = res.results[0].customer_balance;
                }
            },

            changeActive(which) {
                this.active = which;
            },

            switchActive(route) {
                this.$router.push('/manage/orders/'+route);
                this.active = route;
            },

            //清空收银页临时数据
            clearDocument() {
                for(let key in this.paymentStyle){
                    this.paymentStyle[key] = 0;
                }
            },

            //应付金额传递
            passTheCost(cost) {
                this.cost = cost;
            },
            //打开付款方式弹出层
            openWindow(obj) {
                let which = obj.style;
                this.partner_id = obj.id;
                this.open = true;
                this.coverName = which;
                this.notPay = this.cost;                
                for(let key in this.paymentStyle){
                    if(key != which){
                        this.notPay = (this.notPay - this.paymentStyle[key]).toFixed(2);
                    }
                    
                }
                this.lastPay = this.paymentStyle[which];
            },

            //清空弹出层临时数据
            clearWindow(){
                this.confirmAlert = '';
                this.open = false;
                this.coverName = '';
            },
            //弹出层取消
            closeWindow(which) {
                this.paymentStyle[which] = this.lastPay;
                this.clearWindow();
            },

            //弹出层确定
            async confirmPay(coverName) {
                let pay = this.paymentStyle[coverName];
                let notPay = this.notPay;
                if(pay > notPay){
                    this.confirmAlert = '输入金额不能超过应付金额!';
                }else if(pay < 0){
                    this.confirmAlert = '输入金额不能小于0元！';
                }else{
                    if(coverName === '会员卡支付'){
                        let res = await checkVIPCard({partner_id:this.partner_id,pay_money:pay,timestamp:new Date().getTime()});
                        if(res.state_code === 'error'){
                            this.$message.error(res.err_message);
                        }else{
                            this.clearWindow();
                        }
                    }else if(coverName === '抹零'){
                        if(pay >= 10){
                            this.confirmAlert = '抹零金额应少于10元 ^_^';
                        }else{
                            this.clearWindow();
                        }
                    }else{
                        this.clearWindow();
                    }
                }

            }
        }
    }
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
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

.paymentWindow{
    position: absolute;
    top:0;
    left:0;
    z-index:1000;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
}
.paymentWindow>.priceInput{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    width:400px;
    height:240px;
    padding:20px;
    background:#fff;
}
.paymentWindow>.priceInput>.notice{
    display:flex;
    justify-content: space-between;
    border-bottom:1px solid #e4e7ed;
    font-size:16px;
    height:40px;
    line-height: 24px;
}
.paymentWindow>.priceInput>.notice>.close{
    cursor: pointer;
    font-size:24px;
    margin-bottom:20px;
}
.paymentWindow>.priceInput>.controlBox{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 10px 0;
}
.paymentWindow>.priceInput>.controlBox>.notPay>span{
    color:#e11717;
}
.paymentWindow>.priceInput>.controlBox>.toPay{
    display:flex;
    align-items: center;
}
.paymentWindow>.priceInput>.controlBox>.toPay>.infoValue{
    flex:1;
}
</style>
