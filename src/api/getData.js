import fetch from '@/config/fetch'
/**
 * 登陆
 */
export const login = data => fetch('/login', data, 'POST');

// 获取验证码
export const getCheckCode = data => fetch('/login/get_sms_code', data, 'POST');

//验证手机
export const checkMobile = data => fetch('/login/check_sms_code', data, 'POST');

// 重置密码
export const restPassword = data => fetch('/login/reset_password', data, 'POST');

/*** 退出*/
export const logOut = data => fetch('/logout',data,'GET');


// 客户列表
export const partner = data => fetch('/partner',data);

//获取车辆信息
export const quick_order_car = data => fetch('/car/quick_order_car',data);

//快速开单
export const quick_order = data => fetch('/dn_maintenance_order',data,'POST');

//**********************************************************邓力**************************************************
export const partnerp = data =>fetch('/partner',data,'POST');
export const partnerput = data =>fetch('/partner',data,'PUT');
export const partnerdel = data =>fetch('/partner',data,'DELETE');
//查询品牌;
export const brand_multi_fuzzy_search = data =>fetch('/brand_multi_fuzzy_search',data);
//查询车系
export const series_multi_fuzzy_search = data =>fetch('/series_multi_fuzzy_search',data);
//查询车型
export const model_multi_fuzzy_search = data =>fetch('/model_multi_fuzzy_search',data);
//删除车型
export const model_multi_fuzzy_search_del = data =>fetch('/model_multi_fuzzy_search',data,'DELETE');
//vin
export const jy_car_model = data =>fetch('/jy_car_model',data,'POST');
export const select_brand_series = data =>fetch('/select_brand_series',data);
//删除客户车辆
export const carDel  = data =>fetch('/car',data,'DELETE');
//新增客户车辆
export const carPost  = data =>fetch('/car',data,'POST');
//编辑客户车辆
export const carPut  = data =>fetch('/car',data,'PUT');
//新增品牌
export const dn_brandPost  = data =>fetch('/dn_brand',data,'POST');
//删除品牌
export const dn_brandDel  = data =>fetch('/dn_brand',data,'DELETE');
//新增车系
export const dn_seriesPost  = data =>fetch('/dn_series',data,'POST');
//修改车系
export const dn_seriesPut  = data =>fetch('/dn_series',data,'PUT');
//新增车型
export const dn_car_modelPost  = data =>fetch('/dn_car_model',data,'POST');
//删除车系
export const dn_seriesDel  = data =>fetch('/dn_series',data,'DELETE');
//修改车型
export const dn_car_modelPut  = data =>fetch('/dn_car_model',data,'PUT');
//查询车型
export const dn_car_model  = data =>fetch('/dn_car_model',data);
//查询维系项目
export const maintenance_item_multi_fuzzy_search  = data =>fetch('/maintenance_item_multi_fuzzy_search',data);
//新增维修项目
export const dn_maintenance_item_post  = data =>fetch('/dn_maintenance_item',data,"POST");
//修改维修项目
export const dn_maintenance_item_Put  = data =>fetch('/dn_maintenance_item',data,"PUT");
//删除维修项目
export const maintenance_item_state_change_del  = data =>fetch('/maintenance_item_state_change',data,"PUT");
//查询维修项目
export const dn_maintenance_item  = data =>fetch('/dn_maintenance_item',data);
//删除维修项目
export const dn_maintenance_item_del  = data =>fetch('/dn_maintenance_item',data,"DELETE");
//项目分类查询
export const dn_peoded  = data =>fetch('/project_classify_multi_fuzzy_search',data);
//查询项目分类
export const dn_project_classify  = data =>fetch('/dn_project_classify',data);
//新增项目分类
export const dn_project_classifyPost  = data =>fetch('/dn_project_classify',data,"POST");
//删除项目分类
export const dn_project_classifyDel  = data =>fetch('/dn_project_classify',data,"DELETE");
//修改项目分类名称
export const dn_project_classifyPut  = data =>fetch('/dn_project_classify',data,"PUT");
//查询员工
export const employeeGet  = data =>fetch('/employee',data);
//离职
export const employeedel  = data =>fetch('/employee',data,'DELETE');
//新增员工
export const employeepost  = data =>fetch('/employee',data,'POST');
//修改员工
export const employeeput  = data =>fetch('/employee',data,'PUT');
//查询部门不带惨数
export const departmentNo  = data =>fetch('/department',data);
//查询部门
export const departmentGet  = data =>fetch('/department',data);
//新建部门
export const departmentPost  = data =>fetch('/department',data,'POST');
//删除部门
export const departmentDel  = data =>fetch('/department',data,'DELETE');
//修改部门
export const departmentPut  = data =>fetch('/department',data,'PUT');
//基础--生效失效
export const model_state_change  = data =>fetch('/model_state_change',data,'PUT');
//优惠券
export const senior_select  = data =>fetch('/senior_select',data);
//新增优惠券
export const dn_coupon_set_post  = data =>fetch('/dn_coupon_set',data,"POST");
//查询优惠券
export const dn_coupon_set  = data =>fetch('/dn_coupon_set',data);
//编辑优惠券
export const dn_coupon_set_put  = data =>fetch('/dn_coupon_set',data,"PUT");
//删除优惠券
export const dn_coupon_set_del  = data =>fetch('/dn_coupon_set',data,"DELETE");
//优惠券发放
export const dn_partner_coupon_post  = data =>fetch('/dn_partner_coupon',data,"POST");
//权限组
export const get_groups  = data =>fetch('/staff/get_groups',data);
//打印查询
export const print_conf = data =>fetch('/print_conf',data);
//上传图片
export const print_conf_post = data =>fetch('/print_conf',data,"POST");
//打印修改
export const print_conf_put_222 = data =>fetch('/print_conf',data,"PUT");

export const print_conf_info = data =>fetch('/print_conf_info',data,"PUT");
//充值记录
export const member_search_for_partner = data =>fetch('/member_search_for_partner',data);
//消费记录
export const cashier_search_for_partner = data =>fetch('/cashier_search_for_partner',data);
//优惠券查询
export const partner_all_coupon = data =>fetch('/partner_all_coupon',data);
//权限接口
export const get_permission = data =>fetch('/staff/get_permission',data);
//维修履历
export const maintenance_record = data =>fetch('/maintenance_record',data);
//修改余额
export const adjust_balance = data =>fetch('/partner/adjust_balance',data,'PUT');
//****************************************************周总********************************************************8
//单据管理
export const getFormItems = data => fetch('/multi_conditional_select',data);
export const construction = data => fetch('/construction',data, 'PUT');
export const backConstruction = data => fetch('/back_construction',data, 'PUT');
export const backWait = data => fetch('/recover',data, 'PUT');


// 删除施工中、待施工单据
export const deleteOrder  = data => fetch('/dn_maintenance_order',data,'DELETE');

//工单收银按钮接口
export const orderPay = data => fetch('/dn_maintenance_order_cashier',data,'POST');

// 根据ID查询单据信息
export const getOrder = data => fetch('/dn_maintenance_order',data,'GET');

//修改单据信息
export const editOrder = data => fetch('/dn_maintenance_order',data,'PUT');

//工作台模糊查询
export const queryOrder = data => fetch('/workbench_select',data, 'GET');

// 工作台数据统计
export const queryStatic = data => fetch('/dn_maintenance_order_statistics',data,'GET')
// 获取基础维修项目
export const getProjects = data => fetch('/dn_maintenance_item',data);

// 获取基础配件
export const getParts = data => fetch('/dn_stock/parts',data,'GET');

// 获取班组信息
export const getTeam = data => fetch('/staff/team_group',data,'GET');

// 删除维修项目
export const deletePro = data => fetch('/dn_maintenance_order_project_parts_list',data,'DELETE');

//工单收银
export const workingOrder  = data => fetch('/cashier_search_model_rid',data);
//收银单收银
export const renderOrder  = data => fetch('/dn_cashier_order',data);
// 获取接待人列表
export const getEmployee = data => fetch('/employee',data,'GET');
//收银单查询
export const getCashOrder  = data => fetch('/cashier_multi_fuzzy_search',data);
//收银详单

export const renderItems  = data => fetch('/consumption_list_multi_fuzzy_search',data);

export const sendPayment = data => fetch('/dn_cashier_order_complete_cashier',data, 'PUT');

export const backCashier = data => fetch('/dn_cashier_order_back_cashier',data,'DELETE');

//仓库管理
export const getStockHouse  = data => fetch('/dn_stock/stock_house',data);
export const createStockHouse  = data => fetch('/dn_stock/stock_house',data,'POST');
export const deleteStockHouse  = data => fetch('/dn_stock/stock_house',data,'DELETE');
export const modifyStockHouse  = data => fetch('/dn_stock/stock_house',data,'PUT');
export const searchPart  = data => fetch('/dn_stock/parts',data);
export const modifyPart = data => fetch('/dn_stock/parts',data,'PUT');
export const createPart  = data => fetch('/dn_stock/parts',data,'POST');
export const stockIn  = data => fetch('/dn_stock/stock_in/create_in_lines',data,'POST');
export const fetchPartsList  = data => fetch('/dn_stock/stock_part',data);
export const modifySku  = data => fetch('/dn_stock/stock_part',data,'PUT');
// export const stockInOnList  = data => fetch('/dn_stock/stock_in',data,'POST');

// ***************************供应商管理******************************//
export const getSupplier  = data => fetch('/dn_stock/supplier',data);
export const createSupplier  = data => fetch('/dn_stock/supplier',data,'POST');
export const modifySupplier  = data => fetch('/dn_stock/supplier',data,'PUT');
export const deleteSupplier  = data => fetch('/dn_stock/supplier',data,'DELETE');

//配件出库
export const gen_out = data => fetch('/dn_stock/stock_out/gen_out_lines',data,'POST');

//确认出库
export const confirmOut = data => fetch('/dn_stock/stock_out/put_out',data,'POST')

// 出库明细删除功能
export const delete_out = data => fetch('/dn_stock/stock_out_line',data,'DELETE');

// 出库明细查询功能
export const showOuted = data => fetch('/dn_stock/stock_out/get_out_lines',data,'POST');

// 获取出库明细详情
export const getStockOutDetail = data => fetch('/dn_stock/stock_out_line',data);

// 获取出库明细
export const getStockOut = data => fetch('/dn_stock/stock_out/multi_fuzzy_search',data);

// 获取入库明细详情
export const getStockInDetail = data => fetch('/dn_stock/stock_in_line',data);

// 获取入库明细
export const getStockIn = data => fetch('/dn_stock/stock_in/multi_fuzzy_search',data);

// 获取盘点明细
export const getStockCheck = data => fetch('/dn_stock/stock_check/multi_fuzzy_search',data);

// 修改出库明细
export const modifyGenOut = data => fetch('/dn_stock/stock_out_line',data,'PUT');

// 操作退库
export const handlebackOut = data => fetch("/dn_stock/stock_out/back_out",data,'POST')

// 获取配件已出库明细
export const fetchOuted = data => fetch("/dn_stock/stock_out/get_out_lines_accessories",data,'POST')

// 会员充值
export const handlecharge = data => fetch("/member_charge_create_cashier_order",data,'POST')

//优惠券
export const getDiscounts  = data => fetch('/dn_partner_coupon',data);
export const useDiscounts = data => fetch('/use_partner_coupon',data,'PUT');
export const dontUseDiscounts = data => fetch('/cancel_use_partner_coupon',data,'PUT');
export const checkVIPCard  = data => fetch('/member_cashier_affirm',data);

// 打印
export const handlePrint  = data => fetch('/dn_report/download',data,'GET');
//导出
export const order_export = data => fetch('/maintenance_export',data,'GET');

//保险公司
export const addInsurance = data => fetch('/dn_insurance_company',data,'POST');
export const modInsurance = data => fetch('/dn_insurance_company',data,'PUT');
export const delInsurance = data => fetch('/dn_insurance_company',data,'DELETE');
export const getInsurance = data => fetch('/insurance_company_multi_fuzzy_search',data,'GET');
// 店名修改
export const modCompanyName = data => fetch('/change_company_name',data,'POST');
