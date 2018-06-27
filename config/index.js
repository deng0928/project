// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8002,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/partner':{
            target:'http://10.10.0.145/api',
            changeOrigin:true,
        },
        '/login':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/select_brand_series':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/car':{
            target:'http://10.10.0.145/api',

            changeOrigin:true
        },
        '/employee':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/department':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/brand_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/series_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/model_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/jy_car_model':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_brand':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_series':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_car_model':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/model_state_change':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/maintenance_item_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_project_classify':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/project_classify_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/maintenance_item_state_change':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/senior_select':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_coupon_set':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_partner_coupon':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/staff/get_groups':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/print_conf':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/member_search_for_partner':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/cashier_search_for_partner':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/partner_all_coupon':{

            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        //单据管理
        '/dn_maintenance_order': {
            target:'http://10.10.0.145/api',
            changeOrigin: true,
        },
        '/multi_conditional_select':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/construction':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/get_sms_code':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/check_sms_code':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/reset_password':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/workbench_select':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },

        '/back_construction':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/cashier_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_cashier_order':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/consumption_list_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_cashier_order_complete_cashier':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_cashier_order_back_cashier':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_maintenance_item':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_stock/parts':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/staff/team_group':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/dn_maintenance_order_project_parts_list':{
            target:'http://10.10.0.145/api',
            changeOrigin:true
        },
        '/car/quick_order_car': {
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        'dn_maintenance_order_cashier':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/cashier_search_model_rid': {
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_house':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/supplier':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_part':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_in/create_in_lines':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/gen_out_lines':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/put_out':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out_line':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_in/multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_check/multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_in_line':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/get_out_lines':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/back_out':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_stock/stock_out/get_out_lines_accessories':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/member_charge_create_cashier_order':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_maintenance_order_statistics':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        //优惠券
        '/use_partner_coupon':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/cancel_use_partner_coupon':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/dn_report/download':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/maintenance_export':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/member_cashier_affirm':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/recover':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/staff/get_permission':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/logout':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        },
        '/insurance_company_multi_fuzzy_search':{
            target:'http://10.10.0.145/api',
            changeOrigin: true
        }
    }
    ,
    context: [ //代理路径
        '/partner',
        '/login',
        '/car',
        '/employee',
        '/brand_multi_fuzzy_search',
        '/series_multi_fuzzy_search',
        '/model_multi_fuzzy_search',
        '/jy_car_model',
        '/dn_brand',
        '/dn_series',
        '/dn_car_model',
        '/maintenance_item_multi_fuzzy_search',
        '/model_state_change',
        '/project_classify_multi_fuzzy_search',
        '/maintenance_item_state_change',
        '/senior_select',
        '/dn_coupon_set',
        '/dn_partner_coupon',
        '/staff/get_groups',
        '/print_conf',
        '/member_search_for_partner',
        '/cashier_search_for_partner',
        '/partner_all_coupon',
        //单据管理
        '/partnerp',
        '/construction',
        '/get_sms_code',
        '/check_sms_code',
        '/dn_maintenance_item',
        '/dn_stock/parts',
        '/reset_password',
        '/dn_maintenance_order',
        '/workbench_select',
        '/back_construction',
        '/multi_conditional_select',
        '/select_brand_series',
        '/cashier_multi_conditional_search',
        '/dn_maintenance_order_project_parts_list',
        '/car/quick_order_car',
        '/cashier_multi_fuzzy_search',
        '/dn_cashier_order',
        '/consumption_list_multi_fuzzy_search',
        '/dn_cashier_order_complete_cashier',
        '/dn_cashier_order_back_cashier',
        'dn_maintenance_order_cashier',
        '/department',
        '/staff/team_group',
        '/cashier_search_model_rid',
        '/dn_stock/stock_out/multi_fuzzy_search',
        '/dn_stock/stock_in/multi_fuzzy_search',
        '/dn_stock/stock_check/multi_fuzzy_search',
        //仓库
        '/dn_stock/stock_house',
        '/dn_stock/supplier',
        '/dn_stock/parts',
        '/dn_stock/stock_part',
        '/dn_stock/stock_in/create_in_lines',
        '/dn_stock/stock_out/gen_out_lines',
        '/dn_stock/stock_out/put_out',
        '/dn_stock/stock_out_line',
        '/dn_stock/stock_in_line',
        '/dn_stock/stock_out/get_out_lines',
        "/dn_stock/stock_out/back_out",
        '/dn_stock/stock_out/get_out_lines_accessories',
        '/member_charge_create_cashier_order',
        '/dn_maintenance_order_statistics',
        //优惠券
        '/dn_partner_coupon',
        '/use_partner_coupon',
        '/cancel_use_partner_coupon',
        '/dn_report/download',
        '/maintenance_export',
        '/member_cashier_affirm',
        '/recover',
        '/staff/get_permission',
        '/logout',
        '/insurance_company_multi_fuzzy_search'
    ],
    cssSourceMap: false
  }
};
