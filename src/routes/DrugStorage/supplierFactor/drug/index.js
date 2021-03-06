import React, { PureComponent } from 'react';
import { Form, Row, Col, DatePicker, Input, Select, Button, Icon, message, Tooltip,Modal } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { supplierFactor } from '../../../../api/drugStorage/supplierFactor';
import { connect } from 'dva';
import AddFactor from './add';//上传
import Preview from "../../../../components/Preview";//预览
import FetchSelect from '../../../../components/FetchSelect';
import {common} from "../../../../api/purchase/purchase";
const FormItem = Form.Item;
const { Option } = Select;

class SearchForm extends PureComponent {
    state = {
        factorList: [
            {value: "1", label: "药品注册证"},
            {value: "2", label: "药品质检报告"},
            {value: "3", label: "药品说明书"},
            {value: "4", label: "进口药品通关单"},
            {value: "5", label: "再注册受理通知书"},
            {value: "6", label: "再注册批件"}
        ],
        periodList:[
            {value: "30", label: "30天"},
            {value: "60", label: "60天"},
            {value: "90", label: "90天"},
            {value: "180", label: "180天"},
            {value: "0", label: "已过期"}
        ]
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
        this.props.formProps.dispatch({
          type:'base/updateConditions',
          payload: values
        });
          this.props._handlQuery(values);
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }

  render() {
    const {factorList,periodList } = this.state;
    const { supplierList }=this.props;
    const { getFieldDecorator } = this.props.form;
    const {display} = this.props.formProps.base;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
            <Col span={8}>
                <FormItem label={'供应商'} {...formItemLayout}>


                    {getFieldDecorator('supplierCode', {
                        initialValue: ''
                    })(
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
                    )}

                </FormItem>
            </Col>
            <Col span={8}>
                <FormItem label={'资质类型'} {...formItemLayout}>
                    {getFieldDecorator('licType', {
                        initialValue: ''
                    })(
                        <Select
                            showSearch
                            placeholder={'请选择'}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        >
                            <Option key={''} value={''}>全部</Option>
                            {
                                factorList.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
            </Col>
            <Col span={8}>
                <FormItem label={'临效期'} {...formItemLayout}>
                    {getFieldDecorator('ExpiryDate', {
                        initialValue: 180
                    })(
                        <Select
                            showSearch
                            placeholder={'请选择'}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        >
                            <Option key={''} value={''}>全部</Option>
                            {
                                periodList.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
            </Col>

            <Col span={8} style={{display:'block'}}>
                <FormItem {...formItemLayout} label={'药品名称'}>
                    {
                        getFieldDecorator(`goodsName`)(
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
                <FormItem {...formItemLayout} label={'生产厂家'}>
                    {
                        getFieldDecorator(`producerName`)(
                            <Input placeholder='请输入生产厂家' />
                        )
                    }
                </FormItem>
            </Col>
          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>

          </Col>
        </Row>
      </Form>
    )
  }
}
const SearchFormWarp = Form.create()(SearchForm);

class RecallAndLocked extends PureComponent {
  state = {
    loading: false,
    visible: false,
    selected: [],
    selectedRows: [],
    display: 'none',
      query: {},
      supplierList:[]
  }
    handlQuery = (query) => {
        this.setState({query});
    }

    delete = () =>{
        let { selectedRows, query } = this.state;
        if (selectedRows.length === 0) {
            return message.warn('请选择一条数据');
        };
        selectedRows = selectedRows.map(item => item.id);
        this.setState({ loading: true });
        this.props.dispatch({
            type: 'supplierFactor/deleteDrugFactor',
            payload: { ids: selectedRows },
            callback: () =>{
                message.success('删除成功');
                this.setState({ loading: false });
                this.refs.table.fetch(query);
            }
        })

    }
    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        });
    }
    saveFactior=values=>{
        this.setState({ loading: true });
        let { query } = this.state;
        this.setState({ loading: true });
        this.props.dispatch({
            type:'supplierFactor/saveDrugFactor',
            payload: values,
            callback: ({data, code, msg}) => {
                if(data === 1) {
                    message.success('保存成功');
                    this.setState({ loading: false });
                    this.refs.table.fetch(query);
                }
            }
        })
    }

    export = () => {
      console.log(this.props.base.queryConditons)
        return;
        this.props.dispatch({
            type: 'statistics/medicineStandingExport',
            payload: {
                ...this.state.query
            }
        });
    }

//供应商list
    componentDidMount = () =>{
        this.props.dispatch({
            type: 'base/genSupplierList',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        supplierList: data
                    });
                }
            }
        });
    }
    //tab-list
    getList=(data)=>{
        this.setState({data:data})
    }
  render() {
    const { loading} = this.state;
      let query = this.props.base.queryConditons;
      query = {
          ...query,
          ...this.state.query
      }
    const columns = [
     {
        title: '序号',
        width: 60,
         dataIndex: 'serialNumber',
        render:(text,record,index)=>`${index+1}`,
      }, 
      {
        title: '供应商',
        dataIndex: 'ctmaSupplierName',
        width: 128
       },
      {
        title: '药品名称',
        width:350,
        dataIndex: 'goodsName',
      },
      {
        title: '生产厂家',
        width: 200,
        dataIndex: 'producerName',
      },
      {
        title: '批准文号',
        width: 120,
        dataIndex: 'registKey',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '资质类型',
          width:140,
          dataIndex: 'type',
          className:'typecolor',
          render: (text, record) =>
              <div>
                  <AddFactor record={record} supplierList={this.state.supplierList} onOk={this.saveFactior}  lists={this.state.data}>
                      {text}
                  </AddFactor>
                  {
                      record.lot?<div style={{display:'flex'}}>
                          批号:<Tooltip placement="topLeft" title={record.lot} className='requests'>{record.lot}</Tooltip>
                      </div>:null
                  }
              </div>
      },
        {
            title: '发证日期',
            width: 118,
            dataIndex: 'productTime',
            render: (text) =>
            {
                return text?<Tooltip>
                    {moment(text).format('YYYY-MM-DD')}
                </Tooltip>:''
            }
        },
        {
            title: '有效期至',
            width: 118,
            dataIndex: 'validEndDate',
            render: (text) =>
            {
                return text?<Tooltip>
                    {moment(text).format('YYYY-MM-DD')}
                </Tooltip>:''
            }
        },
        {
            title: '预览',
            width: 90,
            dataIndex: 'pictcontents',
            render: (text, record) =>{
                return record.pictcontents? <Preview record={record.pictcontents}>
                    <Icon type="picture" />
                </Preview>:'暂未上传'
            }

        },
    ];



    return (
      <div className='ysynet-main-content factor-content '>
        <SearchFormWarp
          formProps={{...this.props}} _handlQuery={this.handlQuery} supplierList={this.state.supplierList}
        />
        <div>
            <AddFactor record={{}} supplierList={this.state.supplierList} onOk={this.saveFactior}  lists={2}>
                <Button type='primary'>上传证照</Button>
            </AddFactor>
            <Button style={{ margin:'0  8px'}} onClick={this.delete} loading={loading}>移除</Button>
        </div>
        <RemoteTable
          onChange={this._tableChange}
          ref='table'
          query={query}
          bordered
          url={supplierFactor.DRUG_LIST}
          columns={columns}
          rowKey='id'
          scroll={{ x: '100%' }}
           isDetail={true} 
          style={{marginTop: 20}}
          getList={this.getList}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
        />

      </div>
    )
  }
}
export default connect(state => state)(RecallAndLocked);