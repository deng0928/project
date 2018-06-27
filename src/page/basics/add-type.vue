<template>
    <div class="addItemType-alert DN">
        <el-input style="width:100%" v-model="inputValue"></el-input>
        <p v-if="errorToggle">{{errorText}}</p>
        <div class="DN cancel">
            <el-button @click="cancelItemType()">取消</el-button>
            <el-button type="warning" @click="saveItemType" class="compile-button">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:['errorToggle','errorText'],
    data() {
        return {
            inputValue:''
        }
    },
    methods: {
        cancelItemType() {
            this.$emit('cancelItemType');
        },
        saveItemType(){
            this.$emit('saveItemType',this.inputValue);
        }
    }
}
</script>

<style lang="less" scoped>
    .addItemType-alert{
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
    .addItemType-alert>p{
        padding:8px 0;
        color:#e41618
    }
    .addItemType-alert .cancel{
        text-align: right;
        padding:15px 0;
        padding-bottom:10px;
    }
    .addItemType-alert::before{
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
</style>
