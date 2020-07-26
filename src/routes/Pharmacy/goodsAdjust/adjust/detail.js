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
import {Table ,Row, Col, Tooltip, Spin} from 'antd';
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
      dataIndex: 'ctmmTradeName',
      width: 350,
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  /*{
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 168,
  },*/
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 200,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '移动数量',
    dataIndex: 'adjustNum',
    width: 112,
  },
  {
    title: '移动单位',
    dataIndex: 'originalUnitName',
    width: 112,
  },
  {
    title: '原库存',
    dataIndex: 'originalStore',
    width: 112,
  },
  {
    title: '原货位',
    dataIndex: 'originalGoodsName',
    width: 112,
  },
  {
    title: '原货位类型',
    dataIndex: 'originalLocTypeName',
    width: 168,
  },
  {
    title: '目的货位',
    dataIndex: 'goalGoodsName',
    width: 112,
  },
  {
    title: '目的货位单位',
    dataIndex: 'goalUnitName',
    width: 168,
  },
  {
    title: '目的货位类型',
    dataIndex: 'goalLocTypeName',
    width: 168,
  },
  {
    title: '转换系数',
    dataIndex: 'conversionRate',
    width: 112,
  },
  {
    title: '包装规格',
    dataIndex: 'packageSpecification',
    width: 148,
  },
  {
    title: '生产批号',
    dataIndex: 'lot',
    width: 148,
  }
];

class ReplenishmentDetail extends PureComponent{
  state = {
    info: {},
    loading: true,query:{}
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'goodsAdjust/goodsDetail',
      payload: {
        locAdjustNo: this.props.match.params.id
      },
      callback: (data) => {
        this.setState({info: data, loading: false});
      }
    })
  }
  getData=()=>{
    this.props.dispatch({
      type: 'goodsAdjust/goodsDetail',
      payload: {
        locAdjustNo: this.props.match.params.id,
        ...this.state.query
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
          <Spin spinning={loading}>
            <h3>单据信息</h3>
            <Row>
              <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
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
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>移库时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.createDate || ''}</div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
          
        <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col span={12} style={{ marginLeft: 4 }}>
            <FetchSelect
              allowClear
              value={this.state.value}
              style={{ width: '100%' }}
              placeholder='药品名称'
              deptStateb={' '}
              url={TableSearchUrl.searchgoodsAdjustadjust}
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


          <h3 style={{marginBottom: 15}}>产品信息</h3>
          <Table
            loading={loading}
            dataSource={roomLocAdjustDetailVoList || []}
            bordered
            pagination={false}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'drugCode'}
          />
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(ReplenishmentDetail);
