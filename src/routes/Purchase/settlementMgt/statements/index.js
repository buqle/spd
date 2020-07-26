/**
 * @file 结算管理 - 结算单
 */
import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import { Form, Row, Col, Input, Button, DatePicker, Tooltip,message,Modal,Select } from 'antd';
import {settlementMgt} from '../../../../api/purchase/purchase';
import RemoteTable from '../../../../components/TableGrid/index';
import moment from 'moment';
import {connect} from 'dva';
const FormItem = Form.Item;
const monthFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const Conform = Modal.confirm;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
      md: {span: 8}
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
      md: {span: 16}
    },
};

const columns = [
{
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },
    {
        title: '结算时间',
        dataIndex: 'settleDate',
        width: 224,
    },
    {
    title: '结算单',
    dataIndex: 'settleBillNo',
    width: 168,
    render: (text, record) => (
        <span>
            <Link to={{ pathname: `/purchase/settlementMgt/statements/details/${text}`}}>{text}</Link>
        </span>
    )
    }, {
        title: '供应商',
        dataIndex: 'ctmaSupplierName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    }, {
        title: '审核状态',
        dataIndex: 'checkStatus',
        width: 112,
        render: (text,record) =>{
            return record.checkStatus==1?'待审核':record.checkStatus==2?'通过':'驳回'
        }
    },{
        title: '确认状态',
        dataIndex: 'settleStatusName',
        width: 112
    },{
        title: '总条目',
        dataIndex: 'settleSumqty',
        width: 90,
    },{
        title: '结算周期',
        dataIndex: 'settleStatusNames',
        width: 200,
        render: (text,record) =>{
            return `${record.settleBegindate}~${record.settleEnddate}`
        },
    },{
        title: '来源',
        dataIndex: 'source',
        width: 112
    },{
        title: '结算总金额',
        dataIndex: 'settleSumamount',
        width: 120,

    }]


class SettlementMgt extends PureComponent {
    state = {
        loading: false,
        sendLoading: false,
        selectedRowKeys: [],
        selectedRow: [],
        visible:false,
        settleBillNoList:[],
        checkStatusList:[
            {value:1, label: "未审核"},
            {value:2, label: "通过"},
            {value:3, label: "驳回"}
        ]
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let {time} = values;
            if(time && time.length > 0) {
                values.startTime = time[0].format('YYYY-MM-DD');
                values.endTime = time[1].format('YYYY-MM-DD');
            }else {
                values.startTime = '';
                values.endTime = '';
            };
            delete values.time;
            this.props.dispatch({
                type:'base/setQueryConditions',
                payload: values
            });
        })
    }
    handleReset = (e) => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'base/clearQueryConditions'
        });
    }
    componentDidMount() {
        let { queryConditons } = this.props.base;
        if(queryConditons.startTime && queryConditons.endTime) {
            queryConditons.time = [moment(queryConditons.startTime, monthFormat), moment(queryConditons.endTime, monthFormat)];
        }else {
            queryConditons.time = [];
        };
        //找出表单的name 然后set
        let values = this.props.form.getFieldsValue();
        values = Object.getOwnPropertyNames(values);
        let value = {};
        values.map(keyItem => {
            value[keyItem] = queryConditons[keyItem];
            return keyItem;
        });
        this.props.form.setFieldsValue(value);
    }
    //打印
    export = () => {
        let {queryConditons} = this.props.base;
        queryConditons = {...queryConditons};
        delete queryConditons.pageNo;
        delete queryConditons.key;
        delete queryConditons.pageSize;
        delete queryConditons.sortField;
        delete queryConditons.sortOrder;
        delete queryConditons.time;
        this.props.dispatch({
            type: 'settlementMgt/settleExport',
            payload: queryConditons,
        });
    }
    //审核弹窗
    showModal=(settleBillNoList,checkStatus)=>{
        const { dispatch } = this.props;
        let {query}=this.props.base.queryConditons;
        let SettleDto={
            settleBillNoList,checkStatus
        }
        dispatch({
            type: 'settlementMgt/batchAuditSettle',
            payload: {settleBillNoList,checkStatus},
            callback: ({data, code, msg}) =>{
                if(code==200){
                    message.success(checkStatus==2?'批量通过结算单成功':'批量驳回结算单成功');
                    this.setState({ sendLoading: false,visible:false });
                    this.refs.table.fetch(query);
                }else {
                    message.error(msg);
                    this.setState({ sendLoading: false ,visible:false });
                }
            }
        })

    }
    //审核&&删除公用
    batchAudit = (id) =>{
        let { selectedRow,settleBillNoList} = this.state;
        let {query}= this.props.base.queryConditons
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let list = [];
        selectedRow.map(item => list.push(item.settleBillNo));

        this.setState({ sendLoading: id,settleBillNoList:list });
        if(id==1){
            this.setState({ visible:true});
        }else {
            this.props.dispatch({
                type: 'settlementMgt/batchdeleteSettle',
                payload: {
                    settleBillNoList:list
                },
                callback: (flag) =>{
                    this.setState({ sendLoading: false });
                    if(flag){
                        this.refs.table.fetch(query);
                    }
                }
            })
        }

        //console.log(selectedRow)
    }
    canCel=()=>{
        this.setState({ visible:false});
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let query = this.props.base.queryConditons;
        query = {...query};
        delete query.key;
        delete query.time;
        const {sendLoading,settleBillNoList,checkStatusList}=this.state
        return (
            <div className="ysynet-main-content">
                <Form onSubmit={this.handleSearch}>
                    <Row gutter={30}>
                        <Col span={8}>
                            <FormItem label={`汇总单`} {...formItemLayout}>
                                {getFieldDecorator('settleBillNo', {})(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`制单日期`} {...formItemLayout}>
                                {getFieldDecorator('time', {})(
                                    <RangePicker />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'状态'} {...formItemLayout}>
                                {getFieldDecorator('checkStatus', {
                                    initialValue: 2
                                })(
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={'请选择'}
                                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            checkStatusList.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{float: 'right',  textAlign: 'right', marginTop: 4}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Button type='primary' onClick={this.batchAudit.bind(this, 1)}>审核结算单</Button>
                    <Button type='primary'  onClick={this.batchAudit.bind(this, 2)} loading={sendLoading==2?true:false} style={{marginLeft: 8}}>删除结算单</Button>
                    <Button onClick={this.export} style={{marginLeft: 8}}>导出</Button>
                </Row>
                <RemoteTable
                    query={query}
                    style={{marginTop: 20}}
                    url={settlementMgt.SETTLE_LIST}
                    columns={columns}
                    rowKey={'id'}
                    scroll={{x: '100%'}}
                    isDetail={true}
                    ref='table'
                    rowSelection={{
                        onChange: (selectedRowKeys, selectedRow) => {
                            this.setState({selectedRowKeys, selectedRow});
                        },
                         getCheckboxProps: record => ({
                             disabled:record.checkStatus==2||record.checkStatus==3
                         })
                    }}
                />
                <Modal
                    title="结算单审核"
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.canCel}
                    width={300}
                >
                    <div className='edit-flex'style={{textAlign: 'center'}}>
                        <Button type='primary' onClick={this.showModal.bind(this, settleBillNoList,2)} >通过</Button>
                        <Button onClick={this.showModal.bind(this, settleBillNoList,3)} style={{marginLeft: 28}}>驳回</Button>
                    </div>
                </Modal>
            </div>
        )
    }
};

const WrappedSettlementMgt = Form.create()(SettlementMgt);

export default connect(state=>state)(WrappedSettlementMgt);
