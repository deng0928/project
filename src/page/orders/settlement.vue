<template>
    <div class="settlement DN">
        <div class="settlementHeader">
            单据管理 / <span>收银单号：</span><span>{{resultOfOrder.cashier_no}}</span>
        </div>
        <div class="settlementBox">
            <div class="row">
                <div class="info">
                    <p class="infoKeyWord">工单类型</p>：<p class="infoValue">{{resultOfOrder.order_type}}</p>
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

            <p class="title" v-if="resultOfOrder.order_type != '会员充值' && items.length != 0">消费清单</p>
            <el-row class="titleOfForm" v-if="resultOfOrder.order_type != '会员充值' && items.length != 0">
                <el-col class="infoOfTitle" :span="6">项目</el-col>
                <el-col class="infoOfTitle" :span="6">数量</el-col>
                <el-col class="infoOfTitle" :span="6">单价</el-col>
                <el-col class="infoOfTitle" :span="6">小计</el-col>
            </el-row>
            <el-row class="infoOfItem" v-for="item in items" :key="item.id" v-if="resultOfOrder.order_type != '会员充值' && items.length != 0">
                <el-col :span="6">{{item.project_name}}</el-col>
                <el-col :span="6">{{item.quantity}}</el-col>
                <el-col :span="6">{{item.unit_price}}</el-col>
                <el-col :span="6">{{item.subtotal}}</el-col>
            </el-row>

            <p class="title titleWithBtn" v-if="resultOfOrder.order_type != '会员充值' && discounts.length != 0">优惠券<el-button v-show="cancelBtn" style="margin-left:26px;" type="warning" @click="cancelAllDiscounts()">取消使用</el-button></p>
            <el-row class="discountBox" v-if="resultOfOrder.order_type != '会员充值' && discounts.length != 0">
                <div class="discount-coupon" v-for="coupon in discounts" :key="coupon.id" :title="coupon.coupon_name" @click="coupon.state === '未使用' && useThisDiscount(coupon)">
                    <div class="border" :class="[coupon.state === '已使用'?'discount-border-be-used':'']"></div>
                    <div class="discount-detail" :class="[coupon.state === '已使用'?'discount-detail-be-used':'']">
                        <p :alt="coupon.coupon_name">{{shortText(coupon.coupon_name)}}</p>
                        <p v-if="coupon.coupon_type==='现金券'" class="discount-cash">¥ <span>{{coupon.offset_amount}}</span></p>
                        <p v-else class="discount-rate">折扣 : <span>{{coupon.discount_rate}}%</span></p>
                        <p>有效期 : <span>{{coupon.effective_date}}</span></p>
                    </div>
                    <p class="discount-check" :class="[coupon.state === '已使用'?'discount-check--be-used':'']">
                        <span>{{coupon.coupon_type}}</span>
                        <span v-if="coupon.applicable_working_hours && coupon.applicable_accessories">适用工时/配件</span>
                        <span v-else-if="coupon.applicable_working_hours">适用工时</span>
                        <span v-else-if="coupon.applicable_accessories">适用配件</span>
                        <span v-show="coupon.state === '未使用'" class="space"></span>
                        <span v-show="coupon.state === '已使用'" class="iconfont icon-chenggong" style="color:#ff901e"></span>
                    </p>
                </div>
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
            <div class="paymentRow">
                <!-- 循环出所有付款方式按钮 -->
                <el-button type="warning" plain
                    v-for="(pay,style) in paymentStyle"
                    v-if="resultOfOrder.order_type != '会员充值' || style != '会员卡支付'"
                    :key="style"
                    @click="open(style,VIPCardId)">
                    {{style}}
                </el-button>
            </div>
            <div class="paymentDetail">
                <p class="payment"
                    v-for="(price,style) in paymentStyle"
                    v-if="Number(price)!==0"
                    :key="style">
                    {{style}}：
                    <span>¥{{price}}</span>
                </p>
                <p class="total">支付总金额：<span>¥{{total.toFixed(2)}}</span></p>
            </div>
            <div class="btnRow">
                <el-button plain @click="close()">取消</el-button>
                <el-button type="warning" @click="done()">完成</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import {workingOrder,renderOrder,renderItems,sendPayment,getDiscounts,useDiscounts,dontUseDiscounts} from '@/api/getData';
export default {
    props: ['paymentStyle'],
    data() {
        return {
            from:'',
            settlementId:'',
            resultOfOrder:'',
            items:'',
            discounts:'',
            applicable:'',
            partner_coupon_id:[],
            partner_id:'',
            cancelBtn:false,
            VIPCardId:'',
            userID:'',
        }
    },
    methods: {
        //限制字数
        shortText(text) {
            let len = text.length;
            if(len > 12){
                return text.slice(0,12)+"...";
            }else{
                return text;
            }
        },

        //打开付款方式的弹出层
        open(which,id) {
            let obj = {
                style:which,
                id:id
            };
            this.$emit('openWindow',obj)
        },

        //警告框
        alertBox(sentence,title) {
            this.$alert(sentence, title, {
                confirmButtonText: '确定',
                callback: action => {}
            });
        },

        //抹零
        async outZero() {

        },

        //使用优惠券
        async useThisDiscount(coupon) {
            let obj = {
                partner_coupon_id:coupon.id,
                cashier_order_id:this.settlementId.toString(),
                partner_id:coupon.partner_id
            }
            let res = await useDiscounts(obj);
            if(res.state_code === 'error'){
                this.$message.error(res.err_message);
            }else{
                this.loadData();
            }
        },

        //取消使用优惠券
        async cancelAllDiscounts() {
            let obj = {
                partner_coupon_id:this.partner_coupon_id,
                cashier_order_id:this.settlementId.toString(),
                partner_id:this.partner_id
            }
            let res = await dontUseDiscounts(obj);
            if(res.state_code === 'error'){
                this.$message.error(res.err_message);
            }else{
                this.loadData();
            }
            return res;
        },

        //取消付款
        close() {
            if(this.cancelBtn) {
                this.cancelAllDiscounts().then(res => {
                    if(res.state_code === 'error'){
                        this.$message.error(res.err_message);
                    }else{
                        this.$emit('clearDocument');
                        //this.$emit('switchActive','cashier');
                        this.$router.go(-1);
                    }
                });
            }else{
                this.$emit('clearDocument');
                //this.$emit('switchActive','cashier');
                this.$router.go(-1);
            }
        },
        //完成付款
        done() {
            let total = this.resultOfOrder.amount_payable;
            let pay = this.total;
            if(pay < total){
                this.alertBox('应付金额未付清，请继续收银','');
            }else if(pay > total){
                this.alertBox('支付金额超过应付金额，请确认！','');
            }else{
                let str = "";
                for(let key in this.paymentStyle){
                    if(Number(this.paymentStyle[key]) != 0){
                        str += key + ",";
                    }
                }
                let newstr = str.slice(0,-1);
                async function send(settlementId,paymentStyle,ids,payee_id) {
                    return await sendPayment({
                        rid:settlementId,
                        payment_method:newstr,
                        cash_pay_money:paymentStyle['现金支付'],
                        wechat_pay_money:paymentStyle['微信支付'],
                        alipay_pay_money:paymentStyle['支付宝支付'],
                        bank_card_pay_money:paymentStyle['银行卡支付'],
                        club_card_pay_money:paymentStyle['会员卡支付'],
                        on_credit_pay_money:paymentStyle['挂账'],
                        adversion_pay_money:paymentStyle['内转'],
                        moling_pay_money:paymentStyle['抹零'],
                        partner_coupon_ids:ids,
                        payee_id:payee_id
                    });
                }
                send(this.settlementId.toString(),this.paymentStyle,this.partner_coupon_id,this.userID).then(res => {
                    if(res.state_code === 'error'){
                        if(res.err_message.indexOf('已被使用') != -1){
                            this.$alert(res.err_message, '', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    if(action === 'confirm') {
                                        cancelAllDiscounts();
                                    }
                                }
                            });
                        }else{
                            this.$message.error(res.err_message);
                        }
                    }else if(res.state_code === 'ok'){
                        this.$message({message: '收银成功',type: 'success'});
                        this.$emit('clearDocument');
                        this.$emit('switchActive','cashier');
                    }
                });

            }
        },

        async loadItem() {
            let items = await renderItems({cashier_order_id:this.settlementId,timestamp:new Date().getTime()});
            if(items.state_code === 'error'){
                this.$message.error(items.err_message);
            }else{
                this.items = items.results;
            }
            let discounts = await getDiscounts({partner_id:this.VIPCardId,cashier_order_id:this.settlementId,timestamp:new Date().getTime()});
            if(discounts.state_code === 'error'){
                this.$message.error(discounts.err_message);
            }else{
                this.discounts = discounts.results;
                if(this.discounts.length != 0){
                    this.partner_coupon_id = [];
                    this.partner_id = this.discounts[0].partner_id;
                    for(let i = 0;i < this.discounts.length;i++){
                        if(this.discounts[i].state === '已使用'){
                            this.partner_coupon_id.push(this.discounts[i].id);
                        }
                    }
                    if(this.partner_coupon_id.length > 0){
                        this.cancelBtn = true;
                    }else{
                        this.cancelBtn = false;
                    }
                }
            }
        },

        //加载数据
        async loadData() {
            if(this.from==='working'){
                let res = await workingOrder({rid:this.$route.query.id,rmodel:this.$route.query.rmodel,timestamp:new Date().getTime()});
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                }else{
                    this.resultOfOrder = res.results[0];
                    this.settlementId = this.resultOfOrder.id;
                    this.VIPCardId = this.resultOfOrder.res_partner_id;
                    if(this.resultOfOrder.order_type != '会员充值'){
                        this.loadItem();
                    }
                }
            }else if(this.from==='cashier'){
                this.settlementId = this.$route.query.id;
                let res = await renderOrder({rid:this.settlementId,timestamp:new Date().getTime()});
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                }else{
                    this.resultOfOrder = res.results[0];
                    this.VIPCardId = this.resultOfOrder.res_partner_id;
                    if(this.resultOfOrder.order_type != '会员充值'){
                        this.loadItem();
                    }
                }
            }
            const cost = this.resultOfOrder.amount_payable;
            this.$emit('passTheCost',cost);
        },
    },
    async mounted() {
        this.from = this.$route.query.from;
        this.$emit('changeActive',this.from);
        this.userID = JSON.parse(sessionStorage.getItem('userInfo')).id;
        this.loadData();
    },
    computed: {
        total() {
            let total = 0;
            for(let key in this.paymentStyle){
                total += Number(this.paymentStyle[key]);
            }
            return total;
        },
    }
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

.paymentRow{
    width: 100%;
    margin-bottom:20px;
    display: flex;
    justify-content: flex-start;
}
.paymentRow>.el-button{
    width:100px;
    height:30px;
    line-height: 30px;
    font-size:12px;
}
.paymentRow>.el-button{
    margin-bottom:20px;
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
.total{
    font-size:16px;
    font-weight: bolder;
}
.total>span{
    color:#e11717;
}

.titleWithBtn{
    height:32px;
    line-height: 32px;
}
.discountBox{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items:center;
    align-content:space-around;
    justify-content: flex-start;
    border-bottom:1px solid #e4e7ed;
    margin-bottom:26px;
}
.discount-coupon{
    position:relative;
    margin:10px 10px 40px;
    width:200px;
    height:100px;
    cursor: pointer;
}
.discount-coupon>.border{
    position:absolute;
    top:-5px;
    z-index:1000;
    width:200px;
    height:6px;
    background: url('../../assets/img/discount_off.png') no-repeat;
    background-size: cover;
}
.discount-coupon>.discount-border-be-used,.discount-coupon:hover .border{
    background-image: url('../../assets/img/discount_on.png')
}
.discount-coupon>.discount-detail{
    width:100%;
    height:65px;
    background:#ffcf8d;
    border:1px solid #ffcf8d;
    color:#fff;
}
.discount-coupon:hover .discount-detail{
    background:#ff901e;
    border:1px solid #ff901e;
}
.discount-coupon>.discount-detail-be-used{
    background:#ff901e;
    border:1px solid #ff901e;
}
.discount-coupon>.discount-detail>p{
    text-align: center;
}
.discount-coupon>.discount-detail>p:first-child{
    font-size:12px;
    padding-left:10px;
    text-align: left;
}
.discount-coupon>.discount-detail>.discount-cash,.discount-coupon>.discount-detail>.discount-rate>span{
    font-size:20px;
}
.discount-coupon>.discount-detail>p:last-child{
    font-size:12px;
}
.discount-coupon>.discount-check{
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size:12px;
    width:100%;
    height:35px;
    border:1px solid #ffcf8d;
}
.discount-coupon:hover .discount-check{
    border:1px solid #ff901e;
}
.discount-coupon>.discount-check--be-used{
    border:1px solid #ff901e;
}
.discount-coupon>.discount-check>.space{
    width:16px;
}
</style>
