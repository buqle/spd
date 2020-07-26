/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 补货管理--补货计划
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker, Icon, Select, Tooltip,Checkbox } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {statisticAnalysis,common} from '../../../../api/purchase/purchase';
import FetchSelect from '../../../../components/FetchSelect';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: {span: 8}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: {span: 16}
  },
};
const formItemLayout2 = {
    labelCol: {
        xs: { span: 30 },
        sm: { span: 10 },
        md: {span: 10}
    },
    wrapperCol: {
        xs: { span: 26 },
        sm: { span: 14 },
        md: {span: 14}
    },
};

class SearchForm extends PureComponent{
  state = {
    supplierList: [],
    typeList: [],
    isShow:1
  }
  componentDidMount() {
      let values={
          isShowOthersType:this.state.isShow
      }
      this.props._handlQuery(values);
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/getSuppliers',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }
      }
    });
    dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: "medicine_standing"
      },
      callback: (data) => {
        this.setState({
          typeList: data
        });
      }
    })
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
    onCheckChanage = (e) =>{

        if(e.target.checked){
            this.setState({isShow:1})
        }else {
            this.setState({isShow:2})
        }

    }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        if (closeDate.length > 0) {
          values.startTime = closeDate[0].format('YYYY-MM-DD HH:mm');
          values.endTime = closeDate[1].format('YYYY-MM-DD HH:mm');
        }else {
          values.startTime = '';
          values.endTime = '';
        };
        values.isShowOthersType=this.state.isShow
        this.props._handlQuery(values);
      }
    })
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    const { supplierList, typeList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`)(
                  <Select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
              <FormItem label={`药品名称`} {...formItemLayout}>
                  {getFieldDecorator('hisDrugCodeList')(
                      <FetchSelect
                          style={{width: '100%'}}
                          allowClear
                          placeholder='药品名称'
                          url={common.QUERY_DRUG_BY_LIST}
                      />
                  )}
              </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`统计时间`}>
              {
                getFieldDecorator(`closeDate`)(
                  <RangePicker showTime style={{width: '100%'}}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`类型`}>
              {
                getFieldDecorator(`secondType`)(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      typeList.map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={'生产批号'}>
              {
                getFieldDecorator(`lot`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          {
                this.props._show?<Col span={8}>
                    <FormItem {...formItemLayout2} label={'包含拆零移库信息'} style={{ display: display }}>
                        {
                            getFieldDecorator(`isShowOthersType`,{
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox
                                    onChange={this.onCheckChanage}
                                />
                            )
                        }
                    </FormItem>
                </Col>:null
          }
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

class DrugLedger extends PureComponent {
  state = {
    query: {},
      newList:{
          title: '库存数量',
          dataIndex: 'stockNum',
          fixed: 'right',
          width: 112,
      },
      newss:{},
      showButtton:'',
      showButtton2:'',
      pageNow:1
  }
  handlQuery = (query) => {
    this.setState({query});
  }
  export = () => {
    this.props.dispatch({
        type: this.state.showButtton?'statistics/medicineStandingExport':'statistics/medicineStandingExportNew',
      payload: {
        ...this.state.query
      }
    });
  }
    componentDidMount() {
        if(this.props.location.pathname.indexOf('new')!=-1){
            this.setState({
               // newList:newss,
                showButtton2:true
            })
        }else {
            this.setState({
                showButtton:true
            })
        }
    }
    getTotal=(data)=>{
        let {query}=this.state
        this.setState({
            query: {
                ...query,
                pageNo:data.pageNo
            }
        });
    }
  render() {

    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      }, 
      {
        title: '类型',
        dataIndex: 'type',
        width: 100,
      }, {
        title: '单号',
        dataIndex: 'orderNo',
        width: 158,
      }, {
        title: '时间',
        dataIndex: 'createDate',
        width: 180,
      }, /*{
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 200,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, */{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },/* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 138,
      }, */{
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: 90,
      }, {
        title: '生产批号',
        dataIndex: 'lot',
        width: 110,
      }, {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 118,
      }, {
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 118,
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 148,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90,
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 168,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 118,
      }, this.state.newList, {
        title: '入库数量',
        dataIndex: 'inStockNum',
        fixed: 'right',
        width: 100,
      }, {
        title: '出库数量',
        dataIndex: 'outStockNum',
        fixed: 'right',
        width: 100,
      }, {
        title: '结存数量',
        dataIndex: 'balanceNum',
        fixed: 'right',
        width: 100,
      },
        {
            title: '药品编号',
            fixed: 'right',
            dataIndex: 'hisDrugCode',
            width: 148,
        }
    ];
    const {query,showButtton,showButtton2} = this.state;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          _handlQuery={this.handlQuery}
          _show={showButtton2}
        />
        <div>
          <Button onClick={this.export}>导出</Button>
        </div>
          {
            showButtton2&&query.isShowOthersType?
                <RemoteTable
                    onChange={this._tableChange}
                    query={query}
                    columns={columns}
                    isDetail={true}
                    scroll={{x: '100%' ,  }}
                    style={{marginTop: 20}}
                    ref='table'
                    rowKey={'id'}
                    getTotal={this.state.pageNow==1?null:this.getTotal}
                    url={statisticAnalysis.DRUG_LEDGER_NEW}
                />:null
          }
          {
              showButtton?
                  <RemoteTable
                      onChange={this._tableChange}
                      query={query}
                      columns={columns}
                      isDetail={true}
                      scroll={{x: '100%' ,  }}
                      style={{marginTop: 20}}
                      ref='table'
                      rowKey={'id'}
                      getTotal={this.state.pageNow==1?null:this.getTotal}
                      url={statisticAnalysis.DRUG_LEDGER}
                  />:null
          }
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(DrugLedger));