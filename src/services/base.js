import request from '../utils/request';
import { _local } from '../api/local';


//选择产品时-根据关键字获取下拉框
export function SearchProductSelect(options){
  return request(`${_local}/a/common/queryDrugByList`,{ 
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//公共确认验收
export function commonConfirmCheck(options) {
  return request(`${_local}/a/examdetail/checkList`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}

export function commonReject(options) {
    return request(`${_local}/a/examdetail/reject`,{
        method: 'POST',
        type: 'json',
        body: options
    })
}
//补货单据-新增出库/入库
export function InsertMakeup(options){
  return request(`${_local}/a/roommakeupdetail/makeupdetail/insertmakeup`,{ 
    method: 'POST',
    type: 'json',
    body: options
  })
}
//药品药库基数药 - 药品目录 - 导出
export function deptExport(options) {
  return request(`${_local}/a/his/hisctmedicinematerial/export`, {
    method: 'POST',
    type: 'formData',
    export: true,
    body: options
  })
}

//补登 - 新建补登异常入库单
export function addAbnormalDataSource(options) {
  return request(`${_local}/a/medHisBackDetail/medhisbackdetail/druglist`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}

//补登 - 新建异常入库单 - 确认
export function confrimList(options) {
  return request(`${_local}/a/medHisBackDetail/medhisbackdetail/confrimList`, {
    method: 'POST',
    type: 'json',
    body: options
  })
}
//补登 - 新建异常出库单 - 确认
export function submitBadFlowList(options) {
  return request(`${_local}/a/bill/balance/submitBadFlowList`, {
    method: 'POST',
    type: 'formData',
    body: options
  })
}

//自采计划导出
export function depotplanDetailExport(options) {
  return request(`${_local}/a/depotdetail/depotplandetail/export`, {
    method: 'POST',
    type: 'json',
    body: options,
    export: true
  })
}
//补货计划导出
export function depotplanExport(options) {
    return request(`${_local}/a/depotdetail/depotplandetail/planExport`, {
        method: 'POST',
        type: 'json',
        body: options,
        export: true
    })
}

//补登入库单添加产品
export function roomMakeupDetail(options) {
  return request(`${_local}/a/roommakeupdetail/makeupdetail/queryDrugSuppllier`, {
    method: 'POST',
    type: 'json',
    body: options,
  })
}

//全院管理 -- 退货审核  -- 通过/驳回
export function depotBackSubmit(options) {
  return request(`${_local}/a/commonback/backdetail/depotBackSubmit`, {
    method: 'POST',
    type: 'json',
    body: options,
  })
}
//获取科室下拉列表
export function getAllDeptByCondition(options) {
    return request(`${_local}/a/his/dept/getAllDeptByCondition`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//接口调用card
export function getLogCountByDate(options){
    return request(`${_local}/a/interfacelog/getLogCountByDate`,{
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//修改指示货位进行移库操作
export function locAdjustStock(options) {
    return request(`${_local}/a/depot/druginfo/locAdjustStock`,{
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//查询药品
export function queryDrug(options) {
    return request(`${_local}/a/depot/depotplan/queryDrugByDept`,{
        method: 'POST',
        type: 'json',
        body: options,
    })
}
//申领-删除
export function deleteAppStore(options) {
    return request(`${_local}/a/apply/batchDelete`,{
        method: 'POST',
        type: 'json',
        body: options,
    })
}
