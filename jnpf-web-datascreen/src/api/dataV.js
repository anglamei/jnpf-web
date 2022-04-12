import request from '@/utils/request'

// 获取大屏分类
export const getDataVTypeSelector = () => {
  return request({
    url: '/api/system/Base/DictionaryData/b1474890faaa47e1858ce7b593c8ffd7/Data/Selector',
    method: 'GET'
  })
}

// 添加大屏
export const createDataV = data => {
  return request({
    url: '/api/visualdev/DataScreen',
    method: 'POST',
    data
  })
}

// 修改大屏
export const updateDataV = (data, id) => {
  return request({
    url: `/api/visualdev/DataScreen/${id}`,
    method: 'PUT',
    data
  })
}

// 获取大屏信息
export const getDataVInfo = id => {
  return request({
    url: `/api/visualdev/DataScreen/${id}`,
    method: 'GET',
  })
}

// 保存截图
export const savaScreenShot = data => {
  return request({
    url: '/api/visualdev/DataScreen/Images/screenShot/Uploader',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}


// 获取地图下拉框
export const getMapSeletor = () => {
  return request({
    url: '/api/system/Base/DataMap/Selector',
    method: 'GET'
  })
}

// 数据接口下拉列表
export const getDataInterfaceSelector = () => {
  return request({
    url: '/api/system/Base/DataInterface/Selector',
    method: 'GET'
  })
}

// 获取数据接口数据
export const getDataInterfaceResponse = id => {
  return request({
    url: `/api/system/Base/DataInterface/${id}/Actions/Response`,
    method: 'GET'
  })
}

// 获取图片列表
export const getImgList = type => {
  return request({
    url: `/api/visualdev/DataScreen/Images/${type}`,
    method: 'GET',
  })
}
