/* 采购结算 - 结算管理 */
import request from '../../utils/request';
import { _local } from '../../api/local';
/*-- 结算单 --*/
export function settleDetail(options) {
  return request(`${_local}/a/settle/detail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
};
export function settleExport(options) {
  return request(`${_local}/a/settle/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}

//批量审核-结算单
export function batchAuditSettle(options) {
    return request(`${_local}/a/settle/batchCheck`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//批量删除-结算单
export function batchdeleteSettle(options) {
    return request(`${_local}/a/settle/batchDelete`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}

/*-- end --*/

/*-- 日对账单 --*/
export function dailyDetail(options) {
  return request(`${_local}/a/bill/balance/dailyDetail`, {
    method: 'GET',
    type: 'formData',
    body: options
  })
}

export function push2Hrp(options) {
  return request(`${_local}/a/bill/balance/push2Hrp`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
export function balanceStatus(options) {
    return request(`${_local}/a/bill/balance/balanceStatus`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
export function billExport(options) {
  return request(`${_local}/a/bill/balance/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}
/*-- end --*/
/**
 * @author QER
 * @date 19/4/3
 * @Description: 结余导出
*/
export function hissetExport(options) {
    return request(`${_local}/a/hissettleref/export`, {
        method: 'POST',
        type: 'formData',
        export: true,
        body: options
    })
}
/**
 * @author QER
 * @date 2019/11/25
 * @Description: 结算管理-生成结算单-生成
*/
export function createReplenishment(options) {
    return request(`${_local}/a/balancedetail/generatorSettleList`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
/**
 * @author QER
 * @date 2019/11/25
 * @Description: 结算管理-生成结算单-导出
*/
export function exportDifference(options) {
    return request(`${_local}/a/balancedetail/export`, {
        method: 'POST',
        type: 'formData',
        export: true,
        body: options
    })
}