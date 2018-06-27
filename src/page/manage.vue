<template>
    <div class="manage_page fillcontain" v-loading.fullscreen.lock="fullscreenLoading">
        <el-row style="height: 100%;">
            <!--模块菜单-->
            <el-col :span="3" style="height: 100%;border-right:1px solid #eee">
                <div class="sidebar-logo-box">
                    <el-button type="text" style="text-decoration: none" @click="dialogFormVisible=true" :disabled="userInfo.uid != '1'">{{userInfo.company}}</el-button>
                </div>
                <div class="box" :style="{height:fullHeight-160+'px'}" style="overflow: auto">
                    <div
                        v-if="getJurisdiction(...item.active)"
                        :class="{sidebarMenuBoxActive:JSON.stringify(item.moduleName).indexOf(moduleName)>=0}"
                        class="sidebar-menu-box"
                        v-for="(item,index) in moduleDate"
                        :key="index"
                        @click="moduleItemClick(item.moduleName[0])">
                        <b class="moduleIconStyle iconfont"
                           :class="item.iconClass"
                        ></b>
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <div class="main-quit-box">
                    <div class="user">
                        <div class="button" @click="quitLogin">
                            退出登录
                            <b></b>
                        </div>
                        <div >
                            <p style="display:flex;align-items: center">
                                <span class="iconfont icon-yonghu first"></span>
                                <span style="font-size:14px;color:#3c3c3c">{{userInfo.name}}</span>
                            </p>
                            <p style="color:#3c3c3c">{{userInfo.mobile}}</p>
                        </div>

                    </div>
                </div>
            </el-col>
            <el-col :span="21" style="height: 100%;overflow: auto;">
                <router-view></router-view>
            </el-col>
        </el-row>
        <el-dialog title="店名修改" :visible.sync="dialogFormVisible" width="20%" top="35vh">
            <el-input v-model="newName" placeholder="请输入新店名" size="small"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false;newName = ''" size="small">取 消</el-button>
                <el-button type="primary" @click="modName" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {employeeGet,get_permission,modCompanyName,logOut} from '@/api/getData'
    import {mapState,mapMutations} from 'vuex';

    export default {
        methods:{
            async modName(){
                const res = await modCompanyName({name:this.newName})
                if(res.success =='ok'){
                    this.userInfo.company = this.newName
                    sessionStorage.setItem('userInfo',JSON.stringify(this.userInfo))
                    this.newName = '';
                    this.dialogFormVisible= false;
                    this.$message({
                        type:'success',
                        message:'修改成功'
                    })
                }
            },
            moduleItemClick:function (m) {
                this.moduleName = m;
                this.$router.push(m)
            },
            quitLogin(){
                this.$confirm('确认退出吗？')
                .then(async ()=> {
                    const res = await logOut({timestamp:new Date().getTime()});
                    if(res){
                        this.$message({
                            type:'success',
                            message:'退出成功！'
                        })
                        sessionStorage.clear()
                        this.$router.push('/')
                    }
                })
                .catch(_ => {});
            },
        },
        async mounted(){
            this.moduleName = this.$route.path;
            if(this.$route.path.indexOf('/manage/client_main/addClient/')>=0||this.$route.path.indexOf('/manage/client_main/clientDetail/')>=0){
                this.moduleName = '/manage/client_main'
            }
            if(this.$route.path.indexOf('/manage/addStaff/')>=0){
                this.moduleName = '/manage/staff'
            }
            if(this.$route.path.indexOf('/manage/basics/addCar/')>=0||this.$route.path.indexOf('/manage/basics/brand')>=0){
                this.moduleName = 'manage/basics'
            }
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if(this.userInfo == null) {
                this.$message({
                    type: 'error',
                    message: '您尚未登录，请先登录'
                })
                this.$router.push('/')
            }
            //判断权限，用以控制跳转页面
            let dataLen = this.moduleDate.length;
            for(let i=0;i<dataLen;i++){
                let item = this.moduleDate[i];
                let len = item.right.length;
                for(let j=0;j<len;j++){
                    if(!this.getJurisdiction(...item.right[j])){
                        item.moduleName.splice(j, 1);
                    }
                }
            }
            //权限渲染函数--按钮渲染
            const res = await get_permission({rid:this.userInfo.uid,timestamp:new Date().getTime()});
            if(res.state_code == 'ok'){
                console.log(res.results);
                sessionStorage.setItem('jurisdictionList',res.results.toString());
            }
        },
        data(){
            return{
                fullscreenLoading: false,
                userInfo:{},
                newName:'',
                dialogFormVisible:false,
                jurisdictionDate:{
                    receptionist:false,//前台接待
                    cashier:false,//收银员
                    management:false,//仓库管理
                    system:false //系统设置管理员
                },
                fullHeight: document.documentElement.clientHeight,
                moduleName:'工作台',
                moduleDate:[
                    {
                        active:['4001','4002','4003','5001','5002','5003','5004','1001','1002','3001','3002','3003','2001'],
                        iconClass:'icon-gongzuotaisvg',
                        name:'工作台',
                        moduleName:['/manage/workbench'],
                        right:[]
                    },
                    {
                        active:['3001','2001','5001','5002','5003','5004','3002','3003'],
                        iconClass:'icon-kehu1',
                        name:'客户管理',
                        moduleName:['/manage/client_main','/manage/client_main/coupon'],
                        right:[['3001','2001','5001','5002','5003','5004'],['3001','3002','3003','5001','5002']]
                    },
                    {
                        active:['3001','4001','5001','5002','5003'],
                        iconClass:'icon-danju',
                        name:'单据管理',
                        moduleName:['/manage/orders/working','/manage/orders/parts','/manage/orders/cashier'],
                        right:[['3001'],['4001'],['5001','5002','5003']]
                    },
                    {
                        active:['4001','4002','4003'],
                        iconClass:'icon-cangku',
                        name:'仓库管理',
                        moduleName:['/manage/storage/parts_manage','/manage/storage/set_storage','/manage/storage/stock'],
                        right:[['4001','4002','4003'],['4001','4002','4003']]
                    },
                    {
                        active:['4001','4002','4003','5001','5002','5003','5004','1001','1002','3001','3002','3003','2001'],
                        iconClass:'icon-yuangongguanli',
                        name:'员工管理',
                        moduleName:['/manage/staff'],
                        right:[]
                    },
                    {
                        active:['3001','2001','1001'],
                        iconClass:'icon-car',
                        name:'基础管理',
                        moduleName:['/manage/basics','/manage/basics/basics_fix','/manage/basics/basics_dy','/manage/basics/insurance'],
                        right:[['3001','2001','1001'],['3001','1001'],['3001','1001']]
                    }
                ],
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../style/mixin';
    .sidebar-logo-box{
        padding:0 .6rem;
        height:50px;
        display: flex;
        font-size: 15px;
        font-weight:bold;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
        margin-bottom:15px;
        color: #3c3c3c;
    }
    .moduleIconStyle{
        margin-right:10px;
        font-size:22px;
    }
    .sidebar-menu-box{
        display: flex;
        width:90%;
        margin: 0 auto;
        padding:.4rem 0;
        color:#8c8c8c;
        align-items: center;
        justify-content: center;
        margin-bottom:15px;
        span{
            width:70px;
            display: inline-block;
        }
    }

    .sidebarMenuBoxActive{
        background:#f8f8f8;
        color:#ff901d
    }

    .sidebar-menu-box:hover{
        cursor: pointer;
        background:#f8f8f8
    }
    .main-quit-box{
        padding:10px 0;
    }
    .main-quit-box .button{
        border:1px solid #eee;
        cursor: pointer;
        box-shadow: 1px 1px 1px #fafafa ;
        background: #fff;
        display: none;
        position:absolute;
        top:-20px;
        left:50%;
        transform: translateX(-50%);
        padding:8px 0;
        text-align: center;
        font-size:14px;
        color:#969696;
        width: 80%;
        margin: 0 auto;
        margin-bottom:10px;
    }
    .main-quit-box .button:active{
        background: #ff901d;
        color:#fff;
    }
    .main-quit-box .button:active b{
        background: #ff901d;
        border-bottom:1px solid #ff901d;
        border-right:1px solid #ff901d;
    }
    .main-quit-box .button>b{
        position:absolute;
        top:100%;
        left:50%;
        transform: translate(-50%,-50%) rotate(45deg);
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #fff;
        border-bottom:1px solid #eee;
        border-right:1px solid #eee;
    }
    .main-quit-box>.user{
        border-top:1px solid #eee;
        position: relative;
        padding:20px 0 0 0;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .main-quit-box>.user:hover .button{
        display: block;
    }
    .main-quit-box>.user .first{
        margin-right:5px;
        text-align: center;
        color:#8c8c8c;
        font-size:25px;
    }
</style>
