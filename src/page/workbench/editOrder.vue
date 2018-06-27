<template>
    <div class="add-client-box fillcontain DN" v-loading="loading">
        <header class="header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/manage/workbench' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>编辑单据</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
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
                    <div class="base_hd"><em>*</em>联系人：</div>
                    <el-input placeholder="请输入内容" class="inline-input" size="small" v-model="orderInfo.contacts"></el-input>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>联系电话：</div>
                    <el-input placeholder="请输入内容" class="inline-input" size="small" v-model="orderInfo.contacts_phone"></el-input>
                </div>
            </div>
            <div class="el-row" v-if="orderInfo.order_type == '保险工单'">
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>保险公司：</div>
                    <el-input placeholder="请输入内容" class="inline-input" size="small" v-model="orderInfo.insurance_company"></el-input>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>是否自费：</div>
                    <el-checkbox-group  v-model="orderInfo.self_fee">
                        <el-checkbox :label="orderInfo.self_fee==false?'否':'是'" name="take"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>进场油量：</div>
                    <el-select v-model="orderInfo.incoming_oil" placeholder="请选择" class="inline-input" size="small">
                        <el-option
                            v-for="item in incoming_oil"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>进场里程：</div>
                    <el-input placeholder="请填写进场里程" class="inline-input" size="small" v-model="orderInfo.advance_mileage"></el-input>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd">下次保养里程：</div>
                    <el-input placeholder="请填写下次保养里程" class="inline-input" size="small" v-model="orderInfo.the_next_maintenance_mileage"></el-input>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">客户陈述：</div>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        placeholder="最多200字"
                        resize="none"
                        maxlength="200"
                        v-model="orderInfo.customer_statement"
                        @input="desCount = orderInfo.customer_statement.length">
                    </el-input>
                    <span class="textareaend">{{desCount}}/200</span>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">服务顾问备注：</div>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        resize="none"
                        maxlength="200"
                        placeholder="最多200字"
                        v-model="orderInfo.service_advisor_notes"
                        @input="serCount = orderInfo.service_advisor_notes.length">
                    </el-input>
                    <span class="textareaend">{{serCount}}/200</span>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd"><em>*</em>接待人：</div>
                    <el-select v-model="orderInfo.receptionist_id" placeholder="请选择" class="inline-input" size="small">
                        <el-option
                            v-for="item in contacter"
                            :key="item.id"
                            :label="item.employee_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">&nbsp;</div>
                <div class="el-col el-col-24" style="margin-top:40px">
                    <div class="base_hd" style="width:10%">&nbsp;</div>
                    <el-button type="" @click="$router.replace('/manage/workbench')" class="btn_default"
                               style="margin-left:0">取消
                    </el-button>
                    <el-button type="warning" @click="baseActive=false">维修信息</el-button>
                    <el-button type="warning" @click="submitEdit">完成</el-button>
                </div>
            </div>
        </div>
        <div class="baseform" v-show="baseActive == false">
            <div class="el-row" style="border-top:none;">
                <div class="el-col el-col-12">
                    <div class="base_hd">检测结果：</div>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        placeholder="最多200字"
                        resize="none"
                        maxlength="200"
                        v-model="orderInfo.detection_result"
                        @input="resultCount = orderInfo.detection_result.length">
                    </el-input>
                    <span class="textareaend">{{resultCount}}/200</span>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">后续维修建议：</div>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        resize="none"
                        maxlength="200"
                        placeholder="最多200字"
                        v-model="orderInfo.follow_up_maintenance_proposal"
                        @input="sugCount = orderInfo.follow_up_maintenance_proposal.length">
                    </el-input>
                    <span class="textareaend">{{sugCount}}/200</span>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-24" style="position:relative">
                    <div class="base_hd" style="width: 10%">维修项目：</div>
                    <el-autocomplete
                        class="inline-input"
                        v-model="state2"
                        :fetch-suggestions="queryProSearch"
                        placeholder="项目名称，别称，价格"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        size="small"
                    ></el-autocomplete>
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
                                        <el-input v-model="item.price" @input="handleProCount" @change = 'item.price = toFixedTwo($event)'>
                                            <template slot="prepend">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-5"  style="text-align: right">
                                班组：
                                <el-select placeholder="请选择" v-model="item.department_id" style="height:auto;width:150px;" size="small" @change = loadEmployee(item.department_id,item)>
                                    <el-option
                                        v-for="cls in team"
                                        :key="cls.department_id"
                                        :label="cls.department_name"
                                        :value="cls.department_id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="el-col el-col-7" style="text-align: right">
                                员工：
                                <el-select multiple placeholder="请选择" v-model="item.employee_ids" size="small" style="min-width:250px">
                                    <el-option
                                        v-for="stuf in item.employee"
                                        :key="stuf.id"
                                        :label="stuf.employee_name"
                                        :value="stuf.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="el-col el-col-2">
                                <el-button type="text" @click="deletePro(item)">删除</el-button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd">所需配件：</div>
                    <el-autocomplete
                        class="inline-input"
                        v-model="state3"
                        :fetch-suggestions="queryPartSearch"
                        placeholder="配件名称，别名，价格"
                        :trigger-on-focus="false"
                        @select="handlePartSelect"
                        size="small"
                        style="width: 280px"
                    ></el-autocomplete>

                    <!--<el-button type="text" @click="queryOuted">查询已出库</el-button>-->
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
                                    <el-form-item label="报价" size="small">
                                        <el-input v-model="item.price" @input = 'handlePartsCount' @change="item.price = toFixedTwo($event)">
                                            <template slot="prepend">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-6" style="text-align: center">
                                所需数量：<el-input-number label="数量" size="small" v-model="item.quantity" @change="handlePartsCount"></el-input-number>
                            </div>
                            <div class="el-col el-col-3">
                                出库价格：{{item.out_price||0}}
                            </div>
                            <div class="el-col el-col-3">
                                出库数量：{{item.out_quantity||0}}
                            </div>
                            <div class="el-col el-col-2">
                                <el-button type="text" @click="backOut(item)" v-if="item.out_quantity>0"> 退库</el-button>
                                <el-button type="text" @click="deletePart(item)" v-if="item.out_quantity == 0">删除</el-button>
                            </div>
                        </li>
                    </ul>
                </div>
                <el-col class="el-col-24" style="margin-top:10px;">
                    <div class="base_hd" style="width:10%">项目小计：</div>
                    <span style="color:#e01823">¥ {{toFixedTwo(pro_amount_payable)}}</span>
                    <div class="base_hd" style="width:10%">配件小计：</div>
                    <span style="color:#e01823">¥ {{toFixedTwo(parts_amount_payable)}}</span>
                    <div class="base_hd" style="width:10%">总计：</div>
                    <span style="color:#e01823">¥ {{toFixedTwo(orderInfo.total_amount_payable)}}</span>
                </el-col>
                <div class="el-col el-col-12" style="margin-top:20px;">&nbsp;</div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%; float: left;">&nbsp;</div>
                    <el-button type="" @click="$router.replace('/manage/workbench')" class="btn_default"
                               style="margin-left:0">取消
                    </el-button>
                    <el-button type="warning" @click="baseActive=true">基本信息</el-button>
                    <el-button type="warning" v-if="orderInfo.state == '施工中'" @click="partOut">配件出库</el-button>
                    <el-button type="warning" @click="submitEdit">完成</el-button>
                </div>
            </div>
        </div>
        <!--出库信息弹窗-->
        <el-dialog title="配件出库" :visible.sync="dialogTableVisible" width="80%">
            <el-table :data="genoutInfo">
                <el-table-column label="配件编码">
                    <template slot-scope="scope">{{scope.row.parts_code}}</template>
                </el-table-column>
                <el-table-column label="领料人">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.picking_ids" multiple placeholder="请选择" size="small" style="margin-bottom: 0">
                            <el-option
                                v-for="item in contacter"
                                :key="item.id"
                                :label="item.employee_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="配件名称">
                    <template slot-scope="scope">{{scope.row.parts_name}}</template>
                </el-table-column>
                <el-table-column label="出库数量">
                    <template slot-scope="scope">
                        <input type="text" v-model="scope.row.sku">
                    </template>
                </el-table-column>
                <el-table-column label="出库单价">
                    <template slot-scope="scope">
                        <input type="text" v-model="scope.row.price">
                    </template>
                </el-table-column>
                <el-table-column label="出库小计">
                    <template slot-scope="scope">
                        {{(scope.row.price*scope.row.sku).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="出库批次">
                    <template slot-scope="scope">{{scope.row.batch}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" class="btn_default" @click="deleteOutItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="genOutConfirm">确认出库</el-button>
            </div>
        </el-dialog>

        <!--退库弹窗-->
        <el-dialog title="退库" :visible.sync="dialogTkVisible">
            <el-row :gutter="20" style="margin-bottom:15px;">
                <el-col :span="8">配件编码：{{tkInfo.parts_code}}</el-col>
                <el-col :span="8">名称：{{tkInfo.parts_name}}</el-col>
                <el-col :span="8">OE号：{{tkInfo.parts_oe}}</el-col>
            </el-row>
            <el-table :data="ckInfo">
                <el-table-column label="出库数量">
                    <template slot-scope="scope">{{scope.row.sku}}</template>
                </el-table-column>
                <el-table-column label="出库批次">
                    <template slot-scope="scope">{{scope.row.batch}}</template>
                </el-table-column>
                <el-table-column label="退库数量">
                    <template slot-scope="scope">
                        <input type="text" v-model="scope.row.sku" placeholder="请输入退库数量">
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTkVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBackOut">确认退库</el-button>
            </div>
        </el-dialog>
    </div>
</template>



<script>
    import {getOrder,editOrder,getProjects,getTeam,getEmployee,deletePro,getParts,gen_out,confirmOut,delete_out,showOuted,modifyGenOut,handlebackOut,fetchOuted} from '@/api/getData'
    export default {
        data() {
            return {
                state2:'',
                state3:'',
                orderInfo:{},
                cars: [],
                activeTab: 'fix',
                baseActive: true,
                activeCar: {},
                desCount: 0,
                serCount: 0,
                resultCount: 0,
                result: "",
                sugCount: 0,
                sug: "",
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
                genoutInfo:[],
                dialogTableVisible:false,
                dialogTkVisible:false,
                loading:false,
                tkInfo:[],
                ckInfo:[],
                incoming_oil:[{value:'空', labbel:'空'},{value:'20%', labbel:'20%'},{value:'40%', labbel:'40%'},{value:'60%', labbel:'60%'},{value:'80%', labbel:'80%'},{value:'满', labbel:'满'},],
            };
        },
        methods: {
            queryProSearch(queryString, cb) {
                queryString = queryString.trim();
                var projects = this.projects;
                console.log(this.projects);
                var results = queryString ? projects.filter(this.creatProFilter(queryString)) : projects;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            creatProFilter(queryString) {
                return (project) =>{
                    if(project.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0){
                        return true
                    }else{}
                }
            },
            queryPartSearch(queryString, cb) {
                queryString = queryString.trim();
                var parts = this.parts;
                console.log(this.parts);
                var results = queryString ? parts.filter(this.creatPartFilter(queryString)) : projects;
                // 调用 callback 返回建议列表的数据

                cb(results);
            },
            creatPartFilter(queryString) {
                return (part) =>{
                    if(part.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0){
                        return true
                    }else{}
                }
            },
            handleSelect(item) {
                for(var i=0;i<this.orderInfo.maintenance_project_ids.length;i++){
                    if(item.id == this.orderInfo.maintenance_project_ids[i].maintenance_project_id){
                        this.state2 ='';
                        this.$message.error('已经选择该项目');
                    }
                }
                item.maintenance_project_id = item.id;
                this.orderInfo.maintenance_project_ids.push(item);
                this.handleProCount();
                this.state2 =''
            },
            handlePartSelect(item){
                // for(var i=0;i<this.orderInfo.required_accessories_ids.length;i++){
                //     if(item.id == this.orderInfo.required_accessories_ids[i].parts_id){
                //         this.state3 ='';
                //         return this.$message({
                //             type:'error',
                //             message:'已经选择该配件'
                //         })
                //     }
                // }
                item.parts_id = item.id;
                this.orderInfo.required_accessories_ids.push(item);
                this.handlePartsCount();
                this.state3 =''
            },
            //删除选中项目
            deletePro(item){
                var _this = this;
                console.log(item);
                this.$confirm('确认删除？')
                    .then(_ => {
                        if(item.serial_number){
                            (async function(){
                                await deletePro({rid:_this.orderInfo.id,serial_number:item.serial_number,delete_type:"xm"})
                            })()
                        }
                        item.department_id=[];
                        item.employee_ids='';
                        var idx = this.orderInfo.maintenance_project_ids.indexOf(item);
                        this.orderInfo.maintenance_project_ids.splice(idx,1);
                        this.handleProCount();
                    })
                    .catch(_ => {});
            },
            //删除选中配件
            deletePart(item){
                var _this = this;
                this.$confirm('确认删除？')
                    .then(_ => {
                        if(item.serial_number){
                            (async function(){
                                await deletePro({rid:_this.orderInfo.id,serial_number:item.serial_number,delete_type:"sxpj"})
                            })()
                        }
                        var idx = this.orderInfo.required_accessories_ids.indexOf(item);
                        this.orderInfo.required_accessories_ids.splice(idx,1);
                        this.handlePartsCount();
                    })
                    .catch(_ => {});
            },
            changeType(e){
                this.crtprojtype = e;
                console.log(this.crtprojtype)
            },
            createFilter(queryString) {
                return (car) => {
                    if (car.name.indexOf(queryString) >= 0) {
                        return true
                    } else if (car.carnumber.indexOf(queryString) >= 0) {
                        return true
                    } else if (car.phone.indexOf(queryString) >= 0) {
                        return true
                    } else {
                    }
                };
            },
            async loadBasic(){
                const res = await getTeam({timestamp:new Date().getTime()});
                this.team = res.results;
                console.log(res);
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
                    this.desCount = this.orderInfo.customer_statement.length;
                    this.serCount = this.orderInfo.service_advisor_notes.length;
                    this.loadBasic();
                    this.handleProCount();
                    this.handlePartsCount()
                }else{
                    this.loading = false;
                    this.$message.error(res.err_message)
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
            async submitEdit(){
                console.log(this.orderInfo);
                this.orderInfo.rid = this.orderInfo.id;
                const res = await editOrder(this.orderInfo);
                if(res.state_code == 'ok'){
                    this.$message.success('修改完成')
                    this.$router.push('/manage/workbench')
                }else{
                    this.$message.error(res.err_message)
                }
            },
            // 加载基础维修项目
            async loadProject(){
                const res = await getProjects({timestamp:new Date().getTime()});
                this.projects = res.results.filter(obj => obj.active == true);
                var i;
                for(i=0;i<this.projects.length;i++){
                    this.projects[i].value = this.projects[i].other_name + ' ' + this.projects[i].project_name + ' '+this.projects[i].price + '元'
                }

            },
            // 加载基础配件
            async loadParts(){
                const res = await getParts({timestamp:new Date().getTime()});
                this.parts = res.results.filter(obj => obj.active == true);
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
            // 加载员工
            loadEmployee(val,obje){
                obje.employee_ids = [];
                var crtteam = this.team.filter(obj => obj.department_id == val);
                obje.employee = crtteam[0].employee;
            },
            // 获取接待人
            async fetchEmployee(){
                const res = await getEmployee({timestamp:new Date().getTime()});
                if(res.results){
                    this.contacter = res.results.filter(obj => obj.state =='在职');
                }
            },
            // 生成出库信息
            async partOut(){
                if(!this.getJurisdiction('4001')){
                    this.$message.error('您没有配件出库权限')
                }else{
                    this.loading = true;
                    this.orderInfo.rid = this.orderInfo.id;
                    const data = await editOrder(this.orderInfo);
                    if(data.state_code == 'ok'){
                        const res = await gen_out({order_id:this.orderInfo.id,employee_id:1});
                        if(res.state_code == 'ok'){
                            this.loading = false;
                            this.getOrderInfo();
                            if(res.warn){
                                this.$alert(res.warn, '提示', {
                                    confirmButtonText: '知道了',
                                    callback: action => {
                                        if(res.results.length >0){
                                            this.dialogTableVisible = true;
                                            this.genoutInfo = res.results;
                                        }else{
                                            this.$message.error('没有需要出库的配件！')
                                        }
                                    }
                                });
                            }else{
                                if(res.results.length >0){
                                    this.dialogTableVisible = true;
                                    this.genoutInfo = res.results;
                                }else{
                                    this.$message.error('没有需要出库的配件！')
                                }
                            }
                        }else{
                            this.loading = false;
                            this.$message.error(res.err_message)
                        }
                    }else{
                        this.loading = false;
                        this.$message.error(data.err_message)
                    }
                }
            },
            // 确认出库
            async genOutConfirm(){
                this.loading = true;
                const data = await modifyGenOut(this.genoutInfo)
                if(data.state_code == 'ok'){
                    this.genoutInfo = data.results
                    const res = await confirmOut({
                        order_id:this.orderInfo.id,
                        employee_id:JSON.parse(sessionStorage.getItem('userInfo')).id
                    })
                    this.loading = false;
                    if(res.state_code == 'ok'){
                        this.dialogTableVisible = false
                        this.$message.success('出库成功');
                        this.loading = false;
                        this.getOrderInfo()
                    }else{
                        this.dialogTableVisible = false
                        this.$message.error(res.err_message)
                        this.loading = false;
                    }
                } else{
                    this.$message.error(data.err_message)
                    this.loading = false;
                }
            },
            //删除出库明细信息
            deleteOutItem(item){
                var idx;
                for(var i=0 ; i<this.genoutInfo.length;i++){
                    if(this.genoutInfo[i].id == item.id){
                        idx = i;
                    }
                }
                this.$confirm('确认删除？')
                    .then(async() => {
                        const res = await delete_out({id:item.id,employee_id:1})
                        if(res.state_code == 'ok'){
                            this.genoutInfo.splice(idx,1)
                        }else{
                            this.$message.error(res.err_message)
                        }
                    })
                    .catch(() => {});
            },

            // 操作退库
            async backOut(e){
                if(!this.getJurisdiction('4001')){
                    this.$message.error('您没有退库权限！')
                }else{
                    this.dialogTkVisible = true;
                    const res = await fetchOuted({
                        order_id:this.orderInfo.id,
                        parts_id:e.parts_id,
                        serial_number:e.serial_number
                    })
                    if(res.state_code == 'ok'){
                        this.$set(this.tkInfo,'parts_code',res.results[0].parts_code)
                        this.$set(this.tkInfo,'parts_name',res.results[0].parts_name)
                        this.$set(this.tkInfo,'parts_oe',res.results[0].parts_oe)
                        this.$set(this.tkInfo,'parts_id',res.results[0].parts_id)
                        this.ckInfo = res.results
                    }else{
                        this.$message.error(res.err_message)
                    }
                }
            },
            // 确认退库
            async confirmBackOut(){
                this.$confirm('确认退库？')
                    .then(async() => {
                        this.$set(this.tkInfo,'tk_arr',[])
                        for(var i=0;i<this.ckInfo.length;i++){
                            this.tkInfo.tk_arr.push({
                                id:this.ckInfo[i].id,
                                sku:this.ckInfo[i].sku
                            })
                        }
                        const res = await handlebackOut(this.tkInfo.tk_arr)
                        if(res.state_code == 'ok'){
                            this.$message.success('退库成功')
                            this.tkInfo = []
                            this.dialogTkVisible = false;
                            this.getOrderInfo()
                        }else{
                            this.$message.error(res.err_message)
                            this.dialogTkVisible = false
                            this.getOrderInfo()
                        }
                    })
                    .catch(_ => {});
            }
        },
        mounted(){
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
</style>
