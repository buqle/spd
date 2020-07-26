import React,{PureComponent} from "react";
import { Form, Row, Col, Button, Input, Icon, DatePicker,Tooltip,Select,Table ,message} from 'antd';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
class OrderRetrospect extends PureComponent {
    constructor(props){
        super(props);
        const {backNo}=this.props.match.params;
        this.state={
            query: {
                backNo
            },
            info:[]
        }
    }
    componentDidMount() {
        const {backNo} = this.state.query
        this.props.dispatch({
            type: 'reportform/getMedHisBackDetail',
            payload: {
                backNo
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        info: data,
                    });
                }else {
                    message.error(msg);
                };
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
                title: '药品名称',
                dataIndex: 'ctmmDesc',
                width:200,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },

            {
                title: '规格',
                width:150,
                dataIndex: 'ctmmSpecification',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '单位',
                dataIndex: 'unit',
                width: 112
            },
            {
                title: '操作前库存',
                dataIndex: 'beforOperationStock',
                width: 112
            },
            {
                title: '操作数量',
                dataIndex: 'operationNum',
                width: 112
            },
            {
                title: '操作后库存',
                dataIndex: 'afterOperationStock',
                width: 112
            }
            ,
            {
                title: '患者名称',
                dataIndex: 'patPatientName',
                width: 112
            }
            ,
            {
                title: '就诊卡号',
                dataIndex: 'patPatientId',
                width: 140
            }
        ];
        const {info,query}=this.state;
        return (
            <div className="fullCol">
                <div className="fullCol-fullChild">
                    <h3>基本信息</h3>
                    <Row gutter={30}>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>单号</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                <div className='ant-form-item-control'>{info.backno || ''}</div>
                            </div>
                        </Col>
                        <Col span={10}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>单据类型</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                <div className='ant-form-item-control'>{info.ordertype || ''}</div>
                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>操作人</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                <div className='ant-form-item-control'>{info.operationUserName || ''}</div>
                            </div>
                        </Col>
                        <Col span={10}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>操作时间</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                <div className='ant-form-item-control'>{info.backdate || ''}</div>
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
                        data={info.getDetail|| []}
                        isDetail={true}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state => state)(Form.create()(OrderRetrospect));

