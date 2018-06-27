<template>
    <div class="client-detail-box">
        <header class="header">
            <span @click="$router.go(-1)" style="cursor: pointer;">客户管理 / </span>
            <span class="detail">客户详情</span>
        </header>
        <section class="section">
            <ul class="user-detail">
                <li class="user-detail-item" style="display: flex">
                    <span class="title">姓名 ： </span>
                    <span class="content">{{detailListDate.name}}</span>
                    <div style="margin-left:100px;" class="client-discount">
                        <!--券-->
                        <div @click="openTicket">
                            <i class="iconfont icon-youhuiquan"></i>
                            <span>券：{{couponCount}}</span>
                            <div class="DN" style="position: absolute" v-show="ticketToggle">
                                <b  class="iconfont icon-close tickeClose" @click.stop="ticketToggle = false"></b>
                                <el-tabs type="border-card" style="width:600px">
                                    <el-tab-pane  label="未使用">
                                        <el-table
                                            empty-text="暂无优惠券"
                                            :max-height="220"
                                            :data="ticketDate_2"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="name"
                                                label="券号"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="coupon_name"
                                                label="优惠券名称"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="coupon_type"
                                                label="类型">
                                            </el-table-column>
                                            <el-table-column
                                                prop="effective_date"
                                                label="失效日期">
                                            </el-table-column>
                                            <el-table-column
                                                prop="get_date"
                                                label="获取日期">
                                            </el-table-column>
                                            <el-table-column
                                                prop="state"
                                                label="状态">
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                    <el-tab-pane  label="已使用">
                                        <el-table
                                            empty-text="暂无优惠券"
                                            :max-height="220"
                                            :data="ticketDate_1"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="name"
                                                label="券号"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="coupon_name"
                                                label="优惠券名称"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="coupon_type"
                                                label="类型">
                                            </el-table-column>
                                            <el-table-column
                                                prop="effective_date"
                                                label="失效日期">
                                            </el-table-column>
                                            <el-table-column
                                                prop="get_date"
                                                label="获取日期">
                                            </el-table-column>
                                            <el-table-column
                                                prop="state"
                                                label="状态">
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </div>
                        <!--余额-->
                        <div style="padding-left:40px;" @click="openCar()" v-if="getJurisdiction('5004')">
                            <i class="iconfont icon-cardb"></i>
                            <span>余额：{{detailListDate.customer_balance==''?'0':detailListDate.customer_balance}}</span>
                            <el-tooltip class="item" effect="dark" content="调整余额" placement="top-start">
                                <b  @click.stop="showDialogVisible " style="position:absolute;right:-18px;top:-30%;color:#5db5fd" class="iconfont icon-bianji"></b>
                            </el-tooltip>

                            <div class="DN" style="position: absolute" v-show="carToggle">
                                <b  class="iconfont icon-close tickeClose" @click.stop="carToggle = false"></b>
                                <el-tabs type="border-card" style="width:600px" v-model="carActive">
                                    <el-tab-pane label="充值记录" name="first">
                                        <el-table
                                            empty-text="暂无充值记录"
                                            :max-height="220"
                                            :data="carDate_1"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="member_charge_no"
                                                label="充值单号"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="received_money"
                                                label="充值金额"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="gift_money"
                                                label="赠送金额">
                                            </el-table-column>
                                            <el-table-column
                                                prop="gathering_time"
                                                label="充值日期">
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                    <el-tab-pane label="消费记录" name="second">
                                        <el-table
                                            empty-text="暂无消费记录"
                                            :max-height="220"
                                            :data="carDate_2"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="relevant_documents_no"
                                                label="充值单号"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="cashier_no"
                                                label="消费单号"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="club_card_pay_money"
                                                label="消费金额">
                                            </el-table-column>
                                            <el-table-column
                                                prop="order_type"
                                                label="消费类型">
                                            </el-table-column>
                                            <el-table-column
                                                prop="receiving_time"
                                                label="消费日期">
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="user-detail-item" >
                    <span class="title">手机号 ： </span>
                    <span class="content" v-if="detailListDate.mobile_phone">{{detailListDate.mobile_phone}}</span>
                </li>
                <li class="user-detail-item" >
                    <span class="title">电话 ： </span>
                    <span class="content" v-if="detailListDate.phone">{{detailListDate.phone}}</span>
                </li>
                <li class="user-detail-item" >
                    <span class="title">性别 ： </span>
                    <span class="content" v-if="detailListDate.sex">{{detailListDate.sex}}</span>
                </li>
                <li class="user-detail-item" >
                    <span class="title">客户来源 ： </span>
                    <span class="content" v-if="detailListDate.customer_source">{{detailListDate.customer_source}}</span>
                </li>
                <li class="user-detail-item" >
                    <span class="title">是否生效 ： </span>
                    <span class="content">{{detailListDate.active==true?'是':''}}</span>
                </li>
                <li>
                    <div class="DN" style="margin-top: 20px;margin-bottom: 10px;">
                        <el-button type="warning" @click="$router.push(`/manage/client_main/addClient/${$route.params.id}`)">编辑客户和车辆</el-button>
                    </div>
                </li>
            </ul>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
            >
                <div style="display: flex;align-items: center">
                    <span style="padding-right:20px">调整余额</span>
                    <el-input v-model="inputValue" type="number" size="small" style="width:70%"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="saveDialogVisible">确 定</el-button>
                    </span>
            </el-dialog>
            <div class="client-detail-car DN">
                <el-table
                    empty-text="该客户暂未添加车辆"
                    :data="detailCarList"
                    style="width: 100%">
                    <el-table-column
                        prop="brand_name"
                        label="品牌"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="series_name"
                        label="车系"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="car_models_name"
                        label="车型">
                    </el-table-column>
                    <el-table-column
                        prop="plate_number"
                        label="车牌">
                    </el-table-column>

                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="warning"
                                @click="weixiu(scope.row.id)"
                            >维修履历</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
        <!--维修履历弹框-->
        <div class="add-client-alert" v-show="ifToggle1">
            <div class="alert-box" style="width:70%">
                <div class="title">
                    <span>维修履历</span>
                    <i  class="iconfont icon-close" @click="ifToggle1 = false"></i>
                </div>
                <div class="from-box">
                    <div style="padding:6px 50px;color:#909399;font-size:14px">
                        <span style="margin-right: 50px;">品牌：{{tableData_b.brand_name}}</span>
                        <span style="margin-right: 50px;">车系：{{tableData_b.series_name}}</span>
                        <span style="margin-right: 50px;">车牌：{{tableData_b.plate_number}}</span>
                    </div>
                    <el-table
                        :max-height="300"
                        :data="tableData_a"
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            prop="create_date"
                            label="接待时间"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contacts"
                            label="送修人"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="contacts_phone"
                            label="联系电话"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="order_type"
                            label="维修类型"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="total_amount_payable"
                            label="消费金额"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="receptionist_name"
                            label="接待人"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="follow_up_maintenance_proposal"
                            label="后续维修建议"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {partner,member_search_for_partner,cashier_search_for_partner,partner_all_coupon,adjust_balance,maintenance_record} from '@/api/getData'
    export default {
        data(){
            return{
                ifToggle1:false,
                tableData_b:{},
                tableData_a:[],
                inputValue:'',
                dialogVisible:false,
                couponCount:'',
                carCount:'',
                carActive:'first',
                carToggle:false,
                ticketToggle:false,
                ticketDate_1:[],
                ticketDate_2:[],
                carDate_1:[],
                carDate_2:[],
                detailCarList:[],
                itemId:'',
                detailListDate:{//客户基本信息
                },
            }
        },
        async mounted(){
            const data = {
                rid:this.$route.params.id,timestamp:new Date().getTime()
            };
            const res = await partner(data);
            if(res.state_code=='ok'){
                this.detailListDate = res.results[0];
                if(res.results[0].customer_car_ids.length==0){
                    this.detailCarList = []
                }else{
                    this.detailCarList = res.results[0].customer_car_ids
                }
            }else{
                this.$message.error(res.err_message);
            };
            this.getCpoupen();
            this.getCar()
        },
        methods:{
            showDialogVisible(){
                this.dialogVisible = true;
                this.inputValue = this.detailListDate.customer_balance
            },
            //维修履历
            async weixiu(id){
                this.ifToggle1 = true;
                const res = await maintenance_record({rid:id})
                if(res.state_code==='ok'){
                    this.tableData_b = res.results
                    this.tableData_a = res.results.record
                }
            },
            //调整余额
            async saveDialogVisible(){
                const res = await adjust_balance({'rid':this.$route.params.id,'customer_balance':this.inputValue});
                if(res.state_code==='ok'){
                    this.$message({
                        message: '更改成功',
                        type: 'success'
                    });
                    this.dialogVisible = false;
                    this.detailListDate.customer_balance = this.inputValue
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //发送请求获取优惠券
            async getCpoupen(){
                const res = await partner_all_coupon({partner_id:this.$route.params.id,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.ticketDate_1 = res.result.已使用;
                    this.ticketDate_2 = res.result.未使用;
                    this.couponCount = res.count;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //发送请求获取卡
            async getCar(){
                //发送请求数据获取充值记录
                const res = await member_search_for_partner({partner_id:this.$route.params.id,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.carDate_1 =res.results;
                }else{
                    this.$message.error(res.err_message);
                }
                //发送请求获取消费纪律
                const resa = await cashier_search_for_partner({partner_id:this.$route.params.id,timestamp:new Date().getTime()});
                if(resa.state_code=='ok'){
                    this.carDate_2 = resa.results;
                }else{
                    this.$message.error(resa.err_message);
                }
            },

            async openTicket(){
                this.ticketToggle = true;
                this.carToggle = false;
                this.tickeActive = 'first'

            },
            async openCar(){
                this.ticketToggle = false;
                this.carToggle = true;
                this.carActive = 'first';
            },

        }
    }
</script>

<style  scoped>
    .client-detail-box .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }

    .client-detail-box>.header>.detail{
        color:#ff901d;
    }
    .client-detail-box>.section{
        padding:20px;
    }
    .user-detail{
        padding:10px;
    }
    .user-detail-item{
        height: 40px;
        line-height: 40px;
        font-size:15px;
        color:#606266
    }
    .user-detail-item >.title{
        display: inline-block;
        width:80px;
        text-align: right;
        margin-right:8px;
    }
    .client-detail-car{
        border-top:1px solid #eeeeee;
        padding-top:50px;
    }
    .client-discount{
        display: flex;
    }
    .client-discount>div{
        cursor: pointer;
        position: relative;
    }
    .client-discount i{
        font-size:23px;
        color: #ff901e;
    }
    .client-discount div:hover i{
        color:#ff601e;
    }
    .client-discount div:hover>span{
        color:#ff601e;
    }
    .client-discount span{
        color: #ff901e;
    }
    .tickeClose{
        position: absolute;
        top:0;
        right:20px;
        z-index:1000000;
        font-size:20px
    }
    .tickeClose:hover{
        color:red
    }

    .add-client-alert{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.4);
        z-index: 100;
    }
    .alert-box{
        width:490px;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%)
    }
    .alert-box>.title{
        padding-left:20px;
        font-weight:bold;
        font-size:15px;
        height: 59px;
        color:#666;
        line-height: 59px;
        border-bottom:1px solid #eee;
        display: flex;
        justify-content: space-between;
        padding-right:20px;
    }
    .alert-box>.title>i{
        font-size:20px;
    }
    .alert-box>.title>i:hover{
        color:red;
    }
    .from-box{
        padding:20px 50px 20px 0
    }
    .tableCell{
        text-align: center;
    }
</style>
