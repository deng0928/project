<template>
    <div class="partsManage DN">
        <div class="partsManageHeader">
            <el-button type="primary" size="small" @click="$router.push('/manage/storage/stock')">采购入库</el-button>

            <div class="searchBlock">
                <el-select v-model="value" placeholder="请选择" style="width: 110px" size="small">
                    <el-option
                        v-for="item in states"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input class="searchForm"
                    placeholder="请输入配件名称，别名，OE号"
                    prefix-icon="el-icon-search"
                    v-model.trim="where"
                    @keyup.enter.native="getParts(value,where)"
                    size="small"
                    clearable
                >
                </el-input>
                <el-button class="btn_yl" @click="getParts(value,where)" size="small">搜索</el-button>
            </div>
        </div>
        <div class="partsManageBox">
            <p class="title">库存详情</p>
            <el-row class="titleOfForm">
                <el-col class="infoOfTitle" :span="3">编码</el-col>
                <el-col class="infoOfTitle" :span="4">名称</el-col>
                <el-col class="infoOfTitle" :span="3">OE号</el-col>
                <el-col class="infoOfTitle" :span="3">库存</el-col>
                <el-col class="infoOfTitle" :span="3">参考售价</el-col>
                <el-col class="infoOfTitle" :span="3">状态</el-col>
                <el-col class="infoOfTitle" :span="5">操作</el-col>
            </el-row>
            <el-row class="infoOfItem" type="flex" align="middle" v-for="item in parts" :key="item.id">
                <el-col :span="3">{{item.code}}</el-col>
                <el-col :span="4">{{item.name}}</el-col>
                <el-col :span="3">{{item.oe}}</el-col>
                <el-col :span="3">{{item.sku}}</el-col>
                <el-col :span="3">¥{{item.price}}</el-col>
                <el-col :span="3">{{item.active?'有效':'无效'}}</el-col>
                <el-col :span="5">
                    <el-button type="primary" size="small" @click="openStorage(item.id)" v-if="item.active">入库</el-button>
                    <el-button type="primary" size="small" @click="openEdit(item.id)">编辑</el-button>
                    <el-button type="primary" size="small" @click="openDetail(item)">库存详情</el-button>
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
                :page-size="pageconfig.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageconfig.count">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import{fetchPartsList,searchPart} from '@/api/getData'
export default {
    data() {
        return {
            //搜索
            states: [{
                value: 'all',
                label: '全部状态'
            }, {
                value: '1',
                label: '有效'
            },{
                value: '0',
                label: '失效'
            }],
            pageconfig:{
                offset:1,
                limit:10,
                count:0
            },
            value: '1',
            where:'',

            //配件
            parts: [],

            //分页
            currentPage:1,
        }
    },
    methods: {
        openDetail(number) {
            this.$emit('openDetail',number);
        },
        openEdit(number) {
            this.$emit('openEdit',number);
        },
        openStorage(number) {
            this.$emit('openStorage',number);
        },
        // 获取配件库存列表
        async getParts(val,where){
            this.loading = true;
            this.pageconfig.timestamp = new Date().getTime();
            const res = await searchPart({
                active:val,
                where:where,
                offset:this.pageconfig.offset,
                limit:this.pageconfig.limit,
                timestamp:this.pageconfig.timestamp
            });
            console.log(res.results)
            if(res.state_code =='ok'){
                this.loading = false;
                this.pageconfig.count = res.count;
                this.parts = res.results;
            }else{
                this.loading = false;
                this.$message({
                    type:"error",
                    message:res.err_message
                })
            }
        },

        //分页事件
        handleSizeChange(val) {
            this.pageconfig.limit = val
            this.getParts()
        },
        handleCurrentChange(val) {
            this.pageconfig.offset = val
            this.getParts()
        }
    },
    mounted(){
        this.getParts(this.value,this.where)
    }
}
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.partsManage{
    width:100%;
    font-size:14px;
    color:#333;
}
.partsManageHeader{
    background: #f8f8f8;
    height: 59px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.partsManageHeader>.searchBlock{
    display: flex;
    align-items: center;
}
.partsManageHeader>.searchBlock .searchForm{
    width:300px;
    margin:0 20px;
}

.partsManageBox{
    padding:0 30px;
}
.title{
    font-size:16px;
    margin-bottom:20px;
}
.titleOfForm {
    width:100%;
    margin:0 0 26px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoOfTitle {
    text-align: center;
}
.infoOfItem{
    text-align: center;
    padding-bottom:20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
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
