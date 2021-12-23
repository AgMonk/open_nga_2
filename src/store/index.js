import { createStore } from 'vuex'
import read from "@/store/read";
import users from "@/store/users";
import breadcrumb from "@/store/breadcrumb";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {read,users,breadcrumb
  }
})
