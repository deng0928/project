<template>
    <div class="reset_page fillcontain" v-loading='loading'>
        <transition name="el-fade-in">
            <div class="reset_box form_contianer"  v-show="showReset">
                <div class="reset_top">
                    <img src="../../assets/img/logo.png" alt="">
                    <section class="rightlink">已有账号，<router-link to="/">马上登录</router-link></section>
                </div>
                <div class="formbox">
                    <div class="form_head">找回密码</div>
                    <el-form class="resetform" :model="resetForm" ref="resetForm" :rules="rules">
                        <el-form-item class="reset_input" prop="pass">
                            <el-input type="password" v-model="resetForm.pass" placeholder="请输入8-14位含大写字母密码" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item class="reset_input" prop="checkPass">
                            <el-input type="password" v-model="resetForm.checkPass" placeholder="请输入密码" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="submit_btn on" @click="submitForm('resetForm')">完成</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {restPassword} from '@/api/getData'
    export default{
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.resetForm.checkPass !== '') {
                        this.$refs.resetForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.resetForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                loading:false,
                resetForm:{
                    mobile:'',
                    code:'',
                    pass:'',
                    checkPass:''
                },
                showReset:false,
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            async submitForm(formName){
                this.loading = true;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await restPassword({mobile:this.resetForm.mobile , code:this.resetForm.code,new_password:this.resetForm.checkPass});
                        if (res.success) {
                            this.loading  = false ;
                            this.$message({
                                type: 'success',
                                message: '修改密码成功'
                            });
                            this.$router.push('/')
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
            }
        },
        mounted(){
            this.showReset = true;
            this.resetForm.mobile = this.$route.query.mobile;
            this.resetForm.code = this.$route.query.code;
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
    .resetform{
        width: 400px;
        margin:0 auto
    }
    .el-form-item {
        margin-bottom: 28px;
    }
</style>

