import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import info from './modules/info'
import getters from './getters'
import menu from './modules/menu'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        tagsView,
        user,
        info,
        menu
    },
    getters
})

export default store