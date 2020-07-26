/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--人员统计及追溯
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, message, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom'; 
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },
        {
            title: '退药单号',
            dataIndex: 'backno',
            width: 162,
            render: (text,record) =>(
                <span>
            <Link to={{ pathname: `/purchase/statisticAnalysis/statisticsTraceability/details/${record.backno}` }}>{text}</Link>
          </span>
            )
        },
      {
        title: '退药类型',
        dataIndex: 'ordertype',
        width:100
      },
      {
        title: '科室操作人',
        dataIndex: 'username',
        width: 112, 
      },
      {
        title: '部门操作人',
        dataIndex: 'operationUserName',
        width: 112, 
      },
      {
        title: '操作时间',
        dataIndex: 'backdate',
        width: 112,
      },
      {
        title: '品规数',
        dataIndex: 'drugtotal',
        width:90,
      },
      {
        title: '单据状态',
        dataIndex: 'orderStatus',
        width: 90,
      },

    ];   

class OrderRetrospect extends PureComponent {
    constructor(props) {
        super(props);
        const {deptCode, backDeptCode,startTime,endTime} = this.props.match.params;
        this.state = {
            detailsData: {},
            query: {
                deptCode,
                backDeptCode,
                startTime,
                endTime,
                type:0
            },
        }
    }
  render() { 
    const { query } = this.state;
    return ( 
      <div className="fullCol">
      <div className='ysynet-main-content'>
      <h3 style={{marginBottom: 16}}>库存信息</h3>
        <RemoteTable
          query={query}
          scroll={{x: '100%', y: 300}}
          columns={columns}
           isDetail={true} 
          style={{marginTop: 20}}
          ref='table'
          isJson
          rowKey="id"
          url={tracingTotalList.HIS_BACK}
        />
      </div>
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);