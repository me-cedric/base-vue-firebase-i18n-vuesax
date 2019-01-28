import Vue from 'vue'
import Vuesax from 'vuesax'
import firebase from './firebase/firebase'
import functions from 'firebase/functions'
import App from './App.vue'
import router from './router'
import store from './store'
import LanguageService, { i18n } from './services/LanguageService'
import VModal from 'vue-js-modal'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css'

Vue.config.productionTip = false

let app = ''

// adding firebase to the Vue.prototype allows usage of firebase in your vue components by using this.$firebase
Vue.prototype.$firebase = firebase
Vue.prototype.$functions = functions

Vue.prototype.$languageService = LanguageService

// Frontend framework
Vue.use(Vuesax)

// Adding the modal plugin
Vue.use(VModal, { dynamic: true })

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      i18n,
      render: h => h(App)
    }).$mount('#app')
  }
})
