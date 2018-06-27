import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false;
Vue.use(ElementUI);


new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
});

Vue.prototype.getJurisdiction = function (...val){
    var a = false;
    val.forEach(obj=>{
        if(sessionStorage.getItem('jurisdictionList').indexOf(obj)>=0) a = true
    })
    return a
};
Vue.prototype.toFixedTwo = function (value) {
    value = Number(value);
    return value.toFixed(2)
}
