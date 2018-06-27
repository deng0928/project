<template>
    <div class="dy-box">
        <section>
            <el-form  label-width="140px">
                <el-form-item v-if="false" label="点击上传LOGO：" style="position:relative">
                    <el-upload
                        class="avatar-uploader"
                        action="/print_conf"
                        :before-remove="deleteFun"
                        :limit="1"
                        :data="{rid:accountId}"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img style="height:120px;width:120px" :src="imageUrl" v-if="imageUrl" alt="">
                        <div  class="logo-box DN" v-else>
                            <i style="font-size:40px;color:#8c8c8c;margin-top:15px;" class="iconfont icon-ai-up-img"></i>
                            <el-button style="width:100px;margin-left:10px;" size="small" type="warning">上传logo</el-button>
                        </div>
                        <div style="position: absolute;top:85px;left:130px" class="el-upload__tip" slot="tip">图片大小:小于1M,图片格式：jpg,png,jpeg,gif</div>
                    </el-upload>

                </el-form-item>
                <el-form-item label="报价单注意事项：">
                    <el-input type="textarea" :disabled="!getJurisdiction('1001')" :autosize="{ minRows:5, maxRows: 5}" v-model="offerDate" style="width:651px"></el-input>
                </el-form-item>
                <el-form-item label="结算单注意事项：">
                    <el-input type="textarea" :disabled="!getJurisdiction('1001')" :autosize="{ minRows:5, maxRows: 5}" v-model="accountDate" style="width:651px"></el-input>
                </el-form-item>
                <el-form-item class="DN">
                    <!--<el-button style="width:100px" @click="deleteFun">取消</el-button>-->
                    <el-button v-if="getJurisdiction('1001')" style="width:100px" type="warning" @click="saveFun">确认</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    import {print_conf_info,print_conf,print_conf_post} from '@/api/getData'
    export default {
        data(){
            return{
                imageUrl: '',
                offerDate:'',
                accountDate:'',
                accountId:''
            }
        },
       async mounted(){
           const res = await print_conf({timestamp:new Date().getTime()});
           if(res.state_code=='ok'){
                this.accountId = res.results[0].id;
                this.offerDate = res.results[0].quotation_matters
                this.accountDate = res.results[0].statements_matters
               this.imageUrl = `data:image/jpeg;base64,${res.results[0].logo_base64}`
            }else {
               this.$message.error(res.err_message);
           }
       },
        methods:{
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPGE = file.type === 'image/jpeg';
                const isPNG=  file.type === 'image/png';
                const isGIF=  file.type === 'image/gif';
                const isJPG=  file.type === 'image/jpg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPGE&&!isPNG&&!isGIF&&!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG/GIF/JPEG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return  (isJPGE  || isPNG || isJPG || isGIF) && isLt2M;
            },
            deleteFun(){
                this.imageUrl=''
            },
            async saveFun(){
                const data ={
                    rid:this.accountId,
                    quotation_matters:this.offerDate,
                    statements_matters:this.accountDate
                }
                const res = await print_conf_info(data)
                if(res.state_code=='ok'){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.err_message)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
section{
    padding:20px;

}
.logo-box{
    width:120px;
    height:120px;
    border:1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

</style>
