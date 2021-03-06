import {_local} from '../local';

//统计分析
export const statisticAnalysis = {

  BATCH_LIST: `${_local}/a/common/trace/tracePageList`,         //批号追溯列表

}

//患者追溯
export const patientTracing={
	TABLE_LIST:`${_local}/a/reportform/lot/getSickGoodsLotReview`, //列表

	AB:`${_local}/reportform/userwork/getCheckacceptDetail`,
	AC:`${_local}/a/reportform/userwork/getPurchaseOrderDetail`
}
//人员工作统计
export const tracingTotalList={
	SEARCH:`${_local}/a/reportform/back/getSickBackReportform`, //同步采购记录
	HIS_BACK:`${_local}/a/reportform/back/getMedHisBack`, //获取退货单信息
	CHECK_BILL:`${_local}/a/reportform/userwork/getMedCommonCheckBillDetail`, //盘点
	TABLE_LIST:`${_local}/a/common/trace/tracePageList`, //补货明细
	TABLE_LISTYS:`${_local}/a/common/trace/tracePageList`, //验收单明细
	GET_Purchase_Order_List: `${_local}/a/reportform/userwork/getPurchaseOrderList`, // 人员工作统计 - 补货单
    GET_Purchase_Order_Details: `${_local}/reportform/userwork/getPurchaseOrderDetails`, // 人员工作统计 - 补货单明细
    GET_Checkaccept_Details: `${_local}/a/reportform/userwork/getCheckacceptDetails`, // 人员工作统计 - 验收单明细
    GET_Check_List: `${_local}/reportform/userwork/getCheckacceptList`, // 人员工作统计 - 验收单
    GET_Check_List_Detail: `${_local}/reportform/userwork/getCheckacceptDetail`, // 人员工作统计 - 验收单-三级页面详情
	WORKSTATIS:`${_local}/a/reportform/userwork/getUserWorkCount`,  // 人员工作统计
	DRUGgRECHECK:`${_local}/a/reportform/userwork/getCheckMedHisDispensings`, // 发药复核
	DISPENS:`${_local}/reportform/userwork/getMedHisDispensings`, // 调剂
	OUTGOING:`${_local}/a/reportform/userwork/getMedCommonOutStoreDetail`, // 出库复核
	GET_MED_Order_Detail:`${_local}/a/reportform/userwork/getMedCommonPickingOrderDetail`, // 下架


}
