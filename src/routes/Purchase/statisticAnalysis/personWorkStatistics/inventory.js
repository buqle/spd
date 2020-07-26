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
import moment from 'moment';
class OrderRetrospect extends PureComponent {
    constructor(props) {
        super(props);
        const {userId, startTime, endTime} = this.props.match.params;
        this.state = {
            query: {
                userId,
                startTime: startTime && startTime != 'undefined' ? startTime : '',
                endTime: endTime && endTime != 'undefined' ? endTime : ''
            },
        }
    }

  render() { 
    const {query } = this.state;
    const columns = [
      {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },     
      {
        title: '单据号',
        dataIndex: 'orderNo',
        width:156,
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
    
      {
        title: '操作时间',
        width:138,
        dataIndex: 'operationTime'
      },
      {
        title: '商品名称',
        dataIndex: 'ctmmTradeName',
        width: 250,
        render:(text)=>(
              <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
          )
      },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168
      },
      {
        title: '生产厂商',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 112,
      },
      {
        title: '操作前库存',
        dataIndex: 'beforOperationStock',
        width: 90,
      },
      {
        title: '操作数量',
        dataIndex: 'operationStock',
        width: 90,
      }, 
      {
        title: '操作后结存',
        dataIndex: 'afterOperationStock',
        width: 90,
      }, 
      {
        title: '货位',
        dataIndex: 'locationName',
        width: 166,
      }, 
    ];
    const {userNo,userName} = this.props.match.params;
    return (
      <div className="fullCol">
          <div className='fullCol-fullChild'>
              <div style={{ display:'flex',justifyContent: 'space-between' }}>
                  <h3><b>基本信息</b></h3>
              </div>
              <Row>
                  <Col span={8}>
                      <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                          <label>工号</label>
                      </div>
                      <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                          <div className='ant-form-item-control'>{userNo&&userNo!='undefined'?userNo:''}</div>
                      </div>
                  </Col>
                  <Col span={8}>
                      <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                          <label>姓名</label>
                      </div>
                      <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                          <div className='ant-form-item-control'>{userName?userName:''}</div>
                      </div>
                  </Col>
              </Row>
          </div>
      <div className='ysynet-main-content'>
      <h3 style={{marginBottom: 16}}>盘点信息</h3>
        <RemoteTable
          query={query}
          scroll={{x: '100%', y: 300}}
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.CHECK_BILL}
        />
      </div>
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);