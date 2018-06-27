<template>
    <div class="basics-box DN">
        <div class="basics-top">
            <span @click="switchActive('parts_manage')" :class="{'active':active==='/manage/storage/parts_manage'}">配件管理</span>
            <span @click="switchActive('set_storage')" :class="{'active':active==='/manage/storage/set_storage'}">仓库设置</span>
        </div>
        <router-view
            v-on:openDetail="openDetail($event)"
            v-on:openEdit="openEdit($event)"
            v-on:openStorage="openStorage($event)"
            v-on:openSupplier="openSupplier()"
            ref='tpl'
        >
        </router-view>

        <!-- 仓库详情弹出层 -->
        <div class="theDetailWindow" v-if="detailWindow">
            <div class="detailBox">
                <p class="notice"><span>库存详情</span><span class="close" @click="closeDetail()">&times;</span></p>
                <p class="info">配件编码：<span>{{details.code}}</span>名称：<span>{{details.name}}</span>OE号：<span>{{details.oe}}</span></p>
                <el-row class="titleOfForm">
                    <el-col class="infoOfTitle" :span="5">仓库</el-col>
                    <el-col class="infoOfTitle" :span="5">批次</el-col>
                    <el-col class="infoOfTitle" :span="5">库存</el-col>
                    <el-col class="infoOfTitle" :span="5">供应商</el-col>
                    <el-col class="infoOfTitle" :span="4">操作</el-col>
                </el-row>
                <div class="infoBox">
                    <el-row class="infoOfItem" type="flex" align="middle" v-for="(item,index) in details.list" :key="index">
                        <el-col :span="5">{{item.house_name}}</el-col>
                        <el-col :span="5">{{item.batch}}</el-col>
                        <el-col :span="5">
                            <span style="width:100% !important;display: inline-block;box-sizing: border-box;" v-if="index != changeStorage">{{item.sku}}</span>
                            <el-input-number v-else v-model="item.sku" controls-position="right" size="small" style="width: 80%" :min="0"></el-input-number>
                        </el-col>
                        <el-col :span="5">{{item.supplier_name}}</el-col>
                        <el-col :span="4">
                            <el-button type="warning" v-if="index != changeStorage" @click="changeStorageBtn(index)">调整</el-button>
                            <el-button type="warning" v-else @click="confirmStorageBtn(item)">确定</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>

        <!-- 编辑弹出层 -->
        <div class="theEditWindow" v-if="editWindow">
            <div class="editBox">
                <p class="notice"><span>新增/编辑配件</span><span class="close" @click="closeEdit()">&times;</span></p>
                <section class="section">
                    <el-form :model="editPartForm" :rules="editRules" ref="editPartForm" label-width="100px">
                        <el-form-item label="配件编码" prop="code" size="small">
                            <el-input v-model="editPartForm.code" placeholder="2-20个罗马字符或英文字符"></el-input>
                        </el-form-item>
                        <el-form-item label="配件名称" prop="name" size="small">
                            <el-input v-model="editPartForm.name" placeholder="2-30个汉字"></el-input>
                        </el-form-item>
                        <el-form-item label="别名" prop="alias" size="small">
                            <el-input v-model="editPartForm.alias" placeholder="用于快速搜索"></el-input>
                        </el-form-item>
                        <el-form-item label="参考售价" prop="price" size="small">
                            <el-input placeholder="请填写参考销售价格" v-model="editPartForm.price">
                                <template slot="prepend">¥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="OE号" prop="oe" size="small">
                            <el-input v-model="editPartForm.oe" placeholder="2-20个罗马字符或英文字符"></el-input>
                        </el-form-item>
                        <el-form-item label="配件品质" prop="quality" size="small">
                            <el-select v-model="editPartForm.quality" placeholder="请选择配件品质">
                                <!-- 这里需要调类型数据来循环渲染 -->
                                <el-option label="原厂" value="原厂"></el-option>
                                <el-option label="品牌" value="品牌"></el-option>
                                <el-option label="改包" value="改包"></el-option>
                                <el-option label="拆车" value="拆车"></el-option>
                                <el-option label="高仿" value="高仿"></el-option>
                                <el-option label="副厂" value="副厂"></el-option>
                                <el-option label="专业厂" value="专业厂"></el-option>
                                <el-option label="下线" value="下线"></el-option>
                                <el-option label="国产" value="国产"></el-option>
                                <el-option label="台湾" value="台湾"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库存提醒" size="small">
                            <el-input-number v-model="editPartForm.stock_warn" :min="0" controls-position="right"></el-input-number>
                        </el-form-item>
                        <el-form-item label="是否生效" size="small">
                            <el-switch v-model="editPartForm.active" style="margin-top:5px;"></el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button plain @click="closeEdit()">取消</el-button>
                            <el-button type="warning" @click="confirmModify(editPartForm)">确定</el-button>
                        </el-form-item>
                    </el-form>
                </section>
            </div>
        </div>

        <!-- 入库弹出层 -->
        <div class="theStorageWindow" v-if="storageWindow">
            <div class="storageBox">
                <p class="notice">
                    <span>配件入库</span>
                    <span class="close" @click="closeStorage()">&times;</span>
                </p>
                <section class="section">
                    <el-form :model="storageForm" :rules="storageRules" ref="storageForm" label-width="100px">
                        <el-form-item label="配件编码:" prop="code">
                            {{editPartForm.code}}
                        </el-form-item>
                        <el-form-item label="配件名称:" prop="name">
                            {{editPartForm.name}}
                        </el-form-item>
                        <el-form-item label="仓库:" prop="storage">
                            <el-select v-model="storageForm.storage" placeholder="选择仓库" size="small">
                                <!-- 这里需要调类型数据来循环渲染 -->
                                <el-option v-for="item in storage" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                            <div class="forPosition">
                                    <span class="add" @click="newStorageWindow = true">新增仓库</span>
                                    <div class="add-alert" v-if="newStorageWindow">
                                        <el-input style="width:100%" placeholder="新增仓库的名称" v-model="newName"></el-input>
                                        <div class="cancel">
                                            <el-button @click="newStorageWindow=false;newName=''">取消</el-button>
                                            <el-button type="warning" class="compile-button" @click="addStockConfirm">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                        </el-form-item>
                        <el-form-item label="供应商:" prop="supplier">
                            <el-select v-model="storageForm.supplier" placeholder="选择供应商" size="small">
                                <!-- 这里需要调类型数据来循环渲染 -->
                                <el-option  v-for="item in suppliers" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                            <div class="forPosition">
                                <span class="add" @click="newSupplierWindow = true">新增供应商</span>
                                <div class="add-alert" v-if="newSupplierWindow">
                                    <el-input style="width:100%" placeholder="新增供应商的名称" v-model="newSupplier"></el-input>
                                    <div class="cancel">
                                        <el-button @click="newSupplierWindow = false">取消</el-button>
                                        <el-button type="warning" class="compile-button" @click="addConfirm">确定</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="采购数量:" prop="amount" size="small">
                            <el-input-number v-model="storageForm.amount" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="单价:" prop="price" size="small">
                            <el-input-number placeholder="请输入购入价" v-model="storageForm.purchase_price" controls-position="right" type="number" style="width: 200px" :min="0">
                            </el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button plain
                                       @click="storageWindow = false;
                                        storageForm.storage = '',
                                        storageForm.supplier='',
                                        storageForm.amount='',
                                        storageForm.purchase_price=''">取消</el-button>
                            <el-button type="warning" @click="confirmIn(editPartForm)">确定</el-button>
                        </el-form-item>
                    </el-form>
                </section>
            </div>
        </div>

         <!-- 入库弹出层 -->
        <div class="theSupplierWindow" v-if="supplierWindow">
            <div class="supplierBox">
                <p class="notice" style="margin-bottom:20px;"><span>供应商管理</span><span class="close" @click="closeSupplier()">&times;</span></p>
                <div class="forPosition" style="margin-bottom:20px;">
                    <el-button class="compile-button" type="warning" @click="addSupplier = true" >新增供应商</el-button>
                    <div class="add-alert" v-if="addSupplier">
                        <el-input style="width:100%" placeholder="请输入名称" v-model="newSupplier"></el-input>
                        <!--<p>名称重复或未填写</p>-->
                        <div class="cancel">
                            <el-button @click="addSupplier = false;newSupplier=''">取消</el-button>
                            <el-button type="warning" class="compile-button" @click="addConfirm">确定</el-button>
                        </div>
                    </div>
                </div>

                <el-row class="titleOfForm">
                    <el-col class="infoOfTitle" :span="6">名称</el-col>
                    <el-col class="infoOfTitle" :span="6">配件数</el-col>
                    <el-col class="infoOfTitle" :span="6">创建时间</el-col>
                    <el-col class="infoOfTitle" :span="6">操作</el-col>
                </el-row>
                <div class="infoBox">
                    <template v-for="(item,index) in suppliers">
                        <el-row class="infoOfItem" type="flex" align="middle"  :key="item.id">
                            <el-col :span="6">{{item.name}}</el-col>
                            <el-col :span="6">{{item.count_parts}}</el-col>
                            <el-col :span="6">{{item.create_date}}</el-col>
                            <el-col :span="6">
                                <el-button @click="handleDelete(item.id)">删除</el-button>
                                <el-button type="warning" @click="changeName(index)">改名</el-button>
                            </el-col>
                        </el-row>
                        <el-row class="changeNameItem" :key="item.name" v-if="index === changeNameIndex">
                            <el-col :span="6">
                                <el-input style="width:100%;" v-model="reName"></el-input>
                                <p class="changeNameBtn">
                                    <span @click="modifySupName(item)">保存</span>|<span @click="cancleModSup(item)">取消</span>
                                </p>
                                <p class="errorMessage" v-show="item.error">{{item.error}}</p>
                            </el-col>
                        </el-row>
                    </template>
                </div>
                 <!-- 分页 -->
                <div class="pages">
                    <el-pagination class="pageControler"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="supply_pageConfig.offset"
                        :page-sizes="[10, 20, 40, 60]"
                        :page-size="supply_pageConfig.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="supply_pageConfig.count">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getSupplier,createSupplier,modifySupplier,deleteSupplier,getStockHouse,fetchPartsList,createStockHouse,stockIn,modifyPart,modifySku} from '@/api/getData'
import {searchPart} from "../../api/getData";
export default {
    data() {
        return {
            active:'',
            supply_pageConfig:{
                offset:1,
                limit:10,
                count:0
            },
            newName:'',
            newSupplier:'',
            reName:'',
            //仓库详情
            detailWindow:false,

            changeStorage:-1,

            details:{
                code:'',
                name:'',
                oe:'',
                list:[]
            },
            storage:[],
            //编辑
            editWindow:false,
            editPartForm:{},
            editRules: {
                code: [
                    { required: true, message: '请输入配件编码', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个罗马字符或英文字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入配件名称', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30 个汉字', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请填写价格', trigger: 'blur' }
                ],
                OEcode: [
                    { required: true, message: '请输入OE号', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个罗马字符或英文字符', trigger: 'blur' }
                ],
                quality:[{required:true}]
            },

            //入库
            storageWindow:false,
            storageForm:{
                storage:'',
                supplier:'',
                amount:'',
                price:'',
                total:'',
            },
            storageRules:{

            },

            //供应商管理
            supplierWindow:false,
            addSupplier:false,
            suppliers:[],
                //改名
            changeNameIndex:-1,
                //分页
            currentPage:1,

            //新增仓库
            newStorageWindow:false,

            //新增供应商
            newSupplierWindow:false,
        }
    },

    methods: {
        switchActive(route) {
            this.$router.push('/manage/storage/'+route);
            this.active = '/manage/storage/'+route;
        },

        //仓库详情弹窗
        async openDetail(e) {
            this.detailWindow = true;
            const res = await fetchPartsList({
                parts_id:e.id,
                timestamp:new Date().getTime()
            })
            if(res.state_code == 'ok'){
                this.details.code = e.code;
                this.details.name = e.name;
                this.details.oe = e.oe;
                this.details.list = res.results
            }
        },
        closeDetail() {
            this.storage = null;
            this.changeStorage = -1;
            this.detailWindow = false;
        },

        changeStorageBtn(index) {
            this.changeStorage = index;
        },
        async confirmStorageBtn(item) {
            const res = await modifySku({
                rid :item.id,
                adjust_sku :item.sku,
                out_employee_id:JSON.parse(sessionStorage.getItem('userInfo')).id
            })
            if(res.state_code =='ok'){
                this.changeStorage = -1;
                this.$refs.tpl.getParts(this.$refs.tpl.value,this.$refs.tpl.where)
                this.$message({
                    type:'success',
                    message:'调整成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        },

        // 添加仓库confirm
        async addStockConfirm(){
            this.loading = true;
            const res = await createStockHouse({
                name:this.newName
            })
            if(res.state_code == 'ok'){
                this.loading = false;
                this.newStorageWindow = false;
                this.newName = '';
                this.getStorage()
                this.$message({
                    type:'success',
                    message:"添加成功"
                })
            }else{
                this.loading = false;
                this.newName = '';
                this.newStorageWindow = false;
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        },
        // 获取仓库列表
        async getStorage(){
            this.loading = true;
            const res = await getStockHouse({
                timestamp : new Date().getTime()
            });
            if(res.state_code =='ok'){
                this.loading = false;
                this.count_storage = res.count;
                this.storage = res.results;
            }else{
                this.loading = false;
                this.$message({
                    type:"error",
                    message:res.err_message
                })
            }
        },
        // 添加供应商
        async addConfirm(){
            const res = await createSupplier({
                name:this.newSupplier
            })
            if(res.state_code == 'ok'){
                this.addSupplier = false;
                this.newSupplierWindow = false;
                this.newSupplier='';
                this.getSupplylist()
                this.$message({
                    type:'success',
                    message:'新增成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        },
        // 取消修改
        cancleModSup(item){
            this.changeNameIndex = -1;
            this.reName = '';
            item.error = '';
        },
        //修改供应商
        async modifySupName(e){
            this.loading = true;
            const res = await modifySupplier({
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
                this.reName = '',
                this.getSupplylist()
            }else{
                this.loading = false;
                this.$set(e,'error',res.err_message)
            }
        },
        //删除供应商
        async handleDelete(id){
            this.$confirm('确认删除？')
                .then(async () => {
                    this.loading = true;
                    const res = await deleteSupplier({rid:id})
                    console.log(res)
                    if(res.state_code == 'ok'){
                        this.loading = false;
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                        this.getSupplylist()
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

        //编辑弹窗
        openEdit(number) {
            this.editWindow = true;
            (async()=>{
                const res = await searchPart({rid:number,timestamp:new Date().getTime()})
                console.log(res)
                if(res.state_code =='ok'){
                    if(res.results[0].active === ''){
                        res.results[0].active = false
                    }
                    this.editPartForm = res.results[0]
                    this.editPartForm.rid = res.results[0].id;
                }else{
                    this.$message({
                        type:'error',
                        message:res.err_message
                    })
                }
            })()
        },
        closeEdit() {
            this.editWindow = false;
        },

        //供应商弹窗
        openSupplier() {
            this.getSupplylist()
            this.supplierWindow = true;
        },
        // 查询供应商列表
        async getSupplylist(){
            const res = await getSupplier({
                offset:this.supply_pageConfig.offset,
                limit:this.supply_pageConfig.limit,
                timestamp:new Date().getTime()
            })
            if(res.state_code == 'ok'){
                this.supply_pageConfig.count = res.count
                this.suppliers = res.results
            }else{
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        },
        // 查询仓库列表

        closeSupplier() {
            this.supplierWindow = false;
            this.addSupplier = false;
            this.newSupplier ='';
        },
            //改名窗口
        changeName(index) {
            this.changeNameIndex = index;
        },
            //分页事件
        handleSizeChange(val) {
            this.supply_pageConfig.limit = val;
            this.getSupplylist()
        },
        handleCurrentChange(val) {
            this.supply_pageConfig.offset = val;
            this.getSupplylist()
        },

        //入库弹窗
        openStorage(number) {
            this.storageWindow = true;
            this.getStorage();
            this.getSupplylist();
            (async()=>{
                const res = await searchPart({rid:number,timestamp:new Date().getTime()})
                if(res.state_code =='ok'){
                    this.editPartForm = res.results[0]
                    console.log(this.editPartForm);
                }else{
                    this.$message({
                        type:'error',
                        message:res.err_message
                    })
                }
            })()
        },
        // 提交入库
        async confirmIn(e){
            const res = await stockIn({
                house_id:this.storageForm.storage,
                supplier_id:this.storageForm.supplier,
                employee_id:JSON.parse(sessionStorage.getItem('userInfo')).id,
                lines:[{
                    parts_id:e.id,
                    purchase_price:this.storageForm.purchase_price,
                    sku:this.storageForm.amount,
                    price:this.editPartForm.price
                }]
            })
            if(res.state_code=='ok'){
                this.storageWindow = false;
                this.$refs.tpl.getParts(this.$refs.tpl.value,this.$refs.tpl.where)
                this.storageForm.storage = '',
                this.storageForm.supplier='',
                this.storageForm.amount='',
                this.storageForm.purchase_price='',
                this.$message({
                    type:'success',
                    message:'提交入库成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }

        },

        closeStorage() {
            this.storageWindow = false;
            this.newStorageWindow = false;
            this.newSupplierWindow = false;
            this.storageForm.storage = '';
            this.storageForm.supplier='';
            this.storageForm.amount='';
            this.storageForm.purchase_price='';
            this.newName='';
            this.newSupplier=''

        },

        // 提交配件编辑
        async confirmModify(e){
            const res = await modifyPart(e);
            if(res.state_code =='ok'){
                this.editWindow = false;
                this.$refs.tpl.getParts(this.$refs.tpl.value,this.$refs.tpl.where)
                this.$message({
                    type:'success',
                    message:'编辑成功'
                })
            }else{
                this.$message({
                    type:'error',
                    message:res.err_message
                })
            }
        }
    },
    mounted(){
        this.getSupplylist();
        this.getStorage();
        this.active = this.$route.path
    }
}
</script>

<style lang="less" scoped>
.withborder{
    border:1px solid #ddd;
    border-radius:5px;
    padding:8px;
    width:60%;
}

.compile-button{
    background: #ff861f;
    color:#fff
}
.basics-top{
    height: 48px;
    line-height: 48px;
    padding-left:20px;
}
.basics-top>span{
    display: inline-block;
    width:65px;
    font-size:16px;
    margin-right: 20px;
    text-align: center;
    cursor: pointer;
}
.basics-top>span.active{
    border-bottom:2px solid #ff901d;
}

.section{
    padding:10px;
}

.theDetailWindow,.theEditWindow,.theStorageWindow,.theSupplierWindow{
    position: absolute;
    top:0;
    left:0;
    z-index:1000;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
}
.detailBox,.editBox,.storageBox,.supplierBox{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    width:700px;
    height:400px;
    padding:20px;
    background:#fff;
}
.theEditWindow>.editBox{
    width:400px;
    height:500px;
}

.theStorageWindow .storageBox{
    width:450px;
    height:440px;
}

.theSupplierWindow .supplierBox{
    width:900px;
    height:650px;
}

.notice{
    display:flex;
    justify-content: space-between;
    border-bottom:1px solid #e4e7ed;
    font-size:16px;
    height:40px;
    line-height: 24px;
}
.notice>.close{
    cursor: pointer;
    font-size:24px;
    margin-bottom:20px;
}
.theDetailWindow>.detailBox>.info{
    font-size:15px;
    font-weight: normal;
    padding:20px 0;
}
.theDetailWindow>.detailBox>.info>span{
    margin-right:20px;
}
.titleOfForm {
    font-size:14px;
    text-align: center;
    width:100%;
    margin:0 0 10px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoBox{
    height:240px;
    overflow: auto;
}
.theSupplierWindow .infoBox{
    height:380px;
    overflow: auto;
}
.infoBox .infoOfTitle {
    font-size:14px;
    text-align: center;
}
.infoBox .infoOfItem{
    font-size:14px;
    text-align: center;
    padding-bottom:10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

.forPosition{
    display:inline-block;
    position:relative;
    margin-left:20px;
}
.forPosition>.add{
    color:#ff801d;
    cursor: pointer;
}

.forPosition .add-alert{
    position: absolute;
    width: 262px;
    background: #fff;
    left: 115%;
    top: -220%;
    border: 1px solid #eee;
    box-shadow: 1px 1px 1px #eee;
    padding: 20px 15px 15px 20px;
    z-index: 1000;
}
.forPosition .add-alert>p{
    padding:8px 0;
    color:#e41618
}
.forPosition .add-alert .cancel{
    text-align: right;
    padding:15px 0;
    padding-bottom:10px;
}
.forPosition .add-alert::before{
    content: '';
    display: block;
    position: absolute;
    left: -6px;
    top: 50%;
    z-index: 1000;
    width: 10px;
    height: 10px;
    border-left: 1px solid #eee;
    border-bottom: 1px solid #eee;
    transform: rotate(45deg);
    background: #fff;
}

.changeNameItem{
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
