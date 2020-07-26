/*
 * @Author: wwb 
 * @Date: 2018-07-24 20:15:54 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-31 00:16:10
 */
/* 
  @file 补货计划 详情
*/
import React, { PureComponent } from 'react';
import { Table ,Row, Col,Tooltip, Button, message } from 'antd';
import { connect } from 'dva';
import { replenishmentPlan } from '../../../../api/replenishment/replenishmentPlan';
import {Link} from 'react-router-dom';
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
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
        width: 50,
        dataIndex: 'serialNumber',
        render: (text, record, index) => index + 1
    },
    {
        title: '药品名称',
        width:350,
        dataIndex: 'ctmmTradeName',
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
        title: '剂型',
        width: 90,
        dataIndex: 'ctmmDosageFormDesc'
    },
    {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification'
    },
    {
        title: '单位',
        width: 90,
        dataIndex: 'replanUnit'
    },
    {
        title: '需求数量',
        dataIndex: 'demandQuantity',
        width: 90
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
    },
    {
        title: '价格',
        dataIndex: 'price',
        width: 100
    },
    {
        title: '金额',
        dataIndex: 'amount',
        width: 100,
        render: (text, record) => (record.price * record.demandQuantity).toFixed(4)
    },
    {
        title: '批准文号',
        width: 200,
        dataIndex: 'approvalNo'
    },
    {
        title: '药品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    },
];

class ReplenishmentDetail extends PureComponent{
    state = {
        detailsData: {},
        submitLoading: false,
        query:{
        }
    }
    searchHadle=()=>{
        const { query} = this.state;
        this.getDetail(query.hisDrugCodeList)
    }
    componentDidMount = () => {
        this.getDetail();
    }
    //详情
    getDetail = (hisDrugCodeList) => {
        if (this.props.match.params.planCode) {
            let { planCode } = this.props.match.params;
            this.props.dispatch({
                type:'base/ReplenishDetails',
                payload: { planCode,hisDrugCode:hisDrugCodeList?hisDrugCodeList:null },
                callback:({data, code, msg})=>{
                    if(code === 200) {
                        this.setState({ detailsData: data });
                    }else {
                        message.error(msg);
                    };
                }
            });
        }
    }
    //提交
    submit = () => {
        this.setState({
            submitLoading: true
        });
        let {detailsData} = this.state;
        let dataSource = detailsData.list.map(item => {
            return {
                bigDrugCode: item.bigDrugCode,
                demandQuantity: item.demandQuantity,
                drugCode: item.drugCode,
                drugPrice: item.drugPrice,
                hisDrugCode: item.hisDrugCode,
                supplierCode: item.supplierCode
            }
        });
        this.props.dispatch({
            type: 'base/submit',
            payload: {
                auditStatus: 2,
                id: detailsData.id,
                planType: detailsData.planType,
                list: dataSource,
                deptCode: detailsData.deptCode,
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        submitLoading: false
                    });
                    message.success('提交成功');
                    this.getDetail();
                }else {
                    this.setState({
                        submitLoading: false
                    });
                    message.error(msg);
                };
            }
        });
    }
    //打印
    print = () => {
        let { planCode } = this.props.match.params;
        window.open(`${replenishmentPlan.PLAN_DETAIL_PRINT}?planCode=${planCode}`, '_blank');
    }
    //导出
    export = () => {
        let { planCode } = this.props.match.params;
        this.props.dispatch({
            type:'base/depotplanExport',
            payload: {
                planCode,
            }
        });
    }
    render(){
        const { detailsData } = this.state;
        let {path} = this.props.match;
        path = path.split('/');
        path.length = 4;
        path = path.join('/');
        return (
            <div className='fullCol fadeIn'>
                <div className='fullCol-fullChild'>
                    <div style={{ display: 'flex',justifyContent: 'space-between' }}>
                        <h3>单据信息</h3>
                        <div>
                            <Button onClick={this.export} style={{ marginRight: 8 }}>导出</Button>
                            {
                                detailsData.auditStatus === 1 ||
                                detailsData.auditStatus === 3 &&detailsData.newFlag==0?
                                    [
                                        <Link key="edit" to={{pathname: `${path}/edit/${this.props.match.params.planCode}`}}>
                                            <Button type='default'>编辑</Button>
                                        </Link>,
                                        <Button key="submit" type='primary' onClick={this.submit} style={{ marginLeft: 8 }}>提交</Button>
                                    ]
                                    :
                                    <Button onClick={this.print}>打印</Button>
                            }
                        </div>
                    </div>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>计划单号</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.planCode}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>类型</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.planTypeName}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>状态</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.statusName}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>发起人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.createUserName}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>发起时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.createDate}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>联系电话</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.mobile}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>收货地址</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.receiveAddress}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>审核人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.sheveUserName}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>审核时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.sheveDate}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>驳回说明</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{detailsData.note}</div>
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
                                        hisDrugCodeList: value ? value : '',
                                        //planCode:this.props.match.params.planCode
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
                    <RemoteTable
                        title={()=>'产品信息'}
                        ref={(node) => this.pickingTable = node}
                        columns={columns}
                        data={detailsData.list}
                        //loading={tableLoading}
                        rowKey={'id'}
                        scroll={{ x: '100%' }}
                        isDetail={true}
                        rowKey='drugCode'
                    />
                </div>
            </div>
        )
    }
}
export default connect(state => state)(ReplenishmentDetail);

