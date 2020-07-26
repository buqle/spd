/**
 * @author QER
 * @date 2020/1/11
 * @Description: 批号调整-首页
*/
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon,Badge,InputNumber,Modal,Upload} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import AddLot from './add'
import {uniqBy} from 'lodash';
import FetchSelect from "../../../../components/FetchSelect";
import {common,batchAdjust} from "../../../../api/purchase/purchase";
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },//5
        md: {span: 8}
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
        md: {span: 16}
    },
};
class SearchForm extends PureComponent{
    state = {
        supplierList: [],
        releaseStatus: [
            {value: "1", label: "新欠品单"},
            {value: "2", label: "已补计划"}
        ], // 发布状态
        blendStatus: [
            {value: "", label: "全部"},
            {value: "1", label: "已保存"},
            {value: "2", label: "待审核"},
            {value: "3", label: "已审核"},
            {value: "4", label: "已驳回"}
        ], // 勾兑状态
        auditStatus: [], // 审核状态
        deptModules:[],//部门
    }
    toggle = () => {
        this.props.formProps.dispatch({
            type:'base/setShowHide'
        });
    }
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const orderTime = values.orderTime === undefined ? '' : values.orderTime;
                if(orderTime.length){
                    values.startTime = values.orderTime[0].format('YYYY-MM-DD');
                    values.endTime = values.orderTime[1].format('YYYY-MM-DD');
                }else {
                    values.startTime = '';
                    values.endTime = '';
                };
                this.props._handlQuery(values);
                this.props.formProps.dispatch({
                    type:'base/updateConditions',
                    payload: values
                });
            }
        })
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.formProps.dispatch({
            type:'base/clearQueryConditions'
        });
    }
    handleplanType=(value)=>{
        this.props.planType(value)
    }
    handlepurchaseType=(value)=>{
        this.props.chaseType(value)
    }
    handleDept=(value)=>{
        this.props.handleDeptCodes(value)
    }
    componentDidMount = () =>{
        if(this.props.formProps.match.path=='/purchase/batchAdjust/editBatchCheck'){
            this.props._handlQuery({
                status:2
            });
        }else {
            this.props._handlQuery({
                status:''
            });
        }


    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {blendStatus} = this.state;
        const {display} = this.props.formProps.base;
        const {supplierList}=this.props;
        const expand = display === 'block';
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`三级科室`}>
                            {
                                getFieldDecorator(`deptCode`,{
                                    initialValue: ''
                                })(

                                    <Select
                                        placeholder='请输入'
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            supplierList.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`轮换药房`}>
                            {
                                getFieldDecorator(`status`,{
                                    initialValue: '2'
                                })(
                                    <Select onChange={this.handlepurchaseType}>

                                        {
                                            blendStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`制单时间`}>
                            {
                                getFieldDecorator(`orderTime`)(
                                    <RangePicker format={'YYYY-MM-DD'}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={'药品名称'}>
                            {
                                getFieldDecorator(`hisDrugCode`)(
                                    <FetchSelect
                                        allowClear={true}
                                        placeholder='药品名称'
                                        query={{queryType: 3}}
                                        url={common.QUERY_DRUG_BY_LIST}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={'批号'}>
                            {
                                getFieldDecorator(`lot`)(
                                    <Input placeholder='请输入批号' />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`状态`}>
                            {
                                getFieldDecorator(`status`,{
                                    initialValue:'2'
                                })(
                                    <Select onChange={this.handlepurchaseType}>

                                        {
                                            blendStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrapperForm = Form.create()(SearchForm);
class PlanOrder extends PureComponent{
    state = {
        loading: false,
        sendLoading: false,
        selected: [],
        selectedRows: [],
        supplierList:[],
        visible:false,
        note:'',
        query:{
        }
    }
    componentDidMount() {
        let { dispatch } = this.props;
        dispatch({
            type: 'batchAdjust/deptList',
            payload: {type:'lot_adjust_dept'},
            callback: (data) =>{
                this.setState({
                    supplierList:data
                })
            }
        });
    }
    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        })
    }
    handleplanType=(v)=>{
        this.setState({
            planType:v
        })
    }
    handlepurchaseType=(v)=>{
        this.setState({
            purchaseType:v
        })
    }
    handleDeptCode=(v)=>{
        this.setState({
            deptCode:v
        })
        //console.log(this.state.deptCode)
    }
    handlQuery = (query) => {
        this.setState({
            query: {
                ...this.state.query,
                ...query
            }
        });

    }
    //导出
    export = () => {
        let {selectedRows} = this.state;
        if(selectedRows.length === 0) {
            message.warning('请选择一条数据进行导出');
            return;
        };
        let lotAdjustList = [];
        let pickingDetail=uniqBy(selectedRows, 'id');
        pickingDetail.map(item => lotAdjustList.push({id:item.id}));
        this.props.dispatch({
            type: 'batchAdjust/exportDifference',
            payload: {lotAdjustList}
        });
    }

    //保存添加药品
    submitGoods=values=>{
        let { query } = this.state;
        this.props.dispatch({
            type:'batchAdjust/saveSupplyGoods',
            payload: {lotAdjustList:values},
            callback: (flag) =>{
                if(flag){
                    this.refs.table.fetch(query);
                }
            }
        });
    }
    //提交&&审核&&驳回
    publish=(flag)=>{
        let {selectedRows,} = this.state;
        if(selectedRows.length === 0) {
            message.warning(flag==1?('请选择一条数据进行提交'):flag==2?('请选择一条数据进行删除'):flag==3?('请选择一条数据进行审核'):('请选择一条数据进行驳回'));
            return;
        };
        let lotAdjustList= [];
        let pickingDetail=uniqBy(selectedRows, 'id');
        pickingDetail.map(item => lotAdjustList.push({id:item.id}));
        let { query } = this.state;
        this.setState({sendLoading:flag})
        this.props.dispatch({
            type:flag==1?'batchAdjust/submitDraft':flag==2?'batchAdjust/batchDelete':flag==3||flag==4?'batchAdjust/batchCheck':null,
            payload: flag==3?{lotAdjustList,checkStatus:1}:flag==4?{lotAdjustList,checkStatus:2}:{lotAdjustList},
            callback: (flag) =>{
                this.setState({ sendLoading: false });
                if(flag){
                    this.refs.table.fetch(query);
                    this.noSelect();
                }else {
                    this.noSelect();
                }
            }
        });
    }

    noSelect=()=>{
        this.setState({
            selected: [],
            selectedRows: [],
            sendLoading: false,
            note:''
        });
    }
    render(){
        const { sendLoading ,supplierList} = this.state;

        let query = this.props.base.queryConditons;
        query = {...query,...this.state.query};
        delete query.orderTime;
        delete query.key;
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
                dataIndex: 'rows'
            },
            {
                title: '单据编号',
                width:128,
                dataIndex: 'deptName'
            },
            {
                title: '三级科室',
                dataIndex: 'hisDrugCode',
                width: 140
            },{
                title: '轮换药房',
                dataIndex: 'unitCode',
                width: 100,
            },{
                title: '状态',
                dataIndex: 'adjustQty',
                width: 90,
            },{
                title: '制单人',
                dataIndex: 'lot',
                width: 130,

            },{
                title: '制单日期',
                dataIndex: 'productDate',
                width: 118,
                render: (text) =>
                {
                    return text?<Tooltip>
                        {moment(text).format('YYYY-MM-DD')}
                    </Tooltip>:''
                }
            }
        ];
        return (
            <div className='ysynet-main-content'>
                <WrapperForm
                    dispatch={this.props.dispatch}
                    formProps={{...this.props}}
                    planType={this.handleplanType}
                    chaseType={this.handlepurchaseType}
                    handleDeptCodes={this.handleDeptCode}
                    supplierList={supplierList}
                    _handlQuery={this.handlQuery}
                />
                <div className='ant-row-bottom'>
                    <AddLot  onOk={this.submitGoods} supplierList={supplierList}>
                        <Button type='primary'>
                            新增
                        </Button>
                    </AddLot>
                    <Button style={{marginLeft: 8}} onClick={this.publish.bind(this, 1)} loading={sendLoading==1?true:false}  type='primary'>提交</Button>
                    <Button style={{marginLeft: 8}} onClick={this.export} loading={sendLoading==5?true:false}  type='primary'>导出</Button>
                    <Button style={{marginLeft: 8}} onClick={this.publish.bind(this, 2)} loading={sendLoading==2?true:false}>删除</Button>
                </div>
                <RemoteTable
                    onChange={this._tableChange}
                    columns={columns}
                    bordered
                    query={query}
                    ref='table'
                    isDetail={true}
                    scroll={{ x: '100%',  }}
                    rowKey={'id'}
                    url={batchAdjust.GET_BATCH_LIST}
                    rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                selected: selectedRowKeys,
                                selectedRows: [...this.state.selectedRows,...selectedRows]
                            })
                        },
                        /* getCheckboxProps: record => ({
                             disabled:showButtton2==2?record.status!=1:record.status!=2
                         })*/
                    }}

                />

            </div>
        )
    }
}
export default connect(state => state)(PlanOrder)