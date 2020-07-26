/*
 * @Author: yuwei  出库管理详情 /newLibrary/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tabs, Tooltip, Button, message,InputNumber } from 'antd';
import querystring from 'querystring';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import RemoteTable from '../../../../components/TableGrid';
import {connect} from 'dva';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
const columns = [
 {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },
    /*{
      title: '通用名',
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
    /* {
       title: '规格',
       width: 168,
       dataIndex: 'ctmmSpecification',
     },*/
    {
        title: '生产批号',
        width: 110,
        dataIndex: 'productBatchNo',
    },
    {
        title: '药品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    },
    {
        title: '实到数量',
        width: 100,
        dataIndex: 'realNum'
    },
    {
        title: '需求数量',
        width: 100,
        dataIndex: 'realDeliveryQuantiry'
    },
    {
        title: '单位',
        width: 90,
        dataIndex: 'replanUnit'
    },
    {
        title: '剂型',
        width: 90,
        dataIndex: 'ctmmDosageFormDesc'
    }]

const {TabPane} = Tabs;
class DetailsNewLibrary extends PureComponent{
    constructor(props){
        super(props)
        let info = querystring.parse(this.props.match.params.id);
        this.state={
            checkLoading: false,
            detailInfo: {},
            defaultActiveKey: null,
            id: info.id,
            info: {},
            selected: [],
            selectedRows: [],
            tabsData:[],
            unacceptedQuery: {    //未验收请求体
                distributeCode: info.id,
                status: 1
            },
            acceptedQuery: {     //验收请求体
                distributeCode: info.id,
                status: 2
            }
        }
    }

    componentDidMount() {
        this.queryDetail()
    }

    queryDetail() {
        this.props.dispatch({
            type: 'base/checkDetailHead',
            payload: {
                distributeCode: this.state.id
            },
            callback: ({data, msg, code}) => {
                if(code !== 200) return message.error(msg);
                this.setState({
                    loading: false,
                    info: data,
                    defaultActiveKey: data.auditStatus === 1? '1' : '2',
                })
            }
        });
        // this.props.dispatch({
        //   type: 'base/deliverRequest',
        //   payload: {
        //     distributeCode: this.state.id,
        //   },
        //   callback: (data) => {
        //     this.setState({
        //       loading: false,
        //       info: data,
        //       defaultActiveKey: data.auditStatus === 1? '1' : '2',
        //       btnShow: data.auditStatus === 1 ? true : false,
        //     })
        //   }
        // });
    }

    tableOnChange = () => {
        this.setState({
            selected: [],
            selectedRows: []
        });
    }

    rowChange = (selectedRowKeys, selectedRows) => {
        this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
        //let { selectedRows } = this.state;
        console.log(this.state.selectedRows)
    }

    saveCheck = () => {
        let {selectedRows, info,tabsData} = this.state;
        let {distributeCode} = info;
        if(selectedRows.length === 0) {
            message.error('至少选择一条数据');
            return;
        };
        this.setState({
            checkLoading: true
        });
        let detailList = {}, pickingDetail = [];
        selectedRows.map(item => pickingDetail.push({
            id: item.id,
            realReceiveQuantiry: item.realNum,
        }));
        detailList=pickingDetail
        this.props.dispatch({
            type: 'base/commonConfirmCheck',
            payload: {
                detailList,
                distributeCode,
                checkType: 2
            },
            callback: ({data, code, msg}) => {
                this.setState({
                    checkLoading: false
                });
                if(code !== 200) return message.error(msg);
                message.success('确认验收成功');
                this.setState({
                    defaultActiveKey:'1',
                })
                this.queryDetail();
                this.unacceptedTable.fetch();
                this.acceptedTable && this.acceptedTable.fetch();
                this.setState({
                    selected: []
                });
            }
        })
    }

    tabsChange = (key) =>{
        this.setState({
            defaultActiveKey: key
        });
    }

    //打印
    print = () => {
        const { distributeCode } = this.state.info;
        const { defaultActiveKey } = this.state;
        window.open(`${wareHouse.PRINT_ROOM_DETAIL}?distributeCode=${distributeCode}&status=${defaultActiveKey}`, '_blank');
    }
    //修改数量
   /* setRowInput = (val, record, i) => {
        let {tabsData}=this.state
        if(val>tabsData[i].realDeliveryQuantiry){
            message.error('实到数量不能大于需求数量');
            return false
        }
        tabsData[i].realReceiveQuantiry = val;

    }*/
    onChange = (record, index, value) => {
        let { selectedRows } = this.state;
        if (!/^\d+$/.test(value)) return message.warn('请输入非0正整数');
        if (value > record.realDeliveryQuantiry) {
            value  = record.realDeliveryQuantiry;
            record.realNum = record.realDeliveryQuantiry;
            return message.warn(`输入数值过大, 不能超过${record.realDeliveryQuantiry}`)
        }else {
            record.realNum = value;
        };
        selectedRows = selectedRows.map(item => {
            if(item.id === record.id) {
                item.realNum = value;
            };
            return item;
        });
        this.setState({ selectedRows });
    }
    unVerfiyTableCallBack = (data) =>{
        this.setState({
            tabsData:data
        })
    }

    render(){
        let {
            defaultActiveKey,
            info, checkLoading,
            unacceptedQuery,
            acceptedQuery
        } = this.state;
        let {checkDetailStatus} = info;
        const columns = [
            /*{
              title: '通用名',
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
            /* {
               title: '规格',
               width: 168,
               dataIndex: 'ctmmSpecification',
             },*/
            {
                title: '生产批号',
                width: 110,
                dataIndex: 'productBatchNo',
            },
            {
                title: '药品编码',
                dataIndex: 'hisDrugCode',
                width: 200,
            },
            {
                title: '实到数量',
                width: 110,
                dataIndex: 'realNum',
                render:(text, record, index)=>(
                    <div>
                        {
                            checkDetailStatus === 1||checkDetailStatus === 0?
                                <InputNumber
                                    defaultValue={text}
                                    min={0}
                                    precision={0}
                                    onChange={this.onChange.bind(this, record, index)}
                                />:<span>{text}</span>
                        }
                    </div>)
            },
            {
                title: '需求数量',
                width: 100,
                dataIndex: 'realDeliveryQuantiry'
            },
            {
                title: '单位',
                width: 90,
                dataIndex: 'replanUnit'
            },
            {
                title: '剂型',
                width: 90,
                dataIndex: 'ctmmDosageFormDesc',

            },
            {
                title: '包装规格',
                width: 128,
                dataIndex: 'packageSpecification',
            },
            {
                title: '批准文号',
                width: 128,
                dataIndex: 'approvalNo',
                className:'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '生产厂家',
                width: 200,
                dataIndex: 'ctmmManufacturerName',
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '生产日期',
                width: 118,
                dataIndex: 'realProductTime',
            },
            {
                title: '有效期至',
                width: 118,
                dataIndex: 'realValidEndDate'
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
        return (
            <div className='fullCol'>
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
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>验收单</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.distributeCode || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>申领单</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.applyCode || ''}</div>
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
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>配货部门</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.originDeptName || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>发起人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.createName || ''}</div>
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
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>验收人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.receptionUserName || ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>验收时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{info.receptionTime || ''}</div>
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
                      url={TableSearchUrl.searchacceptancewareHouse}
                      cb={(value, option) => {
                        let {unacceptedQuery,acceptedQuery} = this.state;
                        unacceptedQuery = {
                          ...unacceptedQuery,
                          hisDrugCodeList: value || ''
                        };
                        acceptedQuery={
                            ...acceptedQuery,
                            hisDrugCodeList: value || ''
                        }
                        this.setState({
                          unacceptedQuery,acceptedQuery,
                          value
                        });
                      }}
                    />
                  </Col>
                </Row>

                <div className='detailCard'>
                    <Tabs
                        activeKey={defaultActiveKey}
                        onChange={this.tabsChange}
                        tabBarExtraContent={
                            checkDetailStatus === 1||checkDetailStatus === 0?
                                <Button loading={checkLoading} type='primary' onClick={this.saveCheck}>确认验收</Button>
                                : null
                        }
                    >
                        <TabPane tab="待验收" key="1">
                            {/* <Table
                bordered
                loading={loading}
                scroll={{x: '100%'}}
                columns={columns}
                dataSource={unVerfiyList || []}
                pagination={false}
                rowKey={'id'}
                rowSelection={{
                  selectedRowKeys: this.state.selected,
                  onChange: this.rowChange
                }}
              /> */}
                            <RemoteTable
                                ref={(node) => this.unacceptedTable = node}
                                query={unacceptedQuery}
                                columns={columns}
                                scroll={{ x: '100%' }}
                                 isDetail={true}
                                url={wareHouse.CHECK_EXAM_DETAIL}
                                rowSelection={{
                                    selectedRowKeys: this.state.selected,
                                    onChange: (selectedRowKeys, selectedRows) => {
                                        this.setState({
                                            selected: selectedRowKeys,
                                            selectedRows: selectedRows
                                        });
                                    }
                                }}
                                cb={this.unVerfiyTableCallBack}
                                rowKey='id'
                                pagination={{
                                    onChange: this.tableOnChange
                                }}
                            />
                        </TabPane>
                        <TabPane tab="已验收" key="2">
                            {/* <Table
                loading={loading}
                bordered
                scroll={{x: '100%'}}
                columns={columns}
                dataSource={verifyList || []}
                rowKey={'id'}
                pagination={false}
              /> */}
                            <RemoteTable
                                ref={(node) => this.acceptedTable = node}
                                query={acceptedQuery}
                                columns={columns}
                                scroll={{ x: '100%' }}
                                url={wareHouse.CHECK_EXAM_DETAIL}
                                rowKey='id'
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default connect(state=>state)(DetailsNewLibrary);