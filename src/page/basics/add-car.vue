<template>
    <div class="add-car-box">

        <header class="header">
            <span>车辆管理 / </span>
            <span class="detail">{{carText}}</span>
        </header>
            <el-form
                :rules="addCarRules"
                :model="addCarDate"
                label-width="100px"
                ref="addCarDate"
                style="padding:20px">
                <!--车型-->
                <el-form-item label="车型" prop="name" size="small">
                    <div class="DN">
                        <el-input placeholder="2-50个汉字" v-model="addCarDate.name" class="input-250px"></el-input>
                    </div>
                </el-form-item>
                <!--品牌-->
                <el-form-item label="品牌" prop="brand_id" size="small">
                    <div class="DN">
                        <el-select style="width:250px"
                                   clearable
                                   @change="brand_change"
                                   :remote-method="brandMethod"
                                   filterable
                                   remote
                                   v-model="addCarDate.brand_id"
                                   placeholder="请搜索品牌">
                            <el-option
                                v-for="item in brandOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!--车系-->
                <el-form-item label="车系" prop="series_id" size="small">
                    <div class="DN">
                        <el-select style="width:250px"
                                   clearable

                                   :remote-method="seriesMethod"
                                   filterable
                                   remote
                                   v-model="addCarDate.series_id"
                                   placeholder="请搜索车系">
                            <el-option
                                v-for="item in seriesOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>

                <el-form-item label="车组名称" prop="group_name"  size="small">
                    <div class="DN">
                        <el-input class="input-250px" v-model="addCarDate.group_name"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="配置级别" prop="configuration_level"  size="small">
                    <div class="DN">
                        <el-input v-model="addCarDate.configuration_level" class="input-250px"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="排量" prop="displacement" size="small">
                    <div class="DN">
                        <el-input v-model="addCarDate.displacement" class="input-250px"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="发动机型号" prop="engine_type" size="small">
                    <div class="DN">
                        <el-input v-model="addCarDate.engine_type" class="input-250px"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="进气形式" prop="intake_form" size="small">
                    <div class="DN">
                        <el-input v-model="addCarDate.intake_form" style="width:250px"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="是否生效" prop="active" size="small">
                    <div class="DN">
                        <el-checkbox v-model="addCarDate.active">{{addCarDate.active==true?'是':'否'}}</el-checkbox>
                    </div>
                </el-form-item>
                <div class="DN" style="padding-left: 100px;">
                    <el-button @click="goAddCar" size="small">取消</el-button>
                    <el-button type="primary" @click="goFillCarDetail('addCarDate')" size="small">填写详细信息</el-button>
                    <el-button type="primary" @click="submitForm('addCarDate')" size="small">确定</el-button>
                </div>
            </el-form>
    </div>
</template>

<script>
    import {dn_car_modelPost,dn_car_modelPut,series_multi_fuzzy_search,brand_multi_fuzzy_search,dn_car_model} from '@/api/getData'
    export default {
        data() {
            return {
                addCarDate: {
                    name:'',//车型名称
                    brand_id:'',//品牌id
                    series_id:'',//车系id
                    group_name:'',//车组名称
                    configuration_level:'',//配置级别
                    displacement:'',//排量
                    engine_type:'',//发动机型号
                    intake_form:'',//进气形式
                    active:true
                },
                carText:'',//是新增车辆还是编辑车辆
                brandOptions:[],//品牌Option
                seriesOptions:[],//车系Option
                addCarRules:{
                    name:[
                        { required: true, message: '请输入车型', trigger: 'change' },
                        { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'change' }],
                    brand_id:[{ required: true, message: '请输入品牌', trigger: 'change' }],
                    series_id:[{ required: true, message: '请输入品牌车系', trigger: 'change' }],
                }
            }
        },
        async mounted(){
            if(this.$route.params.id=='all'){
                this.carText = '新增车辆';
                this.$refs['addCarDate'].resetFields();
                if(this.$route.query.brand_id){
                    this.addCarDate = this.$route.query;
                    this.addCarDate.brand_id = parseInt(this.addCarDate.brand_id);
                    this.addCarDate.series_id = parseInt(this.addCarDate.series_id);
                    const res = await brand_multi_fuzzy_search({rid:this.addCarDate.brand_id,timestamp:new Date().getTime()});
                    const resa = await series_multi_fuzzy_search({rid:this.addCarDate.series_id,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.brandOptions = res.results
                    }else{
                        this.$message.error(res.err_message);
                    }
                    if(resa.state_code=='ok'){
                        this.seriesOptions = resa.results
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            }else{
                this.carText = '编辑车辆';
                const res = await dn_car_model({rid:this.$route.params.id,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    //车辆
                    this.$refs['addCarDate'].resetFields();
                    this.addCarDate.name = res.results[0].name;
                    this.addCarDate.brand_id = res.results[0].brand_id;
                    this.addCarDate.series_id = res.results[0].series_id;
                    this.addCarDate.group_name = res.results[0].group_name;
                    this.addCarDate.configuration_level = res.results[0].configuration_level;
                    this.addCarDate.displacement = res.results[0].displacement;
                    this.addCarDate.engine_type = res.results[0].engine_type;
                    this.addCarDate.intake_form = res.results[0].intake_form;
                    this.addCarDate.active = res.results[0].active;
                    this.brandOptions = [{name:res.results[0].brand_name,id:res.results[0].brand_id}];
                    this.seriesOptions = [{name:res.results[0].series_name,id:res.results[0].series_id}]
                }else{
                    this.$message.error(res.err_message);
                }
            }
        },
        methods: {
            //品牌搜索带出车系
            brand_change:async function(val){
                //清空车系
                this.addCarDate.series_id = '';
                const res =await series_multi_fuzzy_search({brand_id:val,timestamp:new Date().getTime()})
                if(res.state_code=='ok'){
                    this.seriesOptions = res.results
                    console.log(this.seriesOptions);
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //提交数据保存函数
            async save(){
                if(this.$route.params.id=='all'){
                    const res =await dn_car_modelPost(this.addCarDate);
                    if(res.state_code=='ok'){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.$router.replace('/manage/basics')
                    }else{
                        this.$message.error(res.err_message);
                    }
                }else{
                    const data = this.addCarDate;
                    data.rid = this.$route.params.id;
                    const res =await dn_car_modelPut(data);
                    if(res.state_code=='ok'){
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        });
                        this.$router.replace('/manage/basics')
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            goFillCarDetail:function (sizeForm) {
                this.$refs[sizeForm].validate(async (valid) => {

                    if(valid){
                        if(this.$route.params.id=='all'){
                            this.$router.push({
                                path:`/manage/basics/fillCarDetail/${this.$route.params.id}`,
                                query:this.addCarDate
                            })
                        }else{
                            this.$router.push({
                                path:`/manage/basics/fillDetail/${this.$route.params.id}`,
                                query:this.addCarDate
                            })
                        }
                    }
                })

            },
            goAddCar:function () {
                this.$router.push('/manage/basics')
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
                        this.$message.error(res.error_message);
                    }
                }
            },
            //确认提交
            submitForm(sizeForm){
                this.$refs[sizeForm].validate(async (valid) => {
                    if(valid){
                        this.save()
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .el-input{
        width:250px
    }
    .add-car-box .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
    .add-car-box>.header>.detail{
        color:#ff901d;
    }
</style>
