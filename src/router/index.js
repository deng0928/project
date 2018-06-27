import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const forget = r => require.ensure([], () => r(require('@/page/login/forget')), 'forget');
const createOrder_fix = r => require.ensure([], () => r(require('@/page/workbench/createOrder_fix')), 'createOrder_fix');
const createOrder_ins = r => require.ensure([], () => r(require('@/page/workbench/createOrder_ins')), 'createOrder_ins');
const reset = r => require.ensure([], () => r(require('@/page/login/reset')), 'reset');
const client = r => require.ensure([], () => r(require('@/page/client/client')), 'client');
const client_main = r => require.ensure([], () => r(require('@/page/client/client_main')), 'client_main');
const client_coupon = r => require.ensure([], () => r(require('@/page/client/client_coupon')), 'client_coupon');
const staff = r => require.ensure([], () => r(require('@/page/staff/staff')), 'staff');
const addStaff = r => require.ensure([], () => r(require('@/page/staff/addStaff')), 'addStaff');
const workbench = r => require.ensure([], () => r(require('@/page/workbench/workbench')), 'workbench');
const basics = r => require.ensure([], () => r(require('@/page/basics/basics')), 'basics');
const basics_fix = r => require.ensure([], () => r(require('@/page/basics/basics_fix')), 'basics_fix');
const addClient = r => require.ensure([], () => r(require('@/page/client/add-client')), 'addClient');
const clientDetail = r => require.ensure([], () => r(require('@/page/client/client-detail')), 'clientDetail');
const addCar = r => require.ensure([], () => r(require('@/page/basics/add-car')), 'addCar');
const fillCarDetail = r => require.ensure([], () => r(require('@/page/basics/fill-car-detail')), 'fillCarDetail');
const fillDetail = r => require.ensure([], () => r(require('@/page/basics/fill-detail')), 'fillDetail');
const carMain = r => require.ensure([], () => r(require('@/page/basics/car-main')), 'carMain');
const basics_dy = r => require.ensure([], () => r(require('@/page/basics/basics_dy')), 'basics_dy');
const brand = r => require.ensure([], () => r(require('@/page/basics/brand')), 'brand');
const editOrder = r => require.ensure([], () => r(require('@/page/workbench/editOrder')), 'editOrder');
//单据管理
const orders = r => require.ensure([], () => r(require('@/page/orders/orders')), 'orders');
const working_orders = r => require.ensure([], () => r(require('@/page/orders/working_orders')), 'working_orders');
const parts_orders = r => require.ensure([], () => r(require('@/page/orders/parts_orders')), 'parts_orders');
const cash_orders = r => require.ensure([], () => r(require('@/page/orders/cash_orders')), 'cash_orders');
const edit_Order = r => require.ensure([], () => r(require('@/page/orders/edit_order')), 'edit_order');
const settlement = r => require.ensure([], () => r(require('@/page/orders/settlement')), 'settlement');
const detail_of_order = r => require.ensure([], () => r(require('@/page/orders/detail_of_order')), 'detail_of_order');
const working_detail = r => require.ensure([], () => r(require('@/page/orders/working_detail')), 'working_detail');
const stock_out_detail = r => require.ensure([], () => r(require('@/page/orders/stock_out_detail')), 'stock_out_detail');
const stock_in_detail = r => require.ensure([], () => r(require('@/page/orders/stock_in_detail')), 'stock_in_detail');
//仓库管理
const storage = r => require.ensure([], () => r(require('@/page/storage/storage')), 'storage');
const parts_manage = r => require.ensure([], () => r(require('@/page/storage/parts_manage')), 'parts_manage');
const set_storage = r => require.ensure([], () => r(require('@/page/storage/set_storage')), 'set_storage');
//入库
const stock = r => require.ensure([], () => r(require('@/page/stock')), 'stock');
// 会员充值
const recharge = r => require.ensure([], () => r(require('@/page/workbench/recharge')), 'recharge');
//保险公司
const insurance = r => require.ensure([], () => r(require('@/page/basics/insurance')), 'insurance');

const routes = [
    {
        path: '/',
        component: login
    },
    {
        path: '/forget',
        component: forget
    },
    {
        path: '/reset',
        component: reset
    },
    {
        path: '/manage',
        component: manage,
        name: '',
        children: [

            {
                path: 'workbench',
                component: workbench,
                meta: [],

            },
            {
                path: 'editOrder',
                component: editOrder,
                meta: []
            },
            {
                path: 'createOrder_fix',
                component: createOrder_fix,
                meta: [],
            },
            {
                path: 'createOrder_ins',
                component: createOrder_ins,
                meta: [],
            },
            {
                path: 'recharge',
                component: recharge,
                meta: [],
            },
            {
                path: 'client_main',
                component: client_main,
                meta: [],
                children: [
                    {
                        path: '/',
                        component: client,
                        meta: [],
                    },
                    {
                        path: 'coupon',
                        component: client_coupon,
                        meta: [],
                    },
                    {
                        path: 'addClient/:identification',
                        component: addClient,
                        meta: [],
                    },
                    {
                        path: 'clientDetail/:id',
                        component: clientDetail,
                        meta: [],
                    },
                ]
            },

            {
                path:'addStaff/:id',
                component:addStaff
            },
            {
                path: 'orders',
                component: orders,
                meta: [],
                children:[
                    {
                        path: 'working',
                        component: working_orders,
                        meta: [],
                    },
                    {
                        path: 'parts',
                        component: parts_orders,
                        meta: [],
                    },
                    {
                        path: 'cashier',
                        component: cash_orders,
                        meta: [],
                    },
                    {
                        path:'edit_order',
                        component:edit_Order
                    },
                    {
                        path:'settlement',
                        component:settlement
                    },
                    {
                        path:'detail_of_order',
                        component:detail_of_order
                    },
                    {
                        path:'working_detail',
                        component:working_detail
                    },
                    {
                        path:'stock_out_detail',
                        component:stock_out_detail
                    },
                    {
                        path:'stock_in_detail',
                        component:stock_in_detail
                    },
                ]
            },
            {
                path: 'storage',
                component: storage,
                meta: [],
                children:[
                    {
                        path: 'parts_manage',
                        component: parts_manage,
                        meta: [],
                    },
                    {
                        path: 'set_storage',
                        component: set_storage,
                        meta: [],
                    },
                    {
                        path: 'stock',
                        component: stock,
                        meta: [],
                    },
                ]
            },
            {
                path: 'staff',
                component: staff,
                meta: [],
            },
            {
                path: 'basics',
                component: basics,
                meta: [],
                children: [
                    {
                        path: '/',
                        component: carMain,
                        meta:{keepAlive: false}
                    },
                    {
                        path: 'addCar/:id',
                        component: addCar,
                        meta:{keepAlive: false}
                    },
                    {
                        path: 'fillCarDetail/:id',
                        component: fillCarDetail,
                        meta:{keepAlive: true}
                    },
                    {
                        path: 'fillDetail/:id',
                        component: fillDetail,
                        meta:{keepAlive: false}
                    },
                    {
                        path:'brand',
                        component:brand,
                        meta:{keepAlive: false}
                    },
                    {
                        path: 'basics_fix',
                        component: basics_fix,
                        meta:{keepAlive: false}
                    },
                    {
                        path: 'basics_dy',
                        component: basics_dy,
                        meta:{keepAlive: false}
                    },
                    {
                        path: 'insurance',
                        component: insurance,
                        meta:{keepAlive: false}
                    }
                ]
            },

        ]
    }
];

export default new Router({
    routes
})
