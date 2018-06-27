<template>
    <div class="workingOrders DN">
        <div class="workingOrdersHeader" style="justify-content: flex-start;">
            <el-button size="small" type="primary" @click="exportOrder">收銀信息导出</el-button>
        </div>
        <el-row>
            <span>创建时间:</span>
            <el-date-picker
                v-model="creatTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small"
                :picker-options="pickerOptions"
            >
            </el-date-picker>

            <span class="space">收银时间:</span>
            <el-date-picker
                v-model="payTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
            >
            </el-date-picker>
        </el-row>
        <el-row>
            <span class="formType">付款方式:</span>
            <el-select v-model="payment_type" placeholder="请选择" size="small">
                <el-option
                    v-for="item in payStyle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <span class="formType bigspace">业务类型:</span>
            <el-select v-model="order_type" placeholder="请选择" size="small">
                <el-option
                    v-for="item in formTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-input class="searchForm"
                placeholder="客户，名称，编号，车牌号"
                prefix-icon="el-icon-search"
                size="small"
                v-model.trim="where">
            </el-input>

            <el-button class="checkUp" type="warning" plain @click="checkUp()">查询</el-button>
        </el-row>
        <el-row>
            <div class="DN">
                <el-tabs v-model="parameter.state" type="card" @tab-click="switchState">
                    <el-tab-pane  v-for="item in typeStates" :key="item.name" :label="item.label" :name="item.name">
                        <cashForm
                            :resultOfOrders="resultOfOrders"
                            v-on:getOrders="getOrders($event)"
                            v-on:changePageSize="changePageSize($event)">
                        </cashForm>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-row>
    </div>
</template>

<script>
import cashForm from './cashForm';
import {getCashOrder} from '@/api/getData';

export default {
    components: {
        cashForm
    },
    methods: {
        //获取单据 跳转页面
        async getOrders(val = '1') {
            this.parameter.offset = val;
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getCashOrder(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },
        // 报表导出
        async exportOrder(){
            window.open('/api/cashier_order_export_xls?create_time='+this.parameter.create_time+'&receiving_time='+this.parameter.receiving_time+'&state='+this.parameter.state+'&payment_method='+this.parameter.payment_method+'&order_type='+this.parameter.order_type+'&timestamp='+new Date().getTime())
        },
        //切换状态
        async switchState() {
            this.parameter.offset = '1';
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getCashOrder(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },

        //查询数据
        checkUp() {
            this.parameter.create_time = this.creatTime != null?this.creatTime.toString():"";
            this.parameter.receiving_time = this.payTime != null?this.payTime.toString():"";
            this.parameter.payment_method = this.payment_type;
            this.parameter.order_type = this.order_type;
            this.parameter.where = this.where;
            this.parameter.timestamp = new Date().getTime();
            this.getOrders()
        },

        //切换分页条数
        changePageSize(val) {
            this.parameter.limit = val;
            this.parameter.timestamp = new Date().getTime();
            this.getOrders()
        },
    },
    async mounted() {
        this.$emit('changeActive','cashier');
        this.resultOfOrders = await getCashOrder({offset:"1",limit:"10",timestamp:new Date().getTime()});
        if(this.resultOfOrders.state_code === 'error') {
            this.$message.error(this.resultOfOrders.err_message);
        }else if(this.resultOfOrders.results.length === 0) {
            this.$message("未查找到任何数据");
        }
    },

    data() {
        return {
            //单据请求结果
            resultOfOrders:'',

            //单据请求参数
            parameter:{
                //工单状态
                state:"all",
                //工单类型
                order_type:"all",
                //创建时间
                create_time:"",
                //收银时间
                receiving_time:"",
                //付款方式
                payment_method:"all",
                //搜索
                where:"",
                //时间戳
                timestamp:new Date().getTime(),
                //页码
                offset:"1",
                //条数
                limit:"10"
            },
            creatTime:"",
            payTime:"",
            payment_type:"all",
            order_type:"all",
            where:"",

            //日期选择器的shortcuts
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近3天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近7天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            //付款方式 现金支付,微信支付,支付宝支付,银行卡支付,会员卡,挂账,内转
            payStyle:[{
                value: 'all',
                label: '所有'
            },{
                value: '现金支付',
                label: '现金支付'
            },{
                value: '微信支付',
                label: '微信支付'
            },{
                value: '支付宝支付',
                label: '支付宝支付'
            },{
                value: '银行卡支付',
                label: '银行卡支付'
            },{
                value: '会员卡',
                label: '会员卡'
            },{
                value: '挂账',
                label: '挂账'
            },{
                value: '内转',
                label: '内转'
            },],

            //工单类型
            formTypes: [{
                value: 'all',
                label: '所有'
            }, {
                value: '维修工单',
                label: '维修工单'
            }, {
                value: '保险工单',
                label: '保险工单'
            }, {
                value: '会员充值',
                label: '会员充值'
            }],

            //单据状态导航条
            typeStates:[{
                name:'all',
                label:'全部'
            },{
                name:'待收款',
                label:'待收款'
            },{
                name:'已收款',
                label:'已收款'
            }]
        };
    }
};
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.workingOrders{
    width:100%;
    font-size:12px;
    color:#333;
}
.space{
    margin-left:20px;
}
.bigspace{
    margin-left:20px;
}
.checkUp{
    margin-left:20px;
}
.workingOrders>.workingOrdersHeader{
    background: #f8f8f8;
    height: 59px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.searchForm{
    width:300px;
    margin-left:20px;
}
.el-button--warning,.checkUp{
    background: #ff901d;
    border-color: #ff901d;
    color: #fff;
}

.el-button{
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
}

.el-button:hover,.checkUp{
    background: #ff801d;
    color: #ffd
}

.workingOrders>.el-row {
    padding:0 30px;
    margin-bottom: 26px;
    &:last-child {
    margin-bottom: 0;
    }
}
</style>
