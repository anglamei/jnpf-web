import Pagination from '@/components/Pagination'
import JNPFTable from '@/components/JNPF-table'

export default {
  install(Vue, options) {
    Vue.component('Pagination', Pagination)
    Vue.component('JNPFTable', JNPFTable)
  }
}