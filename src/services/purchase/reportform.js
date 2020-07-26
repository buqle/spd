/* 人员工作统计 */
import request from '../../utils/request';
import { _local } from '../../api/local';
/*-- 人员工作统计-补货单 --*/
export function getdeptList(options) {
    return request(`${_local}/a/reportform/back/getdeptList`, {
        method: 'POST',
        type: 'json',
        body: options
    })
};
/*-- 人员工作统计-详情 --*/
export function getMedHisBackDetail(options) {
    return request(`${_local}/a/reportform/back/getMedHisBackDetail`, {
        method: 'POST',
        type: 'formData',
        body: options
    })
};