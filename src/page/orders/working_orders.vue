<template>
    <div class="workingOrders DN">
        <div class="workingOrdersHeader" style="justify-content: flex-start;">
            <el-button size="small" type="primary" @click="exportOrder">工单信息导出</el-button>
            <el-button size="small" type="primary" @click="exportPgOrder">派工信息导出</el-button>
        </div>
        <el-row>
            <span>下单时间:</span>
            <el-date-picker
                v-model="time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small"
                :picker-options="pickerOptionsForTime"
            >
            </el-date-picker>

            <span class="space">收银时间:</span>
            <el-date-picker
                v-model="cashier_time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsForCashierTime"
            >
            </el-date-picker>
        </el-row>
        <el-row>
            <span class="formType">工单类型:</span>
            <el-select v-model="order_type" placeholder="请选择" size="small">
                <el-option
                    v-for="item in formTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-input class="searchForm"
                placeholder="客户，手机号，车牌，车架，编号，接待人"
                prefix-icon="el-icon-search"
                size="small"
                @keyup.enter.native="checkUp"
                v-model.trim="where">
            </el-input>

            <el-button class="checkUp" type="warning" plain @click="checkUp()">查询</el-button>
        </el-row>
        <el-row>
            <div class="DN">
                <el-tabs v-model="parameter.state" type="card" @tab-click="getOrders('1')">
                    <el-tab-pane  v-for="item in typeStates" :key="item.name" :label="item.label" :name="item.name">
                        <workingForm
                            :resultOfOrders="resultOfOrders"
                            v-on:deleteItem="deleteItem($event)"
                            v-on:changeStates="changeStates($event)"
                            v-on:getOrders="getOrders($event)"
                            v-on:changePageSize="changePageSize($event)">
                        </workingForm>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-row>
    </div>
</template>

<script>
import workingForm from './workingForm';
import {getFormItems} from '@/api/getData';

export default {
    components: {
        workingForm
    },
    methods: {
        //获取单据 跳转页面
        async getOrders(val = '1') {
            this.parameter.offset = val;
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getFormItems(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },

        //查询数据
        checkUp() {
            this.parameter.time = this.time != null?this.time.toString():"";
            this.parameter.cashier_time = this.cashier_time != null?this.cashier_time.toString():"";
            this.parameter.order_type = this.order_type;
            this.parameter.where = this.where;
            this.getOrders()
        },

        //切换分页条数
        changePageSize(val) {
            this.parameter.limit = val;
            this.getOrders()
        },

        //导出报表
        async exportOrder(){
            window.open('/api/maintenance_export?state='+this.parameter.state+'&order_type='+this.parameter.order_type+'&time='+this.parameter.time+'&cashier_time='+this.parameter.cashier_time+'&where='+this.parameter.where+'&timestamp='+new Date().getTime())
        },
        async exportPgOrder(){
            window.open('/api/construction_sheet_export?state='+this.parameter.state+'&order_type='+this.parameter.order_type+'&time='+this.parameter.time+'&cashier_time='+this.parameter.cashier_time+'&where='+this.parameter.where+'&timestamp='+new Date().getTime())
        },
    },
    async mounted() {
        this.$emit('changeActive','working');
        this.getOrders();
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
                //日期选择
                time: "",
                //搜索
                where:"",
                //收银时间
                cashier_time:"",
                //时间戳
                timestamp:new Date().getTime(),
                //页码
                offset:"1",
                //条数
                limit:"10"
            },
            time:"",
            cashier_time:"",
            order_type:"all",
            where:"",

            //日期选择器的shortcuts
            pickerOptionsForTime: {
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
            pickerOptionsForCashierTime: {
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
            }],

            //单据状态导航条
            typeStates:[{
                name:'all',
                label:'全部'
            },{
                name:'待施工',
                label:'待施工'
            },{
                name:'施工中',
                label:'施工中'
            },{
                name:'待收银',
                label:'待收银'
            },{
                name:'已完成',
                label:'已完成'
            }]
        };
    }
};
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.space{
    margin-left:20px;
}
.workingOrders{
    width:100%;
    font-size:12px;
    color:#333;
}
.checkUp{
    margin-left:40px;
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
    width:340px;
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
