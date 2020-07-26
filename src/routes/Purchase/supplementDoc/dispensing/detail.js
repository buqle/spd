/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-06 18:12:11
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip ,message , Modal} from 'antd';
import { connect } from 'dva';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
const Comfirm = Modal.confirm;
const columns = [
 {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },   
  {
    title: '数量',
    width: 112,
    dataIndex: 'makeipQuantity',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
    {
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    },
  /*{
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '生产批号',
    width: 148,
    dataIndex: 'lot',
  },
  {
    title: '采购方式',
    width: 112,
    dataIndex: 'purchaseType',
    render: (text) => text === 1 ? '零库存' : '自采'
  },
  {
    title: '生产日期',
    width: 118,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 118,
    dataIndex: 'validEndDate',
  }
];

class ReplenishmentDetail extends PureComponent{

  state ={
    baseInfo:{},query:{}
  }
  componentDidMount(){
    console.log(this.props.match.params.id)
    this.props.dispatch({
      type:'pharmacy/makeDetail',
      payload:{makeupCode:this.props.match.params.id},
      callback:({data, code, msg})=>{
        if(code === 200) {
          this.setState({
            baseInfo:data
          });
        }else {
          message.error(msg);
        };
      }
    })
    
  }
  onCheck = ()=>{
    Comfirm({
      title:"确定执行此操作？",
      onOk:()=>{
        let postData = {
          makeupCode:this.props.match.params.id
        }
        this.props.dispatch({
          type:'pharmacy/SubmitAgainMakeupDetail',
          payload:postData,
          callback:(data)=>{
            message.success('状态变更成功！');
            this.props.history.push({pathname:"/pharmacy/supplementDoc/supplementDocuments"})
          }
        })
      }
    })
  } 

  render(){
    const { baseInfo,query} = this.state;
    var makeupCode=this.props.match.params.id;

    return ( 
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>补登单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupCode:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>异常发药单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.storeCode:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupTypeName:''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.makeupStatusName:''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补登人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.createUserName:''}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>补登时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{baseInfo?baseInfo.createDate:''}</div>
              </div>
            </Col>
          </Row>
        </div>

        <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col span={12} style={{ marginLeft: 4 }}>
            <FetchSelect
              allowClear
              value={this.state.value}
              style={{ width: '100%' }}
              placeholder='药品名称'
              deptStateb={' '}
              url={TableSearchUrl.searchmakeDetail}
              cb={(value, option) => {
                let {query} = this.state;
                query = {
                  ...query,
                  hisDrugCodeList: value || ''
                };
                this.setState({
                  query,
                  value
                });
              }}
            />
          </Col>
        </Row>
        <div className='detailCard'>
          <h3 style={{marginBottom: 16}}>产品信息</h3>
          <RemoteTable
            query={query}
    
            scroll={{x: '100%'}}
            method='get'
            deptStateb={' '}
            url={TableSearchUrl.searchmakeDetailtable+'?makeupCode='+makeupCode+'&hisDrugCodeList='+this.state.query.hisDrugCodeList}
             isDetail={true}
            ref="table"
            columns={columns} 
            rowKey='batchNo' 
          />
        </div>

        {0?<div className='detailCard'>
          <Table
            bordered
            title={()=>'产品信息'}
            style={{marginTop: 20}}
            columns={columns}
            scroll={{ x: '100%' }}
            rowKey='batchNo'
            dataSource={baseInfo?baseInfo.list:[]}
            pagination={false}
          />
        </div>:''}
      </div>
    )
  }
}
export default connect(state=>state)(ReplenishmentDetail);
