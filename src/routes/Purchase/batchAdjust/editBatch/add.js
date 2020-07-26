/**
 * @author QER
 * @date 2020/1/11
 * @Description: 新增批号
 */
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,DatePicker,InputNumber} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from "../../../../components/FetchSelect";
import {outStorage} from "../../../../api/drugStorage/outStorage";
import {filter,difference} from 'loadsh'
import moment from 'moment';
import {batchAdjust} from "../../../../api/purchase/purchase";
const FormItem = Form.Item;
const { Option } = Select;

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

class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            visible: false,
            selected: [],
            selectedRows: [],
            selectedRow: [],
            dataSource: [],
            ctmaSupplier:'',
            sendLoading:false,
            query:{
            },
            //deptList:[],
            visible2:false,
            datas:[],
            deptCode:''
        }
    }


    componentDidMount() {
        this.props.dispatch({
            type: 'batchAdjust/deptList',
            payload: {type:'lot_adjust_dept'},
            callback: (data) => {
               // data = data.filter(item => item.key === 3);
                this.setState({
                    deptList: data,
                });
            }
        })
    }

    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:false,
            dataSource:[]
        });

    }

    deptChange=(v)=>{
        this.setState({
            deptCode: v
        })
    }
    cancelModal2=e=>{

        if(e){
            e.stopPropagation();
        }
        this.setState({
            visible2:false,
            datas:[]
        });

    }

    showModal=e=>{

        if(e){
            e.stopPropagation()
        }
        if(this.state.visible){
            return false;
        }
        this.setState({
            visible:true,

            /* supplierListCode: this.props.supplierList[0].ctmaSupplierCode,
             query:{
                 ...this.state.query,
                 ctmaSupplier:this.props.supplierList[0].ctmaSupplierCode,
             }*/
        })


    }

    delete = () => {  //删除
        let { selectedRows, dataSource, query } = this.state;
        dataSource = difference(dataSource, selectedRows);
        let existDrugCodeList = dataSource.map((item) => item.drugCode)
        this.setState({
            dataSource,
            selected: [],
            selectedRows: [],
            query: {
                ...query,
                existDrugCodeList
            }
        });
    }



    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.setState({
                     query:{
                         ...this.state.query,
                         ...values
                     }
                })
            }
        })
    }


    handleplanType=(value)=>{
        this.props.planType(value)
    }
    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        })
    }
    onCheck = () => {
        const {selectedRow}=this.state;
        let isNull=selectedRow.every((item)=>{
            if(!item.newLot){
                message.error('请填写请新批号');
                return false;
            }else if(!item.newProductDate){
                message.error('请填写请新生产日期');
                return false;
            }else if(!item.newValidEndDate){
                message.error('请填写请新有效日期');
                return false;
            }else if(!item.newValidEndDate){
                message.error('请填写请新有效日期');
                return false;
            }else if(!item.adjustQty){
                message.error('请填写调整数量');
                return false;
            }else {
                return true
            }
        })
        return isNull
    }
    okHandler=(e)=>{
        if(e){
            e.stopPropagation()
        }
        let {selectedRow,deptCode} = this.state;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        if(!this.onCheck()) return;
        this.setState({ sendLoading: true });
        this.setState({
            selectedRow:{
                ...selectedRow,
                deptCode
            }
        })
        this.props.onOk(selectedRow);
        this.setState({
            visible:false,
            dataSource:[],
            selectedRowKeys: [],
            selectedRow: [],
            sendLoading: false,
            query:{}
        });

    }
    //call
    tableCallBack=(data)=>{
        this.setState({
            datas:data
        })
    }



    //添加药品部分
    showModal2=e=>{
        const {deptCode,selectedRow}=this.state;

        if(e){
            e.stopPropagation()
        }
        if(this.state.visible2){
            return false;
        }
        let existInstoreCodeList = [];
        selectedRow.map(item => existInstoreCodeList.push(item.batchNo));
        this.setState({
            visible2:true,
            query:{
                ...this.state.query,
                deptCode,
                existInstoreCodeList
            }
        })


    }
    handleOk=()=>{
        let {selectedRows,dataSource} = this.state;
        if(selectedRows.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        this.setState({
            dataSource:[...dataSource,...selectedRows],
            visible2:false,
            selected:[],
            selectedRows:[]
        })

    }



    render(){
        const {sendLoading,dataSource,selectedRowKeys,visible,datas,visible2,query} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {supplierList}=this.props;
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
            },
            {
                title: '药品编码',
                dataIndex: 'drugCode',
                width: 180
            },
            {
                title: '药品名称',
                dataIndex: 'drugName',
                width:260,
                className: 'ellipsis',
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )

            },
            {
                title: '单位',
                dataIndex: 'unitDesc',
                width: 118
            },
            {
                title: '数量',
                dataIndex: 'totalQuantity',
                width: 100
            },
            {
                title: '批号',
                dataIndex: 'lot',
                width: 130
            },
            {
                title: '生产日期',
                dataIndex: 'productDate',
                width: 118,
                render: (text) =>
                {
                    return text?<Tooltip>
                        {moment(text).format('YYYY-MM-DD')}
                    </Tooltip>:''
                }
            },
            {
                title: '有效日期',
                dataIndex: 'validEndDate',
                width: 118,

                render: (text) =>
                {
                    return text?<Tooltip>
                        {moment(text).format('YYYY-MM-DD')}
                    </Tooltip>:''
                }
            },
            {
                title: '新批号',
                dataIndex: 'newLot',
                width: 130,

                render: (text, record, index) =>
                {
                    return <Input
                        defaultValue={text}
                        min={1}
                        precision={0}
                        onChange={(e)=>{
                            let {dataSource,selectedRow} = this.state;
                            dataSource = JSON.parse(JSON.stringify(dataSource));
                            dataSource[index].newLot = e.target.value;
                            this.setState({dataSource});
                            selectedRow = selectedRow.map((item,i) => {
                                if(item.id === record.id) {
                                    item.newLot = e.target.value;
                                };
                                return item;
                            });
                            this.setState({ selectedRow });
                        }}
                    />
                }
            },
            {
                title: '新生产日期',
                dataIndex: 'newProductDate',
                width: 168,
                render:(text, record, index)=>{
                    return <DatePicker
                        allowClear={false}
                        onChange={(moment, value) => {
                            let {dataSource,selectedRow} = this.state;
                            dataSource = JSON.parse(JSON.stringify(dataSource));
                            dataSource[index].newProductDate = value;
                            this.setState({dataSource});
                            selectedRow = selectedRow.map((item,i) => {
                                if(item.id === record.id) {
                                    item.newProductDate = value;
                                };
                                return item;
                            });
                            this.setState({ selectedRow });
                        }}
                        placeholder="选择生产日期"
                    />
                }
            },
            {
                title: '新有效日期',
                dataIndex: 'newValidEndDate',
                width: 168,

                render:(text, record, index)=>{
                    return <DatePicker
                        allowClear={false}
                        disabledDate={(endTime)=>{
                            return endTime.valueOf() <= moment(record.fromDate).valueOf();
                        }}
                        onChange={(moment, value) => {
                            let {dataSource,selectedRow} = this.state;
                            dataSource = JSON.parse(JSON.stringify(dataSource));
                            dataSource[index].newValidEndDate = value;
                            this.setState({dataSource});
                            selectedRow = selectedRow.map((item,i) => {
                                if(item.id === record.id) {
                                    item.newValidEndDate = value;
                                };
                                return item;
                            });
                            this.setState({ selectedRow });
                        }}
                        placeholder="选择有效日期"
                    />
                }
            },
            {
                title: '调整数量',
                width: 112,
                dataIndex: 'adjustQty',
                render: (text, record, index) =>
                {
                    return <InputNumber
                        defaultValue={text}
                        min={1}
                        precision={0}
                        onChange={(value)=>{
                            let {dataSource,selectedRow} = this.state;
                            dataSource = JSON.parse(JSON.stringify(dataSource));
                            dataSource[index].adjustQty = value;
                            this.setState({dataSource});
                            selectedRow = selectedRow.map((item,i) => {
                                if(item.id === record.id) {
                                    item.adjustQty = value;
                                };
                                return item;
                            });
                            this.setState({ selectedRow });
                        }}
                    />
                }
            },
            {
                title: '备注',
                width: 160,
                dataIndex: 'remarks',
                render: (text, record, index) =>
                {
                    return <Input
                        defaultValue={text}
                        min={1}
                        precision={0}
                        onChange={(e)=>{
                            let {dataSource,selectedRow} = this.state;
                            dataSource = JSON.parse(JSON.stringify(dataSource));
                            dataSource[index].remarks =  e.target.value;
                            this.setState({dataSource});
                            selectedRow = selectedRow.map((item,i) => {
                                if(item.id === record.id) {
                                    item.remarks =  e.target.value;
                                };
                                return item;
                            });
                            this.setState({ selectedRow });
                        }}
                    />
                }
            },
            {
                title: '规格',
                width: 120,
                fixed:'right',
                dataIndex: 'ctmmSpecification',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '生产厂商',
                width: 160,
                fixed:'right',
                dataIndex: 'ctmmManufacturerName',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '批准文号',
                width: 160,
                fixed:'right',
                dataIndex: 'approvalNo',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
        ];
        const columnsModal=[
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
            },
            {
                title: '药品名称',
                width: 350,
                dataIndex: 'drugName',
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '药品编码',
                dataIndex: 'hisDrugCode',
                width: 180
            },
            {
                title: '规格',
                width: 148,
                dataIndex: 'ctmmSpecification',
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '生产厂商',
                width: 160,
                dataIndex: 'ctmmManufacturerName',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '批准文号',
                width: 160,
                dataIndex: 'approvalNo',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
        ]
        return (
           <span  onClick={this.showModal}>
               {this.props.children}
               <Modal
                   destroyOnClose
                   bordered
                   title={'新增产品'}
                   width={1200}
                   style={{ top:'5%'}}
                   visible={visible}
                   onCancel={this.cancel}
                   onOk={this.okHandler}
                   footer={dataSource&&dataSource.length>0?[
                       <Button key="submit" type="primary"  onClick={this.okHandler} loading={sendLoading}>
                           保存
                       </Button>,
                   ]:null}
               >

                   <div className='flex-button'>
                     <span>部门:</span>
                       <Select
                           placeholder='请选择'
                           showSearch
                           optionFilterProp="children"
                           filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                           style={{flex:1}}
                           onChange={this.deptChange}
                           disabled={dataSource.length > 0}
                       >
                           {
                               supplierList.filter(item=>item.value!='').map((item,index) => <Option key={item.value} value={item.value}>{item.label}</Option>)
                           }

                       </Select>
                      <Button style={{marginLeft: 8}} onClick={this.showModal2} loading={sendLoading==1?true:false}  type='primary'>新增产品</Button>
                       <Button style={{marginLeft: 8}} onClick={this.delete} loading={sendLoading==2?true:false}>移除</Button>
                   </div>

                   <div className='detailCard'>
                       <h3 style={{paddingBottom: 10, borderBottom: '1px solid rgba(0, 0, 0, .1)'}}>产品信息</h3>
                   </div>
                    <div  style={{height:'200px',overflow:'auto'}}>
                        <Table
                            rowSelection={{
                                selectedRowKeys: selectedRowKeys,
                                onChange:(selectedRowKey, selectedRow)=>{
                                    this.setState({selectedRow, selectedRowKeys: selectedRowKey})
                                }
                            }}
                            bordered
                            dataSource={dataSource}
                            scroll={{x: '100%'}}
                            columns={columns}
                            isDetail={true}
                            pagination={{size: 'small'}}
                            rowKey={'batchNo'}
                        />
                    </div>

               </Modal>


               <Modal
                   destroyOnClose
                   bordered
                   title={'添加药品'}
                   width={1200}
                   style={{ top:'5%'}}
                   visible={visible2}
                   onCancel={this.cancelModal2}
                   onOk={this.okHandler}
                   footer={datas&&datas.length>0?[
                       <Button key="back" onClick={this.cancelModal2}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary"  onClick={this.handleOk} loading={sendLoading}>
                           确定
                       </Button>,
                   ]:null}
               >
                    <div>
                        <div>
                            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={30}>
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
                        <FormItem label={`药品名称`} {...formItemLayout}>
                            {getFieldDecorator('hisDrugCode')(
                                <FetchSelect
                                    style={{width: '100%'}}
                                    allowClear
                                    placeholder='药品名称'
                                    url={outStorage.QUERY_DRUG_BY_LIST}
                                />
                            )}
                        </FormItem>
                    </Col>
                      <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
                       <Button type="primary" htmlType="submit">查询</Button>
                     </Col>
                    </Row>
                 </Form>
                  </div>
                        <RemoteTable
                            onChange={this._tableChange}
                            columns={columnsModal}
                            data={datas}
                            query={query}
                            isJson={true}
                            url={batchAdjust.ADD_DRUG_LIST}
                            bordered
                            ref='table'
                            isDetail={true}
                            cb={this.tableCallBack}
                            scroll={{ x: '100%',  }}
                            rowKey={'id'}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({
                                        selected: selectedRowKeys,
                                        selectedRows: selectedRows
                                    })
                                }
                            }}

                        />
                    </div>

                </Modal>


           </span>
        )
    }
}
export default connect(state => state)(Form.create()(AddRefund));