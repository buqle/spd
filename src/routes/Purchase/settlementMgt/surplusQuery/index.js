/**
 * @author QER
 * @date 19/4/4
 * @Description: 结余查询
*/
import React, { PureComponent } from 'react';
import { Form, Row, Col, DatePicker, Input, Select, Button, Icon, message, Tooltip,Modal,Card,Tag} from 'antd';
import { Link } from 'react-router-dom';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import {hissettleref} from '../../../../api/purchase/purchase';
import moment from 'moment';
import { connect } from 'dva';
import {common} from "../../../../api/purchase/purchase";
import FetchSelect from "../../../../components/FetchSelect";

const Conform = Modal.confirm;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const { Option } = Select;

class SearchForm extends PureComponent {
    state = {
        methodType: [],
        methodList: [],
        methodLists: [],
        resultCode:[
            {value: "", label: "全部"},
            {value: "Y", label: "已结算"},
            {value: "N", label: "未结算"}
        ],
        showNow:false

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
        const { getFieldDecorator } = this.props.form;
        const {resultCode} = this.state;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={10}>
                        <FormItem {...formItemLayout} label={`药品名称`}>
                            {
                                getFieldDecorator(`drugCode`)(
                                    <FetchSelect
                                        allowClear={true}
                                        style={{ width: '100%' }}
                                        placeholder='药品名称'
                                        url={common.QUERY_DRUG_BY_LIST}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label={'状态'} {...formItemLayout}>
                            {getFieldDecorator('status', {
                                initialValue: 'N'
                            })(
                                <Select
                                    showSearch
                                    placeholder={'请选择'}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                    {
                                        resultCode.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6} style={{float: 'right', textAlign: 'right', marginTop: 4 }}>
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
        loadingB:'',
        visible: false,
        display: 'none',
        query: {},
        countList:[],
        jsonArr: ''
    }
    handlQuery = (query) => {
        this.setState({query});
    }

    _tableChange = values => {
        this.props.dispatch({
            type:'base/setQueryConditions',
            payload: values
        });
    }
    //导出
    export = () => {
        let {queryConditons} = this.props.base;
        queryConditons = {...queryConditons};
        delete queryConditons.pageNo;
        delete queryConditons.key;
        delete queryConditons.pageSize;
        this.props.dispatch({
            type: 'settlementMgt/hissetExport',
            payload: queryConditons,
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    message.success('正在导出对账单');
                }else {
                    message.error(msg);
                }
            }
        });
    }
    render() {
        let query = this.props.base.queryConditons;
        query = {...query,}
        delete query.key;
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
                fixed:'left'
            },
            {
                title: '结余日期',
                dataIndex: 'createDate',
                width: 180,
                fixed:'left'
            },
            {
                title: '药品名称',
                width:250,
                dataIndex: 'drugName',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '生产厂商',
                width: 178,
                dataIndex: 'ctmmManufacturerName',

            },
            {
                title: '单位',
                width: 100,
                dataIndex: 'jyunit'
            },
            {
                title: '数量',
                width: 90,
                dataIndex: 'jyqty'
            },
            {
                title:'批号',
                width:130,
                dataIndex: 'batch'
            },
            {
                title:'生产日期',
                width:116,
                dataIndex: 'productionDate',
                render: (text) =>
                    <Tooltip>
                        {moment(text).format('YYYY-MM-DD')}
                    </Tooltip>
            }
            ,
            {
                title:'有效日期',
                width:116,
                dataIndex: 'expireDate',
                render: (text) =>
                    <Tooltip>
                        {moment(text).format('YYYY-MM-DD')}
                    </Tooltip>
            }
            ,
            {
                title:'单价',
                width:116,
                dataIndex: 'jyprice'
            }
            ,
            {
                title:'金额',
                width:120,
                dataIndex: 'jyamount'
            }
            ,
            {
                title:'药品编码',
                width:136,
                dataIndex: 'drugCode'

            }
            ,
            {
                title:'状态',
                width:116,
                dataIndex: 'status',
                render: (text,record) =>{
                    return record.convertsettledate!=''?'已结算':'未结算'
                },
                fixed:'right'
            }
            ,
            {
                title:'结算单',
                width:160,
                dataIndex: 'settleBillNo',
                fixed:'right'
            }
            ,
            {
                title:'结转日期',
                width:116,
                dataIndex: 'convertsettledate',
                fixed:'right',
                render: (text) =>
                    <Tooltip>
                        {text?moment(text).format('YYYY-MM-DD'):null}
                    </Tooltip>
            }
        ];

        return (
            <div className='ysynet-main-content factor-content detailCards'>
                <SearchFormWarp
                    formProps={{...this.props}} _handlQuery={this.handlQuery}
                />
                <Col span={24} style={{marginBottom:10}}>
                    <Button style={{marginLeft: 8}} onClick={this.export}>导出</Button>
                </Col>
                <RemoteTable
                    onChange={this._tableChange}
                    ref='table'
                    query={query}
                    bordered
                    url={hissettleref.HISSETTLEREF}
                    columns={columns}
                    rowKey={'id'}
                    scroll={{ x: '100%' }}
                    style={{marginTop: 20}}

                />
            </div>
        )
    }
}
export default connect(state => state)(RecallAndLocked);