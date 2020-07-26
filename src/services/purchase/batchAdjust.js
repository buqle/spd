/**
 * @author QER
 * @date 2020/1/11
 * @Description: 批号调整 api管理
*/
import request from '../../utils/request';
import { _local } from '../../api/local';
export function deptList(options) {
    return request(`${_local}/a/spd/dict/type`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
}
//保存
export function saveSupplyGoods(options) {
    return request(`${_local}/a/lot/lotadjust/saveDraft`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//提交
export function submitDraft(options) {
    return request(`${_local}/a/lot/lotadjust/submitDraft`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//删除
export function batchDelete(options) {
    return request(`${_local}/a/lot/lotadjust/batchDelete`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//审核
export function batchCheck(options) {
    return request(`${_local}/a/lot/lotadjust/batchCheck`, {
        method: 'POST',
        type: 'json',
        body: options
    })
}
//导出
export function exportDifference(options) {
    return request(`${_local}/a/lot/lotadjust/export`, {
        method: 'POST',
        type: 'json',
        export: true,
        body: options
    })
}