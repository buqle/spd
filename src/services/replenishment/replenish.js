/**
 * @file 补货管理 - 补货计划
 * @author chengyafang
 * @Date 2018/8/29 11:08
 */
import request from '../../utils/request';
import { _local } from '../../api/local';

// 补货计划 - 删除
export function ReplenishDelete(options) {
  return request(`${_local}/a/depot/depotplan/updateStatus`, {
    methods: 'POST',
    type: 'json',
    body: options
  })
}
// 补货计划 - 详情
export function ReplenishDetails(options) {
  return request(`${_local}/a/depot/depotplan/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}
//补货计划 - 添加产品
export function addDrug(options) {
  return request(`${_local}/a/depot/depotplan/addDrug`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//补货计划 - 新建(编辑) - 保存(提交)
export function submit(options) {
  return request(`${_local}/a/depot/depotplan/save`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
// 状态
export function typelist(options) {
  return request(`${_local}/a/spd/dict/type`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
} 

// 补货计划 - 详情
export function detailXG(options) {
  return request(`${_local}/a/depot/depotplan/detailXG`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}


// 目录外采购新建计划-- 采购部门
export function getModule(options) {
  return request(`${_local}/a/sys/sysdept/getByModule`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

/*  计划订单 */ 
// 供应商下拉框
export function supplierList(options) {
  return request(`${_local}/a/depot/supplier/all`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}
// 订单状态
export function orderStatus(options) {
  return request(`${_local}/a/spd/dict/type`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//  发送订单
export function sendOrder(options) {
  return request(`${_local}/a/purchaseorder/sendOrder2Supplier`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

// 作废订单
export function cancelOrder(options) {
    return request(`${_local}/a/purchaseorder/cancelOrder`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}

// 关闭订单
export function closeOrder(options) {
  return request(`${_local}/a/purchaseorder/closeOrder`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

 //订单状态更新
export function updateStatus(options) {
  return request(`${_local}/a/depot/depotplan/updateStatus`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}


// 计划订单 - 详情
export function planOrderDetail(options) {
  return request(`${_local}/a/purchaseorder/detail`, {
    method: 'GET',
    type: 'planCode',
    body: options
  })
}
// 导出模板
export function excelOut(options) {
  return request(`${_local}/a/depot/depotplan/exportForModel`, {
    method: 'GET',
    type: 'formData',
    export: true,
    body: options
  })
}

// 入库导出
export function outFile(options) {
  return request(`${_local}/a/deliver/print/exportAsPrint`, {
  method: 'GET',
  type: 'formData',
  export: true,
  body: options
  })
  }

//计划审核修改需求数量
export function updateQty(options) {
    return request(`${_local}/a/depot/depotplan/updateQty`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//  缺货管理－生成补货计划
export function createReplenishment(options) {
    return request(`${_local}/a/purchaseorderdetail/createReplenishment`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}

// 缺货管理－导出
export function exportDifference(options) {
    return request(`${_local}/a/purchaseorderdetail/exportDifference`, {
        method: 'POST',
        type: 'formData',
        export: true,
        body: options
    })
}
// 缺货管理－删除
export function replenishmenthDelete(options) {
    return request(`${_local}/a/purchaseorderdetail/delete`, {
        methods: 'POST',
        type: 'json',
        body: options
    })
}