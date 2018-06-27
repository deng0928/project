<template>
    <div class="detailBox">
        <!-- 单据项目表头 -->
        <el-row class="titleOfForm">
            <el-col class="infoOfTitle" :span="5">联系人信息</el-col>
            <el-col class="infoOfTitle" :span="6">车辆信息</el-col>
            <el-col class="infoOfTitle" :span="4">金额</el-col>
            <el-col class="infoOfTitle" :span="6">付款方式</el-col>
            <el-col class="infoOfTitle" :span="3">操作</el-col>
        </el-row>

        <!-- 循环渲染每条单据 -->
        <div class="itemOfForm" v-for="(item,index) in resultOfOrders.results" :key="index">
            <p class="titleOfItem">{{item.cashier_no}} <span>创建时间：{{item.create_date}}</span><span>收银时间：{{item.receiving_time?item.receiving_time:"暂无"}}</span><span>业务类型：{{item.order_type}}</span><span :style="{'color':item.state==='待收款'?'#1cc2b1':'#3c3c3c'}">{{item.state}}</span></p>
            <el-row class="infoOfItem">
                <el-col class="customerInfo" :span="5">
                    <p>联系人：<span>{{item.partner_name}}</span></p>
                    <p>联系电话：<span>{{item.partner_phone}}</span></p>
                </el-col>
                <el-col class="carInfo" :span="6">
                    <p>车牌：<span>{{item.plate_number}}</span></p>
                    <p>车架号：<span>{{item.vin}}</span></p>
                </el-col>
                <el-col class="costInfo" :span="4">¥<span>{{item.total_amount_payable}}</span></el-col>
                <el-col class="paymentInfo" :span="6">{{item.payment_method?item.payment_method:'暂无'}}</el-col>
                <el-col class="controlInfo" :span="3">
                    <template v-if="item.state==='待收款'">
                        <div class="DN">
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/settlement',query:{id:item.id,from:'cashier'}})">收银</el-button>
                        </div>
                    </template>
                    <template v-else-if="item.state==='已收款'">
                        <div class="DN">
                            <el-button type="warning" @click="$router.push({path:'/manage/orders/detail_of_order',query:{id:item.id,from:'cashier'}})">详情</el-button>
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
export default {
    props:['resultOfOrders'],
    methods: {
        //分页事件
        handleSizeChange(val) {
            this.$emit('changePageSize',val)
        },
        handleCurrentChange(val) {
            this.$emit('getOrders',val)
        },
    },
    data() {
        return {
            items:[{
                date:new Date(),
                number:123,
                type:'维修工单',
                state:'待施工'
            },{
                date:new Date(),
                number:123,
                type:'维修工单',
                state:'施工中'
            },{
                date:new Date(),
                number:123,
                type:'维修工单',
                state:'待收银'
            },{
                date:new Date(),
                number:123,
                type:'维修工单',
                state:'已完成'
            }],
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
    margin:0 0 26px 0 !important;
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
