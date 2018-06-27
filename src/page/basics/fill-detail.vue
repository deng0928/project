<template>
    <div class="fill-car-detail">
        <header class="header">
            <span>车辆管理 / </span>
            <span class="detail">{{carText}}</span>
        </header>
        <div class="dataBox" style="padding:20px">
            <div class="left">
                <el-form ref="form"   label-width="100px">
                    <!--变速箱类型-->
                    <el-form-item label="变速箱类型" >
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.transmission_type"></el-input>
                        </div>
                    </el-form-item>
                    <!--车身结构-->
                    <el-form-item label="车身结构">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.body_structure"></el-input>
                        </div>
                    </el-form-item>
                    <!--年款-->
                    <el-form-item label="年款">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.year"></el-input>
                        </div>
                    </el-form-item>
                    <!--发动机描述-->
                    <el-form-item label="发动机描述">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.engine_description"></el-input>
                        </div>
                    </el-form-item>
                    <!--气缸排列-->
                    <el-form-item label="气缸排列">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.cylinder_arrangement"></el-input>
                        </div>
                    </el-form-item>
                    <!--变速器档数-->
                    <el-form-item label="变速器档数">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.transmission_number"></el-input>
                        </div>
                    </el-form-item>
                    <!--门数-->
                    <el-form-item label="门数">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.door_number"></el-input>
                        </div>
                    </el-form-item>
                    <!--气门数-->
                    <el-form-item label="气门数">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.valve_number"></el-input>
                        </div>
                    </el-form-item>
                    <!--保养周期-->
                    <el-form-item label="保养周期">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.maintenance_cycle"></el-input>
                        </div>
                    </el-form-item>
                    <!--座位-->
                    <el-form-item label="座位">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.seat"></el-input>
                        </div>
                    </el-form-item>
                    <!--后轮规则-->
                    <el-form-item label="后轮规则">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.hltgg"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="right" style="padding-left:15px">
                <el-form ref="form"   label-width="120px">
                    <!--驱动形式-->
                    <el-form-item label="驱动形式" >
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.drive_form"></el-input>
                        </div>
                    </el-form-item>
                    <!--轴距-->
                    <el-form-item label="轴距">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.wheelbase"></el-input>
                        </div>
                    </el-form-item>
                    <!--供油方式-->
                    <el-form-item label="供油方式">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.oil_supply_mode"></el-input>
                        </div>
                    </el-form-item>
                    <!--前轮规则-->
                    <el-form-item label="前轮规则">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.qltgg"></el-input>
                        </div>
                    </el-form-item>
                    <!--功率-->
                    <el-form-item label="功率">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.power"></el-input>
                        </div>
                    </el-form-item>
                    <!--国产进口-->
                    <el-form-item label="国产进口">
                        <div class="DN">
                            <el-input v-model="addCarDate.place_of_origin" style="width:250px;" size="small"></el-input>
                        </div>
                    </el-form-item>
                    <!--厂家指导价-->
                    <el-form-item label="厂家指导价">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.factory_price"></el-input>
                        </div>
                    </el-form-item>
                    <!--厂家指导价(含税)-->
                    <el-form-item label="厂家指导价(含税)">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.factory_price_tax"></el-input>
                        </div>
                    </el-form-item>
                    <!--新车购置价-->
                    <el-form-item label="新车购置价">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.new_car_purchase_price"></el-input>
                        </div>
                    </el-form-item>
                    <!--新车购置价(含税)-->
                    <el-form-item label="新车购置价(含税)">
                        <div class="DN">
                            <el-input class="input-250px" v-model="addCarDate.new_car_purchase_price_tax"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="DN" style="padding-left:100px;padding-top:10px">
            <el-button @click="canvasGo">取消</el-button>
            <el-button @click="goAddCar">返回</el-button>
            <el-button type="warning" @click="saveFrom">完成</el-button>
        </div>
    </div>
</template>

<script>
    import {dn_car_modelPost,dn_car_modelPut,dn_car_model} from '@/api/getData'
    export default {
        data(){
            return{
                carText:'',
                addCarDate:{
                    transmission_type:'',//变速箱类型
                    body_structure:'',//车身结构
                    year:'',//年款
                    engine_description:'',//发动机描述
                    cylinder_arrangement:'',//气缸排列
                    transmission_number:'',//变数箱档数
                    maintenance_cycle:'',//保养周期
                    door_number:'',//门数
                    valve_number:'',//气门数
                    drive_form:'',//驱动形式
                    wheelbase:'',//轴距
                    oil_supply_mode:'',//供油方式
                    qltgg:'',//前轮规格
                    hltgg:'',//后轮规格
                    power:'',//功率
                    place_of_origin:'',//国产进口
                    seat:'',//座位
                    factory_price:'',//厂家指导价
                    factory_price_tax:'',//厂家指导价含税
                    new_car_purchase_price :'',//新车购置价
                    new_car_purchase_price_tax :'',//新车购置价含税
                },
            }
        },
        async mounted(){
            if(this.$route.params.id=='all'){
                this.carText = '新增车辆'
            }else{
                this.carText= '编辑车辆'
                const res = await dn_car_model({rid:this.$route.params.id,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.addCarDate = res.results[0]
                }
            }
        },
        methods:{
            canvasGo(){
                this.$router.push('/manage/basics')
            },
            goAddCar:function () {
                if(this.$route.params.id=='all'){
                    this.$router.push({
                        path:'/manage/basics/addCar/all',
                        query:this.$route.query
                    })
                }else{
                    this.$router.push(`/manage/basics/addCar/${this.$route.params.id}`)
                }
            },
            //提交完成
            async saveFrom(){
                if(this.$route.params.id=='all'){
                    const data = Object.assign(this.addCarDate,this.$route.query);
                    const res = await dn_car_modelPost(data);
                    if(res.state_code=='ok'){
                        this.$message({
                            message: '新增车辆成功',
                            type: 'success'
                        });
                        this.$router.push('/manage/basics')
                    }else{
                        this.$message.error(res.err_message);
                    }
                }else{
                    const data = Object.assign(this.addCarDate,this.$route.query);
                    data.rid = this.$route.params.id;
                    const res = await dn_car_modelPut(data);
                    if(res.state_code=='ok'){
                        this.$message({
                            message: '编辑车辆成功',
                            type: 'success'
                        });
                        this.$router.push('/manage/basics')
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .dataBox{
        display: flex;
        justify-content: flex-start;
    }
    .el-form-item{
        margin-bottom:13px;
    }
    .fill-car-detail .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
    .fill-car-detail>.header>.detail{
        color:#ff901d;
    }
</style>
