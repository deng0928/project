import Vue from 'vue'
import Vuex from 'vuex'
// import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex);

const state = {
	userInfo: { //用户状态
		avatar: 'default.jpg',
	},
};

const mutations = {
	saveUserInfo(state, adminInfo){
		state.userInfo = adminInfo;
	}
};

const actions = {
	// async getUserData({commit}){
	// 	try{
	// 		const res = await getAdminInfo();
	// 		if (res.status == 1) {
	// 			commit('saveAdminInfo', res.data);
	// 		}else{
	// 			throw new Error(res)
	// 		}
	// 	}catch(err){
	// 		console.log('您尚未登陆或者session失效')
	// 	}
	// }
};

export default new Vuex.Store({
	state,
	actions,
	mutations,

})
