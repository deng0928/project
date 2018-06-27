<template>
    <div class="add-client-box fillcontain" >
        <header class="header">
            <span style="cursor: pointer;" @click="$router.go(-1)">员工管理 / </span>
            <span class="detail">{{modification_or_add}}</span>
        </header>
        <section class="section">
            <!--编辑模式-->
            <el-form
                ref="addStaffDate"
                :model="addStaffDate"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <!--姓名-->
                <el-form-item  label="姓名：" prop="employee_name">
                    <div class="DN">
                        <el-input v-model="addStaffDate.employee_name" size="small" placeholder="请输入姓名"></el-input>
                    </div>
                </el-form-item>
                <!--电话-->
                <el-form-item  label="手机号：" prop="mobile_phone" >
                    <div class="DN">
                        <el-input placeholder="请输入11位手机号" v-model="addStaffDate.mobile_phone" size="small"></el-input>
                    </div>
                </el-form-item>
                <!--部门-->
                <el-form-item label="部门：" prop="department_id" size="small">
                    <div class="DN">
                        <el-select v-model="addStaffDate.department_id" filterable placeholder="请选择部门">
                            <el-option
                                v-for="item in department"
                                :key="item.id"
                                :label="item.department_name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <!--状态-->
                <el-form-item label="状态：" prop="state">
                    <div class="DN">
                        <el-radio v-model="addStaffDate.state" label="在职">在职</el-radio>
                        <el-radio v-model="addStaffDate.state" label="离职">离职</el-radio>
                    </div>
                </el-form-item>
                <!--登录权限-->
                <el-form-item label="登录权限：" prop="is_landing">
                    <div class="DN">
                        <el-checkbox v-model="addStaffDate.is_landing">{{addStaffDate.is_landing==true?'是':'否'}}</el-checkbox>
                    </div>
                </el-form-item>
                <!--权限组-->
                <el-form-item label="权限组：">
                    <el-checkbox
                        v-if="item.name!=false"
                        v-for="item in groupsDate"
                        :key="item.id"
                        v-model="checkAll[item.name]"
                        :indeterminate="isIndeterminate[item.name]"
                        @change="handleCheckAllChange($event,item)">{{item.name}}</el-checkbox>
                </el-form-item>
                <el-form-item label="权限：">
                    <el-checkbox-group style="margin-right:30px;" :key="item.id"  v-for="item in groupsDate" v-model="checkedCities[item.name]" @change="handleCheckedCitiesChange($event,item.arr,item)">
                        <el-checkbox v-for="list in item.arr" :checked="list.have"  :label="list" :key="list.id">{{list.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="提示：" prop="is_landing">
                    <div class="DN" style="color:#606266;">
                        账号为手机号，默认密码为123
                    </div>
                </el-form-item>
                <div class="DN">
                    <el-form-item>
                        <el-button class="efficacy-button" @click="$router.go(-1)">取消</el-button>
                        <el-button type="warning"  @click="submitForm('addStaffDate')">完成</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </section>
    </div>
</template>
<script>
    import {employeepost,employeeGet,departmentGet,departmentNo,employeeput,get_groups} from '@/api/getData'
    import {checkPhone} from '../../config/validate'
    export default {
        data() {
            return {
                aaa:[],
                checkedCities:{},
                cities:{},
                isIndeterminate:{},
                checkAll:{},
                groupsDate:[],
                department_name:'',
                department:[],//所有部门信息
                modification_or_add:'', //是新增员工还是编辑员工
                addStaffDate: { //员工数据
                    employee_name: '',
                    mobile_phone: '',
                    department_id: '',
                    state: '在职',
                    is_landing:true,
                },
                rules: { //验证规则
                    employee_name :  [{
                        required: true, message: '请输入姓名', trigger: 'change'
                    }],
                    mobile_phone:  [
                        { required: true, trigger: 'blur',validator: checkPhone },
                    ],
                    department_id:[{
                        required: true, message: '请选择班组', trigger: 'change'
                    }]
                }
            };
        },
        async mounted(){

            //获取部门信息接口
            this.departmentList();
            if(this.$route.params.id=='en'){//如果新增员工
                //权限接口
                this.getGurisdiction();
                this.modification_or_add = '新增员工';
                this.$refs['addStaffDate'].resetFields();

            }else{//编辑员工
                this.modification_or_add = '编辑员工';
                this.$refs['addStaffDate'].resetFields();
                //获取当前员工数据
                const res = await employeeGet({rid:this.$route.params.id,timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    if(res.results.length>0){
                        this.addStaffDate = res.results[0];
                        this.groupsDate= res.results[0].groups_id;
                        this.groupsDate.forEach(obj=>{
                            this.$set(this.checkedCities,obj.name,obj.arr.filter(o=>{o.have==true}));
                            this.$set(this.cities,obj.name,obj.arr);
                            this.$set(this.checkAll,obj.name,obj.arr.length==obj.arr.filter(o=>o.have==true).length&&obj.arr.length>0);
                            this.$set(this.isIndeterminate,obj.name,obj.arr.filter(o=>o.have==true).length>0&&obj.arr.filter(o=>o.have==true).length<obj.arr.length)
                        })
                    }
                }else{
                    this.$message.error(res.err_message);
                }
            }
        },
        methods: {
            //获取权限函数
            async getGurisdiction(){
                const res = await get_groups()
                if(res.state_code=='ok'){
                    this.groupsDate= res.results;
                    res.results.forEach(obj=>{
                        this.$set(this.checkedCities,obj.name,[])
                        this.$set(this.cities,obj.name,obj.arr)
                        this.$set(this.isIndeterminate,obj.name,false);
                        this.$set(this.checkAll,obj.name,false)
                    })
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //部门信息获取函数
            async departmentList(){
                const res = await departmentNo({timestamp:new Date().getTime()});
                if(res.state_code=='ok'){
                    this.department  = res.results;
                }else{
                    this.$message.error(res.err_message);
                }
            },
            //表单提交
            submitForm(addStaffDate){
                var self =this;
                this.$refs[addStaffDate].validate(async function(valid) {
                    if (valid) {
                        //验证通过
                        const groups_ids  = [] ;
                        for(var i in self.checkedCities){
                            if(self.checkedCities[i].length>0){
                                self.checkedCities[i].filter(obj=>{
                                    groups_ids.push(obj.id)
                                })
                            }
                        }
                        const module_category_ids = [];
                        self.groupsDate.forEach(obj=>{
                            if(self.isIndeterminate[obj.name]||self.checkAll[obj.name]){module_category_ids.push(obj.id)}
                        });
                        if(self.$route.params.id=='en'){ //新增员工
                            const date = self.addStaffDate;
                            date.groups_id = groups_ids;
                            date.module_category_id=module_category_ids.filter(obj=>obj!=false);
                            const res = await employeepost(date);
                            if(res.state_code=='ok'){
                                self.department_name = res.results[0].department_name;
                                self.$message({
                                    message: '添加员工成功',
                                    type: 'success'
                                });
                                self.$router.push('/manage/staff')
                            }else{
                                self.$message.error(res.err_message);
                            }
                        }else{//修改员工
                            const date1  = self.addStaffDate;
                            date1.rid = self.$route.params.id;
                            date1.groups_id = groups_ids;
                            date1.module_category_id=module_category_ids.filter(obj=>obj!=false);
                            delete date1.department_name;
                            const res = await employeeput(date1);
                            if(res.state_code=='ok'){
                                self.department_name = res.results[0].department_name;
                                self.$message({
                                    message: '修改员工成功',
                                    type: 'success'
                                });
                                self.$router.push('/manage/staff')
                            }else{
                                self.$message.error(res.err_message);
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },
            handleCheckAllChange($event,val) {
                this.$set(this.checkedCities,val.name,$event ? this.cities[val.name] : [])
                this.$set(this.isIndeterminate,val.name,false)
            },
            handleCheckedCitiesChange($event,arr,item) {
                let checkedCount = $event.length;
                this.checkAll[item.name] = checkedCount === arr.length;
                this.isIndeterminate[item.name] = checkedCount > 0 && checkedCount < arr.length;
            }
        }
    }
</script>

<style lang="less" scoped>
    .select-list-box{
        position: relative;
    }
    .select-item{
        width:185px;
        background: #fff;
        border:1px solid #ddd;
        height:271px;
        position: absolute;
        top: 100%;
        z-index: 10001;
        left: 0;
    }
    .add-client-alert{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.4);
        z-index: 10000;
    }
    .add-client-box .header{
        height: 59px;
        line-height: 59px;
        background: #f8f8f8;
        padding:0 20px;
        font-size:16px;
        color: #606266;
    }
    .add-client-box>.header>.detail{
        color:#ff901d;
    }
    .add-client-box>.section{
        padding:20px;
    }
    .alert-box{
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%)
    }
    .alert-box>.title{
        padding-left:20px;
        font-weight:bold;
        font-size:15px;
        height: 59px;
        color:#666;
        line-height: 59px;
        border-bottom:1px solid #eee;
    }
    .from-box{
        padding:20px 50px 20px 0
    }
    .el-input{
        width:200px
    }
    .el-input__inner{
        height: 34px;
        line-height: 34px;
    }
    .efficacy-button{
        color:#ff801d;
        border-color:#ff801d
    }
    .efficacy-button:hover{
        color:#fff;
        background:#ff801d ;
    }
</style>

