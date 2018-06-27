<template>
    <div class="login_page fillcontain" v-loading="loading">
        <div class="login_top"></div>
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer" v-show="showLogin">
                <section class="form_head">用户登录</section>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="mobile" class="login_input name">
                        <el-input v-model.trim="loginForm.mobile" placeholder="手机号"  auto-complete="off"><span></span></el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="login_input password">
                        <el-input type="password" placeholder="密码" v-model="loginForm.password" auto-complete="off" @keyup.enter.native="submitForm('loginForm')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn on">登录</el-button>
                    </el-form-item>
                    <el-button type="text" class="fr" @click="goForget">找回密码</el-button>
                </el-form>
            </section>
        </transition>
    </div>
</template>

<script>
    import {login,car_model_multi_fuzzy_search,get_permission} from '@/api/getData'
    import {checkPhone} from '../../config/validate'
    export default {
        data(){
            return {
                loading: false,
                loginForm: {
                    mobile: '',
                    password: '',
                },
                rules: {
                    mobile: [
                        { required: true, trigger: 'blur', validator: checkPhone },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                },
                showLogin: false,
                userInfo:{},
            }
        },
        mounted(){
            console.log(this.$store.state);
            this.showLogin = true;
        },

        methods: {
            //权限渲染函数--按钮渲染
            async jurisdictionButtonControl(){
                const res = await get_permission({rid:this.userInfo.uid,timestamp:new Date().getTime()});
                if(res.state_code == 'ok'){
                    console.log(res.results);
                    sessionStorage.setItem('jurisdictionList',res.results.toString());
                    this.$router.push('manage/workbench')
                }
            },
            async submitForm(formName) {
                this.loading  = true ;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await login({mobile: this.loginForm.mobile, password: this.loginForm.password});
                        if (res.success) {
                            this.loading  = false ;
                            this.$message({
                                type: 'success',
                                message: res.success
                            });
                            this.userInfo = res;
                            sessionStorage.setItem("userInfo", JSON.stringify(res));
                            this.jurisdictionButtonControl()
                        }else if(res.error){
                            this.loading  = false ;
                            this.$message({
                                type: 'error',
                                message: res.error
                            });
                        }
                    }else{
                        this.loading = false
                    }
                });
            },
            goForget(){
                this.$router.push('forget')
            }
        },
    }
</script>

<style lang="less" scoped>
    @import '../../style/mixin';
    .login_top{
        height:80px;
        background:url("../../assets/img/logo-white.png") 0 0 no-repeat  #ff901e;
        width: 100%;
    }
    .login_page{
        background:url("../../assets/img/bg.jpg") center;
    }
    .el-form{
        width: 100%;
    }
    .form_head{
        color:#3c3c3c;
        height:60px;
        line-height:60px;
        font-size: 18px;
        border-bottom:1px solid #eee;
        text-align:left;
        margin-bottom:60px;
        &:after{
            display: block;
            content: '';
            width:80px;
            height:3px;
            background:#3c3c3c;
            margin-top: -1px;
        }
    }
    .manage_tip{
        position: absolute;
        width: 100%;
        top: -100px;
        left: 0;
        p{
            font-size: 34px;
            color: #fff;
        }
    }
    .form_contianer{
        .wh(420px, 485px);
        .ctp(480px, 513px);
        padding:30px;
        padding-bottom:0;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
        .submit_btn{
            width: 100%;
            font-size: 16px;
        }
        &:after{
            display: block;
            content: '北京德南科技';
            position: absolute;
            bottom:-50px;
            left:50%;
            transform: translateX(-50%);
            color:#fff;
            font-size:14px;
        }
    }
    .tip{
        font-size: 12px;
        color: red;
    }
    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }
    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }
    .el-form-item{
        margin-bottom:30px;
    }
    .el-form-item__error{
        line-height: 30px;
    }
    .el-form{
        width: 350px;
        margin: 0 auto;
    }
    .submit_btn{
        background:#f590f5;
        height:60px;
        -webkit-border-radius:0;
        -moz-border-radius:0;
        border-radius:0;
        color:#999;
        font-size: 18px;
        border:none
    }
    .submit_btn.on{
        background: #ff901e;
        color:#fff!important;
    }
</style>
