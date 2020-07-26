/**
 * @author QER
 * @date 19/4/16
 * @Description: 药学科－配送缺货管理
*/
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon,Badge,InputNumber} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { shortages } from '../../../../api/replenishment/replenishmentPlan';
import { connect } from 'dva';
import FetchSelect from "../../../../components/FetchSelect";
import {common} from "../../../../api/purchase/purchase";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
class SearchForm extends PureComponent{
  state = {
    supplierList: [],
    orderStatus: [
        {value: "1", label: "新欠品单"},
        {value: "2", label: "已补计划"}
    ], // 订单状态
    orderTypeOptions: [
        {value: "1", label: "零库存"},
        {value: "2", label: "自采"}

    ], // 订单类型
      deptModules:[]//部门
  }
  componentDidMount = () =>{
    let { dispatch } = this.props;
    // 供应商
    dispatch({
      type: 'replenish/supplierList',
      payload: {},
      callback: (data) =>{
        this.setState({ supplierList: data })
      }
    });
    //部门
      dispatch({
          type: 'base/getModule',
          payload: { deptType : '3' },
          callback: (data) =>{
              this.setState({ deptModules: data })
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
    const { supplierList, orderStatus, orderTypeOptions,deptModules } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`,{
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
                <FormItem {...formItemLayout} label={`订单类型`}>
                    {
                        getFieldDecorator('purchaseType',{
                            initialValue: '1'
                        })(
                            <Select onChange={this.handleplanType}>

                                {
                                    orderTypeOptions.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
           <Col span={8}>
                <FormItem {...formItemLayout} label={`订单状态`}>
                    {
                        getFieldDecorator(`isReplenishment`,{
                            initialValue: '1'
                        })(
                            <Select onChange={this.handlepurchaseType}>

                                {
                                    orderStatus.map((item,index) => <Option key={index} value={item.value}>{item.label}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
            <Col span={8}>
                <FormItem {...formItemLayout} label={`部门`}>
                    {
                        getFieldDecorator(`deptCode`,{
                            initialValue: '24C69445D19C4625960DA3F1E58A6A1F'
                        })(
                            <Select onChange={this.handleDept}>

                                {
                                    deptModules.map((item,index)=> <Option key={index} value={item.id}>{ item.deptName }</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
            <Col span={8} style={{ display: display }}>
                <FormItem {...formItemLayout} label={`采购订单`}>
                    {
                        getFieldDecorator(`orderCode`)(
                            <Input placeholder='请输入订单编号'/>
                        )
                    }
                </FormItem>
            </Col>
            <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`订货日期`}>
              {
                getFieldDecorator(`orderTime`)(
                  <RangePicker format={'YYYY-MM-DD'}/>
                )
              }
            </FormItem>
          </Col>
            <Col span={8} style={{ display: display }}>
                <FormItem {...formItemLayout} label={`药品名称`}>
                    {
                        getFieldDecorator(`hisDrugCode`)(
                            <FetchSelect
                                allowClear={true}
                                style={{ width: '100%' }}
                                placeholder='药品名称'
                                url={common.QUERY_DRUG_BY_LIST}
                            />
                        )
                    }
                </FormItem>
            </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
           <Button type='default' style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
              <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                  {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
              </a>
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
    selectedRowKeys: [],
    selectedRow: [],
      planType:1,
      purchaseType:1,
      deptCode:'24C69445D19C4625960DA3F1E58A6A1F'
  }
  //删除
    delete=()=>{
        const { selectedRow,query} = this.state;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let list = [];
        selectedRow.map(item => list.push({
            id: item.id,
        }));
        this.setState({ sendLoading: 2 });
        this.props.dispatch({
            type: 'replenish/replenishmenthDelete',
            payload: {
                list
            },
            callback: (flag) =>{
                if(flag){
                    this.setState({ sendLoading: false });
                    if(flag){
                        this.refs.table.fetch(query);
                    }
                }
            }
        })
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
        this.setState({ sendLoading: 1 });
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
  render(){
    const { loading, sendLoading } = this.state;
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        fixed:'left'
      },
        {
            title: '订货日期',
            width:128,
            dataIndex: 'sendDate',
            fixed:'left'
        },
        {
        title: '采购订单',
        dataIndex: 'orderCode',
        width: 200
      },{
        title: '供应商',
        dataIndex: 'supplierName',
        width: 112,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      },{
        title: '药品名称',
        dataIndex: 'ctmmDesc',
        width: 220,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      },{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      },{
        title: '单位',
        dataIndex: 'unit',
        width: 100,
      },{
        title: '生产厂商',
        dataIndex: 'ctmmManufacturerName',
        width: 168,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      }, {
            title: '订货数量',
            dataIndex: 'demandQuantity',
            width: 100,
        },{
            title: '实到数量',
            dataIndex: 'distributeQuantity',
            width: 100,
        },{
            title: '缺货数量',
            dataIndex: 'differenceQuantity',
            width: 100,
            fixed:'right'
        },{
            title: '补货数量',
            dataIndex: 'replenishmentQuantity',
            width: 168,
            render: (text, record, index) => {
                return <div>
                    <InputNumber
                        defaultValue={text}
                        min={1}
                        precision={0}
                        disabled={record.isReplenishment!=1}
                        onChange={this.onChange.bind(this, record, index)}
                    />
                </div>
            },
            fixed:'right'
        },{
            title: '类型',
            dataIndex: 'purchaseTypeName',
            width: 100,
            fixed:'right'
        },{
            title: '状态',
            dataIndex: 'isReplenishmentName',
            width: 100,
            fixed:'right'
        }
    ];
    let query = this.props.base.queryConditons;
    query = {...query};
    delete query.orderTime;
    delete query.key;
    return (
      <div className='ysynet-main-content'>
         <WrapperForm 
            dispatch={this.props.dispatch}
            formProps={{...this.props}}
            planType={this.handleplanType}
            chaseType={this.handlepurchaseType}
            handleDeptCodes={this.handleDeptCode}
          />
         <div className='ant-row-bottom'>
             <Button type='primary' onClick={this.sendOrder} loading={sendLoading==1?true:false}>生成补货计划</Button>
             <Button type='primary' onClick={this.delete} loading={sendLoading==2?true:false}  style={{marginLeft: 8}}>删除</Button>
             <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>
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
            url={shortages.SHORTAGELIST}
            rowSelection={{
                onChange: (selectedRowKeys, selectedRow) => {
                    this.setState({selectedRowKeys, selectedRow});
                },
                getCheckboxProps: record => ({
                    disabled:record.isReplenishment==2
                })
            }}

         />
      </div>
    )
  }
}
export default connect(state => state)(PlanOrder)