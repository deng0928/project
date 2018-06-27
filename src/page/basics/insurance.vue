<template>
    <div class="ins_box DN" v-loading="loading">
        <div class="client-header-box">
            <div>
                <el-button v-if="getJurisdiction('1001')" type="primary" size="small" @click="dialogFormVisible=true">新增保险公司</el-button>
            </div>
            <div class="client-search-box">
                <el-input
                    clearable
                    placeholder="请输入保险公司名称"
                    v-model.where="pageConfig.where"
                    prefix-icon="el-icon-search"
                    size="small"
                    @input = 'handleText'
                    @keyup.enter.native="searchFun"
                >
                </el-input>
                <el-button class="btn_yl" @click="searchFun" size="small" style="margin-left:10px">搜索</el-button>
            </div>
        </div>
        <div style="padding:20px">
            <el-table :data="dataList" tooltip-effect="dark">
                <el-table-column
                    label="公司名">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建日期">
                    <template slot-scope="scope">
                        {{scope.row.create_date}}
                    </template>
                </el-table-column>
                <el-table-column v-if="getJurisdiction('1001')" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleDel(scope.row.id)">删除</el-button>
                        <el-button type="primary" size="small" @click="handleMod(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div class="clent-page-box" style="float: right;padding:20px">
            <el-pagination
                @current-change="handleChange($event,'offset')"
                @size-change="handleChange($event,'limit')"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageConfig.limit"
                :current-page="pageConfig.offset"
                layout="total, sizes, prev, pager, next"
                :total="count">
            </el-pagination>
        </div>

        <el-dialog title="新增保险公司" :visible.sync="dialogFormVisible" width="25%" @close="closeDialog1">
            <el-input v-model="newName" placeholder="请输入保险公司名称" size="small"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false;newName = ''" size="small">取 消</el-button>
                <el-button type="primary" @click="addItem" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改保险公司名称" :visible.sync="dialogModVisible" width="25%" @close="closeDialog2">
            <el-input v-model="reName.name" placeholder="请输入保险公司名称" size="small"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogModVisible = false;reName.name = ''" size="small">取 消</el-button>
                <el-button type="primary" @click="modItem" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getInsurance,addInsurance,delInsurance,modInsurance} from "@/api/getData";

export default {
    data(){
        return{
            dialogFormVisible:false,
            dialogModVisible:false,
            newName:'',
            reName:{
                name:'',
                id:''
            },
            dataList:[],
            loading:false,
            pageConfig:{
                limit:10,
                offset:1,
                where:''
            },
            count:0,
        }
    },
    methods:{
        handleText(){
            if(this.pageConfig.where == ''){
                this.getList()
            }
        },
        handleChange(val,type){
            if(type == 'limit'){
                this.pageConfig.limit = val;
                this.getList()
            }else{
                this.pageConfig.offset = val;
                this.getList()
            }
        },
        closeDialog1(){
            this.newName = ''
        },
        closeDialog2(){
            this.reName = ''
        },
        async getList(){
            this.loading = true
            this.pageConfig.timestamp = new Date().getTime()
            const res = await getInsurance(this.pageConfig)
            if(res.state_code == 'ok'){
                this.loading =  false ;
                this.count = res.count
                this.dataList = res.results
            }else{
                this.loading =  false ;
                this.$message.error(res.err_message)
            }
        },
        async addItem(){
            this.loading = true
            const res = await addInsurance({name:this.newName})
            if(res.state_code == 'ok'){
                this.loading =  false ;
                this.newName = '';
                this.dialogFormVisible = false;
                this.$message.success('新增成功')
                this.getList()
            }else{
                this.loading =  false ;
                this.$message.error(res.err_message)
            }
        },

        // 搜索
        async searchFun(){
            this.getList()
        },


        async delItem(id){
            const res = await delInsurance({rid:id})
            if(res.state_code == 'ok'){
                this.loading =  false ;
                this.getList()
                this.$message.success('删除成功')
            }else{
                this.$message.error(res.err_message)
            }
        },
        handleDel(id){
          this.$confirm('确认删除？')
              .then( () =>{
                this.delItem(id);
                })
              .catch(_ => {
              });
        },

        // 修改
        handleMod(item){
            console.log(item)
            this.dialogModVisible = true;
            this.reName.id = item.id;
            this.reName.name= item.name
        },

        async modItem(){
            this.loading = true;
            const res = await modInsurance({
                name:this.reName.name,
                rid:this.reName.id
            })
            if(res.state_code ==  'ok'){
                this.reName = '';
                this.loading = false;
                this.dialogModVisible = false;
                this.getList();
                this.$message.success('修改成功')
            }else{
                this.loading = false;
                this.$message.error(res.err_message)
            }
        }
    },
    mounted(){
        this.getList()
    }
}
</script>

<style scoped>
    .client-header-box{
        background: #f8f8f8;
        height: 59px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -ms-flex-align: center;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }
    .client-search-box {
        display: inline-flex;
        justify-content: center;
    }
</style>
