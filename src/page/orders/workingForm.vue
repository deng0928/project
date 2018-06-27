<template>
    <div class="detailBox">
        <!-- 单据项目表头 -->
        <el-row class="titleOfForm">
            <el-col class="infoOfTitle" :span="5">客户信息</el-col>
            <el-col class="infoOfTitle" :span="6">车辆信息</el-col>
            <el-col class="infoOfTitle" :span="3">金额</el-col>
            <el-col class="infoOfTitle" :span="4">付款方式</el-col>
            <el-col class="infoOfTitle" :span="6">操作</el-col>
        </el-row>

        <!-- 循环渲染每条单据 -->
        <div class="itemOfForm" v-for="(item,index) in resultOfOrders.results" :key="index">
            <p class="titleOfItem">
                {{item.create_date}}
                <span>{{item.name}}</span>
                <span>{{item.order_type}}</span>
                <span :style="{'color':item.state==='待施工'?'#e11717':(item.state==='施工中'?'#268bdb':(item.state==='待收银'?'#1cc2b1':'#3c3c3c'))}">{{item.state}}</span>
            </p>
            <el-row class="infoOfItem">
                <el-col class="customerInfo" :span="5">
                    <p>客户姓名：<span>{{item.contacts}}</span></p>
                    <p>客户电话：<span>{{item.contacts_phone}}</span></p>
                </el-col>
                <el-col class="carInfo" :span="6">
                    <p>车型：<span>{{item.customer_car}}</span></p>
                    <p>车牌：<span>{{item.plate_number}}</span></p>
                    <p>车架号：<span>{{item.vin}}</span></p>
                </el-col>
                <el-col class="costInfo" :span="3">¥<span>{{item.total_amount_payable}}</span></el-col>
                <el-col class="paymentInfo" :span="4">{{item.payment_method?item.payment_method:'暂无'}}</el-col>
                <el-col class="controlInfo" :span="6">
                    <template v-if="item.state==='待施工'">
                        <div class="DN">
                            <el-button @click="deleteItem(item.id)">删除</el-button>
                            <el-button type="warning" @click="changeState(item.id,'施工中')">施工</el-button>
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/edit_order',query:{id:item.id}})">编辑</el-button>
                        </div>
                    </template>
                    <template v-else-if="item.state==='施工中'">
                        <div class="DN">
                            <el-button @click="deleteItem(item.id)">删除</el-button>
                            <el-button type="warning" @click="changeState(item.id,'待收银')">施工完成</el-button>
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/edit_order',query:{id:item.id}})">编辑</el-button>
                        </div>
                    </template>
                    <template v-else-if="item.state==='待收银'">
                        <div class="DN">
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/working_detail',query:{id:item.id}})">详情</el-button>
                            <el-button type="warning" v-if="getJurisdiction('5001')" @click="payOrder(item.id)">收银</el-button>
                            <el-button type="warning" @click="backState(item.id)">返施工</el-button>
                        </div>
                    </template>
                    <template v-else-if="item.state==='已完成'">
                        <div class="DN">
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/working_detail',query:{id:item.id}})">详情</el-button>
                        </div>
                    </template>
                </el-col>
            </el-row>
        </div>

        <!-- 分页 -->
        <div class="pages">
            <el-pagination class="pageControler"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 40, 60]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultOfOrders.count">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {construction,backConstruction,deleteOrder,orderPay} from '@/api/getData';
export default {
    props:['resultOfOrders'],
    methods: {
        //点击改变单据状态
        changeState(id,state) {
            async function getState() {
                return await construction({rid:id,state:state});
            }
            getState().then(res => {
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                }else if(res.state_code === 'ok'){
                    this.$message({message: '操作成功',type: 'success'});
                    this.$emit('getOrders');
                }
            })
        },
        //返施工
        backState(id) {
            async function getState() {
                return await backConstruction({rid:id});
            }
            getState().then(res => {
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                } if(res.state_code === 'ok'){
                    this.$message({message: '操作成功',type: 'success'});
                    this.$emit('getOrders');
                }
            })
        },
        //删除单据
        deleteItem(id) {
            async function getState() {
                return await deleteOrder({rid:id});
            }
            getState().then(res => {
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                } if(res.state_code === 'ok'){
                    this.$message({message: '删除成功',type: 'success'});
                    this.$emit('getOrders');
                }
            })
        },

        //点击收银
        payOrder(id){
            async function createPayorder() {
                return await orderPay({rid:id});
            }
            createPayorder().then(res => {
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                } if(res.state_code === 'ok'){
                    this.$router.push({
                        path:'/manage/orders/settlement',
                        query:{
                            id:res.results[0].relevant_documents_id,
                            rmodel:'dn.maintenance.order',
                            from:'working'
                        }
                    })
                }
            })
        },

        //分页事件
        handleSizeChange(val) {
            this.$emit('changePageSize',val)
        },
        handleCurrentChange(val) {
            this.$emit('getOrders',val)
        }
    },
    data() {
        return {
            currentPage: 1,
        };
    }
}
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}

.detailBox{
    width:100%;
}
.titleOfForm {
    margin:0 0 10px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoOfTitle {
    text-align: center;
}

.itemOfForm{
    margin:0;
    padding:0;
    border:1px solid #e4e7ed;
}
.itemOfForm>.titleOfItem{
    width:100%;
    padding:15px 20px;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.itemOfForm>.titleOfItem>span{
    margin-left:20px;
}
.itemOfForm>.titleOfItem>span:last-child{
    float:right;
}
.itemOfForm .el-col{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100px;
    border-right: 1px solid #e4e7ed;
    padding:20px;
    overflow: hidden;
    &:last-child {
        border-right:none;
    }
}
.itemOfForm .costInfo,.itemOfForm .paymentInfo{
    flex-direction:row;
    justify-content:center;
    align-items: center;
}
.itemOfForm .controlInfo{
    flex-direction:row;
    justify-content:flex-end;
    align-items: center;
}

.pages{
    width:100%;
    padding:26px;
    overflow:hidden;
}
.pages>.pageControler{
    float:right;
}
</style>
