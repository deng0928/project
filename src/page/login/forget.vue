<template>
    <div class="reset_page fillcontain" v-loading="loading">
        <transition name="el-fade-in">
            <div class="reset_box form_contianer"  v-show="showReset">
                <div class="reset_top">
                    <img src="../../assets/img/logo.png" alt="">
                    <section class="rightlink">已有账号，<router-link to="/">马上登录</router-link></section>
                </div>
                <div class="formbox">
                    <div class="form_head">找回密码</div>
                    <el-form class="forgetform" :model="checkForm" :rules="rules" ref="checkForm">
                        <el-form-item prop="mobile" class="phone_input">
                            <el-input placeholder="手机号" v-model.trim="checkForm.mobile"><span></span></el-input>
                        </el-form-item>
                        <el-form-item prop="checkCode" class="code_input">
                            <el-input placeholder="请输入验证码" v-model = "checkForm.checkCode"></el-input>
                            <el-button type="primary" class="fr codebtn" @click="sendCode('checkForm')" v-bind:disabled="isDisabled">{{btnText}}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="submit_btn on" @click="submitForm('checkForm')">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {getCheckCode,checkMobile} from '@/api/getData'
    import {checkPhone} from '../../config/validate'
    export default{
        data(){
            return{
                loading:false,
                checkForm: {
                    mobile: '',
                    checkCode: '',
                },
                rules: {
                    mobile: [
                        {trigger: 'blur', validator: checkPhone },
                    ],
                    checkCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ],
                },
                showReset:false,
                isDisabled:false,
                show: true,
                btnText:'验证码',
                count:'',
                timer: null,
            }
        },
        methods:{
            async sendCode(formName) {
                this.loading  = true ;
                const TIME_COUNT = 60;
                if(this.rules.checkCode){
                    delete this.rules['checkCode'];
                }
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await getCheckCode({mobile: this.checkForm.mobile});
                        console.log(res);
                        if (res['success'] != undefined) {
                            this.loading  = false ;
                            this.$message({
                                type: 'success',
                                message:'发送成功'
                            });
                            this.isDisabled = true;
                            // 60S倒计时
                            if (!this.timer) {
                                this.count = TIME_COUNT;
                                this.show = false;
                                this.timer = setInterval(() => {
                                    if (this.count > 0 && this.count <= TIME_COUNT) {
                                        this.count--;
                                        this.btnText = this.count + 'S后重试'
                                    } else {
                                        this.isDisabled = false;
                                        this.btnText = '验证码';
                                        clearInterval(this.timer);
                                        this.timer = null;
                                    }
                                }, 1000)
                            }

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
                })
            },
            async submitForm(formName) {
                this.loading  = true ;
                if(!this.rules.checkCode){
                    this.rules.checkCode = [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await checkMobile({mobile:this.checkForm.mobile , code:this.checkForm.checkCode});
                        if (res['success'] != undefined){
                            this.loading = false;
                            this.$router.push({
                                path:'/reset',
                                query:{
                                    mobile:this.checkForm.mobile,
                                    code:this.checkForm.checkCode
                                }
                            })
                        }else if(res['error'] != undefined){
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

        },
        mounted(){
            this.showReset = true;
        }
    }

</script>

<style lang="less" scoped>
    @import '../../style/mixin';
    .reset_page{
        background:#f8f8f8;
    }
    .reset_box{
        .wh(900px,600px);
        .ctp(900px,600px);
    }
    .reset_top{
        position: relative;
    }
    .rightlink{
        position: absolute;
        right: 0;
        bottom:3px;
        a{
            color:@yl
        }
    }
    .formbox{
        .wh(900px,513px);
        background: #fff;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        box-shadow: 2px 2px 5px rgba(0,0,0,.2);
        margin-top:30px;
        overflow: hidden;
        .form_head{
            background: #666;
            color:#fff;
            font-size:24px;
            height:80px;
            line-height: 80px;
            text-align: center;
            margin-bottom: 80px;
        }
    }
    .forgetform{
        width: 400px;
        margin:0 auto;
    }
    .submit_btn{
        width: 100%;
        height:60px;
        font-size:18px;
        color:#fff;
        background:@yl;
        border:none
    }
    .el-form-item{
        margin-bottom:28px;
    }
    .codebtn{
        background:@yl;
        color:#fff;
    }
    .el-button--primary.is-disabled{
        background:#fdca95;
        color:#fff;
    }
</style>

