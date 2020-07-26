/**
 * @author QER
 * @date 2019/9/11
 * @Description: 未结算药品查询
*/
import React, { PureComponent } from 'react';
import { Form, Row, Col, DatePicker, Input, Select, Button, Icon, message, Tooltip,Modal } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { formItemLayout } from '../../../../utils/commonStyles';
import RemoteTable from '../../../../components/TableGrid';
import { connect } from 'dva';
import FetchSelect from '../../../../components/FetchSelect';
import {common} from "../../../../api/purchase/purchase";
import {statisticAnalysis} from '../../../../api/purchase/purchase';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
class SearchForm extends PureComponent {
    state = {
        dayList:[
            {value: "60", label: "60天"},
            {value: "180", label: "180天"},
        ],
        supplierList:[],
    }
    componentDidMount(){
        this.props._handlQuery({
            diffDay: 60,
            settstatus: 2
        });
        const {dispatch} = this.props.formProps;
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
                values.settstatus=2;
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
        const {dayList,supplierList}=this.state
        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8}>
                        <FormItem label={'供应商'} {...formItemLayout}>


                            {getFieldDecorator('supplierCodeList', {
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
                                            <Option key={item.id} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                                        ))
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'临效期'} {...formItemLayout}>
                            {getFieldDecorator('diffDay', {
                                initialValue: 60
                            })(
                                <Select
                                    showSearch
                                    placeholder={'请选择'}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                >
                                    {
                                        dayList.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={'药品名称'}>
                            {
                                getFieldDecorator(`hisDrugCodeList`)(
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

    render() {
        let query = this.props.base.queryConditons;
        query = {
            ...query,
            ...this.state.query
        }
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
                dataIndex: 'rowNo'
            },
            {
                title: '对账单号',
                dataIndex: 'feedBackRemark',
                width: 112
            },{
                title: '临近效期',
                dataIndex: 'accountStatus',
                width: 112
            },{
                title: '结算状态',
                dataIndex: 'unstatus',
                width: 100,
                render:(text)=>(
                    <span>未结算</span>
                )
            },{
                title: '发药确认单',
                dataIndex: 'dispensingNo',
                width: 168
            },
            {
                title: '出库单',
                dataIndex: 'backNo',
                width: 168
            },
            {
                title: '药品名称',
                dataIndex: 'ctmmTradeName',
                width: 350,
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '生产厂家',
                dataIndex: 'ctmmManufacturerName',
                width: 200,
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
            {
                title: '批准文号',
                dataIndex: 'approvalNo',
                width: 200
            },
            {
                title: '包装规格',
                dataIndex: 'packageSpecification',
                width: 168
            },
            {
                title: '发药单位',
                dataIndex: 'replanUnit',
                width: 112
            },
            {
                title: '发药数量',
                dataIndex: 'oEORIDispDrugQuantity',
                width: 112
            },
            {
                title: '出库数量',
                dataIndex: 'backSumNum',
                width: 112
            },
            {
                title: '出库货位类别',
                dataIndex: 'outStoreName',
                width: 168
            },
            {
                title: '生产批号',
                dataIndex: 'lot',
                width: 148
            },
            {
                title: '参考价格',
                dataIndex: 'drugPrice',
                width: 112
            },
            {
                title: '参考金额',
                dataIndex: 'totalAmount',
                width: 112
            },
            {
                title: '生产日期',
                dataIndex: 'productDate',
                width: 118
            },
            {
                title: '有效期至',
                dataIndex: 'validEndDate',
                width: 118
            },
            {
                title: '发药时间',
                dataIndex: 'dispensingDate',
                width: 248
            },
        ];
        return (
            <div className='ysynet-main-content factor-content'>
                <SearchFormWarp
                    formProps={{...this.props}} _handlQuery={this.handlQuery}
                />

                {
                    query.settstatus? <RemoteTable
                        onChange={this._tableChange}
                        ref='table'
                        query={query}
                        bordered
                        url={statisticAnalysis.UNSETTLEDDRUGSLIST}
                        columns={columns}
                        rowKey={'id'}
                        scroll={{ x: '100%' }}
                        isDetail={true}
                        style={{marginTop: 20}}
                    />:null
                }


            </div>
        )
    }
}
export default connect(state => state)(RecallAndLocked);