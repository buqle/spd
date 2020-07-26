/**
 * @author QER
 * @date 2019/11/22
 * @Description: 药学科－结算管理-生成结算单
*/
import React, { PureComponent } from 'react';
import { Form, Button, message, Tooltip, DatePicker, Select, Row, Col, Input, Icon,Badge,InputNumber} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { createSettle } from '../../../../api/purchase/purchase';
import { connect } from 'dva';
import FetchSelect from "../../../../components/FetchSelect";
import {common} from "../../../../api/purchase/purchase";
import {uniqBy} from 'lodash';
import moment from 'moment';
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
      deptModules:[],//部门,
      deptId:''
  }
  componentDidMount = () =>{
    let { dispatch } = this.props;

    // 供应商
    dispatch({
      type: 'base/genSupplierList',
      callback: ({data}) =>{
        this.setState({ supplierList: data },()=>{
                this.setState({deptId:'1012027'});
            }
        )
          this.props._handlQuery({
              supplierCode:'1012027'
          });
      }
    });


    //部门
      dispatch({
          type: 'base/getModule',
          payload: { deptType : '4' },
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
  render(){
    const { getFieldDecorator } = this.props.form;
    const { supplierList, deptModules,deptId } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`,{
                    initialValue: deptId
                })(

                  <Select
                    placeholder='请输入'
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                      <Option key={''} value={''}>全部</Option>
                      {
                          supplierList.map(item => (
                              <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                          ))
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
                            initialValue: ''
                        })(
                            <Select onChange={this.handleDept}>
                                <Option key={''} value={''}>全部</Option>
                                {
                                    deptModules.map((item,index)=> <Option key={index} value={item.id}>{ item.deptName }</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
            <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`时间`}>
              {
                getFieldDecorator(`orderTime`)(
                  <RangePicker format={'YYYY-MM-DD'}/>
                )
              }
            </FormItem>
          </Col>
            <Col span={8} style={{ display: display }}>
                <FormItem {...formItemLayout} label={`发药单号`}>
                    {
                        getFieldDecorator(`dispensingNo`)(
                            <Input placeholder='请输入发药单号'/>
                        )
                    }
                </FormItem>
            </Col>
            <Col span={8} style={{ display: display }}>
                <FormItem {...formItemLayout} label={`对账单号`}>
                    {
                        getFieldDecorator(`balanceCode`)(
                            <Input placeholder='请输入对账单号'/>
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
    pageNoList:[],
    modalSelected:[],
    query:{}
  }
    listysjTableCallBack=(data)=>{
      console.log(data)
      let pageNoList=data.pageNo
      this.setState({
          ...this.state.pageNoList,
          pageNoList,
      })
    }

    handlQuery = (query) => {
        this.setState({
            query: {
                ...this.state.query,
                ...query
            }
        });

    }

  //生成补货计划
    sendOrder = () =>{
        let { selectedRow, query} = this.state;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let idList = [];

        selectedRow.map(item => idList.push(item.id));
        this.setState({ sendLoading: true });
        this.props.dispatch({
            type: 'settlementMgt/createReplenishment',
            payload: {
                idList
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
        let { selectedRow, query} = this.state;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let idList = [];
        selectedRow.map(item => idList.push(item.id));
        this.props.dispatch({
            type: 'settlementMgt/exportDifference',
            payload: {idList}
        });
    }
  render(){
    const { sendLoading ,modalSelected} = this.state;
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,

      },
        {
            title: '业务药房',
            width:110,
            dataIndex: 'deptDesc',
        },
        {
            title: '对账单号',
            width:150,
            dataIndex: 'balanceCode',
        },
        {
        title: '发药时间',
        dataIndex: 'dispensingDate',
        width: 200,

      },
        {
            title: '发药单号',
            width:170,
            dataIndex: 'dispensingNo',
            render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
            )
        },
        {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 112,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      },{
        title: '药品名称',
        dataIndex: 'drugName',
        width: 220,
        render:(text)=>(
                <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
        )
      },{
        title: '数量',
        dataIndex: 'quantity',
        width: 94
      },{
        title: '金额',
        dataIndex: 'price',
        width: 100,
      },{
            title: '单位',
            dataIndex: 'drugDosUom',
            width: 94
        },{
            title: '批号',
            dataIndex: 'batch',
            width: 120
        },{
            title: '合计金额',
            dataIndex: 'amount',
            width: 100,
            fixed:'right'
        }
    ];
    let query = this.props.base.queryConditons;
    query = {...query,...this.state.query};
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
            _handlQuery={this.handlQuery}
          />
         <div className='ant-row-bottom'>
             <Button type='primary' onClick={this.sendOrder} loading={sendLoading}>生成结算单</Button>
             <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>
         </div>
          {
              query.supplierCode?
                  <RemoteTable
                      onChange={this._tableChange}
                      columns={columns}
                      bordered
                      query={query}
                      ref='table'
                      isDetail={true}
                      scroll={{ x: '100%',  }}
                      rowKey={'id'}
                      url={createSettle.CREATE_SETTLE_LIST}
                      getTotal={this.listysjTableCallBack}
                      rowSelection={{
                          //selectedRowKeys: modalSelected,
                          onChange: (selectedRowKeys, selectedRow) => {
                              //this.setState({selectedRowKeys, selectedRow});
                              this.setState({
                                  selectedRowKeys,
                                  selectedRow:selectedRow
                              });
                          },
                          /* getCheckboxProps: record => ({
                               disabled:record.isReplenishment==2
                           })*/
                      }}

                  />
                  :null
          }

      </div>
    )
  }
}
export default connect(state => state)(PlanOrder)