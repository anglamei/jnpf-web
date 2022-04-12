import request from '@/utils/request'

export function getTenantList(data) {
  return request({
    url: '/api/tenant',
    method: 'get',
    data
  })
}
export function addTenant(data) {
  return request({
    url: '/api/tenant',
    method: 'post',
    data
  })
}
export function updateTenant(data) {
  return request({
    url: `/api/tenant/${data.id}`,
    method: 'put',
    data
  })
}
export function getTenantInfo(id) {
  return request({
    url: `/api/tenant/${id}`,
    method: 'get'
  })
}
export function delTenant(id, data) {
  return request({
    url: `/api/tenant/${id}`,
    method: 'delete',
    data
  })
}