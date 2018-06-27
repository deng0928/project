<template>
    <div class="fillcontain client-box" v-loading.fullscreen.lock="fullscreenLoading">
        <div class=" client-header-box DN">
            <div>
                <el-button v-if="getJurisdiction('2001')" type="primary" @click="$router.push('/manage/client_main/addClient/undefined')" size="small">添加客户</el-button>
            </div>
            <div class="client-search-box">
                <div style="padding-right:.5rem;">
                    <div class="DN" style="padding-top:1px;display: flex">
                        <el-select v-model="selectActive" style="width:100px;margin-right:10px;" size="small">
                            <el-option label="有效" value="true">有效</el-option>
                            <el-option label="失效" value="false">失效</el-option>
                        </el-select>
                        <el-input
                            style="width:250px"
                            clearable
                            placeholder="客户姓名,手机,车牌,车架号"
                            v-model.trim="searchBoxValue"
                            prefix-icon="el-icon-search"
                            size="small"
                            @keyup.enter.native="searchFun"
                        >
                        </el-input>
                    </div>
                </div>
                <el-button @click="searchFun" size="small" class="btn_yl">搜索</el-button>
            </div>
        </div>
        <div class="client-user-list" >
            <div class="DN">
                <el-table
                    :data="clientList"
                    :max-height="fullHeight-170"
                    style="width: 100%"
                    ref="bindItemId"
                    @row-click="openDetails">
                    <el-table-column
                        prop="name"
                        label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="mobile_phone;phone,id"
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
                    <el-table-column
                        prop="customer_car_ids"
                        label="车辆">
                        <template slot-scope="scope">
                            <ul>
                                <li v-for="item in scope.row.customer_car_ids">
                                    {{item.series_id_name}} {{item.plate_number}} {{item.vin}}
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button class="efficacy-button"
                                       v-if="getJurisdiction('2001')"
                                       size="mini"
                                       @click.stop="efficacyClick(scope.row.id)"
                            >
                                {{scope.row.active?'失效':'生效'}}
                            </el-button>
                            <!--<el-button class="compile-button"-->
                                       <!--size="mini"-->
                                       <!--@click.stop="compileClick(scope.row.id)"-->
                            <!--&gt;编辑-->
                            <!--</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--分页显示-->
            <div class="clent-page-box">
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
        </div>
    </div>
</template>

<script>
    import {partner,partnerdel} from '@/api/getData'
    export default {
        data() {
            return {
                fullscreenLoading:false,
                selectActive:'true',
                itemId:'22',//当前客户id
                searchBoxValue:'',//搜索框内容
                pageLimitD:20,//当前显示多少页
                presentPageD:1,//页数
                fullHeight: document.documentElement.clientHeight,
                clientList:[], //客户列表
                totality:0
            }
        },
        //页面渲染时加载数据
        async mounted(){
            this.fullscreenLoading = true;
            const data = {
                where:this.searchBoxValue,
                offset:this.presentPageD,
                limit:this.pageLimitD,
                active:this.selectActive,
               timestamp:new Date().getTime()
            };
            const res = await partner(data);
            if(res.state_code=='ok'){
                this.fullscreenLoading = false
                this.totality = res.count;
                this.clientList = res.results;
            }else{
                this.$message.error(res.err_message);
            }

        },

        methods:{
            //点击当前行传递id
            openDetails(row) {
                this.$router.push('/manage/client_main/clientDetail/'+row.id)
            },
            //搜索功能
            searchFun:async function () {
                this.presentPageD = 1;
                const data = {
                    where:this.searchBoxValue,offset:1,limit:this.pageLimitD,active:this.selectActive,timestamp:new Date().getTime()
                };
                const res = await partner(data);
                if(res.state_code=='ok'){
                    this.totality = res.count;
                    this.clientList = res.results;
                }else{
                    this.$message.error(res.err_message);
                }

            },
            //每页多少条
            pageLimit: async function (a) {
                this.pageLimitD = a;
                const data = {
                    where:this.searchBoxValue,offset:this.presentPageD,limit:a,active:this.selectActive,timestamp:new Date().getTime()
                };
                const res = await partner(data);
                if(res.state_code=='ok'){
                    this.clientList = res.results;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //当前页
            presentPage: async function(a){
                this.presentPageD = a;
                const data = {
                    where:this.searchBoxValue,offset:a,limit:this.pageLimitD,active:this.selectActive,timestamp:new Date().getTime()
                };
                const res = await partner(data);
                this.clientList = res.results;
            },
            //失效
            efficacyClick:  function (id) {//点击失效删除
                this.$confirm('您确认要改变该状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const res = await partnerdel({rid:id});
                    if(res.state_code=='ok'){
                        const data = {
                            where:this.searchBoxValue,offset:this.presentPageD,limit:this.pageLimitD,timestamp:new Date().getTime(), active:this.selectActive,
                        };
                        const resa = await partner(data);
                        if(resa.state_code=='ok'){
                            this.totality = resa.count;
                            this.clientList = resa.results;
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                        }else{
                            this.$message.error(resa.err_message);
                        }
                    }else{
                        this.$message.error(res.err_message);
                    }
                })
            },
//            //编辑
//            compileClick: function (id) {
//                this.$router.push(`/manage/client_main/addClient/${id}`)
//            },
        }
    }
</script>

<style lang="less"d scoped>

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


    .client-user-list{
        padding:20px;
        box-sizing:border-box;
        padding-bottom:0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .clent-page-box {
        padding-right: 40px;
        padding-top: 15px;
        text-align: right;
    }
    .efficacy-button {
        color: #ff801d;
        border-color: #ff801d
    }
    .compile-button {
        background: #ff861f;
        color: #fff
    }
    .compile-button:hover{
        background: #ebb563 ;
        border-color:#ebb563 ;
    }
</style>
