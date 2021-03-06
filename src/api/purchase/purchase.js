/*-- 结算管理 --*/
import {_local} from '../local';

//公共

export const common = {
  QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`,   //通用名|产品名 查询药品列表
}

//结算单
export const settlementMgt = {
  SETTLE_LIST: `${_local}/a/settle/list`,       //结算单管理列表
  DETAIL_LIST: `${_local}/a/settle/detailList`, //结算单详情列表
  PRINT_DELIVERY_DETAIL: `${_local}/a/settlebill/print/printDeliveryDetail`,  //结算单打印
};
//生成结算单
export  const  createSettle={
    CREATE_SETTLE_LIST:`${_local}/a/balancedetail/list`
}

//日对账单
export const dayStatements = {
  DAILY_LIST: `${_local}/a/bill/balance/dailyList`,   //日对账单列表
  DAILY_DETAIL_LIST: `${_local}/a/bill/balance/dailyDetailList`,//日对账单详情列表
    DAILY_DETAIL_LIST_NEW: `${_local}/a/bill/balance/detailList`,//日对账单详情列表
  GENERATOR_DAILY_LIST: `${_local}/a/bill/balance/generatorDailyList`,//生成对账单列表printDeliveryDetail
  PRINT_DELIVERY_DETAIL: `${_local}/a/dailybill/print/printDeliveryDetail`,   //打印
}
//结余
export const hissettleref = {
    HISSETTLEREF: `${_local}/a/hissettleref/list `,   //结余列表

}

//发票查询
export const invoiceQueryMenu = {
  INVOICE_LIST: `${_local}/a/invoice/list`,     //发票查询列表
}

//统计分析
export const statisticAnalysis = {
  STATICS_LIST: `${_local}/a/ypjxq/statics/list`,   //近效期列表
  GET_DEPT_BY_PARAM: `${_local}/a/sys/sysdept/getDeptByParam`,    //供应商下拉
  KSTK_LIST: `${_local}/a/statics/kstk/list`,             //科室退库分析列表
  DRUG_LEDGER: `${_local}/a/statics/medicineStanding/drugLedger`, //药品台账列表
  DRUG_LEDGER_NEW: `${_local}/a/statics/medicineStanding/newDrugLedger`, //药品台账列表新
  EXCESSIVE_LIST: `${_local}/a/excessive/statics/list`,           //损益分析列表
  PROFIT_LOSS_DETAIL_LIST: `${_local}/a/excessive/statics/getDetail`,   //损益分析详情列表
  SUPPLIER_RETURN_LIST: `${_local}/a/statics/supplierReturn/list`,  //供应商退货分析列表
  ORDER_EXECUTE: `${_local}/a/orderexecute/count`,      //订单执行情况列表
  EXECUTE_DETAIL_LIST: `${_local}/a/orderexecute/executedetail`,    //订单执行情况详情列表
  SUPPLIER_ANALYZE: `${_local}/a/orderexecute/supplierofmaterial`,     //供应商供货分析列表trace
  TRACE_LIST: `${_local}/a/orderexecute/trace`,         //订单追溯列表
  ORDER_DETAIL_TRACE: `${_local}/a/orderexecute/orderDetailTrace`,    //订单追溯详情分页
  GYSPH_LIST: `${_local}/a/gysph/statics/supplierlist`,     //供应商排行/a/gysph/statics/list
  OPERATIONLOG_LIST: `${_local}/a/operationlog/list`,     //绩效信息表
  BATCH_LIST: `${_local}/a/common/trace/tracePageList`,         //批号追溯列表
  QUERY_DRUG_DEPT_LIST: `${_local}/a/StoreDetail/queryDrugByDeptAll`,   //库存查询
   QUERY_DRUG_DEPT_LIST_NEW: `${_local}/a/StoreDetailDaily/queryDailyByDept`,   //库存日志
  GET_PRICE_STATIC_LIST: `${_local}/a/priceStatic/list`,   //库存查询详情列表
  GET_PRICE_STATIC_DETAIL: `${_local}/a/priceStatic/getDetail`,   //库存查询详情列表
  GET_ROOM_REPERTORY_LIST_ALL: `${_local}/a/StoreDetail/getRoomRepertoryListAll`,
    GET_ROOM_REPERTORY_LIST: `${_local}/a/StoreDetailDaily/getRoomRepertoryList`,
  DELAYSTORE_LIST: `${_local}/a/statics/delayStore/list`,   //近效期列表
  COMPARISON_LIST:`${_local}/a/comparestock/list`,//库存对比列表
  STOREBALANCELIST:`${_local}/a/statics/storeBalance/findBalanceDetails`,//库存结存列表
  UNSETTLEDDRUGSLIST:`${_local}/a/bill/balance/dailyEceiptStatus`,//库存结存列表
}
//药品调价
export const drugPricing = {
  CHECK_PRICE: `${_local}/a/checkprice/list`,     //确认调价列表
  SELECT_DRUG_CODE: `${_local}/a/checkpricedetail/selectDrugCode`,    //添加产品
  CHECK_PRICE_DETAIL: `${_local}/a/checkpricedetail/getList`,     //详情列表
}

/**
 * @author QER
 * @date 2020/1/15
 * @Description: 批号调整功能
*/
export const batchAdjust={
  GET_BATCH_LIST:`${_local}/a/lot/lotadjust/list`,//查询列表
  ADD_DRUG_LIST:  `${_local}/a/lot/lotadjust/addlist`,//添加药品-查询药品
  GET_BATCH_CHECK_LIST:`${_local}/a/lot/lotadjust/checkList`,//审核-查询列表
}