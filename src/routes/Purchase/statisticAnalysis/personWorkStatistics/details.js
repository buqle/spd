import React, {PureComponent} from 'react';
import {Row, Col, message, Tooltip} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {tracingTotalList} from '../../../../api/purchase/patientTracing';
import {connect} from 'dva';
import { Link } from 'react-router-dom';

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
        width: 250,
    }, {
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
    }, {
        title: '生产厂商',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
    }, {
        title: '单位',
        dataIndex: "unit",
        width: 90,
    }, {
        title: '数量',
        dataIndex: "quantity",
        width: 90,
    },

]

class Details extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            list:[]
        }
    }
    componentDidMount() {
        let {orderCode} = this.props.match.params;
        this.props.dispatch({
            type: 'statistics/getPurchaseOrderDetail',
            payload: {
                orderCode
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        info: data,
                        list: data.planDetailList.list
                    });
                    console.log(this.state.info)
                }else {
                    message.error(msg);
                };
            }
        })
    }
    render() {
        const {info,list} = this.state;
        return (
            <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>基本信息</h3>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className='ant-form-item-control'>{info.orderNo || ''}</div>
                        </div>
                    </Col>
                   <Col span={10}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单据类型</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                            <div className='ant-form-item-control'>{info.orderType || ''}</div>
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>操作人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className='ant-form-item-control'>{info.operationUser || ''}</div>
                        </div>
                    </Col>
                    <Col span={10}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>操作时间</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                            <div className='ant-form-item-control'>{info.operationDate || ''}</div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>部门</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className='ant-form-item-control'>{info.deptName || ''}</div>
                        </div>
                    </Col>
                </Row>
              </div>
                <div className='detailCard'>
                    <h3 style={{marginBottom: 16}}>单据明细</h3>
                    <RemoteTable
                        rowKey="id"
                        scroll={{x: '100%'}}
                        data={list|| []}
                        isDetail={true}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
};

export default connect(state=>state)(Details);