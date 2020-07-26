import * as settlementMgt from '../../services/purchase/settlementMgt';
import * as replenishment from "../../services/replenishment/replenish";
import { message } from 'antd';
/* 采购结算 -  结算管理 */
export default {
  namespace: 'settlementMgt',
  state: {},
  reducers: {},
  effects: {
    /*-- 结算单 --*/
    //结算单详情
    *settleDetail({payload, callback}, {call}) {
      const data = yield call(settlementMgt.settleDetail, payload);
      callback && callback(data);
    },
    //导出
    *settleExport({payload, callback}, {call}) {
      const data = yield call(settlementMgt.settleExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
      // 结算管理－生成结算单
      *batchAuditSettle({ payload, callback }, { call }){
          const data = yield call(settlementMgt.batchAuditSettle, payload);
          let flag = true;
          if(callback && typeof callback === 'function'){
              callback(data);
          }
      },
      //批量删除
      *batchdeleteSettle({ payload, callback }, { call }){
          const data = yield call(settlementMgt.batchdeleteSettle, payload);
          let flag = true;
          if(data.code === 200 && data.msg === 'success'){
              message.success('批量删除单据成功');
          }else{
              flag = false;
              message.error(data.msg || '批量删除单据失败')
          }
          if(callback) callback(flag);
      },

    /*-- end --*/
    /*-- 日对账单 --*/
    *dailyDetail({payload, callback}, {call}) {
      const data = yield call(settlementMgt.dailyDetail, payload);
      callback && callback(data);
    },
      *balanceStatus({ payload, callback }, { call }){
          const data = yield call(settlementMgt.balanceStatus, payload);
          let flag = true;
          if(data.code === 200 && data.msg === 'success'&& data.data==true){
              message.success('操作成功');
          }else{
              flag = false;
              message.error('操作失败')
          }
          if(callback) callback(flag);
      },
    //导出
    *billExport({payload, callback}, {call}) {
      const data = yield call(settlementMgt.billExport, payload);
      if(typeof callback === 'function') {
        callback && callback(data);
      };
    },
    /*-- end --*/
      //结余导出
      *hissetExport({payload, callback}, {call}) {
          const data = yield call(settlementMgt.hissetExport, payload);
          if(typeof callback === 'function') {
              callback && callback(data);
          };
      },
      // 结算管理－生成结算单
      *createReplenishment({ payload, callback }, { call }){
          const data = yield call(settlementMgt.createReplenishment, payload);
          let flag = true;
          if(data.code === 200 && data.msg === 'success'){
              message.success('已发送结算单');
          }else{
              flag = false;
              message.error(data.msg || '生成结算单失败')
          }
          if(callback) callback(flag);
      },
      //结算管理－生成结算单－导出
      *exportDifference({payload, callback}, {call}) {
          const data = yield call(settlementMgt.exportDifference, payload);
          if(typeof callback === 'function') {
              callback && callback(data);
          };
      },
  }
}