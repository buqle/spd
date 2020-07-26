/**
 * @file 菜头结算 - 补货计划
 */
import {_local} from '../local';

export  const replenishmentPlan = {
    PLANLIST: `${_local}/a/depot/depotplan/list`, //补货计划列表
    PURCHASEORDERLIST: `${_local}/a/purchaseorder/list`, //计划订单列表
    QUERYDRUGBYDEPT: `${_local}/a/depot/depotplan/queryDrugByDept`,  //添加产品查询产品信息列表
    QUERY_DRUG_BY_LIST: `${_local}/a/common/queryDrugByList`, 
    QUERY_DRUG_DETAIL_BY_LIST: `${_local}/a/common/queryDrugDetailByList`, 
    QUERY_DRUG_BY_LIST2: `${_local}/a/depot/depotplan/detailXG`,   //添加产品 - 下拉框
    QUERY_DRUG_BY_LISTXG: `${_local}/a/depot/depotplan/detailbydrugname`,  //添加产品 - 下拉框
    PRINT_DETAIL: `${_local}/a/orderdetail/print/printDetail`,      //订单管理打印
    PLAN_DETAIL_PRINT: `${_local}/a/plandetail/print/printDetail`,      //补货计划打印
    IMPORTEXCEL:`${_local}/a/depot/depotplan/importXG`, //补货计划excel导入
}


//详情添加搜索url
export const TableSearchUrl={
	//调价确认
	searchpricingConfirmation: `${_local}/a/common/queryDrugByList`, 
	//计划审核
	searchplanCheck: `${_local}/a/common/queryDrugByList`, 
	searchplanCheckb:`${_local}/a/depot/depotplan/detail`,
	//自采计划审核
	searchsinceMiningPlanCheck: `${_local}/a/common/queryDrugByList`, 
	searchsinceMiningPlanChecktable:`${_local}/a/depot/depotplan/detail`,

	//
	searchplanOrder: `${_local}/a/common/queryDrugByList`, 
	searchplanOrdertable: `${_local}/a/purchaseorder/detail`, 

	searchoutReceiptMgt: `${_local}/a/common/queryDrugByList`, 
	searchoutReceiptMgttable: `${_local}/a/common/outstoredetail/detailInfo`, 

	searchmakeDetail: `${_local}/a/common/queryDrugByList`, 
	searchmakeDetailtable: `${_local}/a/bill/balance/make/detail`,

	searchstockInquiry: `${_local}/a/common/queryDrugByList`, 

	searchorderExecuteDetail: `${_local}/a/common/queryDrugByList`, 

	searchbackStorage: `${_local}/a/common/queryDrugByList`, 
	searchbackStoragetable: `${_local}/a/commonback/back/info`,

	searchacceptAnyReturns: `${_local}/a/common/queryDrugByList`, 

	searchoutReceiptMgtb: `${_local}/a/common/queryDrugByList`, 

	searchorderFulfillment: `${_local}/a/common/queryDrugByList`, 

	searchgroundingwareHouse: `${_local}/a/common/queryDrugByList`, 

	searchpickingUnderShelve: `${_local}/a/common/queryDrugByList`, 

	searchpharmacyReview: `${_local}/a/common/queryDrugByList`, 

	searchlockedCheckdetails: `${_local}/a/common/queryDrugByList`, 

	
	searchacceptancewareHouse: `${_local}/a/common/queryDrugByList`, 

	searchputawayHouse: `${_local}/a/common/queryDrugByList`, 

	searchwareHousenewLibrary: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragereview: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragereoutput: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragernewOut: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragepickingUnderShelve: `${_local}/a/common/queryDrugByList`, 
	
	searchoutStoragerefund: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragewithdraw: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragepharmacyReview: `${_local}/a/common/queryDrugByList`, 

	searchoutStoragelocked: `${_local}/a/common/queryDrugByList`, 

	searchgoodsAdjustadjust: `${_local}/a/common/queryDrugByList`, 

	searchconfigMgtbaseMgtdrug: `${_local}/a/common/queryDrugByList`, 

	searchconfigMgsalvageListdrug: `${_local}/a/common/queryDrugByList`,

	searchwareHousedrugsFor: `${_local}/a/common/queryDrugByList`,

	searchoutStoragebaseReplen: `${_local}/a/common/queryDrugByList`,

	searchsupplementDocsupplementDocuments: `${_local}/a/common/queryDrugByList`,

	searchsupplementDocexceptionHandling: `${_local}/a/common/queryDrugByList`,

	searchsalvageCarsalvageCarStock: `${_local}/a/common/queryDrugByList`,

	searchsalvageCardrugApply: `${_local}/a/common/queryDrugByList`,

	searchsalvageCaracceptance: `${_local}/a/common/queryDrugByList`,

	searchwareHouseacceptance: `${_local}/a/common/queryDrugByList`,

	searchwareHousepsListCheck: `${_local}/a/common/queryDrugByList`,	

	searchoutStorageacceptDistribution: `${_local}/a/common/queryDrugByList`,

	searchstockMgtstockInquiry: `${_local}/a/common/queryDrugByList`,
	
	searchconfigMgtbaseMgtdrugb: `${_local}/a/common/queryDrugByList`,

	searchsupplementDocsupplementDocCheck: `${_local}/a/common/queryDrugByList`,
	
}
//缺货管理
export const shortages={
    SHORTAGELIST: `${_local}/a/purchaseorderdetail/findDifference`, //缺货管理
}