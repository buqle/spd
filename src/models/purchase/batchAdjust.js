import * as batchAdjust from '../../services/purchase/batchAdjust';
import { message } from 'antd';
import * as settlementMgt from "../../services/purchase/settlementMgt";
/* 批号调整 */
export default {
    namespace: 'batchAdjust',
    state: {},
    reducers: {},
    effects: {
        //部门
        *deptList({ payload,callback },{ call }){
            const data = yield call(batchAdjust.deptList, payload);
            if(data.code !== 200){
                return message.error(data.msg||'获取部门失败')
            }
            if(callback) callback(data.data)
        },
        //保存批号调整单
        *saveSupplyGoods({ payload,callback },{ call }){
            const data = yield call(batchAdjust.saveSupplyGoods, payload);
            let flag = true;
            if(data.code === 200 && data.msg === 'success'){
                message.success('保存成功');
            }else{
                flag = false;
                message.error(data.msg || '保存失败')
            }
            if(callback) callback(flag);
        },
        //提交批号调整单
        *submitDraft({ payload,callback },{ call }){
            const data = yield call(batchAdjust.submitDraft, payload);
            let flag = true;
            if(data.code === 200 && data.msg === 'success'){
                message.success('提交单据成功');
            }else{
                flag = false;
                message.error(data.msg || '提交失败')
            }
            if(callback) callback(flag);
        },
        //删除批号调整单
        *batchDelete({ payload,callback },{ call }){
            const data = yield call(batchAdjust.batchDelete, payload);
            let flag = true;
            if(data.code === 200 && data.msg === 'success'){
                message.success('删除单据成功');
            }else{
                flag = false;
                message.error(data.msg || '删除失败')
            }
            if(callback) callback(flag);
        },
        //删除批号调整单
        *batchCheck({ payload,callback },{ call }){
            const data = yield call(batchAdjust.batchCheck, payload);
            let flag = true;
            if(data.code === 200 && data.msg === 'success'){
                message.success('单据处理成功');
            }else{
                flag = false;
                message.error(data.msg || '单据处理失败')
            }
            if(callback) callback(flag);
        },
        //删除批号调整单－导出
        *exportDifference({payload, callback}, {call}) {
            const data = yield call(batchAdjust.exportDifference, payload);
            if(typeof callback === 'function') {
                callback && callback(data);
            };
        },
    }
}