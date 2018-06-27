<template>
    <div class="container DN">
        <div class="header">
            单据管理 / <span>入库明细：</span><span>{{resultOfOrder.name}}</span>
        </div>
        <div class="box">
            <div class="row">
                <div class="info">
                    <p class="infoKeyWord">入库仓库</p>：<p class="infoValue">{{resultOfOrder.house_name}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">入库时间</p>：<p class="infoValue">{{resultOfOrder.incoming_time}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">供应商</p>：<p class="infoValue">{{resultOfOrder.supplier_name}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">操作员</p>：<p class="infoValue">{{resultOfOrder.incoming_name}}</p>
                </div>
            </div>
            <p class="title">入库配件</p>
            <div class="row">
                <div class="info">
                    <p class="infoKeyWord">配件编号</p>：<p class="infoValue">{{resultOfOrder.parts_code}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">配件名称</p>：<p class="infoValue">{{resultOfOrder.parts_name}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">OE号</p>：<p class="infoValue">{{resultOfOrder.parts_oe}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">参考售价</p>：<p class="infoValue">{{resultOfOrder.purchase_price}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">入库数量</p>：<p class="infoValue">{{resultOfOrder.sku}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">入库单价</p>：<p class="infoValue">{{resultOfOrder.price}}</p>
                </div>
                <div class="info">
                    <p class="infoKeyWord">金额</p>：<p class="infoValue">{{resultOfOrder.sku * resultOfOrder.price}}</p>
                </div>
            </div>
            <div class="btnRow">
                <el-button type="warning" @click="$router.replace('/manage/orders/parts')">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {getStockInDetail} from '@/api/getData';
export default {
    data() {
        return {
            detailId:'',
            resultOfOrder:'',
        }
    },
    async mounted () {
        this.$emit('changeActive','parts');
        this.detailId = this.$route.query.id;
        let resultOfOrders = await getStockInDetail({rid:this.detailId,timestamp:new Date().getTime()});
        if(resultOfOrders.state_code === 'error') {
            this.$message.error(this.resultOfOrders.err_message);
        }else if(resultOfOrders.results.length === 0) {
            this.$message("未查找到任何数据");
        }else{
            this.resultOfOrder = resultOfOrders.results[0];
        }
        console.log(this.resultOfOrder);
    }
}
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.container{
    width:100%;
    font-size:14px;
    color:#3c3c3c;
}
.header{
    background: #f8f8f8;
    height: 59px;
    line-height:59px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.header>span{
    color:#ff901e;
}

.box{
    padding:0 30px;
}
.row{
    display:flex;
    flex-wrap: wrap;
    width:100%;
    padding:0 30px;
    margin-bottom:20px;
    border-bottom: 1px solid #e4e7ed;
}
.row>.info{
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width:50%;
    margin-bottom:20px;
}
.row>.info>.infoKeyWord{
    width:20%;
    text-align:right;
}
.row>.info>.infoValue{
    flex:1;
    padding-left:20px;
}
.title{
    font-size:16px;
    font-weight: bold;
    margin-bottom:20px;
}
.btnRow{
    width: 100%;
    margin:0 0 40px;
    display: flex;
    justify-content: center;
}
.btnRow>.el-button{
    width:100px;
    height:30px;
    line-height: 30px;
    font-size:12px;
}
</style>
