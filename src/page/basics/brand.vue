<template>
    <div class="brand">
        <div class="header">
            <div class="left">
                <span style="cursor: pointer;" @click="$router.go(-1)">车辆管理 / </span>
                <span class="detail">新增品牌车系</span>
            </div>
            <div class="client-search-box DN">
                <el-select size="small" style="margin-right: .5rem;" v-model="activeModelValue"  placeholder="请选择">
                    <el-option
                        v-for="item in activeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div style="padding-right:.5rem;">
                    <div>
                        <el-input
                            size="small"
                            v-model="searchValue"
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                        >
                        </el-input>
                    </div>
                </div>
                <el-button class="compile-button" @click="searchFun" type="warning" plain>搜索</el-button>
            </div>
        </div>
        <section style="padding:20px">
            <div class="DN addDepartment" style="position:relative;display:inline-block;z-index:600">
                <el-button class="compile-button" type="warning" @click="addPlateToggle=true">新增品牌</el-button>
                <addType
                    v-if="addPlateToggle"
                    :errorToggle="brand_series_plate_error"
                    :errorText = "brand_series_plate_text"
                    @saveItemType="brand_series_plate_request($event)"
                    @cancelItemType="cancelItrem(1)"
                ></addType>
            </div>
            <div class="brand-table">
                <!--列表头部-->
                <el-row class="th">
                    <el-col :span="8">
                        <div>品牌名称</div>
                    </el-col>
                    <el-col :span="5">
                        <div>车系数量</div>
                    </el-col>
                    <el-col :span="7">
                        <div>创建时间</div>
                    </el-col>
                    <el-col :span="4">
                        <div>操作</div>
                    </el-col>

                </el-row>
                <!--列表内容-->
                <ul class="department-itembox" :style="{maxHeight:fullHeight-350+'px'}" style="overflow: auto" >
                    <li v-for="(item,index) in departmentDate" :key="item.id">
                        <el-row>
                            <!--品牌名称-->
                            <el-col :span="8">
                                <div style="width:330px;padding-left:10px">
                                    <span v-if="item.is_Show" @click="closeRename(item)" style="color:#ff901d;margin-right: 6px;cursor: pointer;" class="iconfont icon-shouqi"></span>
                                    <span v-else @click="rename(item)" style="color:#ff901d;margin-right: 6px;cursor: pointer;" class="iconfont icon-zhankai"></span>
                                    {{item.name}}
                                </div>
                            </el-col>
                            <!--车系数量-->
                            <el-col :span="5">
                                <div style="width:260px">{{item.series_number}}</div>
                            </el-col>
                            <!--创建事件-->
                            <el-col :span="7">
                                <div style="width:290px">{{item.create_date}}</div>
                            </el-col>
                            <!--操作-->
                            <el-col :span="4">
                                <div style="width:263px;position: relative" class="DN">
                                    <el-button @click="delete_brand(item.id)">删除</el-button>
                                    <el-button type="warning" class="compile-button" @click="addShowAlert(item)">新增车系</el-button>
                                    <addTypeL v-if="item.isShow"
                                              :errorToggle="brand_series_plate_error_1"
                                              :errorText = "brand_series_plate_text_1"
                                              @saveItemType="brand_series_plate_request_1($event,item.id,item)"
                                              @cancelItemType="cancelItrem(2,item)"
                                    ></addTypeL>
                                </div>
                            </el-col>
                        </el-row>
                        <!--改名-->
                        <div  v-show="item.is_Show" class="DN rename-box">
                            <div ref="abcheight">
                                <div class="box" v-for="item_1 in item.seriesList" :key="item_1.id">
                                    <div class="car-list-box">
                                        <div v-if="!(item_1.id ==renameActive_1)"  style="width:225px;padding-right: 5px;">{{item_1.name}}</div>
                                        <div v-else style="width:225px;padding-right:5px;">
                                            <el-input size="small" v-model="searchValue_1"></el-input>
                                            <div class="save">
                                                <span @click="saveRename(item_1.id,item.id,item)">保存</span>
                                                <span @click="renameActive_1 =''">取消</span>
                                            </div>
                                            <p v-show="error_toggle_1" class="error-box">{{error_text_1}}</p>
                                        </div>
                                        <div class="DN">
                                            <el-button type="warning" @click="dn_seriesDelFun(item,item_1)">删除</el-button>
                                            <el-button @click="hideCarTitle(item_1.id,item_1)" type="warning">改名</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-pagination style="margin: 30px;"
                                       @size-change="pageLimit_1($event,item)"
                                       @current-change="presentPage_1($event,item)"
                                       :page-sizes="[6,3,12]"
                                       :pager-count="9"
                                       :page-size="20"
                                       :current-page="item.presentPageD"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="item.totality"
                                       v-if="item.is_Show">
                        </el-pagination>
                    </li>
                </ul>
            </div>
            <!--分页显示-->
            <div  class="clent-page-box" style="text-align: right;padding-right: 20px;">
                <el-pagination
                    @size-change="pageLimit"
                    @current-change="presentPage"
                    :page-sizes="[2, 5, 10, 20]"
                    :pager-count="9"
                    :page-size="20"
                    :current-page="presentPageD"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totality">
                </el-pagination>
            </div>
        </section>
    </div>
</template>

<script>
    import addType from '@/page/basics/add-type'
    import addTypeL from '@/page/basics/add-type-left'
    import {brand_multi_fuzzy_search,series_multi_fuzzy_search,dn_seriesPut,dn_brandPost,dn_seriesPost,dn_brandDel,dn_seriesDel} from '@/api/getData'
    export default {
        components:{
            addType,
            addTypeL
        },
        data(){
            return{
                fullHeight: document.documentElement.clientHeight,
                activeOptions:[{label:'全部分类',value:'all'},{label:'按品牌搜索',value:'1'},{label:'按车系搜索',value:'0'}],//分类搜索
                activeModelValue:'all',
                searchValue:'',
                searchValue_1:'',
                error_toggle_1:true,
                error_text_1:'',
                pageLimitD:20,//当前显示多少页
                presentPageD:1,//页数
                totality:0,//总数
                addPlateToggle:false,
                addPlateToggle_1:[],
                brand_series_plate_error:false,
                brand_series_plate_text:'',
                brand_series_plate_error_1:false,
                brand_series_plate_text_1:'',
                //品牌列表动态高度
                addCarActive:'',
                toggleDepartment:false,
                renameActive:'',
                renameActive_1:'',
                carTitle:true,
                //品牌数据
                departmentDate:[],
            }
        },
        mounted(){
            this.rendering(this.presentPageD,this.pageLimitD,1)
        },
        methods:{
            //初始化函数
            //渲染车辆数据
            async rendering(a,b,c,d='all'){
                if(c==1){
                    //车辆列表
                    this.presentPageD =a;
                    this.pageLimitD =b;
                    const data = {
                        brand_series:this.activeModelValue,
                        name:this.searchValue,
                        offset:a,
                        limit:b,
                        timestamp:new Date().getTime(),
                    };
                    const res = await brand_multi_fuzzy_search(data);
                    if(res.state_code=='ok'){
                        this.departmentDate = res.results;
                        console.log(res);
                        for(var i =0;i<res.results.length;i++){
                            this.departmentDate[i].is_Show = false;
                            this.departmentDate[i].seriesList=[];//车系容器
                            this.departmentDate[i].pageLimitD = 6;//当前显示多少页
                            this.departmentDate[i].presentPageD = 1;//页数
                            this.departmentDate[i].totality =0;//总数
                            this.departmentDate[i].isShow = false;
                        }
                        this.totality = res.count;
                    }else{
                        this.$message.error(res.err_message);
                    }
                }else{
                    //车系列表
                    this.$forceUpdate();
                    this.$set(d,'presentPageD',a);
                    this.$set(d,'pageLimitD',b);
                    const data = {
                        brand_id:d.id,
                        brand_series:this.activeModelValue,
                        name:this.searchValue,
                        offset:a,
                        limit:b,
                        timestamp:new Date().getTime(),
                    };
                    const res = await series_multi_fuzzy_search(data);
                    console.log(res);
                    if(res.state_code=='ok'){
                        this.$forceUpdate();
                        this.$set(d,'seriesList',res.results);
                        this.$set(d,'totality',res.count);
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //每页多少条
            pageLimit: async function (b) {
                this.rendering(this.presentPageD,b,1)
            },
            //当前页
            presentPage: async function(a){
                this.rendering(a,this.pageLimitD,1)
            },
            //搜索功能
            searchFun:async function () {
                this.rendering(1,this.pageLimitD,1)
            },
            //每页多少条
            pageLimit_1: async function ($event,item) {
                this.rendering(item.presentPageD,$event,2,item);
            },
            //当前页
            presentPage_1: async function($event,item){
                this.rendering($event,item.pageLimitD,2,item)
            },
            //新建品牌保存
            async brand_series_plate_request(val){
                if(val ==''){
                    this.brand_series_plate_text = '品牌名称不能为空';
                    this.brand_series_plate_error = true
                }else{
                    const res= await dn_brandPost({name:val});
                    if(res.state_code=='ok'){
                        this.addPlateToggle =false;
                        this.$message({
                            message: '新增品牌成功',
                            type: 'success'
                        });
                        //刷新品牌列表
                        this.rendering(this.presentPageD,this.pageLimitD,1)
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //新建车系弹框
            addShowAlert(item){
                this.$forceUpdate();
                this.$set(item,'isShow',true);
            },
            //删除品牌
            delete_brand(id){
                this.$confirm('您确认要执行该操作么', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await dn_brandDel({rid:id});
                    if(res.state_code=='ok'){
                        this.rendering(this.presentPageD,this.pageLimitD,1);
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }

                })
            },
            //删除车系
             dn_seriesDelFun(item,item_1){
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const res = await dn_seriesDel({rid:item_1.id})
                    if(res.state_code=='ok'){
                        this.rendering(item.presentPageD,item.pageLimitD,2,item);
                        item.series_number--;
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
            //新建车系保存
            async brand_series_plate_request_1($event,id,item){
                if($event ==''){
                    this.brand_series_plate_text_1 = '车系名称不能为空';
                    this.brand_series_plate_error_1 = true
                }else{
                    const res= await dn_seriesPost({brand_id:id,name:$event});
                    if(res.state_code=='ok'){
                        this.$forceUpdate();
                        this.$set(item,'isShow',false);
                        this.$message({
                            message: '新增车系成功',
                            type: 'success'
                        });
                        item.series_number++;
                        this.rendering(item.presentPageD,item.pageLimitD,2,item);
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //取消新增品牌或者新增车系
            cancelItrem(a,item=0){
                if(a==1){//取消新增品牌
                    this.addPlateToggle = false;
                    this.brand_series_plate_text=''
                }else{//取消新增车系
                    this.$forceUpdate();
                    this.$set(item,'isShow',false);
                    this.brand_series_plate_text_1=''
                }
            },
            rename: async function (item) {
                this.$forceUpdate();
                this.$set(item,'is_Show',true );
                this.rendering(item.presentPageD,item.pageLimitD,2,item);
            },
            //修改车系名称
            async saveRename(id1,id2,item){
                const data = {
                    rid:id1,
                    name:this.searchValue_1,
                    brand_id:id2,
                };
                if(this.searchValue_1==''){
                    this.error_toggle_1 = true;
                    this.error_text_1 = '车系名称不能为空'
                }
                const res = await dn_seriesPut(data);
                if(res.state_code=='ok'){
                    this.renameActive_1 = '';
                    this.error_toggle_1 = false;
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.rendering(item.presentPageD,item.pageLimitD,2,item);
                }else{
                    this.$message.error(res.err_message);
                }
            },
            closeRename:function (item) {
                this.$forceUpdate();
                this.$set(item,'is_Show',false )
            },

            hideCarTitle:function (id,item) {
                this.renameActive_1 = id;
                this.searchValue_1 =item.name
            }
        }
    }
</script>

<style lang="less" scoped>
    .brand>.header{
        display: flex;
        justify-content: space-between;
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
 .clent-page-box{
     transform: translateY(-10px);
 }
    .brand>.header  .detail{
        color:#ff901d;
    }
    .client-search-box{
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .brand-table{
        color: rgb(144, 147, 153);
        font-size:14px;
        font-weight:700;
        padding:0 20px;
        transform: translateY(-19px);
    }
    .brand-table>.th{
        position: relative;
        z-index: 500;
        transform: translateY(40px);
        height: 50px;
        line-height: 50px;
        background: #f8f8f8;
        display: flex;
        padding:0 20px
    }
    .department-itembox{
        color: rgb(96, 98, 102);
        font-size:14px;
        padding:55px 0;
        font-weight:normal;
        padding-bottom:25px
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
    .department-itembox>li{
        border-bottom:1px solid #eee;
    }
    .department-itembox>li>div:first-child{
        height: 50px;
        display: flex;
        color: #606266;
        justify-content: flex-start;
        align-items: center;
    }
    .rename-box>div{
        display: flex;
        flex-wrap: wrap;
    }
    .rename-box{
        padding: 0;
        border-bottom:none;
        box-sizing: border-box;
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
    .car-list-box{
        margin-top:10px;
        padding:20px;
        border:1px solid #eee;
        border-radius: 5px;
        width: 380px;
        display: flex;
        margin-right:15px;
    }
    .save>span{
        display: inline-block;
        padding:0;
        width: 40px;
        margin:10px 0;
        color:#ff861f;
        cursor: pointer;
    }
    .save>span:first-child{
        border-right:1px solid #eee;
    }
    .save>span:last-child{
        text-align: right;
        padding-right:2px ;
    }
    .error-box{
        color: #e41618;
    }

    .addDepartment{
        position:relative;
    }
    .addDepartment-alert{
        position:absolute;
        width:262px;
        background: #fff;
        left: 105px;
        top:-33px;
        border:1px solid #eee;
        box-shadow: 1px 1px 1px #eee;
        padding:20px 15px 15px 20px
    }
    .addDepartment-alert2{
        z-index: 100;
        display: none;
        position:absolute;
        width:262px;
        background: #fff;
        left: -233px;
        top: -34px;
        border:1px solid #eee;
        box-shadow:0px 1px 1px #eee;
        padding:20px 15px 15px 20px
    }
    .toggleAddCar{
        display: block;
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
    .sanjiao{
        display:inline-block;
        position: absolute;
        top:41px;
        left: -9px;
        color:#eee;
    }
    .sanjiao2{
        display:inline-block;
        position: absolute;
        top:41px;
        left: 294px;
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
    .sanjiao-border2{
        position: absolute;
        top: 42px;
        left: 297px;
        display: inline-block;
        width: 2px;
        height: 13px;
        background: #fff;

    }
</style>
