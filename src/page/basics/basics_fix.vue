<template>
    <div class="basics-box DN">
        <div class="fix-main">
            <div class="client-header-box">
                <div>
                    <el-button v-if="getJurisdiction('1001')" type="primary" @click="openItemMask('newItemForm')" size="small">新增项目</el-button>
                    <el-button v-if="getJurisdiction('1001')" type="primary" @click="openTypeMask()" size="small">项目分类</el-button>
                </div>
                <div class="client-search-box">
                    <el-select v-model="activeModel" placeholder="请选择" style="width:100px;margin-right: 10px;" size="small">
                        <el-option
                            v-for="item in activeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div style="padding-right:.5rem;">
                        <div class="DN">
                            <el-input
                                style="width:250px"
                                clearable
                                v-model.trim="searchValue"
                                placeholder="项目分类,项目名称,价格"
                                prefix-icon="el-icon-search"
                                size="small"
                                @keyup.enter.native="searchFun(1)"
                            >
                            </el-input>
                        </div>
                    </div>
                    <el-button class="btn_yl" @click="searchFun(1)" size="small">搜索</el-button>
                </div>
            </div>
            <section class="section">
                <el-table
                    :max-height="fullHeight-200"
                    ref="multipleTable"
                    :data="allFixItems"
                    tooltip-effect="dark"
                    align="center"
                    style="width: 100%"
                    >
                    <el-table-column
                        prop="project_name"
                        label="项目名称">
                    </el-table-column>
                    <el-table-column
                        prop="project_classify_name"
                        label="项目分类">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="价格"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="active"
                        label="状态"
                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.active==true?'生效':'失效'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        v-if="getJurisdiction('1001')"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button class="efficacy-button"
                                       @click.stop="efficacyClick(scope.row.id)"
                                       size="mini"
                            >{{scope.row.active==true?'失效':'生效'}}</el-button>
                            <el-button  class="compile-button"
                                        size="mini"
                                        @click="compileProject(scope.row.id)"
                            >编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin-top: 20px; text-align:right;padding-right: 20px;"
                               @size-change="pageLimit($event,1)"
                               @current-change="presentPage($event,1)"
                               :page-sizes="[2, 5, 10, 20]"
                               :pager-count="9"
                               :page-size="20"
                               :current-page="presentPageD"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="totality">
                </el-pagination>
            </section>

            <!-- 新增项目的遮罩层 -->
            <div class="item-mask-box" v-show="addItemsShow">
                <div class="alert">
                    <header class="header">
                        <span>新增/编辑项目</span>
                        <b class="iconfont icon-close" @click="closeItemMask()"></b>
                    </header>
                    <section class="section">
                        <el-form :model="newItemForm" :rules="rules" ref="newItemForm" label-width="100px">
                            <el-form-item label="项目名称" prop="project_name">
                                <el-input v-model="newItemForm.project_name" placeholder="2-30个字符"></el-input>
                            </el-form-item>
                            <el-form-item label="别名" prop="other_name">
                                <el-input v-model="newItemForm.other_name" placeholder="用于快速搜索"></el-input>
                            </el-form-item>
                            <el-form-item label="项目分类" prop="project_classify_id">
                                <el-select
                                    v-model="newItemForm.project_classify_id"
                                    :remote-method="projectMethod"
                                    filterable
                                    remote
                                    clearable
                                    placeholder="请选择分类"
                                    style="padding-right:10px;">
                                    <el-option
                                        v-for="item in projectOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div class="forPosition">
                                    <span class="add-new-type" @click="addItemType(1)">新建分类</span>
                                    <!-- 判断加载该组件 -->
                                    <addType v-if="addTypeToggle_1"
                                             style="left: 90%;"
                                             :errorToggle="brand_series_plate_error_1"
                                             :errorText="brand_series_plate_text_1"
                                             v-on:cancelItemType="cancelItemType(1)"
                                             v-on:saveItemType = 'saveNewClassify($event,1)'
                                    ></addType>

                                </div>
                            </el-form-item>
                            <el-form-item label="价格" prop="price">
                                <el-input type="number" placeholder="请输入价格" v-model="newItemForm.price">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="是否生效" prop="active" style="display: flex;justify-content: flex-start;">
                                <el-switch disabled v-model="newItemForm.active" style="transform: translateX(-100px);"></el-switch>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('newItemForm')">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                </div>
            </div>

            <!--项目分类的遮罩层 -->
            <div class="type-mask-box" v-show="itemsTypeShow">
                <div class="alert">
                    <header class="header">
                        <span>项目分类</span>
                        <b class="iconfont icon-close" @click="closeTypeMask()"></b>
                    </header>
                    <section class="section_1">
                        <div class="DN addItemType">
                            <div class="forPosition">
                                <el-button class="compile-button" type="warning" @click="addItemType(2)" >新建分类</el-button>
                                <!-- 判断加载该组件 -->
                                <addType v-if="addTypeToggle"
                                         :errorToggle="brand_series_plate_error"
                                         :errorText="brand_series_plate_text"
                                         v-on:cancelItemType="cancelItemType(2)"
                                         v-on:saveItemType = 'saveNewClassify($event,2)'
                                ></addType>
                            </div>
                        </div>
                        <div class="itemType-box" style="height:449px;overflow:auto">
                            <nav>
                                <ul class="itemType-ulbox">
                                    <li style="width:190px">名称</li>
                                    <li style="width:160px">项目数</li>
                                    <li style="width:257px">创建时间</li>
                                    <li style="width:156px">操作</li>
                                </ul>
                            </nav>
                            <div>
                                <ul class="itemType-itembox">
                                    <li v-for="item in itemsTypeDate" :key="item.name">
                                        <div>
                                            <div style="width:190px;padding-left:10px">{{item.name}}</div>
                                            <div style="width:160px">{{item.name_number}}</div>
                                            <div style="width:250px">{{item.create_date}}</div>
                                            <div style="width:163px" class="DN">
                                                <el-button @click="clearProjectClass(item.id)">删除</el-button>
                                                <el-button type="warning" class="compile-button" @click="rename(item.id,item.name)">改名</el-button>
                                            </div>
                                        </div>
                                        <div :class="{rename:item.id == renameActive}" class="DN rename-box" >
                                            <el-input style="width:200px" v-model="renameTextModel"></el-input>
                                            <div class="save">
                                                <span @click="saveRename(item.id)">保存</span>
                                                <span @click="closeRename()">取消</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <div class="clent-page-box">
                        <el-pagination
                            @size-change="pageLimit($event,2)"
                            @current-change="presentPage($event,2)"
                            :page-sizes="[2, 5, 10, 20]"
                            :pager-count="9"
                            :page-size="10"
                            :current-page="presentPageD_1"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totality_1">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {maintenance_item_multi_fuzzy_search,dn_maintenance_item_del,dn_project_classify,dn_project_classifyPost
        ,dn_project_classifyDel,dn_project_classifyPut,dn_maintenance_item_post,dn_peoded,dn_maintenance_item
    ,dn_maintenance_item_Put,maintenance_item_state_change_del} from '@/api/getData'
    import addType from './add-type';
    export default {
        components: {
            addType
        },
        data() {
            return {
                fullHeight: document.documentElement.clientHeight,
                activeOptions:[{
                    label:'全部状态',
                    value:'all',
                },{
                    label:'生效',
                    value:'1',
                },{
                    label:'失效',
                    value:'0',
                }],
                activeModel:'all',
                pageLimitD:20,//当前显示多少页
                presentPageD:1,//页数
                totality:0,
                searchValue:'',
               // multipleSelection:[],//所有选中的列表
                //所有项目列表
                allFixItems:[],
                //新增项目
                addItemsShow:false,
                newItemForm: {
                    project_name:'',
                    other_name:'',
                    project_classify_id:'',
                    price:'',
                    active:true
                },
                rules: {
                    project_name: [
                        { required: true, message: '请输入项目名称', trigger: 'change' },
                        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' }
                    ],
                    project_classify_id: [
                        { required: true, message: '请选择项目分类', trigger: 'change' }
                    ],
                    price: [
                        { required: true, message: '请填写价格', trigger: 'change' }
                    ]
                },
                //项目分类相关
                pageLimitD_1:10,//当前显示多少页
                presentPageD_1:1,//页数
                totality_1:0,
                itemsTypeShow:false,
                addTypeToggle:false,//新建分类弹框
                renameActive:'',
                renameButtonText:'取消',
                itemsTypeDate:[],//项目分类列表
                brand_series_plate_error:false,
                brand_series_plate_text:'',
                renameTextModel:'',//改名input
                //新增项目相关
                addTypeToggle_1:false,//新建分类弹框
                brand_series_plate_error_1:'',
                brand_series_plate_text_1:'',
                projectOptions:[],
                is_compile:false,
            }
        },
        async mounted(){
            //渲染维修项目
            this.rendering(this.presentPageD,this.pageLimitD,1)
        },
        methods: {
            //维修项目渲染
            async rendering(a,b,c){
                if(c==1){ //维修项目渲染
                    this.presentPageD =a;
                    this.pageLimitD =b;
                    //维修工单
                    const data = {
                        active:this.activeModel,
                        where:this.searchValue,
                        offset:a,
                        limit:b,
                        timestamp:new Date().getTime()
                    };
                    const res = await maintenance_item_multi_fuzzy_search(data);
                    if(res.state_code=='ok'){
                        this.allFixItems = res.results;
                        this.totality = res.count
                    }else{
                        this.$message.error(res.err_message);
                    }
                }else{ //项目分类渲染
                    this.presentPageD_1 =a;
                    this.pageLimitD_1 =b;
                    const data = {
                        offset:a,
                        limit:b,
                        timestamp:new Date().getTime()
                    };
                    const res = await dn_project_classify(data);
                    if(res.state_code=='ok'){
                        this.itemsTypeDate = res.results;
                        this.totality_1 = res.count
                    }else{
                        this.$message.error(res.err_message);
                    }
                }

            },
            //每页多少条
            pageLimit: async function ($event,c) {
                if(c==1){
                    this.rendering(this.presentPageD,$event,c)
                }else{
                    this.rendering(this.presentPageD_1,$event,c)
                }
            },
            //当前页
            presentPage: async function($event,c){
                if(c==1){
                    this.rendering($event,this.pageLimitD,c)
                }else{
                    this.rendering($event,this.pageLimitD_1,c)
                }
            },
            //搜索功能
            searchFun:async function (c) {
                this.rendering(1,this.pageLimitD,c)
            },
            //生效和失效
            efficacyClick(id){
                this.$confirm('您确认要改变该状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await maintenance_item_state_change_del({rid:id});
                    if(res.state_code=='ok'){
                        this.rendering(this.presentPageD,this.pageLimitD,1);
                        this.$message({
                            type: 'success',
                            message: '改变状态成功!'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //新建分类按钮
            addItemType:function (val) {
                if(val==1){ //新增项目
                    this.addTypeToggle_1 = true;
                    this.brand_series_plate_text_1 = ''
                }else{//项目分类
                    this.addTypeToggle = true;
                    this.brand_series_plate_text = ''
                }
            },
            //保存新建分类请求
            async saveNewClassify($event,val){
                if(val==1){
                    if($event==''){
                        this.brand_series_plate_error_1 = true;
                        this.brand_series_plate_text_1 = '请输入分类名称'
                    }else{
                        const res =await dn_project_classifyPost({name:$event});
                        if(res.state_code=='ok'){
                            this.rendering(this.presentPageD_1,this.pageLimitD_1,2);
                            this.addTypeToggle_1 = false;
                            this.$message({
                                message: '新增分类成功',
                                type: 'success'
                            });
                        }else{
                            if(res.error_message=='项目名称不可重复'){
                                this.brand_series_plate_text = '项目名称不可重复';
                                this.brand_series_plate_error = true;
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }
                    }
                }else{
                    if($event==''){
                        this.brand_series_plate_error = true;
                        this.brand_series_plate_text = '请输入分类名称'
                    }else{
                        const res =await dn_project_classifyPost({name:$event});
                        if(res.state_code=='ok'){
                            this.rendering(this.presentPageD_1,this.pageLimitD_1,2);
                            this.addTypeToggle = false;
                            this.$message({
                                message: '新增分类成功',
                                type: 'success'
                            });
                        }else{
                            if(res.error_message=='项目名称不可重复'){
                                this.brand_series_plate_text = '项目名称不可重复';
                                this.brand_series_plate_error = true;
                            }else{
                                this.$message.error(res.err_message);
                            }

                        }
                    }
                }
            },
            //删除项目分类
            clearProjectClass(id){
                this.$confirm('是否删除该分类', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const res = await dn_project_classifyDel({rid:id});
                    if(res.state_code=='ok'){
                        this.rendering(this.presentPageD_1,this.pageLimitD_1,2);
                        this.$message({
                            message: '删除分类成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //新增项目弹框取消按钮
            cancelItemType:function (val) {
                if(val==1){
                    this.addTypeToggle_1 = false;
                }else{
                    this.addTypeToggle = false;
                }

            },
            //新增维修项目确认
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        //判断是编辑还是新增
                        if(this.is_compile==false){//编辑
                            const data = {
                                project_name: this.newItemForm.project_name,
                                other_name:this.newItemForm.other_name ,
                                project_classify_id: this.newItemForm.project_classify_id,
                                price: this.newItemForm.price,
                                active: this.newItemForm.active
                            };
                            console.log(data,'编辑模式');
                            const res = await dn_maintenance_item_post(data);
                            if(res.state_code=='ok'){
                                this.rendering(this.presentPageD,this.pageLimitD,1);
                                this.addItemsShow = false;
                                this.$message({
                                    message: '新增项目成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }else{
                            const data = {
                                rid:this.newItemForm.id,
                                project_name: this.newItemForm.project_name,
                                other_name:this.newItemForm.other_name ,
                                project_classify_id: this.newItemForm.project_classify_id,
                                price: this.newItemForm.price,
                                active: this.newItemForm.active
                            };
                            console.log(data,'新增模式');
                            const res = await dn_maintenance_item_Put(data);
                            if(res.state_code=='ok'){
                                this.rendering(this.presentPageD,this.pageLimitD,1);
                                this.addItemsShow = false;
                                this.$message({
                                    message: '编辑项目成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.err_message);
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },
            //项目分类搜索
            async projectMethod(val){
                if(val!=''){
                    const res = await dn_peoded({name:val,timestamp:new Date().getTime()});
                    if(res.state_code=='ok'){
                        this.projectOptions = res.results
                    }else{
                        this.$message.error(res.err_mossage);
                    }
                }
            },
            //点击项目分类
            rename:function (id,name) {
                this.renameActive = id;
                this.renameTextModel =name
            },
            //改名取消
            closeRename:function () {
                this.renameActive = ''
            },
            //改名保存
            async saveRename(id){
                const data = {
                    rid:id,
                    name:this.renameTextModel
                };
                const res = await dn_project_classifyPut(data);
                if(res.state_code=='ok'){
                    this.rendering(this.presentPageD_1,this.pageLimitD_1,2);
                    this. renameTextModel = '';
                    this.renameActive = '';
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.err_message);
                }
            },
            openTypeMask() {
                this.itemsTypeShow =true;
                this.rendering(this.presentPageD_1,this.pageLimitD_1,2)
            },
            closeTypeMask:function () {
                this.itemsTypeShow = false;
                this.addTypeToggle = false;
            },
            ////新增项目***************************
            //点击新增项目
             openItemMask() {
                 this.$refs['newItemForm'].resetFields();
                 this.is_compile = false;
                 this.addItemsShow = true;
             },
            //点击编辑项目
            async compileProject(id){
                this.addItemsShow = true;
                const res = await dn_maintenance_item({rid:id,timestamp:new Date().getTime()});//查询并赋值
                this.is_compile = true;
                if(res.state_code=='ok'){
                       this.projectOptions = [{id:res.results[0].project_classify_id,name:res.results[0].project_classify_name}];
                        this.newItemForm = res.results[0];
                }else{
                    this.$message.error(res.err_message);
                }
            },
            closeItemMask() {
                this.addItemsShow = false;
            },
        },

    }
</script>

<style lang="less" scoped>
    .section{
        padding:20px;
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
    .el-button--warning {
        background: #ff901d;
        border-color: #ff901d;
        color: #fff;
    }

    .el-button:hover {
        background: #ff801d;
        color: #ffd
    }
    .efficacy-button{
        color:#ff801d;
        border-color:#ff801d
    }
    .compile-button{
        background: #ff861f;
        color:#fff
    }
    .el-input{
        width:300px;
    }

    //遮罩层
    .item-mask-box,.type-mask-box{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.3);
        z-index:1000;
    }

    .alert{
        position:absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        background: #fff;
        padding:10px 10px;
    }

    .header{
        padding:10px 10px;
        display: flex;
        justify-content: space-between;
        padding-bottom:10px;
        border-bottom:1px solid #eee;
        color:#606266;
        font-size:16px;
    }
    .header>b{
        color:#8d8d8d;
        font-size:21px;
    }
    .header>b:hover{
        color:red;
    }

    .section{
        padding:20px 10px;
    }
    .section_1{
        padding:10px;
    }
    .section_1 .forPosition{
        display:inline-block;
        position:relative;
    }

    //新增项目
    .item-mask-box>.alert{
        width: 485px;
        height: 420px;
    }
    .item-mask-box .section .add-new-type{
        color:#ff801d;
        cursor: pointer;
    }
    .item-mask-box .section .forPosition{
        margin-left:13%;
    }

    //项目类型
    .type-mask-box>.alert{
        width:750px;
        height: 595px;
    }
    .type-mask-box .addItemType{
        position:relative;
    }
    .type-mask-box .itemType-box{
        padding-top:12px;
    }
    .type-mask-box .itemType-ulbox{
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        background: #f8f8f8;
        color: rgb(144, 147, 153);
        font-size:14px;
        font-weight:700;
        padding:0 10px;
    }
    .type-mask-box .itemType-itembox>li>div:first-child{
        height: 50px;
        border-bottom:1px solid #eeeeee;
        display: flex;
        color: rgb(96, 98, 102);
        font-size:14px;
        justify-content: flex-start;
        align-items: center;
    }
    .type-mask-box .rename-box{
        height:0;
        padding: 0;
        overflow: hidden;
        opacity: 0;
        border-bottom:none;
        box-sizing: border-box;
        transition: all .3s linear;
    }
    .type-mask-box .rename{
        height: 100px;
        padding:15px 0;
        border-bottom:1px solid #eee;
        opacity:1 ;
    }
    .type-mask-box .itemType-itembox .save>span{
        display: inline-block;
        padding:0;
        width: 40px;
        margin:10px 0;
        color:#ff861f;
        cursor: pointer;
    }
    .type-mask-box .itemType-itembox .save>span:first-child{
        border-right:1px solid #eee;
    }
    .type-mask-box .itemType-itembox .save>span:last-child{
        text-align: right;
        padding-right:2px ;
    }
    .type-mask-box .itemType-itembox .error-box{
        color: #e41618;
    }
    .type-mask-box .clent-page-box{
        padding-right: 40px;
        padding-top: 7px;
        text-align: right;
    }
</style>
