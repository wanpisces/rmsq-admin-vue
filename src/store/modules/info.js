import { NewsModuleList } from '../../fetch/modules/info'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Message from  './../../components/Message/index'
const info = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 资讯模块列表获取
    newsModuleList({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        RequestModuleList({}).then(response => {
          resolve(response)
        }).catch (error => {
            reject(error)
        })
      })
    }
  }
}

export default info
