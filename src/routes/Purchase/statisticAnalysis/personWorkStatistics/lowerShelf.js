import React,{PureComponent} from "react";
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select,Table } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from "../../../../api/purchase/patientTracing";
import moment from 'moment';

class OrderRetrospect extends PureComponent {
  constructor(props){
    super(props);
      const {userId,startTime,endTime}=this.props.match.params;
      this.state={
        query: {
            userId,
            startTime:startTime && startTime!='undefined'?startTime:'',
            endTime:endTime&&endTime!='undefined'?endTime:''
        },
      data:[],
      loading:false, baseData:{},
      columns:[
        {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },     
        {
          title: '单据类型',
          dataIndex: 'orderType',
          width: 100
        },

        {
          title: '单据号',
          dataIndex: 'orderNo',
          width: 168
        },
        {
          title: '操作时间',
          dataIndex: 'operationTime',
          width: 118,
          render:(text)=>{
            return moment(text).format('YYYY-MM-DD')
          }
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
          width: 168,
          render:(text)=>(
          <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
      )
        },
        {
          title: '生产厂商',
          dataIndex: 'ctmmManufacturerName',
          width: 212,
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
          width:90,
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
      ],
    }
  }


  render() {
    const {columns,query}=this.state;
    const {userNo,userName} = this.props.match.params;
    return (
      <div className='fullCol fadeIn'>
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
          <RemoteTable
              rowKey="batchNo"
              scroll={{x: '100%'}}
               isDetail={true}
              query={query}
              url={tracingTotalList.GET_MED_Order_Detail}
              columns={columns}
          />
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));

