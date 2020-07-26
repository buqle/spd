import * as reportform from '../../services/purchase/reportform';
/**
 * @author QER
 * @date 19/5/16
 * @Description: 人员工作统计
*/
export default {
    namespace: 'reportform',
    state: {},
    reducers: {},
    effects: {
        //人员工作统计-补货单
        *getdeptList({payload, callback}, {call}) {
            const data = yield call(reportform.getdeptList, payload);
            if(typeof callback === 'function') {
                callback && callback(data);
            };
        },
        //人员工作统计-详情
        *getMedHisBackDetail({payload, callback}, {call}) {
            const data = yield call(reportform.getMedHisBackDetail, payload);
            if(typeof callback === 'function') {
                callback && callback(data);
            };
        },
    }
}