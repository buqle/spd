/*
 * @Author: wwb 
 * @Date: 2018-08-31 23:18:25 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 12:02:41
 */

import * as SupplierFactorService from '../../services/drugStorage/supplierFactor';
import { message } from 'antd';
import * as outStorageService from "../../services/drugStorage/outStorage";


export default {
  namespace: 'supplierFactor',
  state: {

  },
  reducers: {

  },
    effects:{

        //上传企业资质保存
        *saveSupplierFactor({payload, callback}, {call}) {
            const data = yield call(SupplierFactorService.saveSupplierFactor, payload);
            console.log(data, '删除');
            if(data.code === 200 && data.msg === 'success') {
                callback && callback(data);
            }else {
                message.error(data.msg);
            }
        },
        //企业资质类型
        *supplierType({ payload,callback },{ call }){
            const data = yield call(SupplierFactorService.supplierType, payload);
            if(callback && typeof callback === 'function') {
                callback(data);
            };
        },
        //上传企业资质删除
        *deleteSupplierFactor({payload, callback}, {call}) {
            const data = yield call(SupplierFactorService.deleteSupplierFactor, payload);
            console.log(data, '删除');
            if(data.code === 200 && data.msg === 'success') {
                callback && callback(data);
            }else {
                message.error(data.msg);
            }
        },

        //上传药品资质保存
        *saveDrugFactor({payload, callback}, {call}) {
            const data = yield call(SupplierFactorService.saveDrugFactor, payload);
            if(data.code === 200 && data.msg === 'success') {
                callback && callback(data);
            }else {
                message.error(data.msg);
            }
        },

        //上传药品资质删除
        *deleteDrugFactor({payload, callback}, {call}) {
            const data = yield call(SupplierFactorService.deleteDrugFactor, payload);
            if(data.code === 200 && data.msg === 'success') {
                callback && callback(data);
            }else {
                message.error(data.msg);
            }
        },
        //切换药品资质列表
        *changeDrugFactor({payload, callback}, {call}) {
            const data = yield call(SupplierFactorService.changeDrugFactor, payload);
            if(data.code === 200 && data.msg === 'success') {
                callback && callback(data);
            }else {
                message.error(data.msg);
            }
        },

    }
}