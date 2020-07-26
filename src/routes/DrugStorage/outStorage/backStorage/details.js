/*
 * @Author: yuwei  退货详情 /refund/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal, Tooltip, Spin, message,InputNumber } from 'antd';
import {Link} from 'react-router-dom';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { connect } from 'dva';
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
import {common} from "../../../../api/purchase/purchase";
const Conform = Modal.confirm;


class DetailsRefund extends PureComponent{

    constructor(props){
        super(props)
        this.state={
            visible: false,
            spinning: false,
            detailsData: {},
            dataSource: [],query:{},
            selected: [],
            selectedRows: [],
            saveLoading:false
        }
    }
    componentDidMount = () =>{
        this.getDetail()
    }
    searchHadle = () => {
        const { query} = this.state;
        this.getDetail(query.hisDrugCode)
    }
    //详情
    getDetail = (hisDrugCode) => {
        if (this.props.match.params.backNo) {
            let { backNo,isDraft } = this.props.match.params;

            this.setState({ spinning: true });
            this.props.dispatch({
                type:'base/getBackStorageDetail',
                payload: { backNo ,hisDrugCodeList:hisDrugCode?hisDrugCode:null},
                callback:(data)=>{
                    this.setState({ detailsData: data,dataSource: data.list, spinning: false });
                }
            });
        }
    }
    // 确认退货
    backStroage = () => {
        Conform({
            content:"是否确认退货？",
            onOk:()=>{
                const { dispatch, history } = this.props;
                const {  dataSource, detailsData } = this.state;
                let postData = {}, backDrugList = [];
                dataSource.map(item => backDrugList.push({ backNum: item.backNum, drugCode: item.drugCode }));
                postData.backDrugList = backDrugList;
                postData.backcause = detailsData.backCause;
                console.log(postData,'postData')
                dispatch({
                    type: 'base/submitBackStorage',
                    payload: { ...postData },
                    callback: () => {
                        message.success('退货成功');
                        history.push({pathname:"/drugStorage/outStorage/backStorage"})
                    }
                })
            },
            onCancel:()=>{}
        })
    }
    //打印
    print = () => {
        const {backNo} = this.props.match.params;//printBackDetail
        window.open(`${outStorage.PRINT_BACK_DETAIL}?backNo=${backNo}`, '_blank');
    }

    //导出
    export = () => {
        const {backNo} = this.props.match.params;//printBackDetail
        this.props.dispatch({
            type: 'outStorage/exportOutStorageDetalis',
            payload: { backNo }
        })
    }
    render(){
        var { detailsData, dataSource, spinning,query,saveLoading } = this.state;
        let {path} = this.props.match;
        const {backNo} = this.props.match.params;//printBackDetail
        var query={...query,backNo}

        path = path.split('/');
        path.length = 4;
        path = path.join('/');
        const { isDraft } = this.props.match.params;
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
              width: 168,
              dataIndex: 'ctmmSpecification',
              className:'ellipsis',
              render:(text)=>(
                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
              )
            },*/
            {
                title: '入库单号',
                width: 280,
                dataIndex: 'inStoreCode',
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
                title: '药品编码',
                dataIndex: 'hisDrugCode',
                width: 200,
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
                title: '生产厂家',
                dataIndex: 'ctmmManufacturerName',
                width: 200,
                className:'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '批准文号',
                dataIndex: 'approvalNo',
                width: 200
            }
        ];
        return (
            <div className='fadeIn ysynet-content'>
                <Spin spinning={spinning}>
                    <div style={{padding: '0 16px'}}>
                        <div className='ysynet-details-flex-header'>
                            <h3>单据信息</h3>
                            <div style={{ textAlign: 'right' }}>
                                {
                                    detailsData.backStatus === 3 &&
                                    <Link to={{pathname: `${path}/edit/${this.props.match.params.backNo}`}}>
                                        <Button type='default'>编辑</Button>
                                    </Link>
                                }
                                <Button style={{marginLeft: 8}} onClick={this.print}>打印</Button>
                                <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>
                                {
                                    isDraft==1?
                                        <Button style={{marginLeft: 8}} type='primary'>
                                            <Link to={{pathname: `/drugStorage/outStorage/backStorage/editAdd/${backNo}`}}>编辑草稿</Link>
                                        </Button>

                                        :null
                                }
                            </div>
                        </div>
                        <Row>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>退货单</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control' style={{float:'left'}}>{ detailsData.backNo }</div>
                                    {
                                        detailsData.refrigerateType==1?<div className='snow-backno'> <img alt="" src={require(`../../../../assets/img/snow.png`)} style={{width:'100%'}}/></div>:null
                                    }
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>状态</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.backStatusName }</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                    <label>来源部门</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.backDpetName }</div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>退货人</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                    <label>退货时间</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.createDate }
                                    </div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>供应商</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.supplierName }</div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                    <label>复核人</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.reviewUserName }</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                    <label>复核时间</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                    <div className='ant-form-item-control'>{ detailsData.reviewDate }</div>
                                </div>
                            </Col>
                        </Row>
                        <hr className='hr'/>
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
                            <RemoteTable
                                title={()=>'产品信息'}
                                query={query}
                                scroll={{x: '100%'}}
                                isDetail={true}
                                data={dataSource}
                                ref="table"
                                columns={columns}
                                rowKey={'id'}
                            />
                        </div>

                        {0?<div><h3>产品信息</h3>
                            <Table
                                bordered
                                dataSource={dataSource}
                                scroll={{x: '100%'}}
                                columns={columns}
                                isDetail={true}
                                rowKey={'id'}
                                pagination={{
                                    size: 'small',
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    showTotal:(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`
                                }}
                            /></div>:''}
                    </div>
                </Spin>
            </div>
        )
    }
}
export default  connect(state => state)(DetailsRefund) ;
