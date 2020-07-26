/*
 * @Author: yuwei  药品申领  /drugsFor
 * @Date: 2018-07-24 13:12:15 
* @Last Modified time: 2018-07-24 13:12:15 
 */

import React, { PureComponent } from 'react';
import {Form, Input , Row, Col, Button, Icon, Select, DatePicker,Badge,Modal, message, } from 'antd';
import {Link} from 'react-router-dom';
import {formItemLayout} from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid/index';
import {wareHouse} from '../../../../api/pharmacy/wareHouse';
import querystring from 'querystring';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
class DrugsFor extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      query:{
        queryType: 1
      },
      messageError:"",
      selectedRowKeys:[],
        selected:[]
    }
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
//删除
    delete = () => {
        let {selected} = this.state;
        if(selected.length === 0) {
            message.warning('请选择一条数据');
            return;
        }
        let applyCodeList = selected;
        Confirm({
            content:'您确定要删除吗？',
            onOk:()=>{
                this.props.dispatch({
                    type: 'base/deleteAppStore',
                    payload: {
                        applyCodeList
                    },
                    callback: (data) => {
                        message.success('删除成功');
                        let {query} = this.state;
                        this.refs.tab.fetch(query);
                    }
                })
            }
        })
    }
  render(){
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },  
      {
      title: '申领单',
      width: 176,
      dataIndex: 'applyCode',
      render:(text, record)=>(
          <Badge count={record.applydetailsItemsCount} overflowCount={999} style={{right:'-18px',zIndex:'0',top: '8px'}} showZero>
          <Link to={{pathname: `/pharmacy/wareHouse/drugsFor/details/${record.applyCode}`}}>{text}</Link>
          </Badge>
      )
      },
      {
        title: '申领部门',
        width: 148,
        dataIndex: 'applyDeptName',
      },
      {
        title: '配货部门',
        width: 148,
        dataIndex: 'distributeDeptName',
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'applyStatusName'
      },
      {
        title: '类型',
        width: 112,
        dataIndex: 'applyTypeName'
      },
      {
        title: '发起人',
        width: 112,
        dataIndex: 'createUserName',
      },
      {
        title: '发起时间',
        width: 200,
        dataIndex: 'createDate'
      },
    ];
    let query = this.props.base.queryConditons;
    query = {...query, ...this.state.query};
    delete query.key;
    delete query.time;
    const {match} = this.props;
    return (
      <div className='ysynet-main-content'>
        <SearchForm formProps={{...this.props}} />
        <Row>
          <Button type='primary' className='button-gap'>
            <Link to={{pathname:`${match.path}/add/1/1`}}>新建申领</Link>
          </Button>
            <Button onClick={this.delete}>删除</Button>
        </Row>
        <RemoteTable
          onChange={this._tableChange}
          ref="tab"
          query={query}
          rowSelection={{
              onChange:(selectedRowKeys,selectedRows)=>{
                  this.setState({selected: selectedRowKeys})
              },
          }}
          url={wareHouse.APPLYLIST}
          scroll={{x: '100%'}}
          isDetail={true}
          columns={columns}
          rowKey={'applyCode'}
          style={{marginTop: 24}}
        />
      </div>
    )
  }
}
export default connect(state=>state)(DrugsFor);


let timeout;
let currentValue;

function fake(value, callback, url, query) {

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;
    fetch(url, {
        method: 'POST',
        mode:'cors',
        body:querystring.stringify({
           name:value
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
        .then(res => res.json())
        .then(d => {
            if (currentValue === value) {
                const data = [];
                d.data.forEach((r) => {
                    data.push({
                        value: r.id,
                        text: r.userName,
                    });
                });
                callback(data);
            }
        })
        .catch(e => console.log("Oops, error", e))

}

/* 搜索 - 表单 */
class SearchFormWrapper extends PureComponent {
  state = {
    status: [],
      data: [],
      value: '',
  }
  componentDidMount() {
    this.props.formProps.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'apply_status'
      },
      callback: (data) => {
        this.setState({
          status: data
        });
      }
    });
    let { queryConditons } = this.props.formProps.base;
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
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide'
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.time && values.time.length !== 0) {
        values.startTime = values.time[0].format('YYYY-MM-DD');
        values.endTime = values.time[1].format('YYYY-MM-DD');
      }else {
        values.startTime = '';
        values.endTime = '';
      }
      this.props.formProps.dispatch({
        type:'base/updateConditions',
        payload: values
      });
    });
  }
  //重置
  handleReset = () => {
    this.props.form.resetFields()
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
    getValues = (value) => {
        console.log(value)
    }
    handleChange = (value) => {
        this.setState({ value });
        fake(value, data => this.setState({ data }),wareHouse.APPLYLIST2);
    }
  render() {
    let { status } = this.state;
    const { getFieldDecorator } = this.props.form;
    status = status.map(item=>{
      return <Option key={item.value} value={item.value}>{item.label}</Option>
    });
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
      const options = this.state.data.map(d => <Option value={d.value} key={d.value}>{d.text}</Option>);
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem label={`申领单`} {...formItemLayout}>
              {getFieldDecorator('applyCode', {})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={`状态`} {...formItemLayout}>
              {getFieldDecorator('applyStatus', {})(
                <Select 
                  showSearch
                  placeholder={'请选择'}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  >
                      {status}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{display: display}}>
            <FormItem label={`发起时间`} {...formItemLayout}>
              {getFieldDecorator('time')(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
            <Col span={8}>
                <FormItem label={`发起人`} {...formItemLayout}>
                    {getFieldDecorator('userId', {})(
                        <Select
                            allowClear={true}
                            showSearch
                            onSearch={this.handleChange}
                            onChange={this.getValues}
                            notFoundContent="暂无查询结果"
                            style={{width:'100%'}}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            placeholder='请输入发起人姓名'
                        >
                            {options}
                        </Select>
                    )}
                </FormItem>
            </Col>
          <Col span={8} style={{ float:'right',textAlign: 'right', marginTop: 4}} >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
              {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
   )
 }
}
const SearchForm = Form.create()(SearchFormWrapper);