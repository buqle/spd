/**
 * @author QER
 * @date 19/6/3
 * @Description: 呆滞库存查询
*/
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Icon, Select, Tooltip,DatePicker } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect';
import { connect } from 'dva';
import {statisticAnalysis} from '../../../../api/purchase/purchase';
import {common} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
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


class SearchForm extends PureComponent{
  state = {
    timeList: [],
    deptList: [],
    supplierList: [],
    periodList:[]
  }
  componentDidMount() {
    const {dispatch} = this.props.formProps;
    dispatch({
      type: 'statistics/delayGetTimeList',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            timeList: data
          });
        }
      }
    });
      dispatch({
          type: 'statistics/proGetTimeList',
          callback: ({data, code, msg}) => {
              if(code === 200) {
                  this.setState({
                      periodList: data
                  });
              }
          }
      });
    dispatch({
      type: 'statistics/delayGetDeptInfo',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            deptList: data
          });
        }
      }
    });
    dispatch({
      type: 'statistics/supplierAll',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }
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
          const closeDate = values.closeDate === undefined ? '' : values.closeDate;
          if (closeDate.length > 0) {
              values.startTime = closeDate[0].format('YYYY-MM-DD HH:mm');
              values.endTime = closeDate[1].format('YYYY-MM-DD HH:mm');
          }else {
              values.startTime = '';
              values.endTime = '';
          };
       /* values.deptCodeList = values.deptCodeList ? [values.deptCodeList] : [];
        values.hisDrugCodeList = values.hisDrugCodeList ? [values.hisDrugCodeList] : [];
        values.supplierCodeList = values.supplierCodeList ? [values.supplierCodeList] : [];*/
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
    const { timeList, deptList, supplierList,periodList } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
        <Col span={8}>
            <FormItem {...formItemLayout} label={`呆滞时间`}>
              {
                getFieldDecorator(`delayDay`,{
                    initialValue: 30
                })(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    {
                      timeList.map(item => (
                        <Option key={item.id} value={item.id}>{item.desc}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
            <Col span={8}>
                <FormItem {...formItemLayout} label={`呆滞时间段`}>
                    {
                        getFieldDecorator(`closeDate`)(
                            <RangePicker style={{width: '100%'}}/>
                        )
                    }
                </FormItem>
            </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`供应商`}>
              {
                getFieldDecorator(`supplierCode`,{
                    initialValue: ''
                })(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option key="" value="">全部</Option>
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
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={'药品名称'}>
              {
                getFieldDecorator(`hisDrugCode`)(
                  <FetchSelect
                    allowClear={true}
                    placeholder='药品名称'
                    query={{queryType: 3}}
                    url={common.QUERY_DRUG_BY_LIST}
                    cb={(value, option) =>{
                      if(value){
                          this.props._handlQuery2();
                      }
                    }}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} style={{ display: display }}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`deptCode`,{
                    initialValue: ''
                })(
                  <Select 
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option key="" value="">全部</Option>
                    {
                      deptList.map(item => (
                        <Option key={item.id} value={item.id}>{item.deptName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
            <Col span={8}>
                <FormItem {...formItemLayout} label={`临效期`}>
                    {
                        getFieldDecorator(`periodEffectDate`,{
                            initialValue: ''
                        })(
                            <Select
                                placeholder="请选择"
                                style={{
                                    width: '100%'
                                }}
                            >
                                {
                                    periodList.map(item => (
                                        <Option key={item.id} value={item.id}>{item.desc}</Option>
                                    ))
                                }
                            </Select>
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

class NearlyEffective extends PureComponent {
  state = {
    query: {
      queryType: 2
    },
  }
  handlQuery = (query) => {
    this.setState({
      query: {
        ...this.state.query,
        ...query
      }
    });
  }
    handlQuery2 = (query) => {
        this.setState({
            query: {
                ...this.state.query,
                pageNo:1
            }
        });
    }
  export = () => {
    this.props.dispatch({
      type: 'statistics/delayStoreExport',
      payload: {
        ...this.state.query
      }
    })
  }
  render() {
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },  
      {
        title: '部门',
        dataIndex: 'deptName',
        width: 168,
      }, {
        title: '呆滞天数',
        dataIndex: 'delayDay',
        width: 168
      }, {
        title: '货位',
        dataIndex: 'goodsName',
        width: 168,
      }, {
        title: '货位类型',
        dataIndex: 'locName',
        width: 168,
      }, {
        title: '库存',
        dataIndex: 'totalQuantity',
        width: 112
      }, /*{
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, */{
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },/* {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      }, */{
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="right" title={text}>{text}</Tooltip>
        )
      }, {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      }, {
        title: '生产批号',
        dataIndex: 'lot',
        width: 148,
      }, {
        title: '近效期',
        dataIndex: 'diffDay',
        width: 118,
      }, {
        title: '有效期至',
        dataIndex: 'validEndDate',
        width: 118,
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 118,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90,
      }, {
        title: '采购方式',
        width: 112,
        dataIndex: 'purchaseType',
        render: (text) => text === 1 ? '零库存' : '自采'
      }, {
        title: '价格',
        width: 112,
        dataIndex: 'price',
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
        width: 168,
      },
        {
            title: '药品编号',
            dataIndex: 'hisDrugCode',
            width: 168,
        },
    ];
    const {query} = this.state;
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          _handlQuery={this.handlQuery}
          _handlQuery2={this.handlQuery2}
        />
        <div>
          <Button onClick={this.export}>导出</Button>
        </div>
          <RemoteTable
              onChange={this._tableChange}
              query={query}
              columns={columns}
              scroll={{x: '100%'}}
              isDetail={true}
              style={{marginTop: 20}}
              ref='table'
              rowKey='id'
              url={statisticAnalysis.DELAYSTORE_LIST}
          />
        
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(NearlyEffective));