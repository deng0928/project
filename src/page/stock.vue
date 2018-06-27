<template>
    <div class="stock DN">
        <div class="header">
            仓库管理 / <span>配件入库</span>
        </div>
        <div class="box">
            <p class="title">入库仓库</p>
            <el-row class="row">
                <span class="tag"><span>* </span>入库仓库 :</span>
                <el-select v-model="stockData.house_id" placeholder="请选择仓库" size="small">
                    <el-option
                        v-for="item in stockHouse"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div class="forPosition">
                    <span class="add" @click="newStorageWindow = true">新增仓库</span>
                    <div class="add-alert" v-if="newStorageWindow">
                        <el-input v-model="newStockName" style="width:100%" placeholder="新增仓库的名称"></el-input>
                        <p v-show="stockNameErr">仓库的名称重复或未填写</p>
                        <div class="cancel">
                            <el-button @click="newStorageWindow = false">取消</el-button>
                            <el-button type="warning" class="compile-button" @click="addStock()">确定</el-button>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row class="row">
                <span class="tag"><span>* </span>供应商 :</span>
                <el-select v-model="stockData.supplier_id" placeholder="请选择供应商" size="small">
                    <el-option
                        v-for="item in supplier"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div class="forPosition">
                    <span class="add" @click="newSupplierWindow = true">新增供应商</span>
                    <div class="add-alert" v-if="newSupplierWindow">
                        <el-input v-model="newSupplierName" style="width:100%" placeholder="新增供应商的名称"></el-input>
                        <p v-show="supplierNameErr">供应商的名称重复或未填写</p>
                        <div class="cancel">
                            <el-button @click="newSupplierWindow = false">取消</el-button>
                            <el-button type="warning" class="compile-button" @click="addSupplier()">确定</el-button>
                        </div>
                    </div>
                </div>
            </el-row>
            <hr style="border: none;border-bottom:1px solid #e4e7ed;">
            <p class="title">入库配件</p>
            <el-row class="row">
                <span class="tag"><span>* </span>入库配件 :</span>
                <el-autocomplete class="search"
                    v-model="partSelect"
                    :fetch-suggestions="querySearchAsync"
                    :trigger-on-focus="false"
                    placeholder="请输入配件名称，别名，配件编码查找"
                    @select="handleSelect"
                    size="small"
                >
                </el-autocomplete>
                <div class="forPosition">
                    <span class="add" @click="newPartWindow = true">新增配件</span>
                </div>
            </el-row>

            <el-row class="titleOfForm">
                <el-col class="infoOfTitle" :span="4">配件编码</el-col>
                <el-col class="infoOfTitle" :span="4">配件名称</el-col>
                <el-col class="infoOfTitle" :span="4">入库数量</el-col>
                <el-col class="infoOfTitle" :span="6">入库价</el-col>
                <el-col class="infoOfTitle" :span="4">参考售价</el-col>
                <el-col class="infoOfTitle" :span="2">操作</el-col>
            </el-row>
            <el-row class="infoOfItem" type="flex" align="middle" v-for="(item,index) in stockData.lines" :key="index">
                <el-col :span="4">{{item.code}}</el-col>
                <el-col :span="4">{{item.name}}</el-col>
                <el-col :span="4">
                    <el-input type="number" v-model="item.sku" style="width:70%" placeholder="请输入数量" size="small"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input type="number" v-model="item.purchase_price" style="width:70%" placeholder="请输入入库价" size="small">
                        <template slot="prepend">¥</template>
                    </el-input>
                </el-col>
                <el-col :span="4">{{item.price}}</el-col>
                <el-col :span="2">
                    <!--<el-input type="hidden" v-model="item.parts_id"></el-input>-->
                    <el-button @click="deletePart(index)">删除</el-button>
                </el-col>
            </el-row>
            <div class="btnRow">
                <el-button type="warning" @click="stock()">入库</el-button>
                <el-button plain @click="$router.back(-1)">取消</el-button>
            </div>
        </div>
        <!-- 新增配件弹出层 -->
        <div class="thePartWindow" v-if="newPartWindow">
            <div class="partBox">
                <p class="notice"><span>新增/编辑配件</span><span class="close" @click="newPartWindow = false">&times;</span></p>
                <section class="section">
                    <el-form :model="newPartData" :rules="newPartRules" ref="newPartData" label-width="100px" class="elseForm">
                        <el-form-item label="配件编码" prop="code" size="small">
                            <el-input v-model="newPartData.code" placeholder="2-20个罗马字符或英文字符"></el-input>
                        </el-form-item>
                        <el-form-item label="配件名称" prop="name" size="small">
                            <el-input v-model="newPartData.name" placeholder="2-30个汉字"></el-input>
                        </el-form-item>
                        <el-form-item label="别名" prop="alias" size="small">
                            <el-input v-model="newPartData.alias" placeholder="用于快速搜索"></el-input>
                        </el-form-item>
                        <el-form-item label="参考售价" prop="price" size="small">
                            <el-input type="number" placeholder="请填写参考销售价格" v-model="newPartData.price" @change="newPartData.price =  toFixedTwo($event)">
                                <template slot="prepend">¥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="OE号" prop="oe" size="small">
                            <el-input v-model="newPartData.oe" placeholder="2-20个罗马字符或英文字符"></el-input>
                        </el-form-item>
                        <el-form-item label="配件品质" prop="quality" size="small">
                            <el-select v-model="newPartData.quality" placeholder="请选择配件品质">
                                <el-option v-for="(item,index) in quality" :label="item" :value="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库存提醒" prop="stock_warn" size="small">
                            <el-input type="number" v-model="newPartData.stock_warn" placeholder="0"></el-input>
                        </el-form-item>
                        <el-form-item label="是否生效" prop="active" size="small">
                            <el-switch v-model="newPartData.active" style="margin-top: 5px;"></el-switch>
                        </el-form-item>
                        <el-form-item>
                            <el-button plain @click="newPartWindow = false">取消</el-button>
                            <el-button type="warning" @click="addPart()">确定</el-button>
                        </el-form-item>
                    </el-form>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import {getStockHouse,createStockHouse,getSupplier,createSupplier,searchPart,createPart,stockIn} from '@/api/getData';
export default {
    data() {
        return {
            // 登录信息
            userInfo:{},
            //仓库
            stockHouse:[],
            newStockName:'',
                //新增仓库
            newStorageWindow:false,
            stockNameErr:false,

            //供应商
            supplier:[],
            newSupplierName:'',
                //新增供应商
            newSupplierWindow:false,
            supplierNameErr:false,

            //入库配件
            allParts:[],
            partSelect:'',
            timeout:  null,
                //新增配件
            newPartWindow:false,
            newPartData:{
                code: '',
                name: '',
                alias: '',
                price: '',
                oe: '',
                quality: '',
                stock_warn: '0',
                active:true
            },
            quality:['原厂','品牌','改包','拆车','高仿','副厂','专业厂','下线','国产','台湾'],
            newPartRules: {
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
                oe: [
                    { required: true, message: '请输入OE号', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个罗马字符或英文字符', trigger: 'blur' }
                ],
                quality:[
                    { required: true }
                ]
            },

            //入库数据
            stockData:{
                house_id:'',
                supplier_id:'',
                lines:[]
            },
        }
    },
    methods: {
        handleChange(val){
            this.newPartData.price =  this.toFixedTwo(val)
        },

        //获取仓库
        async getStocks() {
            let stockHouse = await getStockHouse({
                timestamp:new Date().getTime()
            });
            if(stockHouse.state_code === 'error'){
                this.$message.error(stockHouse.err_message);
            }else{
                this.stockHouse = stockHouse.results;
            }
        },
            //新增仓库确定按钮
        addStock() {
            async function create(name) {
                return await createStockHouse({name:name});
            };
            let newName = this.newStockName;
            if(!newName){
                this.stockNameErr = true;
                return
            };
            let len = this.stockHouse.length;
            if(len === 0){
                this.stockNameErr = false;
                create(newName).then(res => {
                    if(res.state_code === 'error'){
                        this.$message.error(res.err_message);
                    }else if(res.state_code === 'ok'){
                        this.getStocks();
                        this.$message({message: '新增成功',type: 'success'});
                        this.newStorageWindow = false;
                    }
                });
            }else{
                for(let i = 0;i < len;i++){
                    if(this.stockHouse[i].name === newName){
                        this.stockNameErr = true;
                        return
                    }else if(i === len-1){
                        this.stockNameErr = false;
                        create(newName).then(res => {
                            if(res.state_code === 'error'){
                                this.$message.error(res.err_message);
                            }else if(res.state_code === 'ok'){
                                this.getStocks();
                                this.$message({message: '新增成功',type: 'success'});
                                this.newStorageWindow = false;
                                this.newStockName = '';
                            }
                        });
                    }
                }
            }
        },

        //获取供应商
        async getSuppliers() {
            let supplier = await getSupplier({
                timestamp:new Date().getTime()
            });
            if(supplier.state_code === 'error'){
                this.$message.error(supplier.err_message);
            }else{
                this.supplier = supplier.results;
            }
        },
            //新增供应商确定按钮
        addSupplier() {
            async function create(name) {
                return await createSupplier({name:name});
            };
            let newName = this.newSupplierName;
            if(!newName){
                this.supplierNameErr = true;
                return
            };
            let len = this.supplier.length;
            if(len === 0){
                this.supplierNameErr = false;
                create(newName).then(res => {
                    if(res.state_code === 'error'){
                        this.$message.error(res.err_message);
                    }else if(res.state_code === 'ok'){
                        this.getSuppliers();
                        this.$message({message: '新增成功',type: 'success'});
                        this.newSupplierWindow = false;
                    }
                });
            }else{
                for(let i = 0;i < len;i++){
                    if(this.supplier[i].name === newName){
                        this.supplierNameErr = true;
                        return
                    }else if(i === len-1){
                        this.supplierNameErr = false;
                        create(newName).then(res => {
                            if(res.state_code === 'error'){
                                this.$message.error(res.err_message);
                            }else if(res.state_code === 'ok'){
                                this.getSuppliers();
                                this.$message({message: '新增成功',type: 'success'});
                                this.newSupplierWindow = false;
                                this.newSupplierName = '';
                            }
                        });
                    }
                }
            }
        },

        //配件
            //新增配件确定按钮
        addPart() {
            async function create(data){
                return await createPart(data);
            };
            this.newPartData.price = this.toFixedTwo(this.newPartData.price)
            create(this.newPartData).then(res => {
                if(res.state_code === 'error'){
                    this.$message.error(res.err_message);
                }else if(res.state_code === 'ok'){
                    this.$message({message: '新增成功',type: 'success'});
                    this.newPartWindow = false;
                    this.newPartData = {
                        code: '',
                        name: '',
                        alias: '',
                        price: '',
                        oe: '',
                        quality: '',
                        stock_warn: '0',
                        active:true
                    }
                }
            });
        },

            //搜索配件
        async querySearchAsync(queryString, cb) {
            queryString = queryString.trim()
            clearTimeout(this.timeout);
            if(queryString){
                let allParts = await searchPart({where:queryString,timestamp:new Date().getTime()});
                this.timeout = setTimeout(() => {
                    if(allParts.state_code === 'error'){
                        this.$message.error(allParts.err_message);
                    }else{
                        let res = allParts.results.filter(obj => obj.active == true);
                        let len = res.length;
                        let results = [];
                        if(len > 0){
                            for(let i = 0;i < len;i++){
                                results[i] = {
                                    alias:res[i].alias,
                                    code:res[i].code,
                                    id:res[i].id,
                                    value:res[i].name,
                                    oe:res[i].oe,
                                    price:res[i].price,
                                    quality:res[i].quality,
                                    stock_warn:res[i].stock_warn,
                                    supplier_id:res[i].supplier_id
                                }
                            };
                        }
                        cb(results);
                    }
                }, 1000 * Math.random());
            }
        },
            //选取配件
        handleSelect(res) {
            this.stockData.lines.push({
                parts_id:res.id,
                code:res.code,
                name:res.value,
                sku:'',
                purchase_price:'',
                price:res.price,
            });
            this.partSelect = '';
        },
            //删除配件
        deletePart(index) {
            this.stockData.lines.splice(index,1);
        },

        //入库
        stock() {
            async function begin(data){
                return await stockIn(data);
            };
            let lines = this.stockData.lines;
            let len = lines.length;
            if(!this.stockData.house_id){
                this.$message.error('请选择入库仓库');
            }else if(!this.stockData.supplier_id){
                this.$message.error('请选择供应商');
            }else if(len === 0){
                this.$message.error('请填选需要入库的配件');
            }else{
                this.stockData.employee_id = this.userInfo.id
                begin(this.stockData).then(res => {
                    console.log(res)
                    if(res.state_code === 'error'){
                        this.$message.error(res.err_message);
                    }else if(res.state_code === 'ok'){
                        this.$message({message: '入库成功',type: 'success'});
                        this.$router.back(-1);
                    }
                });
            }
        }
    },
    async mounted() {
        this.getStocks();
        this.getSuppliers();
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    }
}
</script>

<style lang="less" scoped>
div,p{
    box-sizing: border-box;
}
.stock{
    width:100%;
    font-size:15px;
    color:#333;
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
.title{
    font-size:16px;
    font-weight: bold;
    margin-bottom:20px;
}
.row{
    margin-bottom:26px;
}
.tag{
    display:inline-block;
    width:100px;
    text-align: right;
    margin-right:10px;
}
.tag>span{
    color:#e41618;
}
.search{
    width:350px;
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
    left: 150%;
    top: -400%;
    border: 1px solid #eee;
    box-shadow: 1px 1px 1px #eee;
    padding: 20px 15px 15px 20px;
    z-index: 1000;
}
.forPosition .add-alert>p{
    padding:8px 0;
    color:#e41618;
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

.titleOfForm {
    text-align: center;
    width:100%;
    margin:0 0 10px 0 !important;
    padding:10px 0;
    background:#f8f8f8;
    border-bottom: 1px solid #e4e7ed;
}
.infoOfItem{
    text-align: center;
    padding-bottom:10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

.btnRow{
    width: 100%;
    margin:40px 0;
    display: flex;
    justify-content: center;
}
.btnRow>.el-button{
    width:100px;
    height:30px;
    line-height: 30px;
    font-size:12px;
}

.thePartWindow{
    position: absolute;
    top:0;
    left:0;
    z-index:1000;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
}
.partBox{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    width:400px;
    height:620px;
    padding:20px;
    background:#fff;
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
.section{
    padding:10px;
    padding-top:20px;
}
.elseForm .el-form-item--small{
    margin-bottom:28px;
}
</style>
