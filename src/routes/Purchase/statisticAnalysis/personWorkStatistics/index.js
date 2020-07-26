/*
 * @Author: wwb
 * @Date: 2018-07-24 16:08:53
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--损益分析
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import moment from 'moment';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
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


class SearchForm extends PureComponent{
  state = {
      getdeptList: [],
      startDate:'',
      endtDate:'',
  }
    componentDidMount(){
        const defaultSelectDate = {
            startDate: moment().startOf('day').subtract(15, 'days'),
            endDate: moment().endOf('day')
        }
        this.setState({
            startDate:moment(defaultSelectDate.startDate).format('YYYY-MM-DD'),
            endtDate:moment(defaultSelectDate.endDate).format('YYYY-MM-DD')
        },()=>{
            let values={
                startTime:this.state.startDate,
                endTime:this.state.endtDate
            }
            this.props._handlQuery(values);
        })
    const {dispatch} = this.props.formProps;
     dispatch({
          type: 'reportform/getdeptList',
          callback: ({data, code, msg}) => {
              if(code === 200) {
                  this.setState({
                      getdeptList: data
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
          values.startTime = closeDate[0].format('YYYY-MM-DD');
          values.endTime = closeDate[1].format('YYYY-MM-DD');
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
  //重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.formProps.dispatch({
      type:'base/clearQueryConditions'
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const {  getdeptList,startDate,endtDate } = this.state;
    const {display} = this.props.formProps.base;
    const expand = display === 'block';
    return (
      // 补货明细
      //
      // 验收单
      //
      // 验收单明细
      //
      // 下架
      //
      // 出库复核
      //
      // 盘点
      //
      // 调剂
      //
      // 发药复
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`姓名`}>
              {
                getFieldDecorator(`userName`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
              <FormItem {...formItemLayout} label={`工号`}>
                  {
                      getFieldDecorator(`userNo`)(
                          <Input placeholder='请输入' />
                      )
                  }
              </FormItem>
          </Col>
        </Row>
        <Row gutter={30}>
            <Col span={8}>
                <FormItem {...formItemLayout} label={`起止时间`}>
                    {
                        getFieldDecorator(`closeDate`,{
                            initialValue:[moment(startDate, 'YYYY-MM-DD'),moment(endtDate, 'YYYY-MM-DD')]
                        })(
                            <RangePicker/>
                        )
                    }
                </FormItem>
            </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`部门`}>
              {
                getFieldDecorator(`deptCode`,{
                    initialValue: ''
                })
                (
                  <Select
                    allowClear
                    onChange={this.listenDept}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      <Option key={''} value={''}>全部</Option>
                  {
                      getdeptList.map(item => (
                      <Option key={item.id} value={item.id}>{item.deptname}</Option>
                    ))
                  }
                  </Select>
                )
              }
            </FormItem>
          </Col>

          <Col span={8} style={{float: 'right', textAlign: 'right', marginTop: 4}} >
           <Button type="primary" htmlType="submit">查询</Button>
         </Col>
        </Row>
      </Form>
    )
  }
}
const WrapperForm = Form.create()(SearchForm);

class OrderRetrospect extends PureComponent {
  state = {
    query: {},
  }
  _tableChange = values => {
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
  }
    handlQuery = (query) => {
        this.setState({query});
    }
  render() {
    const {match} = this.props;
      const {query}=this.state
      delete query.invoiceDate;
      delete query.closeDate;
      delete query.key;
    const columns = [
     {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },    
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 100,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },

      {
        title: '工号',
        dataIndex: 'userNo',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '补货单',
        dataIndex: 'orderCount',
        width: 80,
        render: (text,record) =>(
          <span>
            <Link to={{pathname: `${match.path}/tracing/${record.userId}/${record.userNo}/${record.userName}/${query.startTime}/${query.endTime}/`}}>{text}</Link>
          </span>
        )

      },
         {
            title: '验收单明细',
            dataIndex: 'checkacceptDetailCount',
            width: 90,
            render: (text,record) =>(
                <span>
            <Link to={{pathname: `${match.path}/acceptanceTotalList/${record.userId}/${query.startTime}/${query.endTime}/`}}>{text}</Link>
          </span>
            )
        },
        {
            title: '下架',
            dataIndex: 'pickingorderCount',
            width: 80,
            render: (text,record) =>(
                <span>
            <Link to={{pathname: `${match.path}/lowerShelf/${record.userId}/${query.startTime}/${query.endTime}/${record.userNo}/${record.userName}`}}>{text}</Link>
          </span>
            )
        },
        {
            title: '出库复核',
            dataIndex: 'storedetailCount',
            width: 80,
            render: (text,record) =>(
                <span>
            <Link to={{pathname: `${match.path}/outgoingReview/${record.userId}/${query.startTime}/${query.endTime}/${record.userNo}/${record.userName}`}}>{text}</Link>
          </span>
            )
        },
        {
            title: '盘点',
            dataIndex: 'checkbillCount',
            width: 80,
            render: (text,record) =>(
                <span>
            <Link to={{pathname: `${match.path}/inventory/${record.userId}/${query.startTime}/${query.endTime}/${record.userNo}/${record.userName}`}}>{text}</Link>
          </span>
            )
        },
        {
            title: '发药复核',
            dataIndex: 'hisCount',
            width: 80,
            render: (text,record) =>(
                <span>
            <Link to={{pathname: `${match.path}/drugRechecking/${record.userId}/${query.startTime}/${query.endTime}/${record.userNo}/${record.userName}`}}>{text}</Link>
          </span>
            )
        },
    ];

    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          _handlQuery={this.handlQuery}
        />
          {
              query.startTime?<RemoteTable
                  onChange={this._tableChange}
                  query={query}
                  scroll={{x: '100%', y: 300}}
                  columns={columns}
                  style={{marginTop: 20}}
                  ref='table'
                  rowKey={'id'}
                  url={tracingTotalList.WORKSTATIS}
              />:null
          }

      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));
