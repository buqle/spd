/**
 * @author QER
 * @date 2019/10/28
 * @Description: 采购目录管理
 */
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon,Badge,InputNumber,Modal,Upload} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import {managPlan, replenishmentPlan} from '../../../../api/replenishment/replenishmentPlan';
import { connect } from 'dva';
import AddPlan from './addShortage'
import EditPlan from './editPlan'
import ReadMore from "../../../SystemMgt/interfacelog/readMore";
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
        blendStatus: [], // 勾兑状态
        auditStatus: [], // 审核状态
        deptModules:[],//部门
        searchArr:['catalog_is_publish','catalog_is_blend','catalog_content_state'],
    }
    componentDidMount = () =>{
        let { dispatch } = this.props;
        dispatch({
            type: 'replenish/orderStatusOrorderType',
            payload: {type:'catalog_is_blend'},
            callback: (data) =>{
                this.setState({ blendStatus: data });
            }
        });
        dispatch({
            type: 'replenish/orderStatusOrorderType',
            payload: {type:'catalog_is_publish'},
            callback: (data) =>{
                this.setState({ releaseStatus: data });
            }
        });
        dispatch({
            type: 'replenish/orderStatusOrorderType',
            payload: {type:'catalog_content_state'},
            callback: (data) =>{
                this.setState({auditStatus:data});
            }
        });
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
    render(){
        const { getFieldDecorator } = this.props.form;
        const { releaseStatus, blendStatus,auditStatus } = this.state;
        const {supplierList}=this.props;
        const {display} = this.props.formProps.base;
        const expand = display === 'block';
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`供应商`}>
                            {
                                getFieldDecorator(`ctmaSupplier`,{
                                    initialValue: ''
                                })(

                                    <Select
                                        placeholder='请输入'
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                        <Option key={''} value={''}>全部</Option>
                                        {
                                            supplierList.map((item,index) => <Option key={index} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`发布状态`}>
                            {
                                getFieldDecorator('isPublish',{
                                    initialValue: ''
                                })(
                                    <Select onChange={this.handleplanType}>

                                        {
                                            releaseStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`勾兑状态`}>
                            {
                                getFieldDecorator(`isBlend`,{
                                    initialValue: ''
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
                        <FormItem {...formItemLayout} label={`审核状态`}>
                            {
                                getFieldDecorator(`contentState`,{
                                    initialValue:''
                                })(
                                    <Select onChange={this.handleDept}>

                                        {
                                            auditStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`发布日期`}>
                            {
                                getFieldDecorator(`orderTime`)(
                                    <RangePicker format={'YYYY-MM-DD'}/>
                                )
                            }
                        </FormItem>
                    </Col>
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
        note:''
    }
    componentDidMount=()=>{
        // 供应商
        this.props.dispatch({
            type: 'replenish/supplierList',
            payload: {},
            callback: (data) =>{
                this.setState({ supplierList: data })
            }
        });
    }
    //生成补货计划
    sendOrder = () =>{
        let { selectedRow, query,planType,purchaseType,deptCode } = this.state;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let list = {}, pickingDetail = [];
        selectedRow.map(item => pickingDetail.push({
            id: item.id,
            bigDrugCode: item.bigDrugCode,
            demandQuantity: item.replenishmentQuantity,
            drugCode: item.drugCode,
            drugPrice:item.drugPrice,
            hisDrugCode:item.hisDrugCode,
            supplierCode:item.supplierCode
        }));
        list=pickingDetail
        this.setState({ sendLoading: true });
        this.props.dispatch({
            type: 'replenish/createReplenishment',
            payload: {
                list,auditStatus:2,planType:planType,purchaseType:purchaseType,
                deptCode:deptCode
            },
            callback: (flag) =>{
                this.setState({ sendLoading: false });
                if(flag){
                    this.refs.table.fetch(query);
                }
            }
        })
        //console.log(selectedRow)
    }
    //补货数量
    onChange = (record, index, value) => {
        let { selectedRow} = this.state;
        if(value!=0){
            record.replenishmentQuantity=value
        }
        selectedRow = selectedRow.map(item => {
            if(item.id === record.id) {
                item.replenishmentQuantity = value;
            };
            return item;
        });
        this.setState({ selectedRow });
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

    //导出
    export = () => {
        let {queryConditons} = this.props.base;
        queryConditons = {...queryConditons};
        delete queryConditons.pageNo;
        delete queryConditons.key;
        delete queryConditons.pageSize;
        this.props.dispatch({
            type: 'replenish/exportDifference',
            payload: queryConditons,
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    message.success('正在导出对账单');
                }else {
                    message.error(msg);
                }
            }
        });
    }

    //提交添加药品
    submitGoods=values=>{
        let { query } = this.state;
        this.props.dispatch({
            type:'replenish/submitSupplyGoods',
            payload: values,
            callback: (flag) =>{
                if(flag){
                    this.refs.table.fetch(query);
                }
            }
        });
    }
    //发布
    publish=()=>{
        let {selectedRows,} = this.state;
        if(selectedRows.length === 0) {
            message.warning('请选择一条数据进行发布');
            return;
        };
        let ids= [];
        selectedRows.map(item => ids.push(item.id));
        let { query } = this.state;
        this.setState({sendLoading:1})
        this.props.dispatch({
            type:'replenish/publishSupplyGood',
            payload: {ids},
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
    //审核
    showModal=()=>{
        let {selectedRows,} = this.state;
        if(selectedRows.length === 0) {
            message.warning('请选择一条数据进行审核');
            return;
        };
        this.setState({
            visible: true
        })
    }
    handleOk=(flag)=>{
        let {selectedRows,note} = this.state;
        let ids= [];
        selectedRows.map(item => ids.push(item.id));
        let { query } = this.state;
        this.setState({sendLoading:2})
        this.props.dispatch({
            type:'replenish/confirmSupplyGood',
            payload: {
                ids,note,contentState:flag
            },
            callback: (flag) =>{
                this.setState({ sendLoading: false });
                if(flag){
                    this.refs.table.fetch(query);
                    this.noSelect();
                }else {
                    this.setState({ visible: false });
                    this.noSelect();
                }
            }
        });
    }
    handleTextareaChange=({ target: { value } }) => {
        this.setState({ note: value });
    };
    //down
    downTel=()=>{
        this.props.dispatch({
            type:'replenish/downTemplate'
        });
    }
    render(){
        const { sendLoading ,supplierList,visible} = this.state;
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
                dataIndex: 'rowKey'
            },
            {
                title: '药品名称',
                dataIndex: 'drugName',
                width: 300,
                className: 'ellipsis',
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '药品编码',
                dataIndex: 'hisDrugCode',
                width: 200
            },{
                title: '药品规格',
                dataIndex: 'specification',
                width: 112,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },{
                title: '供应商名称',
                dataIndex: 'ctmaSupplierName',
                width: 112,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },{
                title: '厂商名称',
                dataIndex: 'ctmmManufacturerName',
                width: 168,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },{
                title: '供应开始时间',
                dataIndex: 'fromDate',
                width: 118,
            },{
                title: '供应结束时间',
                dataIndex: 'toDate',
                width: 118,
            }, {
                title: '采购价格',
                dataIndex: 'referencePrice',
                width: 100,
            },{
                title: '采购单位',
                dataIndex: 'drugDosUom',
                width: 100,
            },{
                title: '发布状态',
                dataIndex: 'isPublishName',
                width: 100,

            },{
                title: '发布时间',
                dataIndex: 'publishDate',
                width: 118,
            },{
                title: '勾兑状态',
                dataIndex: 'isBlendName',
                width: 100,

            },{
                title: '行号',
                dataIndex: 'rowNo',
                width: 80,
            },{
                title: '销售单位',
                dataIndex: 'supplierUnit',
                width: 80,
            },{
                title: '销售单位转换比',
                dataIndex: 'converRate',
                width: 116,
            },{
                title: '业务员',
                dataIndex: 'staffName',
                width: 110,
            },{
                title: '审核状态',
                dataIndex: 'contentStateName',
                width: 100,
            },{
                title: '审核时间',
                dataIndex: 'operateDate',
                width: 118,
                fixed:'right'
            },{
                title: '审核人',
                dataIndex: 'operatorName',
                width: 100,
                fixed:'right'
            },{
                title: '备注',
                dataIndex: 'note',
                width: 120,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                ),
                fixed:'right'
            },
            {
                title: '操作',
                dataIndex: 'draft',
                width:100,
                fixed:'right',
                render: (text, record) =>
                    <div>
                        {
                            record.isBlend==2?
                                <EditPlan record={record}>
                                    <Button type="primary"   >
                                        编辑
                                    </Button>
                                </EditPlan>
                                :
                                <Button type="dashed">
                                    编辑
                                </Button>
                        }
                    </div>

            },
        ];
        let query = this.props.base.queryConditons;
        query = {...query};
        delete query.orderTime;
        delete query.key;
        const props = {
            data:{
                file:'补货计划',
                addDrugType:'1',
                deptCode:query.deptCode
            },
            action:managPlan.MANAGPLAN_IMPORT,
            headers: {
                authorization: 'authorization-text',
            },
            onChange:(info) =>{
                var that = this;
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let data = info.file.response.data;
                    if(!data) {
                        message.warning('导入失败！');
                        return;
                    }else{
                        message.success('导入成功');
                        this.setState({
                            dataSource:data
                        })

                    }

                } else if (info.file.status === 'error') {
                    message.error('导入失败');
                }
            }
        }
        return (
            <div className='ysynet-main-content'>
                <WrapperForm
                    dispatch={this.props.dispatch}
                    formProps={{...this.props}}
                    planType={this.handleplanType}
                    chaseType={this.handlepurchaseType}
                    handleDeptCodes={this.handleDeptCode}
                    supplierList={supplierList}
                />
                <div className='ant-row-bottom'>
                    <AddPlan supplierList={this.state.supplierList} onOk={this.submitGoods}>
                        <Button type='primary'>
                            新增
                        </Button>
                    </AddPlan>
                    <Button style={{marginLeft: 8}} onClick={this.publish} loading={sendLoading==1?true:false}  type='primary'>发布</Button>
                    <Button style={{marginLeft: 8}} onClick={this.showModal} loading={sendLoading==2?true:false}  type='primary'>审核</Button>
                    {/* <Button style={{marginLeft: 8}} onClick={this.downTel} loading={sendLoading==3?true:false}  type='primary'>下载模版</Button>
             <Upload
                 {...props}
                 style={{ marginLeft: '8px' }}
             >
                 <Button>导入模板</Button>
             </Upload>*/}
                    {/*    <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>*/}

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
                    url={managPlan.MANAGPLAN_LIST}
                    rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                selected: selectedRowKeys,
                                selectedRows: selectedRows
                            })
                        },
                        /*getCheckboxProps: record => ({
                            disabled:record.isPublish==2
                        })*/
                    }}

                />
                <Modal
                    title="单据审核"
                    visible={visible}
                    onOk={this.handleOk.bind(this, 2)}
                    onCancel={this.handleOk.bind(this, 3)}
                    okText='通过'
                    cancelText='驳回'
                >
                    <div className='edit-flex'>
                        <dl>
                            <dt><TextArea rows={3} onChange={this.handleTextareaChange}/></dt>
                        </dl>
                    </div>

                </Modal>
            </div>
        )
    }
}
export default connect(state => state)(PlanOrder)
