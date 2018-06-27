<template>
    <div class="coupon-box DN">
        <div class=" client-header-box DN">
            <div>
                <el-button type="primary" @click="newlyToggleF" v-if="getJurisdiction('3002')" size="small">新增优惠券</el-button>
            </div>
            <div class="client-search-box">
                <div style="padding-right:.5rem;">
                    <div class="DN" style="padding-top:1px;display: flex">
                        <el-select style="margin-right: .5rem;width:131px" v-model="couponModel" size="small" placeholder="请选择">
                            <el-option
                                v-for="item in couponOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input
                            style="width:250px"
                            clearable
                            v-model="whereModel"
                            placeholder="优惠券名称"
                            prefix-icon="el-icon-search"
                            size="small"
                        >
                        </el-input>
                    </div>
                </div>
                <el-button class="btn_yl" @click="searchFun" size="small">搜索</el-button>
            </div>
        </div>
        <section class="section">
            <el-table
                :max-height="fullHeight-200"
                :data="couponData"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="名称"
                >
                </el-table-column>
                <el-table-column
                    prop="coupon_type"
                    label="类型"
                    width="90"
                >
                </el-table-column>
                <el-table-column
                    label="失效天数/日期">
                    <template slot-scope="scope">
                        <span >{{scope.row.expiration_date}}</span>
                        <span v-show="scope.row.effective_days" style="font-size: 16px">{{scope.row.effective_days}}天</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="140"
                    label="已发放/未使用数量">
                    <template slot-scope="scope">
                        <span>{{scope.row.already_grant_quantity}}</span>
                        <span v-if="scope.row.already_grant_quantity&&scope.row.not_used_quantity">/</span>
                        <span v-if="scope.row.already_grant_quantity==''&&scope.row.not_used_quantity==''">无</span>
                        <span style="color:#ff901e;font-size: 16px">{{scope.row.not_used_quantity}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="折扣率/抵用金额">
                    <template slot-scope="scope">
                        <span v-show="scope.row.discount_rate">{{scope.row.discount_rate+'%'}}</span>
                        <span v-show="scope.row.discount_rate&&scope.row.offset_amount">/</span>
                        <span v-show="scope.row.offset_amount">{{'￥'+scope.row.offset_amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applicable_accessories"
                    width="90"
                    label="适用配件">
                    <template slot-scope="scope">
                        <span>{{scope.row.applicable_accessories==true?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="applicable_working_hours"
                    width="90"
                    label="适用工时">
                    <template slot-scope="scope">
                        <span>{{scope.row.applicable_working_hours==true?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="state"
                    width="80"
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==='已上线'" class="stateSpan" style="background: #e11717;">已上线</span>
                        <span v-else-if="scope.row.state==='已下线'" class="stateSpan" style="background: #5db5fd;">已下线</span>
                        <span v-else="scope.row.state==='草稿'" class="stateSpan" style="background: #bbb;">未上线</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="250"
                    label="操作">
                    <template slot-scope="scope" >
                        <el-button v-if="getJurisdiction('3002')" size="small" @click="deleteCoupon(scope.row.id)">删除</el-button>
                        <template v-if="scope.row.state==='草稿'">
                            <el-button v-if="getJurisdiction('3002')" size="small" type="warning" @click="compileCoupon(scope.row.id)">编辑</el-button>
                            <el-button v-if="getJurisdiction('3003')" size="small" @click="is_playing('已上线',scope.row.id)" type="warning">上线</el-button>
                        </template>
                        <template v-if="scope.row.state==='已上线'">
                            <el-button v-if="getJurisdiction('3002')" size="small" type="warning" @click="is_playing('已下线',scope.row.id)">下线</el-button>
                            <el-button v-if="getJurisdiction('3003')" size="small" type="warning" @click="grantCouponF(scope.row.id)">发放</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="pageLimit"
                @current-change="presentPage"
                style="margin-top:15px;text-align: right;padding-right:20px;"
                :page-sizes="[2, 5, 10, 20]"
                :pager-count="9"
                :page-size="20"
                :current-page="presentPageD"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totality">
            </el-pagination>
        </section>
        <!--新增优惠券弹框-->
        <div class="add-client-alert" v-show="newlyToggle">
            <div class="alert-box">
                <div class="title">
                    <span>新增优惠券</span>
                    <i class="iconfont icon-close" @click="newlyToggle=false"></i>
                </div>
                <el-form :model="couponForm" style="padding:20px;padding-bottom:0" :rules="rulesCoupon" ref="couponForm" label-width="100px" class="demo-ruleForm">
                    <!--优惠券名称-->
                    <el-form-item label="优惠券名称" prop="name">
                        <el-input style="width:300px" v-model="couponForm.name" placeholder="2-20个汉字"></el-input>
                    </el-form-item>
                    <!--优惠券类型-->
                    <el-form-item label="优惠类型" style="display:flex;align-items:center">
                        <div style="margin-left:-100px;">
                            <el-tooltip class="item" effect="dark" content="上线后优惠券类型不可更改" placement="top-start">
                                <el-radio v-model="couponForm.coupon_type" label="现金券">现金券</el-radio>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="上线后优惠券类型不可更改" placement="top-start">
                                <el-radio v-model="couponForm.coupon_type" label="折扣券">折扣券</el-radio>
                            </el-tooltip>
                        </div>
                    </el-form-item>
                    <!--抵用-->
                    <el-form-item :label="couponForm.coupon_type=='现金券'?'抵用金额':'折扣率'" :prop="couponForm.coupon_type=='现金券'?'offset_amount':'discount_rate'">
                        <el-input v-if="couponForm.coupon_type=='现金券'" type="number" placeholder="请输入购入价" v-model="couponForm.offset_amount" style="width:300px">
                            <template slot="prepend">¥</template>
                        </el-input>
                        <el-input v-else placeholder="请填写0-100罗马数字" type="number" v-model="couponForm.discount_rate" style="width:300px">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <!--优惠券类型-->
                    <el-form-item label="优惠类型" style="display:flex;align-items:center">
                        <div style="margin-left:-100px;">
                            <el-radio v-model="couponForm.failure_type" label="固定日期">固定日期</el-radio>
                            <el-radio v-model="couponForm.failure_type" label="持有天数">持有天数</el-radio>
                        </div>
                    </el-form-item>
                    <!--失效日期-->
                    <el-form-item :label="couponForm.failure_type=='持有天数'?'有效天数':'失效日期'" :prop="couponForm.failure_type=='持有天数'?'effective_days':'expiration_date'">
                        <el-input v-if="couponForm.failure_type=='持有天数'" type="number" v-model="couponForm.effective_days" style="width:300px">
                            <template slot="append">天</template>
                        </el-input>
                        <el-date-picker value-format="yyyy-MM-dd" v-else type="date" placeholder="选择日期" v-model="couponForm.expiration_date" style="width:300px;">
                        </el-date-picker>
                    </el-form-item>
                    <!--使用配件-->
                    <el-form-item label="适用配件" style="margin-bottom:5px">
                        <el-checkbox v-model="couponForm.applicable_accessories">{{couponForm.applicable_accessories?'是':'否'}}</el-checkbox>
                    </el-form-item>
                    <!--适用维修-->
                    <el-form-item label="适用工时" >
                        <el-checkbox v-model="couponForm.applicable_working_hours">{{couponForm.applicable_working_hours?'是':'否'}}</el-checkbox>
                    </el-form-item>
                    <!--确认---取消-->
                    <el-form-item style="display:flex;justify-content: flex-end">
                        <div class="DN">
                            <el-button @click="newlyToggle = false">取消</el-button>
                            <el-button type="warning" @click="saveNewly('couponForm')">确认</el-button>
                        </div>
                    </el-form-item>
                </el-form>

            </div>
        </div>

        <!--现金券发放弹框-->
        <div class="add-client-alert" v-show="grantToggle">
            <div class="alert-box">
                <div class="title">
                    <span>现金券发放</span>
                    <i class="iconfont icon-close" @click="grantToggle=false"></i>
                </div>
                <el-form :model="grantForm" style="padding:20px;padding-bottom:0" ref="grantForm" label-width="100px" class="demo-ruleForm">
                    <!--现金券-->
                    <el-form-item label="现金券" >
                        <span style="color:#ff901e;font-weight:bold">{{grantForm.name}}</span>
                    </el-form-item>
                    <!--人均发放数量-->
                    <el-form-item label="人均发放数量" >
                        <el-input style="width:300px" type="number" v-model="grantForm.quantity"></el-input>
                    </el-form-item>
                    <!--方放入-->
                    <el-form-item label="发放人">
                        <span style="color:#3c3c3c">{{user}}</span>
                    </el-form-item>
                    <!--发放对象-->
                    <el-form-item label="发放对象">
                        <el-select
                            style="width:300px"
                            @change="remoteChange"
                            clearable
                            filterable
                            remote
                            v-model="grantForm.partner_id"
                            placeholder="姓名、电话"
                            :remote-method="remoteMethod"
                        >
                            <el-option
                                v-for="item in remoteOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile_phone }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--客户数据列表-->
                    <el-table
                        :max-height="250"
                        :data="clientData"
                        style="width: 100%">
                        <el-table-column
                            prop="name"
                            label="姓名"
                            width="130"
                        >
                        </el-table-column>
                        <el-table-column
                            width="240"
                            label="电话"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.mobile_phone}}</div>
                                <div>{{scope.row.phone}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button @click="deleteCouponList(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--确认取消-->
                    <el-form-item style="display:flex;justify-content: flex-end;padding-top:10px;">
                        <div class="DN">
                            <el-button @click="grantToggle = false">取消</el-button>
                            <el-button type="warning" @click="saveCoupon">确认</el-button>
                        </div>
                    </el-form-item>
                </el-form>

            </div>
        </div>
    </div>
</template>

<script>
    import {senior_select,dn_coupon_set_post,dn_coupon_set,dn_coupon_set_put,dn_coupon_set_del,partner,dn_partner_coupon_post} from '@/api/getData'
    export default {
        data(){
            return{
                user:'邓二哥',//用户名
                couponText:'',//优惠券名称
                compile_id:'',//记录优惠券id
                is_compile:false,//判断是新增还是编辑
                newlyToggle:false,//控制新增优惠券弹框
                grantToggle:false,//控制现金券发放弹框
                stateText:'未上线',//状态文字
                pageLimitD:20,//当前显示多少页
                presentPageD:1,//页数
                totality:0,//总数
                fullHeight: document.documentElement.clientHeight,
                couponModel:'all',
                whereModel:'',
                couponOptions:[{label:'全部',value:'all'},{label:'现金券',value:'现金券'},{label:"折扣券",value:'折扣券'}],
                couponData:[],//优惠券列表数据
                couponForm:{//新增优惠券内容
                    "name": "",//优惠券名称
                    "coupon_type": "现金券",//优惠券类型
                    "offset_amount": "", //抵用价格
                    "discount_rate": "", //折扣率
                    "failure_type": "固定日期",//优惠类型
                    "expiration_date": "", //失效日期
                    "effective_days": "", //有效天数
                    "superposition_use": true,//可叠加使用
                    "applicable_working_hours": true,//适用工时
                    "applicable_accessories": true//适用配件
                },
                grantForm:{},//发布内容
                clientData:[],//发放对象列表
                rulesCoupon: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'change' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
                    ],
                    offset_amount:[
                        { required: true, message: '请输入抵用金额', trigger: 'change' },
                    ],
                    discount_rate:[
                        { required: true, message: '请输入折扣率', trigger: 'change' },
                    ],
                    expiration_date:[
                        { required: true, message: '请输入失效日期', trigger: 'change' },
                    ],
                    effective_days:[
                        { required: true, message: '请输入有效天数', trigger: 'change' },
                    ]
                },
                remoteOptions:[],//发放对象搜索列表
            }
        },
        mounted(){
            this.rendering(this.presentPageD,this.pageLimitD)
        },
        methods:{
            //数组去重方法
            arr_uniq(person){
                let obj = {};
                person = person.reduce((cur,next) => {
                    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                    return cur;
                },[])
                return person
            },
            //页面加载
            async rendering(a,b){
                this.presentPageD =a;
                this.pageLimitD =b;
                const data = {
                    coupon_type:this.couponModel,
                    where:this.whereModel,
                    offset:this.presentPageD,
                    limit:this.pageLimitD,
                    timestamp:new Date().getTime(),
                };
                const res = await senior_select(data);
                if(res.state_code=='ok'){
                    this.couponData = res.results;
                    this.totality = res.count;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //按id 查询当前优惠券
            async coupon_id(id){
                const res =await  dn_coupon_set({rid:id,offset:1,limit:1,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    if(res.results.length>0){
                        this.couponForm = res.results[0]
                    }
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //每页多少条
            pageLimit: async function (b) {
                console.log(111);
                this.rendering(this.presentPageD,b)
            },
            //当前页
            presentPage: async function(a){
                console.log(222);
                this.rendering(a,this.pageLimitD)
            },
            //搜索功能
            searchFun:async function () {
                console.log(333);
                this.rendering(1,this.pageLimitD)
            },
            //远程搜索发放对象
            async remoteMethod(val){
                if(val!=''){
                    const res = await partner({where:val,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.remoteOptions = res.results.filter(obj => obj.active ==true)
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //选中
            remoteChange(val){
                if(val!=''){
                    console.log(333);
                    this.clientData.push(this.remoteOptions.filter(obj=>obj.id ==val)[0])
                    this.clientData = this.arr_uniq(this.clientData)
                }
            },
            //新增优惠券弹框
            newlyToggleF(){
                this.is_compile = false
                this.newlyToggle=true;
                this.$refs['couponForm'].resetFields();

            },
            //新增或者编辑优惠券保存
            saveNewly(){
                this.$refs['couponForm'].validate(async (valid) => {
                    if (valid) {
                        const data = {
                            "name": this.couponForm.name,//优惠券名称
                            "coupon_type": this.couponForm.coupon_type,//优惠券类型
                            "offset_amount": this.couponForm.offset_amount, //抵用价格
                            "discount_rate": this.couponForm.discount_rate, //折扣率
                            "failure_type": this.couponForm.failure_type,//优惠类型
                            "expiration_date": this.couponForm.expiration_date, //失效日期
                            "effective_days": this.couponForm.effective_days, //有效天数
                            "superposition_use": this.couponForm.superposition_use,//可叠加使用
                            "applicable_working_hours": this.couponForm.applicable_working_hours,//适用工时
                            "applicable_accessories": this.couponForm.applicable_accessories//适用配件
                        };
                        if(data.coupon_type=='现金券'){
                            data.discount_rate =''
                        }else{
                            data.offset_amount =''
                        }
                        if(data.failure_type=='固定日期'){
                            data.effective_days =''
                        }else{
                            data.expiration_date=''
                        }
                        if(this.is_compile){//编辑优惠卷
                            data.rid = this.compile_id
                            data.if_write_all = true;
                            const res = await dn_coupon_set_put(data);
                            if(res.state_code=='ok'){
                                this.rendering(this.presentPageD,this.pageLimitD);
                                this.newlyToggle = false;
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }else{
                            const res = await dn_coupon_set_post(data)
                            if(res.state_code=='ok'){
                                this.rendering(this.presentPageD,this.pageLimitD);
                                this.newlyToggle = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }
                    }
                });

            },
            //编辑按钮
            async compileCoupon(id){
                this.compile_id =id;//保存id
                this.is_compile = true;
                this.newlyToggle = true;
                this.$refs['couponForm'].resetFields();
                this.coupon_id(id)
            },
            //删除
            deleteCoupon(id){
                this.$confirm('是否删除该记录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await dn_coupon_set_del({rid:id})
                    if(res.state_code=='ok'){
                        this.rendering(this.presentPageD,this.pageLimitD)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }

                })
                .catch(() => {})
            },
            //上线和下线
            is_playing(state,id){
                this.$confirm('确认执行此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await dn_coupon_set_put({rid:id,state:state,if_write_all:null})
                    if(res.state_code=='ok'){
                        this.rendering(this.presentPageD,this.pageLimitD)
                        this.$message({
                            message: state,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //发放优惠券默认加载
            async grantCouponF(id){
                this.user = JSON.parse(sessionStorage.getItem('userInfo')).name;
                this.compile_id =id;
                this.grantToggle = true;
                const res =await  dn_coupon_set({rid:id,offset:1,limit:1,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.grantForm = res.results[0]
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //发放优惠券提交
            async saveCoupon(){
                const arr = [];
                for(var index in this.clientData){
                    arr.push(this.clientData[index].id)
                }
                const data = {
                    coupon_set_id:this.compile_id,
                    partner_id:arr,
                    quantity:this.grantForm.quantity,
                    access:"发放",
                    granting_person:this.user
                }
                const res = await dn_partner_coupon_post(data)
                if(res.state_code=='ok'){
                    this.clientData = [];
                    this.$message({
                        type: 'success',
                        message: '发放成功!'
                    });
                    this.grantToggle = false
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //优惠券发放列表删除
            deleteCouponList(id){
                this.$confirm('确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.clientData = this.clientData.filter(obj=>obj.id!=id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                    .catch(()=>{})
            },
        }
    }
</script>

<style lang="less" scoped>
    .section{
        padding-top: 20px;
        padding-left: 20px;
    }
    .client-header-box {
        background: #f8f8f8;
        height: 59px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }

    .client-search-box {
        display: inline-flex;
        justify-content: center;
    }
    .stateSpan{
        color: #ffffff;
        border-radius: 13px;
        font-size: 10px;
        padding:5px 10px;
    }
    //新增优惠劵弹框
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
        width:488px;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%)
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
</style>
