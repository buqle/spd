import * as replenishment from '../../services/replenishment/replenish';
import { message } from 'antd';
import * as settlementMgt from "../../services/purchase/settlementMgt";

export default {
  namespace: 'replenish',
  state: {},
  reducers: {},
  effects: {
    // 补货计划 - 删除
    *ReplenishDelete({ payload, callback },{ put, call }){
      const data = yield call(replenishment.ReplenishDelete, payload);
      if (data.code === 200) {
        message.success('删除成功！');
      } else {
        message.error(data.msg);
      }
      if (callback) {
        callback();
      }
    },
    /* 目录外采购 */
    // 状态
    /* *typelist({ payload,callback },{ call }){
      const data = yield call(replenishment.typelist, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取状态失败')
      }
      if(callback) callback(data.data)
    }, */



    /* 计划订单 */
    // 供应商列表
    *supplierList({ payload,callback },{ call }){
      const data = yield call(replenishment.supplierList, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取供应商失败')
      }
      if(callback) callback(data.data)
    },
    // 订单状态orderStatusOrorderType
    *orderStatusOrorderType({ payload,callback },{ call }){
      const data = yield call(replenishment.orderStatus, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取订单状态失败')
      }
      if(callback) callback(data.data)
    },

    // 更新订单状态
    *updateStatus({ payload,callback },{ call }){
      const data = yield call(replenishment.updateStatus, payload);
      if(data.code === 200 && data.msg === 'success'){
        message.success('状态更新成功');
      }else{
        return message.error(data.msg || '更新状态失败')
      }
      if(callback) callback();
    },

    // 发送订单
    *sendOrder({ payload, callback }, { call }){
      const data = yield call(replenishment.sendOrder, payload);
      let flag = true;
      if(data.code === 200 && data.msg === 'success'){
        message.success('发送订单成功');
      }else{
        flag = false;
        message.error(data.msg || '发送订单失败')
      }
      if(callback) callback(flag);
    },
    // 作废订单
       *cancelOrder({ payload, callback }, { call }){
              const data = yield call(replenishment.cancelOrder, payload);
              let flag = true;
              if(data.code === 200 && data.msg === 'success'){
                  message.success('订单作废成功');
              }else{
                  flag = false;
                  message.error(data.msg || '订单作废失败')
              }
              if(callback) callback(flag);
          },
    // 关闭订单
    *closeOrder({ payload,callback },{ call }){
      const data = yield call(replenishment.closeOrder, payload);
      if(data.code !== 200){
        return message.error(data.msg||'关闭订单失败')
      }
      if(callback) callback(data.data)
    },
      // 缺货管理－生成补货计划
      *createReplenishment({ payload, callback }, { call }){
          const data = yield call(replenishment.createReplenishment, payload);
          let flag = true;
          if(data.code === 200 && data.msg === 'success'){
              message.success('已发送补货计划');
          }else{
              flag = false;
              message.error(data.msg || '发送补货计划失败')
          }
          if(callback) callback(flag);
      },
      //缺货管理－导出
      *exportDifference({payload, callback}, {call}) {
          const data = yield call(replenishment.exportDifference, payload);
          if(typeof callback === 'function') {
              callback && callback(data);
          };
      },
      // 缺货管理－删除
      *replenishmenthDelete({ payload, callback },{ put, call }){
          const data = yield call(replenishment.replenishmenthDelete, payload);
          let flag = true;
          if(data.code === 200 && data.msg === 'success'){
              message.success('订单删除成功');
          }else{
              flag = false;
              message.error(data.msg || '订单删除失败')
          }
          if(callback) callback(flag);
      },
    // 订单详情
    *planOrderDetail({ payload, callback },{ put, call }){
      const data = yield call(replenishment.planOrderDetail, payload);
      if (data.code === 200 && data.msg === 'success') {
        if(callback) callback(data.data)
      } else {
        message.error(data.msg);
      }
    },
      *updateQty({ payload, callback },{ put, call }){
          const data = yield call(replenishment.updateQty, payload);
          if(callback && typeof callback === 'function'){
              callback(data);
          }
      },
    subscriptions: {
      
    }
  }
}