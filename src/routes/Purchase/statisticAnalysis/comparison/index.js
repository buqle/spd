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

class SearchForm extends PureComponent {
    state = {
        deptList:[]
    }
    componentDidMount(){
        const {dispatch} = this.props.formProps;
        this.props._handlQuery({
            deptCode:'24C69445D19C4625960DA3F1E58A6A1F'
        });
        dispatch({
            type: 'statistics/getDeptByParam',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        deptList: data
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
        const {deptList}=this.state
        return (
            <Form onSubmit={this.handleSearch}>
                <Row gutter={30}>
                    <Col span={8} style={{display:'block'}}>
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
                        <FormItem {...formItemLayout} label={'批号'}>
                            {
                                getFieldDecorator(`lot`)(
                                    <Input placeholder='请输入批号' />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'部门'} {...formItemLayout}>


                            {getFieldDecorator('deptCode', {
                                initialValue: '24C69445D19C4625960DA3F1E58A6A1F'
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
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
        delete query.pageSize;
        delete query.pageNo;
        delete query.key;
        this.props.dispatch({
            type: 'statistics/comparisoneExport',
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
                title: '生产厂家',
                width: 168,
                dataIndex: 'ctmmManufactureName',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text} className='requests'>{text}</Tooltip>
                )
            },
            {
                title: '有效日期',
                width: 118,
                dataIndex: 'validEndDate',
            },
            {
                title: '单位',
                width: 118,
                dataIndex: 'unit',
            },
            {
                title: '批号',
                width: 118,
                dataIndex: 'lot',
            },
            {
                title: 'HIS库存',
                width: 118,
                dataIndex: 'hisStock',
            },
            {
                title: 'SPD库存',
                width: 118,
                dataIndex: 'spdStock',
            },
            {
                title: '库存差异',
                width: 118,
                dataIndex: 'differenceStock',
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
                title: '生产日期',
                width: 118,
                dataIndex: 'productDate',
            },

        ];



        return (
            <div className='ysynet-main-content factor-content'>
                <SearchFormWarp
                    formProps={{...this.props}} _handlQuery={this.handlQuery}

                />
                {query.deptCode?
                <Button onClick={this.export}>导出</Button>:null}
                {query.deptCode?

                    <RemoteTable
                        onChange={this._tableChange}
                        ref='table'
                        query={query}
                        bordered
                        url={statisticAnalysis.COMPARISON_LIST}
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