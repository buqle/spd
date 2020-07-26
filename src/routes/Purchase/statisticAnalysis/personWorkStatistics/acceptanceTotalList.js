import React,{PureComponent} from "react";
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
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

class OrderRetrospect extends PureComponent {
  _tableChange = values => {

    //当table 变动时修改搜索条件
    this.props.dispatch({
      type:'base/setQueryConditions',
      payload: values
    });
    console.log(values)
  }
  render() {
    const {match} = this.props;
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
        dataIndex: 'rowNum'
      },
      {
        title: '商品名称',
        dataIndex: 'ctmmTradeName',
        width: 270,
        render:(text)=>(
              <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
          )
      },
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            width:168,
        },
        {
            title: '订单类型',
            dataIndex: 'orderType',
            width:168,
        },
      {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 200
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 112,
      },
      {
        title: '操作前库存数量',
        dataIndex: 'beforOperationStock',
        width: 120,
      },

      {
        title: '操作数量',
        dataIndex: 'operationStock',
        width: 100,
      },
      {
        title: '操作后结存',
        dataIndex: 'afterOperationStock',
        width: 100,
      },
    ];
      const {startTime, endTime} = this.props.match.params;
    let query = {
        userId:this.props.match.params.userid,
        startTime: startTime && startTime != 'undefined' ? startTime : '',
        endTime: endTime && endTime != 'undefined' ? endTime : ''
    }
    return (
      <div className='ysynet-main-content'>
        <RemoteTable
          query={query}
           isDetail={true} 
          scroll={{x: '100%', y: 400}}
          columns={columns}
          style={{marginTop: 20}}
          ref='table'
          rowKey={'id'}
          url={tracingTotalList.GET_Checkaccept_Details}
        />
      </div>
    )
  }
}
export default connect(state => state)(OrderRetrospect);

