
<template>
    <div class="add-client-box fillcontain" >
        <header class="header">
            <span @click="$router.go(-1)" style="cursor: pointer;">客户管理 / </span>
            <span class="detail">{{clientText}}</span>
        </header>
        <section class="section">
            <!--编辑模式-->
            <el-form
                v-show="patternToggle"
                ref="sizeForm"
                :model="sizeForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
                style="border-bottom:1px solid #eee">
                <!--姓名-->
                <el-form-item  label="姓名：" prop="name">
                    <div class="DN">
                        <el-input v-model="sizeForm.name" size="small" placeholder="请输入姓名"></el-input>
                    </div>
                </el-form-item>
                <!--手机号做验证-->
                <el-form-item  label="手机号：" prop="mobile_phone" >
                    <div class="DN">
                        <el-input placeholder="请输入11位手机号" v-model="sizeForm.mobile_phone" size="small"></el-input>
                    </div>
                </el-form-item>
                <!--电话-->
                <el-form-item label="电话：" prop="phone">
                    <div class="DN">
                        <el-input placeholder="请输入联系电话" v-model="sizeForm.phone" size="small"></el-input>
                    </div>
                </el-form-item>
                <!--性别-->
                <el-form-item label="性别：" prop="sex">
                    <div class="DN">
                        <el-select style="width:250px"
                                   size="small"
                                   v-model="sizeForm.sex"
                                   placeholder="请选择性别">
                            <el-option label="男" value='男'></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!--客户来源-->
                <el-form-item
                    label="客户来源"
                    prop="customer_source"
                >
                    <div class="DN">
                        <el-select style="width:250px" size="small" v-model="sizeForm.customer_source" placeholder="请选择客户来源">
                            <el-option label="" value=""></el-option>
                            <el-option label="合作送修" value="合作送修"></el-option>
                            <el-option label="市场" value="市场"></el-option>
                            <el-option label="自然进店" value="自然进店"></el-option>
                            <el-option label="地推" value="地推"></el-option>
                            <el-option label="网销" value="网销"></el-option>
                            <el-option label="保险" value="保险"></el-option>
                            <el-option label="转介绍" value="转介绍"></el-option>
                            <el-option label="转介绍" value="转介绍"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!--是否生效-->
                <el-form-item  label="是否生效：" prop="active">
                    <div class="DN">
                        <el-checkbox-group v-model="sizeForm.active" >
                            <el-checkbox disabled label="是" name="take"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button @click="$router.go(-1)" size="small">取消</el-button>
                    <el-button type="warning" @click="submitForm('sizeForm')" size="small">保存</el-button>
                </el-form-item>
            </el-form>
            <!--只读模式-->
            <el-form
                label-width="100px"
                v-show="!patternToggle"
                class="demo-ruleForm"
                style="border-bottom:1px solid #eee">
                <!--姓名-->
                <el-form-item  label="姓名：" prop="name">
                    <div class="DN">
                        <span>{{sizeForm.name}}</span>
                    </div>
                </el-form-item>
                <!--手机号做验证-->
                <el-form-item  label="手机号：" prop="mobile_phone" >
                    <div class="DN">
                        <span>{{sizeForm.mobile_phone}}</span>
                    </div>
                </el-form-item>
                <!--电话-->
                <el-form-item label="电话：" prop="phone">
                    <div class="DN">
                        <span>{{sizeForm.phone}}</span>
                    </div>
                </el-form-item>
                <!--性别-->
                <el-form-item label="性别：" prop="sex">
                    <div class="DN">
                        <span>{{sizeForm.sex}}</span>
                    </div>
                </el-form-item>
                <!--客户来源-->
                <el-form-item
                    label="客户来源"
                >
                    <div class="DN">
                        <span>{{sizeForm.customer_source}}</span>
                    </div>
                </el-form-item>
                <!--是否生效-->
                <el-form-item label="是否生效：" prop="active">
                    <div class="DN">
                        <span>{{sizeForm.active==false?'否':'是'}}</span>
                    </div>
                </el-form-item>
                <el-form-item class="DN">
                    <el-button type="warning" @click="patternToggle=true">编辑客户</el-button>
                </el-form-item>
            </el-form>
            <!--客户车辆-->
            <div class="DN"  style="padding-top:32px">
                <el-button v-if="getJurisdiction('2001')" type="warning" @click="addCarFun">新增客户车辆</el-button>
                <div class="DN"  style="margin-top: 20px;">
                    <el-table
                        :data="addCarDate"
                        style="width: 100%">
                        <el-table-column
                            prop="brand_name"
                            label="品牌"
                            width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.brand_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="series_name"
                            label="车系"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="car_models_name"
                            label="车型">
                            <template slot-scope="scope">
                                <span>{{scope.row.car_models_name}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="plate_number"
                            label="车牌">
                            <template slot-scope="scope">
                                <span>{{scope.row.plate_number}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="270"
                            prop="operation"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    class="efficacy-button"
                                    size="mini"
                                    @click="delClientCar(scope.row.id)"
                                >失效</el-button>

                                <el-button
                                    class="compile-button"
                                    size="mini"
                                    type="warning"
                                    @click="compileClientCar(scope.row)"
                                >编辑</el-button>
                                <el-button
                                    class="compile-button"
                                    size="mini"
                                    type="warning"
                                    @click="weixiu(scope.row.id)"
                                >维修履历</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </section>
        <!--新增客户车辆弹框-->
        <div class="add-client-alert" v-show="ifToggle" @click.self="hideAlert">
            <div class="alert-box">
                <div class="title">
                    <span>{{clientCarText}} / 客户车辆</span>
                    <i @click="hideAlert" class="iconfont icon-close"></i>
                </div>
                <div class="from-box">
                    <el-form ref="formAddCar"   label-width="100px" class="demo-ruleForm">
                        <!--车架号-->
                        <div class="DN">
                            <el-form-item label="车架号 :" prop="vin">
                                <el-input v-model="formAddCar.vin" placeholder="请输入车架号" size="small"></el-input>
                                <el-button style="margin-left: 8px;" type="warning" @click="recognitionVIN">识别VIN</el-button>
                            </el-form-item>
                        </div>
                        <!--品牌-->
                        <div class="DN">
                            <el-form-item
                                label="品牌 :"
                            >
                                <div class="select-list-box" >
                                    <el-select style="width:241px"
                                               @change="brand_change"
                                               v-model="formAddCar.brand_id"
                                               size="small"
                                               :remote-method="brandMethod"
                                               filterable
                                               remote
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in brandOptions"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div style="position: relative">
                                    <el-button @click="brand_series_plate(1)" style="border:none;margin-left:8px;color:#ff901d">新增品牌</el-button>
                                    <addType v-if="addTypeToggle"
                                             :errorText = "brand_series_plate_text"
                                             :errorToggle="brand_series_plate_error"
                                             @saveItemType="brand_series_plate_request($event,1)"
                                             v-on:cancelItemType="addTypeToggle=false">
                                    </addType>
                                </div>
                            </el-form-item>
                        </div>
                        <!--车系-->
                        <div  class="DN">
                            <el-form-item  label="车系 :">
                                <div class="select-list-box">
                                    <el-select style="width:241px"
                                               @change="series_change"
                                               :disabled="series_toggle"
                                               :remote-method="seriesMethod"
                                               filterable
                                               remote
                                               size="small"
                                               v-model="formAddCar.series_id"
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in seriesOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div style="position: relative;">
                                    <el-button :disabled="series_toggle" @click="brand_series_plate(2)"  :class="{activeAddseries:!series_toggle}" class="addseries">新增车系</el-button>
                                    <addType
                                        v-if="addSeriesToggle"
                                        :errorText = "brand_series_plate_text"
                                        :errorToggle="brand_series_plate_error"
                                        @saveItemType="brand_series_plate_request($event,2)"
                                        @cancelItemType="addSeriesToggle=false"></addType>
                                </div>
                            </el-form-item>
                        </div>
                        <!--车型-->
                        <div  class="DN">
                            <el-form-item  label="车型 :">
                                <div class="select-list-box" >
                                    <el-select style="width:241px"
                                               :disabled="car_models_toggle"
                                               :remote-method="plateMethod"
                                               remote
                                               size="small"
                                               v-model="formAddCar.car_models_id"
                                               filterable
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in plateOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div style="position: relative;">
                                    <el-button :disabled="car_models_toggle" @click="brand_series_plate(3)" :class="{activeAddseries:!car_models_toggle}" class="addseries">新增车型</el-button>
                                    <addType
                                        :errorText = "brand_series_plate_text"
                                        :errorToggle="brand_series_plate_error"
                                        v-if="addPlateToggle"
                                        @saveItemType="brand_series_plate_request($event,3)"
                                        @cancelItemType="addPlateToggle=false"></addType>
                                </div>
                            </el-form-item>
                        </div>
                        <!--车牌-->
                        <div class="DN">
                            <el-form-item  label="车牌 :">
                                <div class="select-list-box">
                                    <el-input style="width:241px" size="small" v-model="formAddCar.plate_number"></el-input>
                                </div>
                            </el-form-item>
                        </div>
                        <!--颜色-->
                        <div class="DN">
                            <el-form-item  label="颜色 :">
                                <el-input v-model="formAddCar.car_color" style="width:241px" size="small"></el-input>
                            </el-form-item>
                        </div>
                        <div class="DN" style="padding-left:189px">
                            <el-form-item size="large">
                                <el-button type="warning" @click="addCarPlate">确定</el-button>
                                <el-button @click="ifToggle = false">取消</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <!--维修履历弹框-->
        <div class="add-client-alert" v-show="ifToggle1">
            <div class="alert-box" style="width:70%">
                <div class="title">
                    <span>维修履历</span>
                    <i @click="ifToggle1=false" class="iconfont icon-close"></i>
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
                            prop="amount_payable"
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
    import {
        dn_brandPost,dn_seriesPost,jy_car_model,model_multi_fuzzy_search,dn_car_model,partnerp,partner,
        carPut,partnerput,series_multi_fuzzy_search,brand_multi_fuzzy_search,select_brand_series,carDel,carPost,dn_car_modelPost
    ,maintenance_record} from '@/api/getData'
    import addType from '../basics/add-type'
    export default {
        components:{
            addType
        },
        data() {
            return {
                tableData_b:'',
                tableData_a:[],
                ifToggle1:false,
                carId:'',//编辑客户车辆id
                brand_series_plate_error:false,
                brand_series_plate_text:'',
                presentClientId:'',//当前客户id
                clientCarText:'',//新增客户车辆还是编辑客户车辆
                addTypeToggle:false,//新增品牌弹框
                addSeriesToggle:false,//新增车系弹框
                addPlateToggle:false,//新增车型弹框
                patternToggle:true,//默认为编辑模式
                clientText:'',//新增客户还是编辑客户
                ifToggle:false,//新增客户车辆编辑弹框
                brandOptions: [],//品牌options
                seriesOptions:[],//车系options
                plateOptions:[],//车型options
                addCarDate:[],//客户车辆列表
                series_toggle:true,//车系是否禁用
                car_models_toggle:true,//车型是否禁用
                sizeForm: {
                    active:true
                },
                formAddCar:{
                    plate_number:'',//车牌
                    partner_id:this.$route.params.identification,//所属客户id
                    vin:'',//vin
                    brand_id:'', //品牌
                    series_id:'',//车系
                    car_models_id:'',//车型
                    car_color:''//颜色
                },
                // 验证规则
                rules: {
                    name :  [{
                        required: true, message: '请输入姓名', trigger: 'change'
                    }],
                    mobile_phone:  [
                        { required: true, message: '请输入符合规范的手机号码', trigger: 'change' },
                        { min: 11, max: 11, message: '请输入11位手机号', trigger: 'change' }
                    ],
                    sex:[{ required: true, message: '请选择性别', trigger: 'change' }],

                },
            };
        },
        //初始化数据，分为编辑客户和添加客户
        async mounted(){
            this.patternToggle = true; //默认编辑模式
            if(this.$route.params.identification==='undefined'){//新增客户
                this.clientText = '新增客户';
            }else{
                //编辑客户
                this.clientText = '编辑客户';
                //请求当前客户信息
                const res = await partner({rid:this.$route.params.identification,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.sizeForm = res.results[0];
                }else{
                    this.$message.error(res.err_message);
                }
                //当前客户车辆信息
                if(res.results[0].customer_car_ids.length==0){
                    this.addCarDate = []
                }else{
                    this.addCarDate = res.results[0].customer_car_ids
                }
            }

        },
        methods: {
            //维修履历
             async weixiu(id){
                this.ifToggle1 = true;
                 const res = await maintenance_record({rid:id})
                 if(res.state_code==='ok'){
                     this.tableData_b = res.results
                     this.tableData_a = res.results.record
                 }
                 console.log(res);
             },
//            //品牌默认加载10条
//            async defaultFun(val){
//                var res;
//                if(val=='品牌') res = await brand_multi_fuzzy_search({limit:'10',offset:'1'});
//                else if(val=='车系') res = await series_multi_fuzzy_search({limit:'10',offset:'1'});
//                else res = await model_multi_fuzzy_search({limit:'10',offset:'1'});
//                if(res.state_code=='ok'){
//                    if(val=='品牌')this.brandOptions = res.results;
//                    else if(val=='车系') this.seriesOptions = res.results;
//                    else this.plateOptions = res.results
//                }else{
//                    this.$message.error(res.err_message);
//                }
//            },
            //保存客户信息--分为编辑客户和添加客户
            submitForm(sizeForm) {
                var self =this;
                this.$refs[sizeForm].validate(async (valid) => {
                    if (valid) {
                        //自定义验证规则--验证通过
                        if(this.$route.params.identification==='undefined'){//新增客户
                            const data = this.sizeForm;
                            delete data.customer_car_ids;
                            console.log(data);
                            const res = await partnerp(data);
                            console.log(res);
                            //判断是否提交成功
                            if(res.state_code=='ok'){
                                this.presentClientId = res.results[0].id;//保存当前新增客户id，新增客户车辆时使用
                                this.patternToggle = false; //切换为只读模式
                                this.$message({
                                    message: '新增客户成功',
                                    type: 'success'
                                });
                                this.$router.push('/manage/client_main/clientDetail/'+res.results[0].id)
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }else{//修改客户
                            const data = this.sizeForm;
                            delete data.customer_car_ids;
                            console.log(data);
                            data.rid = this.$route.params.identification;
                            const res = await partnerput(data);
                            //判断是否提交成功
                            if(res.state_code=='ok'){
                                //切换为只读模式
                                self.patternToggle = false;
                                self.$message({
                                    message: '修改客户成功',
                                    type: 'success'
                                });
                            }else{
                                self.$message.error(res.err_message);
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },
            //点击新增客户车辆按钮
            addCarFun:function(){
                //如果是编辑模式且是新增客户，弹出提示
                if(this.patternToggle&&this.$route.params.identification==='undefined'){//如果是编辑模式
                    this.$alert('您还未填写或保存客户信息', '提示', {
                        confirmButtonText: '确定'
                    });
                }else{//点击新增客户车辆，显示弹框
                    this.ifToggle = true;//显示新增车辆弹框
                    this.clientCarText = '新增';
                    this.series_toggle = true;//车系是否禁用
                    this.car_models_toggle = true;//车型是否禁用
                    this.formAddCar = {
                        plate_number:'',//车牌
                        partner_id:this.$route.params.identification,//所属客户id
                        vin:'',//vin
                        brand_id:'', //品牌
                        series_id:'',//车系
                        car_models_id:'',//车型
                        car_color:''//颜色
                    }//重置表单数据
                }
            },
            //控制新增品牌，新增车系，新增车型弹框
            brand_series_plate(a){
                switch(a)
                {
                    case 1:
                        this.addTypeToggle = true;
                        this.addSeriesToggle = false;
                        this.addPlateToggle = false;
                        break;
                    case 2:
                        this.addSeriesToggle = true;
                        this.addTypeToggle = false;
                        this.addPlateToggle = false;
                        break;
                    default:
                        this.addPlateToggle = true;
                        this.addSeriesToggle = false;
                        this.addTypeToggle = false;
                }
            },
            //新增品牌，新增车系，新增车型请求
            async brand_series_plate_request(val,a){
                if(val==''){
                    this.$message.error('请输入名称');
                }else{
                    var res;
                    switch(a){
                        case 1:
                                res = await dn_brandPost({'name':val});
                            break;
                        case 2:
                                 res = await dn_seriesPost({"name":val,"brand_id":this.formAddCar.brand_id});
                            break;
                        default:
                                 res = await dn_car_modelPost({'name':val,"brand_id":this.formAddCar.brand_id,"series_id": this.formAddCar.series_id});
                    }
                    if(res.state_code=='ok'){
                        switch(a){
                            case 1:
                                this.addTypeToggle = false;
                                break;
                            case 2:
                                this.addSeriesToggle = false;
                                break;
                            default:
                                this.addPlateToggle = false;
                        }
                        this.brand_series_plate_error = false;
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                }

            },
            //品牌更新---清空车系
            brand_change:async function(val){
                const res =await series_multi_fuzzy_search({brand_id:val,timestamp:new Date().getTime()})
                if(res.state_code=='ok'){
                    this.seriesOptions = res.results
                }else{
                    this.$message.error(res.err_message);
                }
                //判断是否为空
                if(this.formAddCar.brand_id!=''){
                    this.series_toggle = false;
                    this.car_models_toggle = true;
                    //清空车系和车型
                    this.formAddCar.series_id='';
                    this.formAddCar.car_models_id='';
                }else{
                    this.series_toggle = true;
                    this.car_models_toggle = true
                }
            },
            //车系更新---清空车型
            series_change:async function(val){
                const res =await model_multi_fuzzy_search({brand_id:this.formAddCar.brand_id,series_id:val,timestamp:new Date().getTime()})
                if(res.state_code=='ok'){
                    this.plateOptions = res.results
                }else{
                    this.$message.error(res.err_message);
                }
                //清空车型
                this.formAddCar.car_models_id='';
                //判断是否为空
                if(this.formAddCar.series_id!=''){
                    this.car_models_toggle = false
                }
            },
            //识别VIN
            recognitionVIN:async function(){
                if(this.formAddCar.vin==''){
                    this.$message.error('您还未填写VIN');
                }else{
                    const res = await jy_car_model({vin:this.formAddCar.vin});
                    if(res.state_code=='ok'){
                        //切换车系车型禁用状态
                        this.series_toggle=false;
                        this.car_models_toggle=false;
                        //车牌
                        this.formAddCar.brand_id = res.results[0].brand_id;
                        this.brandOptions=[{id:res.results[0].brand_id,name:res.results[0].brand_name}];
                        //车系
                        this.formAddCar.series_id = res.results[0].series_id;
                        this.seriesOptions=[{id:res.results[0].series_id,name:res.results[0].series_name}];
                        //车型
                        this.formAddCar.car_models_id = res.results[0].id;
                        this.plateOptions=[{id:res.results[0].id,name:res.results[0].name}];
                    }else{
                        this.$message.error(res.err_message)
                    }
                }
            },
            //新增客户车辆发送请求
            addCarPlate:async function(){
                //是编辑客户车辆还是新增客户车辆
                if(this.formAddCar.brand_id==''){
                    this.$message.error('您还未填写品牌');
                }else if(this.formAddCar.series_id==''){
                    this.$message.error('您还未填写车系');
                }else{//验证通过
                    //客户id判断
                    if(this.$route.params.identification==='undefined'){
                        this.formAddCar.partner_id = this.presentClientId
                    }
                    //判断是添加还是新增
                    var res;
                    var message;
                    if(this.clientCarText==='新增'){
                        res = await carPost(this.formAddCar);
                        message = '新增客户车辆成功'
                    }else{
                        var data = this.formAddCar;
                        data.rid = this.carId;
                        res = await carPut(data);
                        message = '编辑客户车辆成功'
                    }
                    if(res.state_code=='ok'){
                        const resa = await partner({rid:this.formAddCar.partner_id,timestamp:new Date().getTime()});

                        if(resa.results[0].customer_car_ids.length==0){
                            this.addCarDate = []
                        }else{
                            this.addCarDate = resa.results[0].customer_car_ids;
                            this.sizeForm = resa.results[0]
                        }
                        this.ifToggle = false;
                        this.$message({
                            message: message,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message)
                    }
                }
            },
            //删除客户车辆
            delClientCar:async function (val)  {
                this.$confirm('您确认要删除该条记录么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const res = await carDel({rid:val});
                    if(res.state_code=='ok'){
                        const resa = await partner({rid:this.formAddCar.partner_id,timestamp:new Date().getTime()});
                        if(resa.results[0].customer_car_ids==''){
                            this.addCarDate = []
                        }else{
                            this.addCarDate = resa.results[0].customer_car_ids;
                            this.sizeForm = resa.results[0]
                        }

                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //编辑客户车辆
            compileClientCar:async function(row){
                //车牌
                this.brandOptions = [{"id":row.brand_id,"name":row.brand_name}];
                //车系
                this.seriesOptions = [{"id":row.series_id,"name":row.series_name}];
                //车型
                if(row.car_models_id){
                    this.plateOptions = [{"id":row.car_models_id,"name":row.car_models_name}]
                }
                this.carId = row.id;
                this.ifToggle = true;
                this.series_toggle = false;
                this.car_models_toggle = false;
                this.clientCarText = '编辑';
                this.formAddCar.vin = row.vin;
                this.formAddCar.plate_number = row.plate_number;
                this.formAddCar.brand_id = row.brand_id;
                this.formAddCar.series_id = row.series_id;
                this.formAddCar.car_models_id = row.car_models_id;
                this.formAddCar.car_color = row.car_color;
            },
            //品牌远程搜索
            async brandMethod(query) {
                if(query!=''){
                    const res = await brand_multi_fuzzy_search({where:query,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.brandOptions = res.results
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //车系远程搜索
            async seriesMethod(query){
                if(query!=''){
                    const res = await series_multi_fuzzy_search({where:query,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.seriesOptions = res.results
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //车型远程搜索
            async plateMethod(query){
                if(query!=''){
                    const res = await model_multi_fuzzy_search({where:query,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.plateOptions = res.results
                    }else{
                        this.$message.error(res.err_message);
                    }
                }

            },

            hideAlert:function(){
                this.ifToggle = false
            },
        },
    }
</script>

<style lang="less" scoped>
    .addseries{
        color:rgb(182, 182, 182);
        border:none;
        margin-left:8px
    }
    .activeAddseries{
        color:rgb(255, 144, 29)
    }
    .select-item>ul>li{
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
    }
    .select-item>ul{
        height: 240px;
        overflow: auto
    }
    .select-item>div{
        text-align: center;
    }
    .select-item>ul>li:hover{
        background: #f5f7fa;
    }
    .select-list-box{
        position: relative;
    }
    .select-item{
        width:248px;
        background: #fff;
        border:1px solid #ddd;
        height:271px;
        position: absolute;
        top: 100%;
        z-index: 10001;
        left: 0;
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
    .add-client-box .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
    .add-client-box>.header>.detail{
        color:#ff901d;
    }
    .add-client-box>.section{
        padding:20px;
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
    .el-input{
        width:250px
    }
    .el-button--warning{
        background: #ff901d;
        border-color:#ff901d
    }

</style>
<style>

</style>
