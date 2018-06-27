<template>
    <div class="DN editOrder" v-loading="loading">
        <div class="documentHeader">
            {{orderInfo.order_type}}/ <span>工单号：</span><span>{{orderInfo.name}}</span>
        </div>
        <div class="formtab">
            <button class="tabinfo base_info" v-bind:class="{ active: baseActive }" @click="baseActive = true">
                基本信息
            </button>
            <button class="tabinfo fix_info" v-bind:class="{ active: !baseActive }"
                    @click="baseActive=false">维修信息
            </button>
        </div>
        <div class="baseform" v-show="baseActive">

            <div class="outwrap">
                <div class="el-col el-col-12">
                    <div class="base_hd">姓名：</div>
                    {{orderInfo.customer_name}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">电话：</div>
                    {{orderInfo.customer_phone}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">客户车辆：</div>
                    {{orderInfo.customer_car}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">车牌：</div>
                    {{orderInfo.plate_number}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">车架号：</div>
                    {{orderInfo.vin}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">颜色：</div>
                    {{orderInfo.car_color}}
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">联系人：</div>
                    {{orderInfo.contacts}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">联系电话：</div>
                    {{orderInfo.contacts_phone}}
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">进场油量：</div>
                    {{orderInfo.incoming_oil}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">进场里程：</div>
                    {{orderInfo.advance_mileage}}
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd">下次保养里程：</div>
                    {{orderInfo.the_next_maintenance_mileage}}
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">客户陈述：</div>
                    <div style="width:75%;display: inline-block;">{{orderInfo.customer_statement}}</div>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">服务顾问备注：</div>
                    <div style="width:75%;display: inline-block;">{{orderInfo.service_advisor_notes}}</div>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd">接待人：</div>
                    {{orderInfo.receptionist_name}}
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">&nbsp;</div>
                <div class="el-col el-col-24" style="margin-top:40px">
                    <div class="base_hd" style="width:10%">&nbsp;</div>
                    <el-button type="" @click="$router.replace('/manage/orders/working')" class="btn_default"
                               style="margin-left:0">返回
                    </el-button>
                    <el-button type="warning" @click="baseActive=false">维修信息</el-button>
                </div>
            </div>
        </div>
        <div class="baseform" v-show="baseActive == false">
            <div class="el-row" style="border-top:none;">
                <div class="el-col el-col-12">
                    <div class="base_hd">检测结果：</div>
                    {{orderInfo.detection_result}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">后续维修建议：</div>
                    {{orderInfo.follow_up_maintenance_proposal}}
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-24" style="position:relative">
                    <div class="base_hd" style="width: 10%">维修项目：</div>
                </div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%;float:left">&nbsp;</div>
                    <ul class="optgroup" style="width: 90%;float:left;box-sizing: border-box;padding-left: 5px;">
                        <li v-for="(item,index) in orderInfo.maintenance_project_ids" :key="index">
                            <div class="el-col el-col-5" style="text-indent:20px">
                                {{item.project_name}}  {{item.maintenance_project_id}}
                            </div>
                            <div class="el-col el-col-5">
                                <el-form label-width="50px">
                                    <el-form-item label="价格" size="small">
                                        ￥{{item.price}}
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-5"  style="text-align: right">
                                班组：{{item.department_name}}
                            </div>
                            <div class="el-col el-col-7" style="text-align: right">
                                员工：{{item.employee_name}}
                            </div>
                            <div class="el-col el-col-2"></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">所需配件：</div>
                </div>
                <div class="el-col el-col-12">&nbsp;</div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%; float: left;">&nbsp;</div>
                    <ul class="optgroup" style="width: 75%;float:left;box-sizing: border-box;padding-left: 5px;">
                        <li style="padding:18px 0 0 20px" v-for="(item,index) in orderInfo.required_accessories_ids" :key="index">
                            <div class="el-col el-col-2">
                                {{item.parts_code}}
                            </div>
                            <div class="el-col el-col-3">
                                {{item.parts_name}}
                            </div>
                            <div class="el-col el-col-5">
                                <el-form label-width="50px">
                                    <el-form-item label="价格" size="small">
                                        ￥{{item.price}}
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-6" style="text-align: center">
                                数量：{{item.quantity}}
                            </div>
                            <div class="el-col el-col-3">
                                出库价格：{{item.out_price||0}}
                            </div>
                            <div class="el-col el-col-3">
                                出库数量：{{item.out_quantity||0}}
                            </div>
                            <div class="el-col el-col-2"></div>
                        </li>
                    </ul>
                </div>
                <el-col class="el-col-24" style="margin-top:10px;">
                    <div class="base_hd" style="width:10%">项目小计：</div>
                    <span style="color:#e01823">¥ {{pro_amount_payable}}</span>
                    <div class="base_hd" style="width:10%">配件小计：</div>
                    <span style="color:#e01823">¥ {{parts_amount_payable}}</span>
                    <div class="base_hd" style="width:10%">合计金额：</div>
                    <span style="color:#e01823">¥ {{orderInfo.total_amount_payable}}</span>
                </el-col>
                <div class="el-col el-col-12" style="margin-top:20px;">&nbsp;</div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%; float: left;">&nbsp;</div>
                    <el-button type="" @click="$router.replace('/manage/orders/working')" class="btn_default"
                               style="margin-left:0">返回
                    </el-button>
                    <el-button type="warning" @click="baseActive=true">基本信息</el-button>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
    import {getOrder,getProjects,getTeam,getEmployee,getParts} from '@/api/getData'
    export default {
        data() {
            return {
                orderInfo:{},
                baseActive: true,
                desCount: 0,
                serCount: 0,
                result: "",
                des: "",
                ser: '',
                team:[],
                employee:[],
                contacter: [],
                value: '',
                projects:[],
                parts:[],
                pro_amount_payable:0,
                parts_amount_payable:0,
                loading:false,
            };
        },
        methods: {
            async loadBasic(){
                const res = await getTeam({timestamp:new Date().getTime()});
                this.team = res.results;
                for(var i=0;i<this.orderInfo.maintenance_project_ids.length;i++){
                    if(this.orderInfo.maintenance_project_ids[i].department_id != ''){
                        var crtteam = this.team.filter(obj => obj.department_id == this.orderInfo.maintenance_project_ids[i].department_id);
                        this.orderInfo.maintenance_project_ids[i].employee = crtteam[0].employee;
                    }
                }
            },
            async getOrderInfo(){
                this.loading = true;
                const res = await getOrder({
                    rid:this.$route.query.id,
                    limit:1,
                    offset:1,
                    timestamp:new Date().getTime()
                });
                if(res.state_code == 'ok'){
                    this.loading = false;
                    this.orderInfo = res.results[0];
                    console.log('orderInfo',this.orderInfo)
                    this.desCount = this.orderInfo.customer_statement.length;
                    this.serCount = this.orderInfo.service_advisor_notes.length;
                    this.loadBasic();
                    this.handleProCount();
                    this.handlePartsCount()
                }else{
                    this.loading = false;
                    this.$message({
                        type:'error',
                        message:res.err_message
                    })
                }
            },
            // 工时统计
            handleProCount(){
                this.pro_amount_payable = 0;
                for(var i=0;i<this.orderInfo.maintenance_project_ids.length;i++){
                    if(this.orderInfo.maintenance_project_ids[i].price != ''){
                        this.pro_amount_payable += parseFloat(this.orderInfo.maintenance_project_ids[i].price)
                    }
                }
                this.orderInfo.total_amount_payable = this.pro_amount_payable + this.parts_amount_payable
            },
            // 配件统计
            handlePartsCount(){
                if(this.orderInfo.state=='待施工'){
                    this.parts_amount_payable = 0;
                    for(var i=0;i<this.orderInfo.required_accessories_ids.length;i++){
                        if(this.orderInfo.required_accessories_ids[i].price != ''){
                            this.parts_amount_payable += parseFloat(this.orderInfo.required_accessories_ids[i].price)*parseFloat(this.orderInfo.required_accessories_ids[i].quantity)
                        }
                    }
                    this.orderInfo.total_amount_payable = this.pro_amount_payable + this.parts_amount_payable
                }else{
                    this.parts_amount_payable = 0;
                    for(var i=0;i<this.orderInfo.required_accessories_ids.length;i++){
                        if(this.orderInfo.required_accessories_ids[i].out_price != '' && this.orderInfo.required_accessories_ids[i].out_price != undefined){
                            this.parts_amount_payable += parseFloat(this.orderInfo.required_accessories_ids[i].out_price)*parseFloat(this.orderInfo.required_accessories_ids[i].out_quantity)
                        }
                    }
                    this.orderInfo.total_amount_payable = this.pro_amount_payable + this.parts_amount_payable
                }
            },
            // 加载基础维修项目
            async loadProject(){
                const res = await getProjects({timestamp:new Date().getTime()});
                this.projects = res.results;
                var i;
                for(i=0;i<this.projects.length;i++){
                    this.projects[i].value = this.projects[i].other_name + ' ' + this.projects[i].project_name + ' '+this.projects[i].price + '元'
                }

            },
            // 加载基础配件
            async loadParts(){
                const res = await getParts({timestamp:new Date().getTime()});
                this.parts = res.results;
                var i;
                for(i=0;i<this.parts.length;i++){
                    if(this.parts[i].alias != false){
                        this.parts[i].value = this.parts[i].name +' '+ '['+ this.parts[i].alias +']' + ' '+this.parts[i].price + '元'
                    }else{
                        this.parts[i].value = this.parts[i].name + ' '+this.parts[i].price + '元'
                    }
                    this.parts[i].parts_name = this.parts[i].name;
                    this.parts[i].parts_code = this.parts[i].code;
                    this.$set(this.parts[i],'quantity',1)
                }
            },
            // 获取接待人
            async fetchEmployee(){
                const res = await getEmployee({timestamp:new Date().getTime()});
                if(res.results){
                    this.contacter = res.results;
                }
            },
        },
        mounted(){
            this.$emit('changeActive','working');
            this.loadProject();
            this.loadParts();
            this.getOrderInfo();
            this.fetchEmployee();
            for(var i=0;i<this.projects.length;i++){
                this.projects[i].value = this.projects[i].name +' '+ this.projects[i].price
            }
        },
        computed: {
        }
    }
</script>

<style lang="less" scoped>
    @import "../../style/mixin.less";
    @import "../../style/createorder.less";
    .el-form-item__label{
        line-height:32px!important;
    }
div,p{
    box-sizing: border-box;
}
.editOrder{
    width:100%;
    font-size:14px;
    color:#3c3c3c;
}
.documentHeader{
    background: #f8f8f8;
    height: 59px;
    line-height:59px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.documentHeader>span{
    color:#ff901e;
}
</style>
