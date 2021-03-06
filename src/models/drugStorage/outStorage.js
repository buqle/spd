/*
 * @Author: wwb 
 * @Date: 2018-08-31 23:18:25 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 12:02:41
 */

import * as outStorageService from '../../services/drugStorage/outStorage';
import { message } from 'antd';

export default {
  namespace: 'outStorage',
  state: {

  },
  reducers: {

  },
  effects: {
    /*出库单管理*/
    *checkOutStore({payload, callback}, {call}) {
      const data = yield call(outStorageService.checkOutStore, payload);
      console.log(data, '复核');
      if(callback && typeof callback === 'function') {
        callback(data)
      };
    },
      //出库单生成验收单
      *buildCheckAccept({payload, callback}, {call}) {
          const data = yield call(outStorageService.buildCheckAccept, payload);
          console.log(data, '复核');
          if(callback && typeof callback === 'function') {
              callback(data)
          };
      },
      //出库单详情通过与未通过
      *outStoreDetailList({payload, callback}, {call}) {
          const data = yield call(outStorageService.outStoreDetailList, payload);
          if(callback && typeof callback === 'function') {
              callback(data)
          };
      },

    //出库单管理详情
    *outStoreDetailInfo({payload, callback}, {call}) {
      const data = yield call(outStorageService.outStoreDetailInfo, payload);
      if(data.code === 200 || data.msg === 'success') {
        callback && callback(data.data);
      }else {
        message.error(data.msg);
      }
    },
      //出库单详情-detailVo不为null
      *outStoreDetailInfos({payload, callback}, {call}) {
          const data = yield call(outStorageService.outStoreDetailInfos, payload);
          if(data.code === 200 || data.msg === 'success') {
              callback && callback(data.data);
          }else {
              message.error(data.msg);
          }
      },
    //删除出库单
    *deleteOutStore({payload, callback}, {call}) {
      const data = yield call(outStorageService.deleteOutStore, payload);
      console.log(data, '删除');
      if(data.code === 200 && data.msg === 'success') {
        callback && callback(data);
      }else {
        message.error(data.msg);
      }
    },
    //不通过出库单
    *rejectOutStore({payload, callback}, {call}) {
      const data = yield call(outStorageService.rejectOutStore, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    // 已申领部门
    *genDeptList({ payload,callback },{ call }){
      const data = yield call(outStorageService.genDeptList, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取申领部门失败')
      }
      if(callback) callback(data.data)
    },

    // 配货单据详情
    *distributeDetail({ payload,callback },{ call }){
      const data = yield call(outStorageService.distributeDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取配货单详情失败')
      }
      if(callback) callback(data.data)
    },
    // 单条数据更新
    *singUpdate({ payload,callback },{ call }){
      const data = yield call(outStorageService.singUpdate, payload);
      if(data.code !== 200){
        return message.error(data.msg||'配货明细记录更新失败')
      }
      if(callback) callback(data.data)
    },


    /*  出库拣货 申请部门  */
    *findApplyDepts({ payload,callback },{ call }){
      const data = yield call(outStorageService.findApplyDepts, payload);
      console.log(data);
      
      if(data.code !== 200){
        return message.error(data.msg||'获取申请科室失败')
      }
      if(callback) callback(data.data)
    },

    /*  出库拣货 详情  */
    *getpickingDetail({ payload, callback },{ call }){
      const data = yield call(outStorageService.getPickingDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取拣货详情失败')
      }
      if(callback) callback(data.data)
    },

    /** 拣货下架 - 详情 - 头部 */
    *getPickingDetailPad({ payload, callback },{ call }){
      const data = yield call(outStorageService.getPickingDetailPad, payload);
      if(callback && typeof callback === 'function') {
        callback(data)
      };
    },

    // 查询配货明细的单条配货记录
    *getDistributeDetail({ payload,callback },{ call }){
      const data = yield call(outStorageService.getSingleDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取明细配货记录失败')
      }
      if(callback) callback(data.data)
    },


    // 配货单配货一系列操作
    *distributeEvent({ payload,callback },{ call }){
      const data = yield call(outStorageService.distributeEvent, payload);
      if(data.code !== 200){
        return message.error(data.msg||'配货单配货操作失败')
      }
      if(callback) callback(data.data)
    },

    /*  出库确认拣货  */
    *finishPicking({ payload,callback },{ call }){
      const data = yield call(outStorageService.finishPicking, payload);
      if(data.code !== 200){
        return message.error(data.msg||'拣货失败')
      }
      if(callback) callback(data.data)
    },
    /* 
      退库
    */
    // 供应商下拉框
    *genSupplier({ payload,callback },{ call }){
      const data = yield call(outStorageService.genSupplierList, payload);
      if(data.code !== 200){
        return message.error(data.msg||'获取供应商失败')
      }
      if(callback) callback(data.data)
    },

    /* 召回及锁定 */
    // 删除某一单据
    *deleteRecallPlan({ payload,callback },{ call }){
      const data = yield call(outStorageService.deleteRecall, payload);
      if(data.code !== 200){
        return message.error(data.msg||'删除失败')
      }
      if(callback) callback(data.data)
    },
    // 召回 及锁定详情
    *recallDetail({ payload,callback },{ call }){
      const data = yield call(outStorageService.genDetail, payload);
      if(data.code !== 200){
        return message.error(data.msg);
      }
      if(callback) callback(data.data);
    },
    // 取消锁定
    *cancelLocked({ payload,callback },{ call }){
      const data = yield call(outStorageService.cancelLocked, payload);
      if(data.code !== 200){
        return message.error(data.msg||'锁定失败')
      }
      if(callback) callback(data.data)
    },


    /* 召回审核 */ 
    // 批量通过
    *batchAudit({ payload,callback },{ call }){
      const data = yield call(outStorageService.batchAudit, payload);
      if(data.code !== 200){
        return message.error(data.msg||'批量通过失败')
      }
      if(callback) callback(data.data)
    },
    //药房锁定批量通过
    *batchThroughAuditLock({ payload,callback },{ call }){
      const data = yield call(outStorageService.batchThroughAuditLock, payload);
      if(data.code !== 200){
        return message.error(data.msg||'批量通过失败')
      }
      if(callback) callback(data.data)
    },
    // 召回审核不通过
    *auditReject({ payload,callback },{ call }){
      const data = yield call(outStorageService.reject, payload);
      if(data.code !== 200){
        return message.error(data.msg||'审核不通过失败')
      }
      if(callback) callback(data.data)
    },
    //锁定审核不通过
    *rejectLock({ payload,callback },{ call }){
      const data = yield call(outStorageService.rejectLock, payload);
      if(data.code !== 200){
        return message.error(data.msg||'审核不通过失败')
      }
      if(callback) callback(data.data)
    },
    //发起部门
    *getDeptInfoAndStore({ payload,callback },{ call }){
      const data = yield call(outStorageService.getDeptInfoAndStore, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    *exportOutStorageDetalis({ payload,callback },{ call }){
      const data = yield call(outStorageService.exportOutStorageDetalis, payload);
      if(callback && typeof callback === 'function') {
        callback(data);
      };
    },
    subscriptions: {
      
    }
  }
}