<template>
    <div class="setStorage DN" v-loading="loading">
        <div class="setStorageHeader">
            <div class="forPosition">
                <el-button type="primary" size="small" @click="addStorageWindow = true" >新增仓库</el-button>
                <div class="add-alert" v-if="addStorageWindow">
                    <el-input style="width:100%" placeholder="新增仓库的名称" v-model="newName"></el-input>
                    <div class="cancel">
                        <el-button @click="addStorageWindow = false;newName=''">取消</el-button>
                        <el-button type="warning" class="compile-button" @click="addConfirm">确定</el-button>
                    </div>
                </div>
            </div>
            <el-button type="primary" size="small" @click="openSupplier()">供应商管理</el-button>
        </div>
        <div class="setStorageBox">
            <el-row class="titleOfForm">
                <el-col class="infoOfTitle" :span="8">仓库名称</el-col>
                <el-col class="infoOfTitle" :span="8">创建时间</el-col>
                <el-col class="infoOfTitle" :span="8">操作</el-col>
            </el-row>
            <template v-for="(item,index) in storages">
                <el-row class="infoOfItem" type="flex" align="middle" :key="item.id">
                    <el-col :span="8">{{item.name}}</el-col>
                    <el-col :span="8">{{item.create_date}}</el-col>
                    <el-col :span="8">
                        <el-button @click="deleteStock(item.id)">删除</el-button>
                        <el-button type="warning" @click="changeName(index)">改名</el-button>
                    </el-col>
                </el-row>
                <el-row class="changeNameItem" v-if="index === changeNameIndex">
                    <el-col :span="8">
                        <el-input style="width:300px;left:50%;margin-left:-150px;" v-model="reName"></el-input>
                        <p class="changeNameBtn">
                            <span @click="modifyStorage(item)">保存</span>|<span @click="cancleModify()">取消</span>
                        </p>
                        <p class="errorMessage" v-if="item.error">{{item.error}}</p>
                    </el-col>
                </el-row>
            </template>
        </div>
         <!-- 分页 -->
        <div class="pages">
            <el-pagination class="pageControler"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageconfig.offset"
                :page-sizes="[10, 20, 40, 60]"
                :page-size="pageconfig.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count_storage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {getStockHouse,createStockHouse,modifyStockHouse,deleteStockHouse} from '@/api/getData';
export default {
    methods:{
        //供应商弹窗
        openSupplier() {
            this.$emit('openSupplier');
        },

        changeName(index) {
            if(this.changeNameIndex != index){
                this.reName = ''
            }
            this.changeNameIndex = index;
        },

        // 添加仓库confirm
        async addConfirm(){
            this.loading = true;
            const res = await createStockHouse({
                name:this.newName
            })
            if(res.state_code == 'ok'){
                this.loading = false;
                this.addStorageWindow = false;
                this.newName = '';
                this.getStorage();
                this.$message({
                    type:'success',
                    message:"添加成功"
                })
            }else{
                this.loading = false;
                this.addStorageWindow = false;
                this.newName = '';
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        },

        // 删除仓库
        deleteStock(id){
            this.$confirm('确认删除？')
                .then(async () => {
                    this.loading = true;
                    const res = await deleteStockHouse({rid:id})
                    if(res.state_code == 'ok'){
                        this.loading = false;
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                        this.getStorage()
                    }else{
                        this.loading = false;
                        this.$message({
                            type:'error',
                            message:res.err_message
                        })
                    }
                })
                .catch(_ => {});
        },

        //修改仓库
        async modifyStorage(e){
            this.loading = true;
            const res = await modifyStockHouse({
                rid:e.id,
                name:this.reName
            })
            if(res.state_code == 'ok'){
                this.loading = false;
                this.$message({
                    type:'success',
                    message:'修改成功'
                })
                this.changeNameIndex = -1;
                this.getStorage()
            }else{
                this.loading = false;
                e.error = res.err_message
            }
        },
        // 取消修改
        cancleModify(){
            this.changeNameIndex = -1;
            this.reName = ''
        },

        //分页事件
        handleSizeChange(val) {
            this.pageconfig.limit = val
            this.getStorage()
        },
        handleCurrentChange(val) {
            this.pageconfig.offset = val
            this.getStorage()
        },

        // 获取仓库列表
        async getStorage(){
            this.loading = true;
            this.pageconfig.timestamp = new Date().getTime();
            const res = await getStockHouse(this.pageconfig);
            if(res.state_code =='ok'){
                this.loading = false;
                this.count_storage = res.count;
                this.storages = res.results;
            }else{
                this.loading = false;
                this.$message({
                    type:"error",
                    message:res.err_message
                })
            }
        }
    },
    data: function () {
        return {
            loading: false,
            //新增仓库
            addStorageWindow: false,
            storages: [],
            reName:'',
            newName: '',
            //分页
            pageconfig: {
                offset: 1,
                limit: 10,
            },
            count_storage: 0,
            changeNameIndex: -1,
        }
    },
    mounted(){
        this.getStorage()
    }
}
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.compile-button{
    background: #ff861f;
    color:#fff
}
.setStorage{
    width:100%;
    font-size:14px;
    color:#333;
}
.setStorageHeader{
    background: #f8f8f8;
    height: 59px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom:26px;
}
.forPosition{
    display:inline-block;
    position:relative;
    margin-right:12px;
}
.add-alert{
    position: absolute;
    width: 262px;
    background: #fff;
    left: 115%;
    top: -40%;
    border: 1px solid #eee;
    box-shadow: 1px 1px 1px #eee;
    padding: 20px 15px 15px 20px;
    z-index: 1000;
}
.add-alert>p{
    padding:8px 0;
    color:#e41618;
}
.add-alert .cancel{
    text-align: right;
    padding:15px 0;
    padding-bottom:10px;
}
.add-alert::before{
    content: '';
    display: block;
    position: absolute;
    left: -6px;
    top: 15%;
    z-index: 1000;
    width: 10px;
    height: 10px;
    border-left: 1px solid #eee;
    border-bottom: 1px solid #eee;
    transform: rotate(45deg);
    background: #fff;
}

.setStorageBox{
    padding:30px;
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
.infoOfItem,.changeNameItem{
    text-align: center;
    padding-bottom:20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
}
.changeNameItem{
    text-align: left;
}
.changeNameItem .changeNameBtn{
    font-size:14px;
    margin:10px 0;
    width:100%;
    text-align: center;

}
.changeNameItem .changeNameBtn>span{
    color:darkgoldenrod;
    cursor: pointer;
    margin:0 10px;
}
.changeNameItem .errorMessage{
    color:#e41618;
    font-size:14px;
    text-align: center;
}

.pages{
    width:100%;
    padding:26px;
    overflow:hidden;
    box-sizing: border-box;
}
.pages>.pageControler{
    float:right;
}
</style>
