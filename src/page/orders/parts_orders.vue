<template>
    <div class="workingOrders DN">
        <div class="workingOrdersHeader" style="justify-content: flex-start;">
            <el-button size="small" type="primary" @click="exportOrder(tab)">{{tab}}导出</el-button>
        </div>
        <el-row>
            <span>{{dateText[tab]}}时间:</span>
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
            <el-input class="searchForm"
                :placeholder="searchText[tab]"
                prefix-icon="el-icon-search"
                size="small"
                v-model.trim="where">
            </el-input>
            <el-button class="checkUp" type="primary" plain @click="checkUp(tab)" size="small">查询</el-button>
        </el-row>
        <el-row>
            <div class="DN">
                <el-tabs v-model="tab" type="card" @tab-click="switchTab(tab)">
                    <el-tab-pane label="出库明细" name="出库明细">
                        <div class="detailBox">
                            <!-- 项目表头 -->
                            <el-row class="titleOfForm">
                                <el-col class="infoOfTitle" :span="4">配件编码</el-col>
                                <el-col class="infoOfTitle" :span="4">配件名称</el-col>
                                <el-col class="infoOfTitle" :span="4">OE号</el-col>
                                <el-col class="infoOfTitle" :span="3">出库类型</el-col>
                                <el-col class="infoOfTitle" :span="3">出库数量</el-col>
                                <el-col class="infoOfTitle" :span="4">出库时间</el-col>
                                <el-col class="infoOfTitle" :span="2">操作</el-col>
                            </el-row>
                            <!-- 循环渲染每条单据 -->
                            <el-row class="infoOfItem" v-for="(item,index) in resultOfOrders.results" :key="index">
                                <el-col :span="4">{{item.parts_code}}</el-col>
                                <el-col :span="4">{{item.parts_name}}</el-col>
                                <el-col :span="4">{{item.parts_oe}}</el-col>
                                <el-col :span="3">{{item.type}}</el-col>
                                <el-col :span="3">{{item.sku}}</el-col>
                                <el-col :span="4">{{item.out_time}}</el-col>
                                <el-col :span="2">
                                    <div class="DN">
                                        <el-button type="warning" @click="$router.push({path:'/manage/orders/stock_out_detail',query:{id:item.id}})">详情</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- 分页 -->
                            <div class="pages">
                                <el-pagination class="pageControler"
                                    @size-change="stockOutSizeChange"
                                    @current-change="getStockOutOrders"
                                    :current-page="currentPage"
                                    :page-sizes="[10, 20, 40, 60]"
                                    :page-size="10"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="resultOfOrders.count">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="入库明细" name="入库明细">
                        <div class="detailBox">
                            <!-- 项目表头 -->
                            <el-row class="titleOfForm">
                                <el-col class="infoOfTitle" :span="4">配件编码</el-col>
                                <el-col class="infoOfTitle" :span="3">配件名称</el-col>
                                <el-col class="infoOfTitle" :span="3">供应商</el-col>
                                <el-col class="infoOfTitle" :span="3">入库员</el-col>
                                <el-col class="infoOfTitle" :span="3">入库时间</el-col>
                                <el-col class="infoOfTitle" :span="3">入库数量</el-col>
                                <el-col class="infoOfTitle" :span="3">入库单价</el-col>
                                <el-col class="infoOfTitle" :span="2">操作</el-col>
                            </el-row>
                            <!-- 循环渲染每条单据 -->
                            <el-row class="infoOfItem" v-for="(item,index) in resultOfOrders.results" :key="index">
                                <el-col :span="4">{{item.parts_code}}</el-col>
                                <el-col :span="3">{{item.parts_name}}</el-col>
                                <el-col :span="3">{{item.supplier_name}}</el-col>
                                <el-col :span="3">{{item.incoming_name}}</el-col>
                                <el-col :span="3">{{item.incoming_time}}</el-col>

                                <el-col :span="3">{{item.sku}}</el-col>
                                <el-col :span="3">{{item.purchase_price}}</el-col>
                                <el-col :span="2">
                                    <div class="DN">
                                        <el-button type="warning" @click="$router.push({path:'/manage/orders/stock_in_detail',query:{id:item.id}})">详情</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- 分页 -->
                            <div class="pages">
                                <el-pagination class="pageControler"
                                    @size-change="stockInSizeChange"
                                    @current-change="getStockInOrders"
                                    :current-page="currentPage"
                                    :page-sizes="[10, 20, 40, 60]"
                                    :page-size="10"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="resultOfOrders.count">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="盘点明细" name="盘点明细">
                        <div class="detailBox">
                            <!-- 项目表头 -->
                            <el-row class="titleOfForm">
                                <el-col class="infoOfTitle" :span="3">配件编码</el-col>
                                <el-col class="infoOfTitle" :span="3">配件名称</el-col>
                                <el-col class="infoOfTitle" :span="3">OE号</el-col>
                                <el-col class="infoOfTitle" :span="3">供应商</el-col>
                                <el-col class="infoOfTitle" :span="3">盘点数量</el-col>
                                <el-col class="infoOfTitle" :span="3">盘点时间</el-col>
                                <el-col class="infoOfTitle" :span="2">盘点员</el-col>
                                <el-col class="infoOfTitle" :span="4">批次</el-col>
                            </el-row>
                            <!-- 循环渲染每条单据 -->
                            <el-row class="infoOfItem" v-for="(item,index) in resultOfOrders.results" :key="index">
                                <el-col :span="3">{{item.parts_code}}</el-col>
                                <el-col :span="3">{{item.parts_name}}</el-col>
                                <el-col :span="3">{{item.parts_oe}}</el-col>
                                <el-col :span="3">{{item.supplier_name}}</el-col>
                                <el-col :span="3">{{item.adjust}}</el-col>
                                <el-col :span="3">{{item.create_date}}</el-col>
                                <el-col :span="2">{{item.out_employee_name}}</el-col>
                                <el-col :span="4">{{item.batch}}</el-col>
                            </el-row>
                            <!-- 分页 -->
                            <div class="pages">
                                <el-pagination class="pageControler"
                                    @size-change="stockCheckSizeChange"
                                    @current-change="getStockCheckOrders"
                                    :current-page="currentPage"
                                    :page-sizes="[10, 20, 40, 60]"
                                    :page-size="10"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="resultOfOrders.count">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-row>
    </div>
</template>

<script>
import {getStockOut,getStockIn,getStockCheck} from '@/api/getData';
export default {
    data() {
        return {
            //文字信息
            dateText:{
                "出库明细":"出库",
                "入库明细":"入库",
                "盘点明细":"盘点",
            },
            searchText:{
                "出库明细":"配件编码/配件名称/OE号/出库员",
                "入库明细":"配件编码/配件名称/OE号/入库员/供应商",
                "盘点明细":"配件编码/配件名称/OE号/盘点员/供应商/批次",
            },

            //请求结果
            resultOfOrders:'',

            //请求参数
            parameter:{
                //时间
                time:"",
                //搜索
                where:"",
                //时间戳
                timestamp:new Date().getTime(),
                //页码
                offset:"1",
                //条数
                limit:"10"
            },
            time:"",
            where:"",
            tab:"出库明细",

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

            currentPage: 1,
        }
    },
    methods: {
        // 报表导出
        async exportOrder(tab){
            if(tab === '出库明细'){
                window.open('/api/parts_out_export?time='+this.parameter.time+'&where='+this.parameter.where+'&offset='+this.parameter.offset+'&limit='+this.parameter.limit+'&timestamp='+new Date().getTime())
            }else if(tab === '入库明细'){
                window.open('/api/parts_in_export?time='+this.parameter.time+'&where='+this.parameter.where+'&offset='+this.parameter.offset+'&limit='+this.parameter.limit+'&timestamp='+new Date().getTime())
            }else if(tab === '盘点明细'){
                window.open('/api/parts_check_export?time='+this.parameter.time+'&where='+this.parameter.where+'&offset='+this.parameter.offset+'&limit='+this.parameter.limit+'&timestamp='+new Date().getTime())
            }

        },

        //查询数据
        checkUp(tab) {
            this.parameter.time = this.time != null?this.time.toString():"";
            this.parameter.where = this.where;
            this.parameter.timestamp = new Date().getTime();
            if(tab === '出库明细'){
                this.getStockOutOrders();
            }else if(tab === '入库明细'){
                this.getStockInOrders();
            }else if(tab === '盘点明细'){
                this.getStockCheckOrders();
            }
        },

        //切换状态
        async switchTab(tab) {
            this.resultOfOrders = "";
            this.time = "";
            this.parameter.time = "";
            this.where = "";
            this.parameter.where = "";
            this.parameter.offset = '1';
            this.parameter.timestamp = new Date().getTime();
            if(tab === '出库明细'){
                this.getStockOutOrders();
            }else if(tab === '入库明细'){
                this.getStockInOrders();
            }else if(tab === '盘点明细'){
                this.getStockCheckOrders();
            }
        },

        //出库明细 获取单据 跳转页面
        async getStockOutOrders(val = '1') {
            this.parameter.offset = val;
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getStockOut(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },

        //出库明细 分页事件
        stockOutSizeChange(val) {
            this.parameter.limit = val;
            this.parameter.timestamp = new Date().getTime();
            this.getStockOutOrders()
        },

        //入库明细 获取单据 跳转页面
        async getStockInOrders(val = '1') {
            this.parameter.offset = val;
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getStockIn(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },

        //入库明细 分页事件
        stockInSizeChange(val) {
            this.parameter.limit = val;
            this.parameter.timestamp = new Date().getTime();
            this.getStockInOrders()
        },

        //盘点明细 获取单据 跳转页面
        async getStockCheckOrders(val = '1') {
            this.parameter.offset = val;
            this.parameter.timestamp = new Date().getTime();
            this.resultOfOrders = await getStockCheck(this.parameter);
            if(this.resultOfOrders.state_code === 'error') {
                this.$message.error(this.resultOfOrders.err_message);
            }else if(this.resultOfOrders.results.length === 0) {
                this.$message("未查找到任何数据");
            }
        },

        //盘点明细 分页事件
        stockCheckSizeChange(val) {
            this.parameter.limit = val;
            this.parameter.timestamp = new Date().getTime();
            this.getStockCheckOrders()
        },
    },
    async mounted () {
        this.$emit('changeActive','parts');
        this.getStockOutOrders();
    }
}
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

.detailBox{
    width:100%;
}
.titleOfForm {
    margin:0 0 10px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoOfTitle {
    text-align: center;
}
.infoOfItem{
    display: flex;
    align-items: center;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e4e7ed;
    margin-top: 10px;
    padding-bottom: 10px;
}

.pages{
    width:100%;
    padding:26px;
    overflow:hidden;
}
.pages>.pageControler{
    float:right;
}
</style>
