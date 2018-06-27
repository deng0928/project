<template>
    <div class="settlement DN">
        <div class="settlementHeader">
            单据管理 / <span>收银单号：</span><span>{{resultOfOrder.cashier_no}}</span>
        </div>
        <div class="settlementBox">
            <div class="row">
                <div class="info">
                    <p class="infoKeyWord">工单类型</p>：<p class="infoValue">{{resultOfOrder.oder_type}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">相关业务号</p>：<p class="infoValue">{{resultOfOrder.relevant_documents_no}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">姓名</p>：<p class="infoValue">{{resultOfOrder.partner_name}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">车牌</p>：<p class="infoValue">{{resultOfOrder.plate_number}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">电话</p>：<p class="infoValue">{{resultOfOrder.partner_phone}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">车架号</p>：<p class="infoValue">{{resultOfOrder.vin}}</p>
                </div>
            </div>
            <p class="title">消费清单</p>
            <el-row class="titleOfForm">
                <el-col class="infoOfTitle" :span="6">项目</el-col>
                <el-col class="infoOfTitle" :span="6">数量</el-col>
                <el-col class="infoOfTitle" :span="6">单价</el-col>
                <el-col class="infoOfTitle" :span="6">小计</el-col>
            </el-row>
            <el-row class="infoOfItem" v-for="item in items" :key="item.id">
                <el-col :span="6">{{item.project_name}}</el-col>
                <el-col :span="6">{{item.quantity}}</el-col>
                <el-col :span="6">{{item.unit_price}}</el-col>
                <el-col :span="6">{{item.subtotal}}</el-col>
            </el-row>
            <div class="price">
                <p>
                    <span class="priceKeyWord">合计金额：</span>
                    <span class="priceValue">¥{{resultOfOrder.total_amount_payable}}</span>
                </p>
                <p>
                    <span class="priceKeyWord">优惠金额：</span>
                    <span class="priceValue">¥{{resultOfOrder.amount_discount}}</span>
                </p>
                <p>
                    <span class="priceKeyWord">应付金额：</span>
                    <span class="priceValue">¥{{resultOfOrder.amount_payable}}</span>
                </p>
            </div>
            <div class="paymentDetail">
                <p class="payment" v-if="resultOfOrder.cash_pay_money != 0">
                    现金支付：<span>¥{{resultOfOrder.cash_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.wechat_pay_money != 0">
                    微信支付：<span>¥{{resultOfOrder.wechat_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.alipay_pay_money != 0">
                    支付宝支付：<span>¥{{resultOfOrder.alipay_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.bank_card_pay_money != 0">
                    银行卡支付：<span>¥{{resultOfOrder.bank_card_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.club_card_pay_money != 0">
                    会员卡支付：<span>¥{{resultOfOrder.club_card_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.on_credit_pay_money != 0">
                    挂账：<span>¥{{resultOfOrder.on_credit_pay_money}}</span>
                </p>
                <p class="payment" v-if="resultOfOrder.adversion_pay_money != 0">
                    内转：<span>¥{{resultOfOrder.adversion_pay_money}}</span>
                </p>

            </div>
            <div class="btnRow">
                <el-button plain v-if="resultOfOrder.order_type != '会员充值' && getJurisdiction('5002')" @click="goSettlement()">返收银</el-button>
                <el-button type="warning" @click="close()">关闭</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import {renderOrder,renderItems,backCashier} from '@/api/getData';
export default {
    data() {
        return {
            from:'',
            detailId:'',
            resultOfOrder:'',
            items:'',
        }
    },
    methods: {
        //退出收银页面
        close() {
            this.$emit('switchActive',this.from);
        },

        //返收银
        goSettlement() {
            this.$alert('返收银后，收银单作废需重新收银！','', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action === 'confirm'){
                        async function send(id){
                            return await backCashier({rid:id})
                        }
                        send(this.detailId).then(res => {
                            if(res.state_code === 'error'){
                                this.$message.error(res.err_message);
                            }else if(res.state_code === 'ok'){
                                this.$message({message: '返收银成功',type: 'success'});
                                this.close();
                            }
                        });
                    }
                }
            });
        }
    },
    async mounted() {
        this.$emit('changeActive','cashier');
        this.detailId = this.$route.query.id;
        this.from = this.$route.query.from;
        let res = await renderOrder({rid:this.detailId,timestamp:new Date().getTime()});
        if(res.state_code === 'error'){
            this.$message.error(res.err_message);
        }else{
            this.resultOfOrder = res.results[0];
        }
        let items = await renderItems({cashier_order_id:this.detailId,timestamp:new Date().getTime()});
        if(items.state_code === 'error'){
            this.$message.error(items.err_message);
        }else{
            this.items = items.results;
        }
    },
}
</script>

<style scoped>
div,p{
    box-sizing: border-box;
}
.settlement{
    width:100%;
    font-size:14px;
    color:#3c3c3c;
}
.settlementHeader{
    background: #f8f8f8;
    height: 59px;
    line-height:59px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.settlementHeader>span{
    color:#ff901e;
}

.settlementBox{
    padding:0 30px;
}
.row{
    display:flex;
    flex-wrap: wrap;
    width:100%;
    padding:0 30px;
    margin-bottom:20px;
    border-bottom: 1px solid #e4e7ed;
}
.row>.info{
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width:50%;
    margin-bottom:20px;
}
.row>.info>.infoKeyWord{
    width:20%;
    text-align:right;
}
.row>.info>.infoValue{
    flex:1;
    padding-left:20px;
}

.title{
    font-size:16px;
    font-weight: bold;
    margin-bottom:20px;
}
.titleOfForm {
    width:100%;
    margin:0 0 26px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoOfTitle {
    text-align: center;
}
.infoOfItem{
    text-align: center;
    padding-bottom:20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
}

.price{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom:20px;
}
.price>p{
    width:240px;
    font-size:16px;
    margin-bottom: 20px;
}
.price .priceKeyWord{
    font-weight: bold;
}
.price .priceValue{
    color:#e11717;
}


.btnRow{
    width: 100%;
    margin:0 0 40px;
    display: flex;
    justify-content: center;
}
.btnRow>.el-button{
    width:100px;
    height:30px;
    line-height: 30px;
    font-size:12px;
}
.paymentDetail{
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom:20px;
}
.payment{
    width:30%;
    font-size:15px;
    margin-bottom:20px;
    margin-right:20px;
}
.payment>span{
    color:#e11717;
}
</style>
