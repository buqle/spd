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
import { Form, Row, Col, Button, DatePicker, Select, message, Spin } from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
import moment from 'moment';
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


class SearchForm extends PureComponent{
  state = {
    format: 'YYYY-MM-DD',
    data: ''
  }
  componentDidMount = () => {
    this.props.getData({
      staticType: 1,
      startDate: moment(new Date()).add(-15, 'day').format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD')
    });
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const closeDate = values.closeDate === undefined ? '' : values.closeDate;
        const {format} = this.state;
        if (closeDate.length > 0) {
          if(format === 'YYYY-MM') {
            values.startDate = closeDate[0].startOf('month').format('YYYY-MM-DD');
            values.endDate = closeDate[1].endOf('month').format('YYYY-MM-DD');
          }else {
            values.startDate = closeDate[0].format('YYYY-MM-DD');
            values.endDate = closeDate[1].format('YYYY-MM-DD');
          };
        }else {
          values.startDate = '';
          values.endDate = '';
        };
        delete values.closeDate;
        this.props.getData(values);
      };
    });
  }
  //改变维度
  changeDimension = (value) => {
    if(value === 1) {
      this.setState({
        format: 'YYYY-MM'
      });
      this.props.form.setFieldsValue({
        closeDate: [moment(new Date()).add(-6, 'months'), moment(new Date())]
      });
    }else {
      this.setState({
        format: 'YYYY-MM-DD'
      });
      this.props.form.setFieldsValue({
        closeDate: [moment(new Date()).add(-15, 'day'), moment(new Date())]
      });
    };
  }
  //重置
  handleReset = () => {
    this.props.form.setFieldsValue({
      staticType: 1,
      closeDate: [moment(new Date()).add(-15, 'day'), moment(new Date())]
    });
    this.props.getData({
      staticType: 1,
      startDate: moment(new Date()).add(-15, 'day').format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD')
    });
  }
  disabledDate(selectedDate, current) {
    const {format} = this.state;
    if(format === 'YYYY-MM') {
      return current && ( 
        current > moment(new Date()) || 
        current > moment(selectedDate ? selectedDate[0] : current).add(12, 'months') || 
        current < moment(selectedDate ? selectedDate[0] : current).add(-12, 'months')
      );
    };
    return current && ( 
      current > moment(new Date()) || 
      current > moment(selectedDate ? selectedDate[0] : current).add(1, 'months') || 
      current < moment(selectedDate ? selectedDate[0] : current).add(-1, 'months')
    );
  }
  toggle = () => {
    this.props.formProps.dispatch({
        type:'base/setShowHide'
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { format, date } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={30}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`统计维度`}>
              {
                getFieldDecorator(`staticType`, {
                  initialValue: 1
                })(
                  <Select
                    onChange={this.changeDimension}
                    placeholder="请选择"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Option value={2}>月</Option>
                    <Option value={1}>日</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={`统计日期`}>
              {
                getFieldDecorator(`closeDate`, {
                  initialValue: [moment(new Date()).add(-15, 'day'), moment(new Date())]
                })(
                  <RangePicker
                    allowClear={false}
                    onCalendarChange={(date) => this.setState({ date })}
                    disabledDate={this.disabledDate.bind(this, date)}
                    format={format}
                    onOpenChange={(status) => this.setState({ date: '' })}
                    className={'ysynet-formItem-width'}
                  />
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

class SettlementAnalysis extends PureComponent {
  state = {
    data: [],
    canvasWrapWidth: 0,
    loading: false,
    query: {},
    canvsWdith:0
  }
  componentDidMount = () => {
    const canvasWrap = document.querySelector('#canvasWrap');
    let {data}=this.state
    this.setState({
      canvasWrapWidth: canvasWrap.offsetWidth
    },()=>{
        if(data.length * 80 > this.state.canvasWrapWidth) {
            this.setState({
                canvsWdith:data.length * 80
            })
        }else {
            this.setState({
                canvsWdith:this.state.canvasWrapWidth
            })
        };
    });
  }
  getData = (payload = {}) => {
    this.setState({
      loading: true,
      query: payload
    });
    this.props.dispatch({
      type: 'statistics/staticsStoreList',
      payload,
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            data,
            loading: false
          });

        }else {
          this.setState({
            loading: false
          });
          message.error(msg)
        };
      }
    });
  }
  export = () => {
    const {query} = this.state;
    this.props.dispatch({
      type: 'statistics/storeExport',
      payload: {query}
    });
  }
  render() {
    const {data, canvasWrapWidth, loading,canvsWdith} = this.state;
    console.log(data.length)
    const scale = {
      totalPrice: {
        min: 0,
      },
      totalQuantity: {
        min: 0,
      },
      time: {
        tickCount: data.length,
        range: [0.02, 0.98]
      }
    };
    let canvasWidth = null;
   /* if(data.length>0){
        if(data.length * 80 > canvasWrapWidth) {
            canvasWidth = data.length * 80;
        }else {
            canvasWidth = canvasWrapWidth;
        };
    }*/
    console.log(canvasWidth)
    return (
      <div className='ysynet-main-content'>
        <WrapperForm
          formProps={{...this.props}}
          getData={this.getData}
        />
        <div>
          <Button onClick={this.export} style={{marginLeft: 42}}>导出</Button>
        </div>
        <h2 style={{textAlign: 'center', fontSize: 28}}>库房财务指标分析</h2>
        <Spin spinning={loading}>
          <div id="canvasWrap" style={{marginTop: 20, overflowX: 'auto'}}>
            <Chart 
              height={400}
              style={{
                width: canvsWdith,
              }}
              forceFit
              scale={scale} 
              data={data}
              padding={[ 20, 60, 60, 80]}
              placeholder
            >
              <Legend
                custom={true}
                clickable={false}
                items={[
                  { value: '结存金额(万元)', marker: {symbol: 'circle', fill: '#3182bd', radius: 5} },
                  { value: '库房结存数量', marker: {symbol: 'circle', fill: '#ffae6b', radius: 5} }
                ]}
              />
              <Axis
                name="time"
                label={{
                  textStyle:{
                    fill: '#000'
                  },
                }}
              />
              <Tooltip />
              <Geom 
                type="interval" 
                position="time*totalPrice" 
                size={30} 
                color="#3182bd"
                tooltip={['time*totalPrice', (time, totalPrice)=>{
                  return {
                    name: '结存金额(万元)',
                    value: totalPrice
                  }
                }]}
              />
              <Geom
                type="line" 
                position="time*totalQuantity" 
                color="#fdae6b" 
                size={3} 
                shape="smooth"
                tooltip={['time*totalQuantity', (time, totalQuantity)=>{
                  return {
                    name: '库房结存数量',
                    value: totalQuantity
                  }
                }]}
              />
              {/* <Geom 
                type="point" 
                position="time*totalQuantity" 
                color="#fdae6b" 
                size={3} 
                shape="circle" 
              /> */}
            </Chart>
          </div>
        </Spin>
      </div>
    )
  }
}
export default connect(state => state)(SettlementAnalysis);