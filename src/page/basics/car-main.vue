<template>
    <div class="car-main DN" v-loading.fullscreen.lock="fullscreenLoading">
        <div class=" client-header-box">
            <div class="DN">
                <el-button v-if="getJurisdiction('1001')" type="primary" @click="goAddCar" size="small">新增车型</el-button>
                <el-button v-if="getJurisdiction('1001')"  type="primary" @click="$router.push('/manage/basics/brand')" size="small">新增品牌车系</el-button>
            </div>
            <div class="client-search-box DN">
                <el-select style="width:100px;margin-right: 10px;" v-model="stateLabel" placeholder="所有状态" size="small"
                >
                    <el-option
                        v-for="item in activeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select
                    v-model="brandLabel"
                    :remote-method="brandMethod"
                    filterable
                    remote
                    clearable
                    size="small"
                    placeholder="所有品牌"
                    style="padding-right:10px;width:250px">
                    <el-option
                        v-for="item in brandOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div style="padding-right:.5rem;">
                    <div class="DN">
                        <el-input
                            style="width:250px"
                            clearable
                            placeholder="请输入车系，车型"
                            v-model.trim="searchValue"
                            prefix-icon="el-icon-search"
                            size="small"
                            @keyup.enter.native = 'searchFun'
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
                ref="multipleTable"
                :data="basics_car_table"
                tooltip-effect="dark"
                style="width: 100%"
            >
                <el-table-column
                    prop="brand_name"
                    label="品牌"
                    width="120">
                </el-table-column>

                <el-table-column
                    prop="series_name"
                    label="车系"
                    width="200"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="车型"
                    prop="name"
                    >
                </el-table-column>
                <el-table-column
                    prop="active"
                    label="状态"
                    width="80"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                            <span>
                                {{scope.row.active==true?'生效':'失效'}}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="getJurisdiction('1001')"
                    prop="address"
                    label="操作"
                    width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button class="efficacy-button"
                                   @click.stop="efficacyClick(scope.row.id)"
                                   size="mini"
                        >{{scope.row.active==true?'失效':'生效'}}</el-button>
                        <el-button  class="compile-button"
                                    @click.stop="compileClick(scope.row.id)"
                                    size="mini"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <footer >
            <div class="clent-page-box"style="margin-top: 20px; text-align:right;padding-right: 20px;">
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
        </footer>
    </div>
</template>
<script>
    import {model_multi_fuzzy_search_del,model_state_change,partner,model_multi_fuzzy_search,brand_multi_fuzzy_search} from '@/api/getData'
    export default {
        data() {
            return {
                fullscreenLoading: false,
                fullHeight: document.documentElement.clientHeight,
                stateLabel:'all',//状态
                brandLabel:'',//品牌
                searchValue:'',//搜索
                pageLimitD:20,//当前显示多少页
                is_take:'生效',//生效还是失效
                presentPageD:1,//页数
                totality:0,
                basics_car_table: [],//基础车辆数据
                activeOptions:[{value: 'all', label: '所有状态'},{value: '1', label: '生效'}, {value: '0', label: '失效'}],
                brandData:[],
                brandOptions:[],//所以品牌option
            }
        },
        async mounted(){
            //车辆列表
            this.rendering(this.presentPageD,this.pageLimitD)
        },
        methods: {
            //渲染车辆数据
            async rendering(a,b){
                this.fullscreenLoading = true;
                //车辆列表
                this.presentPageD =a;
                this.pageLimitD =b;
                const data = {
                    where:this.searchValue,
                    active:this.stateLabel,
                    brand_id:this.brandLabel,
                    offset:a,
                    limit:b,
                    timestamp:new Date().getTime(),
                };
                const res = await model_multi_fuzzy_search(data);
                if(res.state_code=='ok'){
                    this.fullscreenLoading = false;
                    this.basics_car_table = res.results;
                    this.totality = res.count;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //每页多少条
            pageLimit: async function (b) {
                  this.rendering(this.presentPageD,b)
            },
            //当前页
            presentPage: async function(a){
                this.rendering(a,this.pageLimitD)
            },
            //搜索功能
            searchFun:async function () {
                this.rendering(1,this.pageLimitD)
            },
            //品牌远程搜索
            async brandMethod(query) {
                if(query!=''){
                    const res = await brand_multi_fuzzy_search({where:query});
                    if(res.state_code=='ok'){
                        this.brandOptions = res.results;
                    }else{
                        this.$message.error(res.err_message);
                    }
                }
            },
            //失效---生效
            async efficacyClick(id){
                var self = this;
                this.$confirm('您确认要改变该状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await model_state_change({rid:id});
                    if(res.state_code=='ok'){
                        self.rendering(self.presentPageD,self.pageLimitD);
                        self.$message({
                            type: 'success',
                            message: '改变状态成功!'
                        });
                    }else{
                        this.$message.error(res.err_message);
                    }
                })

            },
            //编辑
            compileClick(id){
                this.$router.push(`/manage/basics/addCar/${id}`)
            },

            goAddCar:function () {
                this.$router.push('basics/addCar/all')
            },
            goAddBrand:function () {
                this.$router.push('basics/brand')
            }
        }
    }
</script>

<style lang="less" scoped>
    .basics-top{
        height: 48px;
        line-height: 48px;
        padding-left:20px;
    }
    .basics-top>span{
        display: inline-block;
        width:60px;
        font-size:16px;
        text-align: center;
    }
    .basics-top>span.active{
        border-bottom:2px solid #ff901d;
    }
    .section{
        padding:30px;
        padding-top:15px;
        padding-bottom:0;
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
        display: flex;
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
</style>
