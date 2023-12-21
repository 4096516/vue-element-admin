/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const empRouter = {
  path: '/emp',
  component: Layout,
  redirect: '/emp/complex-table',
  name: '职工管理',
  meta: {
    title: '职工管理',
    icon: 'el-icon-s-help'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: '员工统计' , icon: 'edit'}
    },
    {
      path: 'employee-list',
      component: () => import('@/views/employee/employee-list'),
      name: 'EmployeeList',
      meta: { title: '职工列表' , icon: 'list' }
    }
  ]
}
export default empRouter
