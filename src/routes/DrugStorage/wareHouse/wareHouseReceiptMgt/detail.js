/*
 * @Author: gaofengjiao 
 * @Date: 2018-08-06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-27 15:11:46
 */
/* 
  @file 入库 详情
*/
import React, { PureComponent } from 'react';

import { Table ,Row, Col,Tooltip, Button, message } from 'antd';
import {connect} from 'dva';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import FetchSelect from "../../../../components/FetchSelect/index.js";
import {common} from "../../../../api/purchase/purchase";

const columns = [

  /*{
    title: '通用名',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
        title: '序号',
        width: 60,
        dataIndex: 'serialNumber',
        render:(text,record,index)=>`${index+1}`,
      },
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
 /* {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification'
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification',
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit',
  },
  {
    title: '入库数量',
    dataIndex: 'inQuantity',
    width: 112,
  },
  {
    title: '生产批号',
    width: 168,
    dataIndex: 'lot',
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
  },
  {
    title: '货位',
    width: 112,
    dataIndex: 'storeLocName',
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

class ReplenishmentDetail extends PureComponent{
  state = {
    data: {},
    loading:false
  }
  componentDidMount = () => {
        this.getDetail()
  }
    searchHadle = () => {
        const { query} = this.state;
        this.getDetail(query.hisDrugCode)
    }
    //详情
    getDetail = (hisDrugCode) => {
        this.setState({
            loading:true
        })
        this.props.dispatch({
            type: 'wareHouse/getPutStorageInfo',
            payload: {
                inStoreCode: this.props.match.params.id,
                hisDrugCodeList:hisDrugCode?hisDrugCode:null
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        data,
                        loading:false
                    });
                }else {
                    message.error(msg);
                }
            }
        })
    }
  //打印
  print = () => {//printInstoreDetail
    const {id} = this.props.match.params;
    window.open(`${wareHouse.PRINT_INSTORE_DETAIL}?inStoreCode=${id}`, '_blank');
  }
  render(){
    let {
    data,
    query,
    loading
    } = this.state;
    let {list} = data;
    return (
      <div  className="fullCol fadeIn">
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h3>单据信息</h3>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>部门</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.deptName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>入库分类</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.inStoreTypeName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                <label>供应商</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.ctmaSupplierName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>入库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.inStoreCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>配送单/验收单号</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.distributeCode || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>订单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.orderCode || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>入库时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>上架时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                  <label>备注</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                <div className='ant-form-item-control'>{data.remarks || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className='detailCard detailCards'>
            <Row style={{display: 'flex', alignItems: 'center'}}>
                <Col span={12} style={{ marginLeft: 4}}>
                    <FetchSelect
                        allowClear
                        value={this.state.value}
                        style={{ width: '100%' }}
                        placeholder='药品名称'
                        deptStateb={' '}
                        url={common.QUERY_DRUG_BY_LIST}
                        cb={(value, option) => {
                            let {query} = this.state;
                            query = {
                                ...query,
                                hisDrugCode: value ? value : '',
                            };
                            this.setState({
                                query,
                                value
                            },()=>{
                                this.searchHadle();
                            });
                        }}
                    />
                </Col>
            </Row>
            <Table
                bordered
                title={()=>'产品信息'}
                loading={loading}
                dataSource={data.list}
                scroll={{x: '100%'}}
                columns={columns}
                isDetail={true}
                rowKey={'id'}
                pagination={{
                    size: 'small',
                    showQuickJumper: true,
                    showSizeChanger: true
                }}
            />
        </div>
      </div>
    )
  }
}
export default connect(state=>state.wareHouse)(ReplenishmentDetail);
