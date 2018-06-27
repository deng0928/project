<template>
    <div class="staff-box fillcontain DN" v-loading.fullscreen.lock="fullscreenLoading">
        <div class=" client-header-box">
            <div>
                <el-button v-if="getJurisdiction('1002')" type="primary" @click="$router.push('/manage/addStaff/en')" size="small">添加员工</el-button>
                <el-button v-if="getJurisdiction('1002')" type="primary" @click="staffMaskToggle" size="small">部门信息</el-button>
            </div>
            <div class="client-search-box">
                <div style="padding-right:.5rem;">
                    <div class="DN">
                        <el-input
                            style="width:250px"
                            clearable
                            size="small"
                            v-model.trim="searchBoxValue"
                            placeholder="请输入姓名，电话，班组"
                            @keyup.enter.native = 'searchFun'
                        >
                        </el-input>
                    </div>
                </div>
                <el-button class="btn_yl" @click="searchFun" size="small">搜索</el-button>
            </div>
        </div>
        <div class="client-user-list">
            <div class="DN">
                <el-table
                    :data="staffList"
                    :max-height="fullHeight-190"
                    style="width: 100%"
                >
                    <!--姓名-->
                    <el-table-column
                        prop="employee_name"
                        label="姓名"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.employee_name}}</span>
                        </template>
                    </el-table-column>
                    <!--手机号码-->
                    <el-table-column
                        prop="mobile_phone"
                        label="电话"
                    >
                        <template slot-scope="scope">
                            <ul>
                                <li v-show="false">{{scope.row.id}}</li>
                                <li v-show="scope.row.mobile_phone">
                                    {{scope.row.mobile_phone}}
                                </li>
                                <li v-show="scope.row.phone">
                                    {{scope.row.phone}}
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <!--分类-->
                    <el-table-column
                        prop="department_id_name"
                        label="部门/班组">
                        <template slot-scope="scope">
                            <span style="margin-right: 5px">{{ scope.row.department_name }}</span>
                            <i v-show="scope.row.department_is_group"
                                style="color:#ff861f;
                        border:1px solid #ff861f;
                        border-radius:6px;
                        font-size:12px;
                        padding:0 4px">班组</i>
                        </template>
                    </el-table-column>
                    <!--状态-->
                    <el-table-column
                        prop="state"
                        label="状态">
                        <template slot-scope="scope">
                            <span :class="{stateActive:scope.row.state=='离职'}">
                                {{scope.row.state}}
                            </span>
                        </template>
                    </el-table-column>
                    <!--是否可登录-->
                    <el-table-column
                        prop="is_landing"
                        label="是否可登录">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.is_landing==''?'否':'是'}}
                            </span>
                        </template>
                    </el-table-column>
                    <!--操作-->
                    <el-table-column
                        v-if="getJurisdiction('1002')"
                        width="170"
                        label="操作">
                        <template slot-scope="scope">

                            <el-button
                                       :class="{efficacyButton:scope.row.state=='离职'}"
                                       size="mini"
                                       @click.stop="dimission(scope.row.id)"
                            >{{scope.row.state=='在职'?'离职':'在职'}}
                            </el-button>
                            <el-button class="compile-button"
                                       size="mini"
                                       @click.stop="$router.push(`/manage/addStaff/${scope.row.id}`)"
                            >编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="clent-page-box">
            <el-pagination
                @current-change="presentPage"
                @size-change="pageLimit"
                :page-sizes="[2, 5, 10, 20]"
                :pager-count="9"
                :page-size="20"
                :current-page="presentPageD"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totality">
            </el-pagination>
        </div>

        <!--弹出框-->
        <div class="staff-mask-box" v-show="staffMaskShow" @click.self="closeMask">
            <div class="alert">
                <header class="header">
                    <span>部门信息</span>
                    <b class="iconfont icon-close" @click="closeMask"></b>
                </header>
                <section class="section">
                    <div class="DN addDepartment">
                        <el-button size="small" type="primary" @click="addDepartment">新建部门</el-button>
                        <div v-show="toggleDepartment" class="addDepartment-alert DN">
                            <el-input v-model="adddepartment.department_name"></el-input>
                            <p v-show="departmentError">名称为空或者名称重复</p>
                            <div class="banzu">
                                <span>是否为班组：</span>
                                <el-checkbox v-model="adddepartment.is_team_group">{{adddepartment.is_team_group==''?'否':'是'}}</el-checkbox>
                            </div>
                            <div class="DN cancel">
                                <el-button @click="closeDepartment">取消</el-button>
                                <el-button @click="cancelDepartment" class="compile-button">确定</el-button>
                            </div>
                            <span class="sanjiao iconfont icon-fanhui"></span>
                            <b class="sanjiao-border"></b>
                        </div>
                    </div>
                    <!--部门数据-->
                    <div class="department-box" style="height:449px;overflow:auto">
                        <nav>
                            <ul class="department-ulbox">
                                <li style="width:190px">名称</li>
                                <li style="width:160px">员工数</li>
                                <li style="width:257px">创建时间</li>
                                <li style="width:156px">操作</li>
                            </ul>
                        </nav>
                        <div>
                            <ul class="department-itembox">
                                <!--部门数据-->
                                <li v-for="(item,index) in departmentDate" :key="index">
                                    <div>
                                        <div style="width:190px;padding-left:10px">
                                            {{item.department_name}}
                                            <i v-show="item.is_team_group"
                                               style="color:#ff861f;
                                            border:1px solid #ff861f;
                                            border-radius:6px;
                                            font-size:12px;
                                            padding:0 4px">班组</i>
                                        </div>
                                        <div style="width:160px">{{item.employee_number==''?0:item.employee_number}}</div>
                                        <div style="width:250px">{{item.create_date}}</div>
                                        <div style="width:163px" class="DN">
                                            <el-button @click="delDepartment(item.id)" size="small">删除</el-button>
                                            <el-button type="primary" size="small" @click="rename(item.id,index)">改名</el-button>
                                        </div>
                                    </div>
                                    <div :class="{rename:item.id == renameActive,renameLong:item.id == renameActive&&renameLong}" class="DN rename-box" >
                                        <el-input style="width:200px" size="small" v-model="renameText"></el-input>
                                        <div class="banzu">
                                            <span>是否为班组：</span>
                                            <el-checkbox v-model="is_team">{{is_team==''?'否':'是'}}</el-checkbox>
                                        </div>
                                        <div class="save">
                                            <span @click="saveRename(item.id,is_team,index)">保存</span>
                                            <span @click="closeRename">取消</span>
                                        </div>
                                        <p class="error-box" v-if="renameLong">班组名不能重复</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                <div class="clent-page-box">
                    <el-pagination
                        @current-change="presentPage2"
                        @size-change="pageLimit2"
                        :page-sizes="[2, 5, 10, 20]"
                        :pager-count="5"
                        :page-size="10"
                        :current-page="presentPageD2"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totality2">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {employeeGet,employeedel,departmentGet,departmentPost,departmentDel,departmentNo,departmentPut} from '@/api/getData'
    export default {
        data(){
            return{
                fullscreenLoading: false,
                is_team:'',
                staffList:[],//员工列表
                fullHeight: document.documentElement.clientHeight,//高度
                searchBoxValue:'',//搜索框内容
                pageLimitD:20,//当前显示多少条
                pageLimitD2:10,//当前显示多少页
                presentPageD:1,//页数
                presentPageD2:1,//页数
                totality:0,
                totality2:0,
                staffMaskShow:false,//部门信息弹框
                toggleDepartment:false,
                renameActive:'',
                renameButtonText:'取消',
                departmentDate:[],//所有部门数据
                staffAlertDate:[{
                    name: '小姐姐',
                    staffNumber:'1',
                    newDate: '机修'
                }],
                departmentError:false,//部门信息重复提示
                renameLong:false,//改名是部门信息重复提示
                adddepartment:{ //新增部门信息
                    department_name:'',
                    is_team_group:''
                },
                renameText:'sdfsd'//改名绑定input数据
            }
        },
        methods:{
            //部门数据渲染
            async department_load(a,b){
                this.presentPageD2 =a;
                this.pageLimitD2 =b;
                const data2 ={
                    offset:a,limit:b,timestamp:new Date().getTime()
                }
                const res = await departmentGet(data2);
                if(res.state_code=='ok'){
                    this.totality2 = res.count;
                    this.departmentDate = res.results;
                }else{
                    this.$message.error(res.err_message)
                }
            },
            //员工列表渲染
            async staff_load(a,b){
                this.presentPageD =a;
                this.pageLimitD =b;
                const data = {
                    where:this.searchBoxValue,offset:this.presentPageD,limit:this.pageLimitD, timestamp:new Date().getTime()
                };
                this.fullscreenLoading = true;
                const res = await employeeGet(data);
                if(res.state_code=='ok'){
                    this.fullscreenLoading = false;
                    this.staffList = res.results;
                    this.totality = res.count;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //离职办理
            dimission:async function (id){
                this.$confirm('您确认要更改该员工状态么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const res = await employeedel({rid:id});
                    if(res.state_code=='ok'){
                        const data = {
                            where:this.searchBoxValue,offset:this.presentPageD,limit:this.pageLimitD,timestamp:new Date().getTime()
                        };
                        const resa = await employeeGet(data);
                        this.staffList = resa.results;
                        this.totality = resa.count;
                        this.$message({
                            message: '更改成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //搜索功能
            searchFun:async function () {
                this.staff_load(1,this.pageLimitD)
            },
            //当前显示多少页
            pageLimit: async function ($event) {
                this.staff_load(this.presentPageD,$event)
            },
            //当前页
            presentPage: async function($event) {
                this.staff_load($event,this.pageLimitD)
            },
            //部门 当前显示多少页
            pageLimit2: async function ($event) {
                this.department_load(this.presentPageD2,$event)
            },
            //当前页
            presentPage2: async function($event) {
                this.department_load($event,this.pageLimitD2)
            },
            closeMask:function () {
                this.staffMaskShow = false
            },
            addDepartment:function () {
                this.toggleDepartment = true
            },
            //新建部门取消
            closeDepartment:function(){
                this.adddepartment.department_name=''
                this.toggleDepartment = false;
                this.adddepartment.name ='';
                this.adddepartment.is_team_group=''
            },
            //新建部门确认提交数据
            cancelDepartment: async function () {
                //添加部门信息
                if(this.adddepartment.department_name==''){
                    this.$message.error('请填写部门名称');
                }else{
                    const data = this.adddepartment;
                    const res= await departmentPost(data);
                    if(res.state_code=='ok'){
                        this.departmentError = false;//隐藏错误提示框
                        this.toggleDepartment = false;//关闭添加部门弹框

                        this.department_load(this.presentPageD2,this.pageLimitD2);
                        this.$message({
                            message:'添加成功',
                            type: 'success'
                        });
                        this.adddepartment.department_name=''
                    }else{
                        this.departmentError = false;
                        this.$message.error(res.err_message);
                    }
                }
            },
            //删除部门数据
            delDepartment:async function(id){
                this.$confirm('您确认要删除该部门信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await departmentDel({rid:id});
                    console.log(res);
                    if(res.state_code=='ok'){
                        //刷新部门信息列表
                        this.department_load(this.presentPageD2,this.pageLimitD2);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //改名按钮
            rename:function (id,index) {
                this.renameLong = false;
                this.renameText= this.departmentDate[index].department_name;
                this.is_team = this.departmentDate[index].is_team_group;
                this.renameActive = id;
            },
            //关闭改名弹框
            closeRename:function () {
                this.renameActive = ''
            },
            //改名弹框提交数据
            saveRename:async function(id,group,index){
                if(this.renameText==''){
                    this.$message.error('您还未填写部门名称');
                }else{
                    const data ={
                        rid:id,
                        department_name:this.renameText,
                        is_team_group:group
                    };
                    const res = await departmentPut(data);
                    if(res.state_code=='ok'){
                        this.renameActive = '';//隐藏下拉框
                        this.departmentDate[index].department_name = this.renameText;
                        this.departmentDate[index].is_team_group = this.is_team;
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }

                }
            },
            //部门信息弹框
            staffMaskToggle:function () {
                this.staffMaskShow =true;
                this.department_load(this.presentPageD2,this.pageLimitD2)
            },
        },
        //初始化数据
        async mounted(){
            //员工列表
            this.staff_load( this.presentPageD, this.pageLimitD)
        }
    }
</script>

<style scoped>
    .stateActive{
        color:red;
    }
    .addDepartment{
        position:relative;
    }
    .addDepartment-alert{
        position:absolute;
        width:262px;
        background: #fff;
        left: 100px;
        top:-36px;
        border:1px solid #eee;
        box-shadow: 1px 1px 1px #eee;
        padding:20px 15px 15px 20px
    }
    .addDepartment-alert>p{
        padding:8px 0;
        color:#e41618
    }
    .addDepartment-alert .cancel{
        text-align: right;
        padding:15px 0;
        padding-bottom:10px;
    }
    .department-box{
        padding-top:12px;
    }
    .banzu{
        padding:3px 0;
        color:#606266
    }
    .sanjiao{
        display:inline-block;
        position: absolute;
        top:41px;
        left: -9px;
        color:#eee;
    }
    .sanjiao-border{
        position: absolute;
        top: 42px;
        left: -1px;
        display: inline-block;
        width: 2px;
        height: 15px;
        background: #fff;

    }
    .department-ulbox{
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        background: #f8f8f8;
        color: #606266;
        padding:0 10px;
    }
    .department-itembox>li>div:first-child{
        height: 50px;
        border-bottom:1px solid #eeeeee;
        display: flex;
        color: #606266;
        justify-content: flex-start;
        align-items: center;
    }
    .rename-box{
        height:0;
        padding: 0;
        overflow: hidden;
        opacity: 0;
        border-bottom:none;
        box-sizing: border-box;
        transition: all .3s linear;
    }
    .rename{
        height: 113px;
        padding:15px 0;
        border-bottom:1px solid #eee;
        opacity:1 ;
    }
    .renameLong{
        height:141px
    }
    .department-itembox .save>span{
        display: inline-block;
        padding:0;
        width: 40px;
        margin:10px 0;
        color:#ff861f;
        cursor: pointer;
    }
    .department-itembox .save>span:first-child{
        border-right:1px solid #eee;
    }
    .department-itembox .save>span:last-child{
        text-align: right;
        padding-right:2px ;
    }
    .department-itembox .error-box{
        color: #e41618;
    }
    .client-header-box{
        background: #f8f8f8;
        height: 59px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left:20px;
        padding-right: 20px;
    }
    .client-search-box{
        display: inline-flex;
        justify-content: center;
    }
    .el-button--warning{
        background:#ff901d;
        border-color:#ff901d;
        color:#fff;
    }

    .el-button:hover{
        background: #ff801d;
        color:#ffd
    }
    .client-user-list{
        padding:20px;
        box-sizing:border-box;
        padding-bottom:20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .clent-page-box{
        padding-right: 40px;
        padding-top: 7px;
        text-align: right;
    }
    .efficacyButton{
        color:#ff801d;
        border-color:#ff801d
    }
    .compile-button{
        background: #ff861f;
        color:#fff
    }
    .staff-mask-box{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.3);
    }
    .staff-mask-box .alert{
        position:absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        width:750px;
        height: 595px;
        background: #fff;
        padding:10px 10px;
    }
    .header{
        display: flex;
        justify-content: space-between;
        padding-bottom:10px;
        border-bottom:1px solid #eee;
        color:#606266
    }
    .header>b{
        color:#8d8d8d;
        font-size:16px;
    }
    .header>b:hover{
        color:red;
    }

    .section{
        padding:10px;
    }
</style>
<style>

</style>
