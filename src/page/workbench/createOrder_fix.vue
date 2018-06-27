<template>
    <div class="add-client-box fillcontain DN">
        <div class="pagetab">
            <ul>
                <li>
                    <button @click="$router.replace('/manage/createOrder_fix')" class="active">维修工单</button>
                </li>
                <li>
                    <button @click="$router.replace('/manage/createOrder_ins')">保险工单</button>
                </li>
            </ul>
        </div>
        <header class="header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/manage/workbench' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>快速开单</el-breadcrumb-item>
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
            <div class="el-col el-col-24">
                <div class="base_hd" style="width:10%;">客户信息获取：</div>
                <el-autocomplete
                    popper-class="my-autocomplete"
                    placeholder="请输入内容"
                    size="small"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleCstSelect"
                    >
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.partner_name }}&nbsp;{{item.mobile_phone}}</div>
                        <span class="carnumber">{{ item.plate_number }}</span>
                    </template>
                </el-autocomplete>
                <el-button type="text" @click="$router.push('/manage/client_main/addClient/undefined')">新建客户</el-button>
            </div>
            <div class="outwrap">
                <div class="el-col el-col-12">
                    <div class="base_hd">姓名：</div>
                    {{activeCar.partner_name}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">电话：</div>
                    {{activeCar.mobile_phone}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">客户车辆：</div>
                    {{activeCar.car_models_name}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">车牌：</div>
                    {{activeCar.plate_number}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">车架号：</div>
                    {{activeCar.vin}}
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd">颜色：</div>
                    {{activeCar.car_color}}
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>联系人：</div>
                    <el-input placeholder="请输入内容" class="inline-input" size="small" v-model="contacts"></el-input>
                </div>
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>联系电话：</div>
                    <el-input placeholder="请输入内容" class="inline-input" size="small" v-model="contacts_phone"></el-input>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-12">
                    <div class="base_hd"><em>*</em>进场油量：</div>
                    <el-select v-model="oil" placeholder="请选择" class="inline-input" size="small">
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
                    <el-input placeholder="请填写进场里程" class="inline-input" size="small" v-model="advance_mileage"></el-input>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd">下次保养里程：</div>
                    <el-input placeholder="请填写下次保养里程" class="inline-input" size="small" v-model="the_next_maintenance_mileage"></el-input>
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
                        v-model="customer_statement"
                        @input="desCount = customer_statement.length">
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
                        v-model="service_advisor_notes"
                        @input="serCount = service_advisor_notes.length">
                    </el-input>
                    <span class="textareaend">{{serCount}}/200</span>
                </div>
                <div class="el-col el-col-12" style="margin-top:20px;">
                    <div class="base_hd"><em>*</em>接待人：</div>
                    <el-select v-model="receptionist_id" placeholder="请选择" class="inline-input" size="small">
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
                        v-model="detection_result"
                        @input="resultCount = detection_result.length">
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
                        v-model="follow_up_maintenance_proposal"
                        @input="sugCount = follow_up_maintenance_proposal.length">
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
                        style="width: 280px"
                    ></el-autocomplete>
                </div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%;float:left">&nbsp;</div>
                    <ul class="optgroup" style="width: 90%;float:left;box-sizing: border-box;padding-left: 5px;">
                        <li v-for="item in maintenance_project_ids">
                            <div class="el-col el-col-5" style="text-indent:20px">
                                {{item.project_name}}  {{item.id}}
                            </div>
                            <div class="el-col el-col-5">
                                <el-form label-width="50px">
                                    <el-form-item label="价格" size="small">
                                        <el-input v-model="item.price" @input="handleProCount" @change="item.price = toFixedTwo($event)">
                                            <template slot="prepend">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-5"  style="text-align: right">
                                班组：
                                <el-select placeholder="请选择" v-model="item.department_id" style="height:auto;width:150px;" size="small" @change = loadEmployee(item)>
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
                </div>
                <div class="el-col el-col-12">&nbsp;</div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%; float: left;">&nbsp;</div>
                    <ul class="optgroup" style="width: 65%;float:left;box-sizing: border-box;padding-left: 5px;">
                        <li style="padding:20px 0 0 20px" v-for="item in required_accessories_ids">
                            <div class="el-col el-col-6">
                                {{item.parts_name}}
                            </div>
                            <div class="el-col el-col-8">
                                <el-form label-width="50px">
                                    <el-form-item label="报价" size="small">
                                        <el-input v-model="item.price" @input="handlePartsCount" @change="item.price = toFixedTwo($event)">
                                            <template slot="prepend">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="el-col el-col-8" style="text-align: right">
                                所需数量：<el-input-number size="small" v-model="item.quantity" @change="handlePartsCount"></el-input-number>
                            </div>
                            <div class="el-col el-col-2">
                                <el-button type="text" @click="deletePart(item)">删除</el-button>
                            </div>
                        </li>
                    </ul>
                </div>
                <el-col class="el-col-24" style="margin-top:10px;">
                    <div class="base_hd" style="width:10%">项目小计：</div>
                    <span style="color:#e01823">¥ {{pro_amount_payable.toFixed(2)}}</span>
                    <div class="base_hd" style="width:10%">配件小计：</div>
                    <span style="color:#e01823">¥ {{parts_amount_payable.toFixed(2)}}</span>
                    <div class="base_hd" style="width:10%">总计：</div>
                    <span style="color:#e01823">¥ {{total_amount_payable.toFixed(2)}}</span>
                </el-col>
                <div class="el-col el-col-12" style="margin-top:20px;">&nbsp;</div>
                <div class="el-col el-col-24">
                    <div class="base_hd" style="width: 10%; float: left;">&nbsp;</div>
                    <el-button type="" @click="$router.replace('/manage/workbench')" class="btn_default"
                               style="margin-left:0">取消
                    </el-button>
                    <el-button type="warning" @click="baseActive=true">基本信息</el-button>
                    <el-button type="warning" @click="submitEdit">完成</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getOrder,editOrder,getProjects,getTeam,getEmployee,quick_order_car,quick_order,getParts } from '@/api/getData'
    export default {
        data() {
            return {
                contacts:'',
                contacts_phone:'',
                incoming_oil:[{value:'空', labbel:'空'},{value:'20%', labbel:'20%'},{value:'40%', labbel:'40%'},{value:'60%', labbel:'60%'},{value:'80%', labbel:'80%'},{value:'满', labbel:'满'},],
                oil:'',
                advance_mileage:'',
                the_next_maintenance_mileage:'',
                customer_statement:'',
                follow_up_maintenance_proposal:'',
                service_advisor_notes:'',
                detection_result:'',
                maintenance_project_ids:[],
                required_accessories_ids:[],
                receptionist_id:'',
                state2:'',
                state3:'',
                cars: [],
                activeTab: 'fix',
                baseActive: true,
                paySelf: false,
                activeCar: {},
                desCount: 0,
                serCount: 0,
                resultCount: 0,
                result: "",
                sugCount: 0,
                sug: "",
                des: "",
                ser: '',
                team:[],
                employee:[],
                contacter: [],
                value: '',
                projects:[],
                parts:[],
                total_amount_payable:0,
                pro_amount_payable:0,
                parts_amount_payable:0
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

            async querySearchAsync(queryString, cb) {
                queryString = queryString.trim();
                const res = await quick_order_car({where:queryString,timestamp:new Date().getTime()});
                console.log(res);
                if(res.count>0){
                    cb(res.results.customer_car);
                }else{
                    cb([])
                }
            },

            handleProCount(){
                this.pro_amount_payable = 0;
                for(var i=0;i<this.maintenance_project_ids.length;i++){
                    if(this.maintenance_project_ids[i].price != ''){
                        this.pro_amount_payable += parseFloat(this.maintenance_project_ids[i].price)
                    }
                }
                this.total_amount_payable = this.pro_amount_payable + this.parts_amount_payable
            },

            handlePartsCount(){
                this.parts_amount_payable = 0;
                for(var i=0;i<this.required_accessories_ids.length;i++){
                    if(this.required_accessories_ids[i].price != ''){
                        this.parts_amount_payable += parseFloat(this.required_accessories_ids[i].price)*parseFloat(this.required_accessories_ids[i].quantity)
                    }
                }
                this.total_amount_payable = this.pro_amount_payable + this.parts_amount_payable
            },

            // 加载班组
            async loadBasic(){
                const res = await getTeam({timestamp:new Date().getTime()});
                this.team = res.results
            },
            // 加载员工
            loadEmployee(item){
                item.employee_ids = [];
                var crtteam = this.team.filter(obj => obj.department_id == item.department_id);
                item.employee = crtteam[0].employee
            },

            handleCstSelect(item){
                console.log(item);
                this.activeCar = item;
                this.contacts = item.partner_name;
                this.contacts_phone = item.mobile_phone
            },

            handlePartSelect(item){
                if(JSON.stringify(this.required_accessories_ids).indexOf(JSON.stringify(item)) === -1){
                    item.parts_id = item.id;
                    this.required_accessories_ids.push(item);
                    this.handlePartsCount();
                    this.state3 =''
                }else{
                    this.$message.error('已经选择该配件')
                    this.state3 =''
                }
            },

            handleSelect(item) {
                if(JSON.stringify(this.maintenance_project_ids).indexOf(JSON.stringify(item)) === -1){
                    item.maintenance_project_id = item.id;
                    this.maintenance_project_ids.push(item);
                    this.handleProCount();
                    this.state2 =''
                }else{
                    this.$message.error('已经选择该项目')
                    this.state2 =''
                }
            },


            //删除选中项目
            deletePro(item){
                var _this = this;
                this.$confirm('确认删除？')
                    .then(_ => {
                        if(item.serial_number){
                            (async function(){
                                console.log(_this.id);
                                await deletePro({rid:_this.id,serial_number:item.serial_number,delete_type:"xm"})
                            })()
                        }
                        item.department_id=[];
                        item.employee_ids='';
                        var idx = this.maintenance_project_ids.indexOf(item);
                        this.maintenance_project_ids.splice(idx,1);
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
                                console.log(_this.id);
                                await deletePro({rid:_this.id,serial_number:item.serial_number,delete_type:"xm"})
                            })()
                        };
                        var idx = this.required_accessories_ids.indexOf(item);
                        this.required_accessories_ids.splice(idx,1);
                        this.handlePartsCount();
                    })
                    .catch(_ => {});
            },



            //
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
            async submitEdit(){
                console.log(this.receptionist_id);
                if(this.contacts ==''){
                    this.$message.error('请填写联系人姓名')
                }else if(this.contacts_phone ==""){
                    this.$message.error('请填写联系人电话')
                }else if(this.incoming_oil ==""){
                    this.$message.error('请选择进场油量')
                }else if(this.advance_mileage ==""){
                    this.$message.error('请填写进场里程')
                }else if(this.receptionist_id ==""){
                    this.$message.error('请选择接待人')

                }else{
                    const res = await quick_order({
                        order_type: "维修工单",
                        customer_name_id: this.activeCar.partner_id,
                        customer_phone: this.activeCar.mobile_phone,
                        customer_car: this.activeCar.car_models_name,
                        customer_car_id: this.activeCar.id,
                        plate_number: this.activeCar.plate_number,
                        vin: this.activeCar.vin,
                        car_color: this.activeCar.car_color,
                        contacts: this.contacts,
                        contacts_phone:this.contacts_phone,
                        incoming_oil: this.oil,
                        advance_mileage: this.advance_mileage,
                        the_next_maintenance_mileage: this.the_next_maintenance_mileage,
                        customer_statement: this.customer_statement,
                        service_advisor_notes: this.service_advisor_notes,
                        detection_result: this.detection_result,
                        follow_up_maintenance_proposal: this.follow_up_maintenance_proposal,
                        maintenance_project_ids:this.maintenance_project_ids,
                        required_accessories_ids:this.required_accessories_ids,
                        receptionist_id:this.receptionist_id,
                        total_amount_payable:this.total_amount_payable
                    });
                    if(res.results){
                        this.$message.success('创建成功');
                        this.$router.push('/manage/workbench')
                    }else{
                        this.$message.error(res.err_message)
                    }
                }
            },

            // 加载基础维修项目
            async loadProject(){
                const res = await getProjects({timestamp:new Date().getTime()});
                this.projects = res.results.filter(obj => obj.active == true);;
                var i;
                for(i=0;i<this.projects.length;i++){
                    if(this.projects[i].other_name != false){
                        this.projects[i].value = this.projects[i].project_name +' '+ '['+ this.projects[i].other_name +']' + ' '+this.projects[i].price + '元'
                    }else{
                        this.projects[i].value = this.projects[i].project_name + ' '+this.projects[i].price + '元'
                    }
                }
            },

            // 加载基础配件
            async loadParts(){
                const res = await getParts({timestamp:new Date().getTime()});
                console.log(new Date().getTime())
                console.log(res);
                this.parts = res.results.filter(obj => obj.active == true);;
                var i;
                for(i=0;i<this.parts.length;i++){
                    if(this.parts[i].alias != false){
                        this.parts[i].value = this.parts[i].name +' '+ '['+ this.parts[i].alias +']' + ' '+this.parts[i].price + '元'
                    }else{
                        this.parts[i].value = this.parts[i].name + ' '+this.parts[i].price + '元'
                    }
                    this.parts[i].parts_name = this.parts[i].name;
                    this.$set(this.parts[i],'quantity',1)
                }
            },
            //获取接待人
            async fetchEmployee(){
                const res = await getEmployee({timestamp:new Date().getTime()});
                console.log(res.results.filter(obj => obj.state =='在职'));
                if(res.results){
                    this.contacter = res.results.filter(obj => obj.state =='在职');
                }
            }
        },
        mounted(){
            this.loadProject();
            this.loadParts();
            this.loadBasic();
            this.fetchEmployee()
            console.log(JSON.parse(sessionStorage.getItem('userInfo')))
            this.receptionist_id = JSON.parse(sessionStorage.getItem('userInfo')).id
        },
        computed: {
        }
    }
</script>

<style lang="less" scoped>
    @import "../../style/mixin.less";
    @import "../../style/createorder.less";
</style>
