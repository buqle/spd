/*
 * @Author: yuwei  /applyAccept/details 申请受理详情
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col , Tooltip , Button } from 'antd';
import {connect} from 'dva';
import { Link } from 'react-router-dom';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },  
  {
   title: '申领数量',
   width: 112,
   dataIndex: 'applyNum',
  },
  {
    title: '单位',
    width: 90,
    dataIndex: 'replanUnit'
  },
  /*{
    title: '通用名称',
    width: 200,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width: 100,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 148,
    dataIndex: 'packageSpecification'
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];
class DetailsApplyAccept extends PureComponent{
  state = {
    drugsForInfo: {},
    loading: true,query:{}
  }
  componentDidMount() {
    let {applyCode} = this.props.match.params;
    this.props.dispatch({
      type: 'pharmacy/drugsForInfo',
      payload: { applyCode },
      callback: (data) => {
        console.log(data);
        this.setState({
          drugsForInfo: data,
          loading: false
        })
      }
    })
  }
  getData=()=>{
    let {applyCode} = this.props.match.params;
    this.props.dispatch({
      type: 'pharmacy/drugsForInfo',
      payload: { applyCode,...this.state.query },
      callback: (data) => {
        console.log(data);
        this.setState({
          drugsForInfo: data,
          loading: false
        })
      }
    })
  }
  render(){
    let {drugsForInfo, loading,query} = this.state;
    let dataSource = drugsForInfo.detailList || [];

    
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
            <div  className='ysynet-details-flex-header'>
                <h3>单据信息</h3>
                {
                    drugsForInfo.applyStatus==0?
                        <Button type='default' style={{marginLeft: 8}}> <Link to={{pathname: `/pharmacy/wareHouse/drugsFor/add/${drugsForInfo.applyCode}/${drugsForInfo.applyStatus}`}}>编辑草稿</Link></Button>:null
                }
            </div>

          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyCode || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>状态</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyStatusName}</div>
                </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>类型</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{drugsForInfo.applyTypeName || ''}</div>
              </div>
            </Col>
          <Row>
          </Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>申领部门</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.applyDeptName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发起人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.createUserName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发起时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{drugsForInfo.createDate || ''}</div>
                </div>
            </Col>
          <Row>
          </Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>联系电话</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>13020082008</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药房地址</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>这是一个药房的地址</div>
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
              url={TableSearchUrl.searchwareHousedrugsFor}
              cb={(value, option) => {
                let {query} = this.state;
                query = {
                  ...query,
                  hisDrugCodeList: value || ''
                };
                this.setState({
                  query,
                  value
                },()=>{
                  this.getData();
                });
                
              }}
            />
          </Col>
        </Row>

        <div className='detailCard'>
          <Table
            loading={loading}
            title={()=>'产品信息'}
            dataSource={dataSource}
            bordered
            pagination={false}
            scroll={{x: '100%'}}
            columns={columns}
             isDetail={true}
            rowKey={'drugCode'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsApplyAccept);