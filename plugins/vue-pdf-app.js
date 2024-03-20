
import Vue from 'vue'
import "vue-pdf-app/dist/icons/main.css";
// import VuePdfApp from "vue-pdf-app";
// Vue.component('VuePdfApp', VuePdfApp)

if (process.browser) {
  window.onNuxtReady(() => {
    const VuePdfApp = require('vue-pdf-app')
    Vue.component('VuePdfApp', VuePdfApp)
  })
}
