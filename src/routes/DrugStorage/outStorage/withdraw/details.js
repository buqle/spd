/*
 * @Author: yuwei  出库管理详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Tooltip, message,Tabs} from 'antd';
import {connect} from 'dva';
import querystring from 'querystring';
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
import {common} from "../../../../api/purchase/purchase";
import {outStorage} from "../../../../api/drugStorage/outStorage";
const {TabPane} = Tabs;
const columns = [
    /* {
       title: '通用名',
       width: 224,
       dataIndex: 'ctmmGenericName',
       className: 'ellipsis',
       render: (text) => (
         <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
       )
     },*/
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
      width: 168,
      dataIndex: 'ctmmSpecification',
      className:'ellipsis',
      render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      )
    },*/
    {
        title: '剂型',
        width: 90,
        dataIndex: 'ctmmDosageFormDesc',
    },
    {
        title: '包装规格',
        width: 168,
        dataIndex: 'packageSpecification'
    },
    {
        title: '单位',
        width: 112,
        dataIndex: 'replanUnit'
    },
    {
        title: '出库数量',
        width: 112,
        dataIndex: 'backNum'
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
        dataIndex: 'validEndDate'

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
    },
    {
        title: '供应商',
        width: 200,
        dataIndex: 'supplierName',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    }
];

class DetailsOutput extends PureComponent{

    constructor(props){
        super(props)
        let info = this.props.match.params.id;
        info = querystring.parse(info);
        this.state={
            info: {},
            loading: false,
            id: info.id,
            status: null,
            successLoading: false,
            failLoading: false,
            tabKey:'',
            tabsData:[],
            pendingQuery:{
                backNo:info.id,
                checkStatus:'0'
            },
            unpendingQuery:{
                backNo:info.id,
                checkStatus:'1'
            }
        }
    }
    componentDidMount() {
        this.getDatail();
    }
    getDatail = () => {
        this.setState({loading: true});
        this.props.dispatch({
            type: 'outStorage/outStoreDetailInfo',
            payload: {
                backNo: this.state.id
            },
            callback: (data) => {
                this.setState({
                    info: data,
                    loading: false,
                    status: data.status
                });
                if(data.status==3){
                    this.setState({
                        tabKey:'1'
                    });
                }else {
                    this.setState({
                        tabKey:'0'
                    });
                }
            }
        })
    }
    tableOnChange = () => {
        this.setState({
            selected: [],
            selectedRows: [],
        });
    }
    //复核与未复核list
    getData=key=>{
        this.setState({
            tabKey:key
        })
    }
    unVerfiyTableCallBack = (data) =>{
        this.setState({
            tabsData:data.length
        })
    }

    render(){
        let {info, loading,tabKey,pendingQuery,unpendingQuery,tabsData} = this.state;
        let {detailVo} = info;
        return (
            <div className='fullCol fadeIn'>
                <div className="fullCol-fullChild">

                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>出库单</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.backNo || ''}</div>
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
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>申领药房</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.deptName || ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>发起人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>发起时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.createDate || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>联系电话</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.phone || ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>药房地址</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.deptAddress || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>复核人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.checkUserName || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>复核时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.checkDate || ''}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="detailCard detailCards">
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
                                    let {unpendingQuery,tabKey,pendingQuery} = this.state;
                                    if(tabKey==1){
                                        unpendingQuery = {
                                            ...unpendingQuery,
                                            hisDrugCode: value || ''
                                        };
                                        this.setState({
                                            unpendingQuery,
                                            value
                                        });
                                    }else {
                                        pendingQuery = {
                                            ...pendingQuery,
                                            hisDrugCode: value || ''
                                        };
                                        this.setState({
                                            pendingQuery,
                                            value
                                        });
                                    }

                                }}
                            />
                        </Col>
                    </Row>
                    <Tabs onChange={this.getData} activeKey={this.state.tabKey}>
                        <TabPane tab="未复核" key="0">
                            {
                                tabKey==0?<RemoteTable
                                    ref={(node) => this.pickingTable = node}
                                    query={pendingQuery}
                                    columns={columns}
                                    scroll={{ x: '100%' }}
                                    isJson={true}
                                    url={outStorage.OUTSTOREDETAILLIST}
                                    rowKey='lot'
                                    pagination={{
                                        onChange: this.tableOnChange
                                    }}
                                />:null
                            }
                        </TabPane>
                        <TabPane tab="已复核" key="1">
                            {
                                tabKey==1? <RemoteTable
                                    ref={(node) => this.pickingTable = node}
                                    query={unpendingQuery}
                                    columns={columns}
                                    scroll={{ x: '100%' }}
                                    isJson={true}
                                    url={outStorage.OUTSTOREDETAILLIST}
                                    rowKey='lot'
                                    cb={this.unVerfiyTableCallBack}
                                    pagination={{
                                        onChange: this.tableOnChange
                                    }}
                                />:null
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(DetailsOutput);