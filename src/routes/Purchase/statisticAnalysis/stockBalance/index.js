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
//预览
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
class SearchForm extends PureComponent {
    state = {
        deptList:[],//存储地点
        supplierList:[],
        startDate:'',
        endtDate:'',
    }
    componentDidMount(){
        const defaultSelectDate = {
            startDate: moment().startOf('day').subtract(15, 'days'),
            endDate: moment().endOf('day')
        }
        this.setState({
            startDate:moment(defaultSelectDate.startDate).format('YYYY-MM-DD HH:mm:ss'),
            endtDate:moment(defaultSelectDate.endDate).format('YYYY-MM-DD HH:mm:ss')
        },()=>{
            let values={
                startTime:this.state.startDate,
                endTime:this.state.endtDate,
                supplierCode:'',
                hisDrugCode:'',
                deptCode:''
            }
            this.props._handlQuery(values);
        })
        const {dispatch} = this.props.formProps;
        //存储地点
        dispatch({
            type: 'statistics/storeFindDepts',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        deptList: data
                    });
                }
            }
        });
        dispatch({
            type: 'statistics/findSuppliers',
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
                const closeDate = values.closeDate === undefined ? '' : values.closeDate;
                if (closeDate.length > 0) {
                    values.startTime = closeDate[0].format('YYYY-MM-DD HH:mm:ss');
                    values.endTime = closeDate[1].format('YYYY-MM-DD HH:mm:ss');
                }else {
                    values.startTime = '';
                    values.endTime = '';
                };
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
        const {deptList,supplierList,startDate,endtDate}=this.state
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
                                            <Option key={item.id} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                                        ))
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={`账期`}>
                            {
                                getFieldDecorator(`closeDate`,{
                                    initialValue:[moment(startDate, 'YYYY-MM-DD HH:mm:ss'),moment(endtDate, 'YYYY-MM-DD HH:mm:ss')]
                                })(
                                    <RangePicker showTime style={{width: '100%'}}  showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label={'药品名称'}>
                            {
                                getFieldDecorator(`hisDrugCode`)(
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
                        <FormItem label={'存储地点'} {...formItemLayout}>


                            {getFieldDecorator('deptCode', {
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
                                        deptList.map(item => (
                                            <Option key={item.id} value={item.id}>{item.deptName}</Option>
                                        ))
                                    }
                                </Select>
                            )}

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
    export = () => {
        let query = this.props.base.queryConditons;
        query = {
            ...query,
            ...this.state.query
        }
        this.props.dispatch({
            type: 'statistics/storeBalanceExport',
            payload:query
        })
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
                dataIndex: 'rowIndex',
                render:(text,record,index)=>`${index+1}`,
              },
            {
                title: '供应商',
                dataIndex: 'supplierName',
                width: 200,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '药品流水码',
                dataIndex: 'hisFlowId',
                width: 200,
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '药品编码',
                width:200,
                dataIndex: 'hisDrugCode',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '药品名称',
                width: 250,
                dataIndex: 'ctmmDesc',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '规格',
                width: 120,
                dataIndex: 'ctmmSpecification',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '生产厂商',
                width: 168,
                dataIndex: 'ctmmManufactureName',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '批号',
                width: 118,
                dataIndex: 'lot',
            },
            {
                title: '生产日期',
                width: 118,
                dataIndex: 'productDate',
            },
            {
                title: '有效日期',
                width: 118,
                dataIndex: 'validEndDate',
            },
            {
                title: '单位',
                width: 118,
                dataIndex: 'unit'
            },

            {
                title: '存储地点',
                width: 118,
                dataIndex: 'deptName'
            },
            {
                title: '发生日期',
                width: 118,
                dataIndex: 'occurDate'
            },
            {
                title: '期初数量',
                width: 90,
                dataIndex: 'periodNum',
                fixed: 'right'
            },
            {
                title: '本期入库',
                width: 90,
                dataIndex: 'thisPeriodInNum',
                fixed: 'right'
            },
            {
                title: '本期发药',
                width: 90,
                dataIndex: 'thisPeriodDispensingNum',
                fixed: 'right'
            },
            {
                title: '本期出库',
                width: 90,
                dataIndex: 'thisPeriodOutNum',
                fixed: 'right'
            },
            {
                title: '本期结存描述',
                width: 110,
                dataIndex: 'thisPeriodStore',
                fixed: 'right'
            },
            {
                title: '本期结余(小单位)',
                width: 140,
                dataIndex: 'thisPeriodBalanceNum',
                fixed: 'right'
            },
        ];



        return (
            <div className='ysynet-main-content factor-content'>
                <SearchFormWarp
                    formProps={{...this.props}} _handlQuery={this.handlQuery}
                />
                <Button onClick={this.export}>导出</Button>
                {
                    query.startTime?<RemoteTable
                        onChange={this._tableChange}
                        ref='table'
                        query={query}
                        bordered
                        url={statisticAnalysis.STOREBALANCELIST}
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