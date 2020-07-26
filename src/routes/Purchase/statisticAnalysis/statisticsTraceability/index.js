/*
 * @Author: wwb 
 * @Date: 2018-07-24 16:08:53 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-08-06 23:17:40
 */

/**
 * @file 采购计划 - 统计分析--人员统计及追溯
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import {post} from '../../../../services/purchase/patientTracing';
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
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
      getdeptList:[],
      startDate:'',
      endtDate:'',
      backSourceArr:[
          {key:'',title:'全部'},
          {key:'1',title:'基数药退药'},
          {key:'2',title:'患者退药'},
      ]
  }
  toggle = () => {
    this.props.formProps.dispatch({
      type:'base/setShowHide',

    });
  }
  componentDidMount() {
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
    const {display} = this.props.formProps.base;
    const expand = display === 'block';

    const {getdeptList,startDate,endtDate,backSourceArr} =this.state;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`科室`}>
              {
                getFieldDecorator(`ctddesc`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`患者名称`}>
              {
                getFieldDecorator(`patpatientname`)(
                  <Input placeholder='请输入' />
                )
              }
            </FormItem>
          </Col>
            <Col span={8}>
                <FormItem {...formItemLayout} label={`起止时间`}>
                    {
                        getFieldDecorator(`closeDate`,{
                            initialValue:[moment(startDate, 'YYYY-MM-DD'),moment(endtDate, 'YYYY-MM-DD')],
                            rules:[
                                {required:true,message:'请选择起止时间'}
                            ]
                        })(
                            <RangePicker/>
                        )
                    }
                </FormItem>
            </Col>
          <Col span={8} style={{ display: display }}>
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
          <Col span={8} style={{ display: display }}>
              <FormItem {...formItemLayout} label={`退药来源`}>
                  {
                      getFieldDecorator(`backSource` ,{
                      initialValue: ''
                  })(
                          <Select
                              showSearch
                              placeholder={'请选择'}
                              optionFilterProp="children"
                              filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                          >

                              {
                                  backSourceArr.map((item)=> <Option key={item.key} value={item.key}>{item.title}</Option>)
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
    const columns = [
       {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },   
      {
        title: '退药部门',
        dataIndex: 'ctddesc',
        width:200,
        className: 'ellipsis',
        render: (text,record) =>(
              <span>
            <Link to={{pathname: `${match.path}/detailsList/${record.deptCode}/${record.backDeptCode}/${query.startTime}/${query.endTime}`}}>{text}</Link>
          </span>
          )
      },
    
      {
        title: '接收部门',
        width:150,
        dataIndex: 'deptname',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '退货单',
        dataIndex: 'backcount',
        width: 112
      },
      {
        title: '上月同期',
        dataIndex: 'monthlybackcount',
        width: 112,
        render: (text,record) =>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '去年同期',
        dataIndex: 'yearbackcount',
        width: 112,
        render: (text,record) =>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '环比变化',
        dataIndex: 'monthlybackchange',
        width: 112,
      }, 
      {
        title: '同比变化',
        dataIndex: 'yearbackchange',
        width: 112,
      },
      {
        title: '退货品种数',
        dataIndex: 'goodscount',
        width: 112,
      },
      {
        title: '上月同期',
        dataIndex: 'monthlygoodscount',
        width: 112,
      },
      {
        title: '去年同期',
        dataIndex: 'yeargoodscount',
        width: 112,
      },
      {
        title: '环比变化',
        dataIndex: 'monthlygoodschange',
        width: 112,
      },
      {
        title: '同比变化',
        dataIndex: 'yeargoodschange',
        width: 112,
      }
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
                isJson
                columns={columns}
                style={{marginTop: 20}}
                ref='table'
                isDetail={true}
                rowKey={'id'}
                url={tracingTotalList.SEARCH}
            />:null
          }
      </div>
    )
  }
}
export default connect(state => state)(Form.create()(OrderRetrospect));