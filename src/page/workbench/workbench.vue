<template>
    <div class="fillcontain" v-loading="loading">
        <div class="contbox">
            <div class="na_card">
                <el-row>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div class="card_hd">今日收入</div>
                            <div class="card_bd">
                                {{orderStatics.today_cashier}}
                                <el-tooltip class="item" effect="light" content="当月收入" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_cashier}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div class="card_hd">今日进场车辆</div>
                            <div class="card_bd">
                                {{orderStatics.today_create_maintenance_order}}
                                <el-tooltip class="item" effect="light" content="当月进场车辆" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_create_maintenance_order}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div class="card_hd">今日完成车辆</div>
                            <div class="card_bd">
                                {{orderStatics.today_complete_maintenance_order}}
                                <el-tooltip class="item" effect="light" content="当月完成车辆" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_complete_maintenance_order}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div class="card_hd">今日新增客户</div>
                            <div class="card_bd">
                                {{orderStatics.today_create_partner}}
                                <el-tooltip class="item" effect="light" content="当月新增客户" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_create_partner}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4" v-if="getJurisdiction('4001','4002','4003','5001','5002','5003','5004','1001','1002')">
                        <div class="grid-content">
                            <div class="card_hd">今日出库金额</div>
                            <div class="card_bd">
                                {{orderStatics.day_money_count}}
                                <el-tooltip class="item" effect="light" content="当月配件出库金额" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_money_count}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4" v-if="getJurisdiction('4001','4002','4003','5001','5002','5003','5004','1001','1002')">
                        <div class="grid-content">
                            <div class="card_hd">今日出库成本</div>
                            <div class="card_bd">
                                {{orderStatics.day_cost_count}}
                                <el-tooltip class="item" effect="light" content="当月配件出库成本" placement="top-end">
                                    <div class="card_bt">{{orderStatics.month_cost_count}}</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <h4 class="tit_4" v-if="getJurisdiction('3001','2001','5003','4001')">常用功能</h4>
            <el-row :gutter="10">
                <el-col :span="6" v-if="getJurisdiction('3001')">
                    <div class="grid-content">
                        <button class="btn_c_i" @click="goCreateorder">
                            <i class="iconfont icon-order"></i>
                            <span>快速开单</span>
                        </button>
                    </div>
                </el-col>
                <el-col :span="6" v-if="getJurisdiction('2001')">
                    <div class="grid-content">
                        <button class="btn_c_i" @click="goAddclient">
                            <i class="iconfont icon-xinzengkehu"></i>
                            <span>新增客户</span>
                        </button>
                    </div>
                </el-col>
                <el-col :span="6" v-if="getJurisdiction('4001')">
                    <div class="grid-content">
                        <button class="btn_c_i" @click="$router.push('/manage/storage/stock')">
                            <i class="iconfont icon-navicon-cgrkd"></i>
                            <span>通用入库</span>
                        </button>
                    </div>
                </el-col>
                <el-col :span="6" v-if="getJurisdiction('5003')">
                    <div class="grid-content">
                        <button class="btn_c_i" @click="$router.push('/manage/recharge')">
                            <i class="iconfont icon-huiyuan"></i>
                            <span>会员充值</span>
                        </button>
                    </div>
                </el-col>
            </el-row>
            <div class="todolist" v-if="getJurisdiction('3001','4001','5001')">
                <div style="position: relative">
                    <h4 class="tit_4">待办事项</h4>
                    <div class="client-search-box DN" style="float: right;position:absolute;width:375px;right:0;top:50%;transform:translateY(-50%)">
                        <div style="padding-right:.5rem;display: inline-block;">
                            <div style="width:300px;padding-top:1px;">
                                <el-input placeholder="客户姓名,手机,车牌,车架号,单据号" v-model.trim="searchBoxValue" prefix-icon="el-icon-search" size="small" @input="handleValuechange" @keyup.enter.native="handleQueryOrder()"></el-input>
                            </div>
                        </div>
                        <el-button size="small" class="btn_yl" style="display: inline-block;" @click="handleQueryOrder">搜索</el-button>
                    </div>
                </div>
                <el-collapse accordion v-model="activeName">
                    <section>
                        <el-collapse-item v-bind:name="1" class="listitem">
                            <template slot="title">
                                <i class="header-icon iconfont icon-shouqi" v-if="activeName == 1"></i>
                                <i class="header-icon iconfont icon-zhankai" v-else></i>
                                <span class="cont">待施工单据</span>
                                <span class="count"><i style="color:#ff901d">{{waitOrder.count||0}}</i> 张</span>
                            </template>
                            <el-table :data="waitOrder.list" style="width: 100%" class="DN">
                                <el-table-column prop="order_type" label="单据类型" width="85"></el-table-column>
                                <el-table-column prop="name" label="单据号" width="180"></el-table-column>
                                <el-table-column prop="customer_name" label="客户姓名" width="100"></el-table-column>
                                <el-table-column prop="contacts_phone" label="客户电话" width="120"></el-table-column>
                                <el-table-column prop="plate_number" label="车牌" width="140"></el-table-column>
                                <el-table-column prop="vin" label="车架号" width="180"></el-table-column>
                                <el-table-column prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column prop="series_name" label="车系"></el-table-column>
                                <el-table-column label="操作" width="380" style="text-align: right" v-if="getJurisdiction('3001')">
                                    <template slot-scope="scope">
                                        <el-button size="small" class="btn_yl" @click="changeState(scope.row.id,'施工中')">施工</el-button>
                                        <el-button size="small" class="btn_yl" @click="goEditOrder(scope.row.id)">编辑</el-button>
                                        <el-button size="small" class="btn_yl" @click="printBjOrder(scope.row.id)">打印</el-button>
                                        <el-button size="small" class="btn_default" @click="handleDelete(scope.row.id,'待施工')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="block" style="margin-top:15px;float: right" v-show="isPageShow">
                                <el-pagination @size-change="waitSizeChange"
                                    @current-change="waitCurrentChange"
                                    :current-page="waitOrder.offset"
                                    :page-sizes="[10, 20, 30, 40]"
                                    :page-size="waitOrder.limit"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="waitOrder.count||0">
                                </el-pagination>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item v-bind:name="2" class="listitem">
                            <template slot="title">
                                <i class="header-icon iconfont icon-shouqi" v-if="activeName == 2"></i>
                                <i class="header-icon iconfont icon-zhankai" v-else></i>
                                <span class="cont">施工中单据</span>
                                <span class="count"><i style="color:#ff901d">{{constrOrder.count||0}}</i> 张</span>
                            </template>
                            <el-table :data="constrOrder.list" style="width: 100%" class="DN">
                                <el-table-column prop="order_type" label="单据类型" width="85"></el-table-column>
                                <el-table-column prop="name" label="单据号" width="180"></el-table-column>
                                <el-table-column prop="customer_name" label="客户姓名" width="100"></el-table-column>
                                <el-table-column prop="contacts_phone" label="客户电话" width="120"></el-table-column>
                                <el-table-column prop="plate_number" label="车牌" width="140"></el-table-column>
                                <el-table-column prop="vin" label="车架号" width="180"></el-table-column>
                                <el-table-column prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column prop="series_name" label="车系"></el-table-column>
                                <el-table-column label="操作" width="380" style="text-align: right" v-if="getJurisdiction('4001','3001')">
                                    <template slot-scope="scope">
                                        <el-button size="small" v-if="getJurisdiction('3001')" class="btn_yl" @click="changeState(scope.row.id,'待收银')">施工完成</el-button>
                                        <el-button size="small" v-if="getJurisdiction('4001','3001')" class="btn_yl" @click="goEditOrder(scope.row.id)">编辑</el-button>
                                        <el-button size="small" v-if="getJurisdiction('3001')" class="btn_yl" @click="printOrder(scope.row.id)">打印</el-button>
                                        <el-button size="small" v-if="getJurisdiction('3001')" class="btn_default" @click="handleBack(scope.row.id,'施工中')">追回</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="block" style="margin-top:15px;float: right" v-show="isPageShow">
                                <el-pagination @size-change="constrSizeChange"
                                               @current-change="constrCurrentChange"
                                               :current-page="constrOrder.offset"
                                               :page-sizes="[10, 20, 30, 40]"
                                               :page-size="constrOrder.limit"
                                               layout="total, sizes, prev, pager, next, jumper"
                                               :total="constrOrder.count||0">
                                </el-pagination>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item v-bind:name="3" class="listitem">
                            <template slot="title">
                                <i class="header-icon iconfont icon-shouqi" v-if="activeName == 3"></i>
                                <i class="header-icon iconfont icon-zhankai" v-else></i>
                                <span class="cont">待收银单据</span>
                                <span class="count"><i style="color:#ff901d">{{unpayOrder.count||0}}</i> 张</span>
                            </template>
                            <el-table :data="unpayOrder.list" style="width: 100%" class="DN">
                                <el-table-column prop="order_type" label="单据类型" width="85"></el-table-column>
                                <el-table-column prop="name" label="单据号" width="180"></el-table-column>
                                <el-table-column prop="customer_name" label="客户姓名" width="100"></el-table-column>
                                <el-table-column prop="contacts_phone" label="客户电话" width="120"></el-table-column>
                                <el-table-column prop="plate_number" label="车牌" width="140"></el-table-column>
                                <el-table-column prop="vin" label="车架号" width="180"></el-table-column>
                                <el-table-column prop="brand_name" label="品牌"></el-table-column>
                                <el-table-column prop="series_name" label="车系"></el-table-column>
                                <el-table-column v-if="getJurisdiction('3001','5001')" label="操作" width="380" style="text-align: right">
                                    <template slot-scope="scope">
                                        <el-button v-if="getJurisdiction('5001')" size="small" class="btn_yl" @click="payOrder(scope.row.id)">收银</el-button>
                                        <el-button v-if="getJurisdiction('3001')" size="small" class="btn_yl" @click="backconstr(scope.row.id,'施工中')">返施工</el-button>
                                        <el-button v-if="getJurisdiction('3001')" size="small" class="btn_yl" @click="printOrder(scope.row.id)">打印</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="block" style="margin-top:15px;float: right" v-show="isPageShow">
                                <el-pagination @size-change="unpaySizeChange"
                                               @current-change="unpayCurrentChange"
                                               :current-page="unpayOrder.offset"
                                               :page-sizes="[10, 20, 30, 40]"
                                               :page-size="unpayOrder.limit"
                                               layout="total, sizes, prev, pager, next, jumper"
                                               :total="unpayOrder.count||0">
                                </el-pagination>
                            </div>
                        </el-collapse-item>
                    </section>
                </el-collapse>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>请为您的店铺命名{{input}}</span>
            <div>
                <el-input v-model="input" placeholder="请输入2-15个汉字的店铺名称"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getFormItems,deleteOrder,construction,backWait,backConstruction,queryOrder,orderPay,queryStatic,handlePrint} from '@/api/getData'

    export default {
        data() {
            return {
                centerDialogVisible: false,
                activeName: "",
                input: '',
                loading:false,
                isPageShow:true,
                searchBoxValue:'',
                waitOrder: {
                    count:'',
                    status:{
                        state: '待施工',
                        offset:1,
                        limit:10,
                        where:'',
                        timestamp:'',
                        order_type:'all'
                    },
                    list: []
                },
                constrOrder: {
                    count:'',
                    status:{
                        state: '施工中',
                        offset:1,
                        limit:10,
                        where:'',
                        timestamp:'',
                        order_type:'all'
                    },
                    list: []
                },
                unpayOrder: {
                    count:'',
                    status:{
                        state: '待收银',
                        offset:1,
                        limit:10,
                        where:'',
                        timestamp:'',
                        order_type:'all'
                    },
                    list: []
                },
                orderStatics:{}
            };
        },
        methods: {
            // 待施工分页加载
            waitSizeChange(val){
                this.waitOrder.status.limit = val;
                this.getwaitOrder();
            },
            waitCurrentChange(val){
                this.waitOrder.status.offset = val;
                this.getwaitOrder();
            },

            // 施工中分页加载
            constrSizeChange(val){
                this.constrOrder.status.limit = val;
                this.getconstrOrder();
            },
            constrCurrentChange(val){
                this.constrOrder.status.offset = val;
                this.getconstrOrder();
            },

            // 待收银分页加载
            unpaySizeChange(val){
                this.unpayOrder.status.limit = val;
                this.getunpayOrder();
            },
            unpayCurrentChange(val){
                this.unpayOrder.status.offset = val;
                this.getunpayOrder();
            },
            // 跳转编辑页面
            goEditOrder(id){
                this.$router.push({path:'/manage/editOrder', query:{id:id}})
            },

            // 单据删除
            handleDelete(val,type){
                this.$confirm('确认删除？')
                    .then( async () => {
                        this.loading = true ;
                        const data = await deleteOrder({rid:val});
                        if(data.state_code == 'ok'){
                            this.loading = false ;
                            this.$message.success('删除成功');
                            if(type == '待施工'){
                                this.getwaitOrder()
                            }else if(type == '施工中'){
                                this.getconstrOrder()
                            }else if(type == '待收银'){
                                this.getunpayOrder()
                            }
                        }else{
                            this.loading = false ;
                            this.$message.error(data.err_message)
                        }
                    })
                    .catch(()=> {
                    });
            },

            //追回施工中工单
            handleBack(id,type){
                this.$confirm('确认将单据状态改为待施工?')
                    .then( async () => {
                        this.loading = true ;
                        const res = await backWait({rid:id});
                        if(this.searchBoxValue==''){
                            if(res){
                                this.getwaitOrder();
                                this.getconstrOrder();
                                this.getunpayOrder();
                            }
                        }else{
                            this.handleQueryOrder()
                        }
                    })
                    .catch(_ => {
                    });
            },
            //更改单据状态
            async changeState(id,state){
                this.$confirm('确定改变此状态吗？')
                    .then( async () => {
                        this.loading = true ;
                        const res = await construction({rid:id,state:state});
                        if(this.searchBoxValue==''){
                            if(res){
                                this.getwaitOrder();
                                this.getconstrOrder();
                                this.getunpayOrder();
                            }
                        }else{
                            this.handleQueryOrder()
                        }
                    })
                    .catch(_ => {
                    });
            },

            // 返施工
            async backconstr(id,state){
                this.$confirm('确定改变此状态吗？')
                    .then( async () => {
                        this.loading = true ;
                        const res = await backConstruction({rid:id,state:state});
                        if(this.searchBoxValue==''){
                            if(res.state_code =='ok'){
                                this.loading = false ;
                                this.$message.success('操作成功');
                                this.getwaitOrder();
                                this.getconstrOrder();
                                this.getunpayOrder();
                            }else{
                                this.loading = false ;
                                this.$message.error(res.err_message)
                            }
                        }else{
                            this.loading = false ;
                            this.handleQueryOrder()
                        }
                    })
                    .catch(_ => {
                    });
            },
            //点击收银
            async payOrder(id){
                const res = await orderPay({rid:id});
                this.$router.push({
                    path:'/manage/orders/settlement',
                    query:{
                        id:res.results[0].relevant_documents_id,
                        rmodel:'dn.maintenance.order',
                        from:'working'
                    }
                })
            },
            handleClose() {
                this.centerDialogVisible = false;
            },
            goAddclient() {
                this.$router.push('/manage/client_main/addClient/undefined')
            },
            goCreateorder() {
                this.$router.push('/manage/createOrder_fix')
            },
            async getwaitOrder() {
                this.isPageShow = true;
                this.loading = true;
                this.waitOrder.status.timestamp = new Date().getTime();
                const res = await getFormItems(this.waitOrder.status);
                if(res.state_code == 'ok'){
                    this.waitOrder.count = res.count;
                    this.waitOrder.list = res.results;
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.error(res.err_message);
                }
            },
            async getconstrOrder() {
                this.isPageShow = true;
                this.loading = true;
                this.constrOrder.status.timestamp = new Date().getTime();
                const res = await getFormItems(this.constrOrder.status);
                if (res.state_code == 'ok'){
                    this.constrOrder.count = res.count;
                    this.constrOrder.list = res.results;
                    this.loading = false;
                } else{
                    this.loading = false;
                    this.$message.error(res.err_message);
                }
            },
            async getunpayOrder() {
                this.isPageShow = true;
                this.loading = true ;
                this.unpayOrder.status.timestamp = new Date().getTime();
                const res = await getFormItems(this.unpayOrder.status);
                if(res.state_code == 'ok'){
                    this.unpayOrder.count = res.count;
                    this.unpayOrder.list = res.results;
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$message.error(res.err_message);
                }
            },
            handleValuechange(){
                if(this.searchBoxValue== ''){
                    this.getwaitOrder();
                    this.getconstrOrder();
                    this.getunpayOrder();
                }
            },

            // 打印
            printOrder(id){
                window.open('/api/dn_report/download?reportname=dn_maintenance.report_service_settlement&docids='+id+'&timestamp='+new Date().getTime())
            },
            printBjOrder(id){
                window.open('/api/dn_report/download?reportname=dn_maintenance.report_service_quotation&docids='+id+'&timestamp='+new Date().getTime())
            },

            async handleQueryOrder(){
                this.isPageShow = false;
                if(this.searchBoxValue == ''){
                    this.getwaitOrder();
                    this.getconstrOrder();
                    this.getunpayOrder();
                }else{
                    var searchText = this.searchBoxValue;
                    this.loading = true;
                    const res = await queryOrder({where:searchText,timestamp:new Date().getTime()});
                    if(res.result.待施工== undefined && res.result.施工中== undefined &&res.result.待收银== undefined){
                        this.$message.error('没有搜到任何单据')
                    }else{
                        var count = 0;
                        for( var key in res.result){
                            if(res.result.hasOwnProperty(key)){
                                count += parseInt(res.result[key].length)
                            }
                        }
                        this.$message.success('共搜到'+count+'条单据,请展开列表查看')
                    }
                    if(res.result.待施工!= undefined){
                        this.waitOrder.list = res.result.待施工;
                        this.waitOrder.count = res.result.待施工.length
                    }if(res.result.待施工 == undefined){
                        this.waitOrder.list = [];
                        this.waitOrder.count = 0
                    }
                    if(res.result.施工中 != undefined){
                        this.constrOrder.list = res.result.施工中;
                        this.constrOrder.count = res.result.施工中.length;
                    }else if(res.施工中 == undefined){
                        this.constrOrder.list = [];
                        this.constrOrder.count = 0;
                    }
                    if(res.result.待收银!= undefined){
                        this.unpayOrder.list = res.result.待收银;
                        this.unpayOrder.count = res.result.待收银.length;
                    }else if(res.result.待收银 == undefined){
                        this.unpayOrder.list = [];
                        this.unpayOrder.count = 0;
                    }
                    this.loading = false;
                }
            },

            // 获取历史数据统计
            async getOrderStatics(){
                const res = await queryStatic({timestamp:new Date().getTime()})
                if(res.state_code == 'ok'){
                    this.orderStatics = res;
                }else{
                    this.$message.error(res.err_message)
                }
            },
        },

        mounted() {
            this.getwaitOrder();
            this.getconstrOrder();
            this.getunpayOrder();
            this.getOrderStatics();
        }
    }
</script>

<style lang="less" scoped>
    @import "../../style/mixin.less";
    @import "../../style/frame.less";

    .contbox {
        padding: 28px 30px;
    }

    .na_card {
        padding: 20px 0;
        background: #f8f8f8;
    }

    .na_card .grid-content {
        text-align: center;
        position: relative;
        &:after {
            height: 100%;
            width: 1px;
            background: #ccc;
            content: "";
            display: block;
            position: absolute;
            right: 0;
            top: 0;
        }
        .card_hd {
            font-size: 14px;
            color: #666
        }
        .card_bd {
            font-size: 24px;
            line-height: 55px;
            position: relative;
            .card_bt {
                font-size: 14px;
                color: @yl;
                position: absolute;
                line-height: 1;
                right: 40px;
                bottom: 0
            }
        }

    }

    .na_card .el-row .el-col:last-child .grid-content:after {
        display: none;
    }

</style>
