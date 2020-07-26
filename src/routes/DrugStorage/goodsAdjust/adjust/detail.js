/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: gaofengjiao
 * @Last Modified time: 2018-08-06
 */
/* 
  @file 货位调整 详情
*/
import React, { PureComponent } from 'react';
import {Table ,Row, Col, Tooltip} from 'antd';
import {connect} from 'dva';
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
      title: '药品名称',
      width: 350,
      dataIndex: 'ctmmTradeName',
      className: 'ellipsis',
      render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
  },
  /*{
    title: '规格',
		width: 100,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
		width:160,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '移动数量',
		width: 90,
    dataIndex: 'adjustNum'
  },
  {
    title: '移动单位',
		width:80,
    dataIndex: 'originalUnitName'
  },
  {
    title: '原库存',
		width: 90,
    dataIndex: 'originalStore'
  },
  {
    title: '原货位',
		width: 90,
    dataIndex: 'originalGoodsName'
  },
  {
    title: '原货位类型',
		width: 118,
    dataIndex: 'originalLocTypeName',
  },
  {
    title: '目的货位',
    dataIndex: 'goalGoodsName',
		width: 112,
  },
  {
    title: '目的货位单位',
    dataIndex: 'goalUnitName',
		width: 128,
  },
  {
    title: '目的货位类型',
		width: 128,
    dataIndex: 'goalLocTypeName'
  },
  {
    title: '转换系数',
		width:90,
    dataIndex: 'conversionRate'
  },
  {
    title: '包装规格',
		width:100,
    dataIndex: 'packageSpecification'
  },
  {
    title: '生产批号',
		width: 128,
    dataIndex: 'lot'
  },
];

class ReplenishmentDetail extends PureComponent{
  state = {
    info: {},
    loading: true,hisDrugCodeList:''
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'goodsAdjust/goodsDetail',
      payload: {
        locAdjustNo: this.props.match.params.id,
        hisDrugCodeList:this.state.hisDrugCodeList
      },
      callback: (data) => {
        this.setState({info: data, loading: false});
      }
    })
  }
  getData(){
    this.props.dispatch({
      type: 'goodsAdjust/goodsDetail',
      payload: {
        locAdjustNo: this.props.match.params.id,
        hisDrugCodeList:this.state.hisDrugCodeList
      },
      callback: (data) => {
        this.setState({info: data, loading: false});
      }
    })
  }
  render(){
    let {info, loading,query} = this.state;
    let {roomLocAdjustDetailVoList} = info;
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>移库单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.locAdjustNo || ''}</div>
              </div>
            </Col>
            <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>状态</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.statusName || ''}</div>
            </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>移库人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                  <label>移库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard detailCards'>
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

                            this.setState({
                                hisDrugCodeList:value
                            },()=>{
                                this.getData()
                            })


                        }}
                    />
                </Col>
            </Row>
          <Table
              title={()=>'产品信息'}
            loading={loading}
            dataSource={roomLocAdjustDetailVoList || []}
            bordered
            scroll={{x: '100%'}}
             isDetail={true} 
            columns={columns}
            rowKey={'drugCode'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(ReplenishmentDetail);
