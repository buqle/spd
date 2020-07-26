/*
 * @Author: yuwei  批号追溯 - 详情
 * @Date: 2018-07-24 10:58:49
* @Last Modified time: 2018-07-24 10:58:49
 */
import React, { PureComponent } from 'react';
import { Form, Row, Col, Table,Tabs} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {post} from "../../../../services/purchase/patientTracing";
const {TabPane} = Tabs;



class EditDrugDirectory extends PureComponent{

    constructor(props){
        super(props)
        this.state = {
            baseData: {},
            tabsData:[],
            tabUrls:['','/a/reportform/lot/getMedStoreDetail','/a/reportform/lot/getmMedCommonCheckacceptDetail','/a/reportform/lot/getMedCommonStoreFlow','/a/reportform/lot/medHisDispensingDetail','/a/common/trace/getMakeUp'],
            loading: false,
        }
    }
    componentDidMount = () =>{
        this.setState({
            baseData:this.props.location.query
        })
        this.getData(1)
    }
    getData=(key)=>{
        const {drugcode, batch} =this.props.location.query;
        this.setState({loading: true});
        var t={
            drugcode,batch
        }
        //t=JSON.stringify(t);
        post(this.state.tabUrls[key],t).then(data=>{
            this.setState({
                tabsData:data.data,loading:false
            })
        });
    }
    getLayout = (columns,url)=>(
        <Table
            columns={columns}
            dataSource={url}
            isDetail={true}
            bordered
            rowKey={'lot'}
            loading={this.state.loading}
            pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal:(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`
            }}
        />
    )

    render(){
        const { baseData,tabsData,} = this.state;

        //当前库存
        const columns = [
        {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },     
            {
                title: '所在部门',
                dataIndex: 'deptname',
                width: 120
            },
            {
                title: '货位',
                dataIndex: 'positionname',
                width: 140
            },
            {
                title: '货位类型',
                dataIndex: 'positiontype',
                width: 130,
                render:(text)=>{
                    var t={
                        "1":'补货指示货位',
                        "2":"拆零发药货位",
                        "3":"预拆零发药",
                        "4":"发药机货位",
                        "5":"基数药货位",
                        "6":"抢救车货位"
                    }
                    return t[text];
                }
            },
            {
                title: '数量',
                dataIndex: 'totalquantity',
                width: 90
            },
            {
                title: '单位',
                dataIndex: 'unit',
                width: 100
            }
        ];
        //采购验收记录
        const columns2 = [
            {
                title: '供应商',
                dataIndex: 'ctmasuppliername',
                width: 190
            },
            {
                title: '采购订单',
                dataIndex: 'ordercode',
                width: 160
            },
            {
                title: '采购时间',
                dataIndex: 'orderdate',
                width: 140,
                render: (text) =>
                {
                    return text?moment(text).format('YYYY-MM-DD'):''
                }
            },
            {
                title: '采购人',
                dataIndex: 'orderusername',
                width: 120
            },
            {
                title: '验收时间',
                dataIndex: 'receptiontime',
                render: (text) =>
                {
                    return text?moment(text).format('YYYY-MM-DD'):''
                }
            },
            {
                title: '验收数量',
                dataIndex: 'realreceivequantiry',
                width: 140
            },
            {
                title: '验收人',
                dataIndex: 'receptionusername',
                width: 120
            },
        ];
        //院内流通记录
        const columns3 = [
            {
                title: '操作部门',
                dataIndex: 'deptname',
            },
            {
                title: '操作类型',
                dataIndex: 'storetype'
            },
            {
                title: '操作时间',
                dataIndex: 'createdate'
            },
            {
                title: '操作人',
                dataIndex: 'username',
            },
            {
                title: '单据编号',
                dataIndex: 'storecode',
            },
            {
                title: '操作数量',
                dataIndex: 'storenum',
            },
            {
                title: '单位',
                dataIndex: 'unit',
            },
        ];
        //发药记录
        const columns4 = [
            {
                title: '发药部门',
                dataIndex: 'deptname',
            },
            {
                title: '发药时间',
                dataIndex: 'dispensingdate',
            },
            {
                title: '发药单号',
                dataIndex: 'dispensingno',
            },
            {
                title: '发药单位',
                dataIndex: 'unit',
            },
            {
                title: '发药数量',
                dataIndex: 'quantity',
            },
            {
                title: '患者姓名',
                dataIndex: 'patpatientname',
            },
            {
                title: '就诊卡号',
                dataIndex: 'patpatientid',
            },
        ]
        //非发药消耗
        const columns5 = [
            {
                title: '消耗部门',
                dataIndex: 'deptName'
            },
            {
                title: '消耗时间',
                dataIndex: 'makeUpDate'
            },
            {
                title: '发药单位',
                dataIndex: 'makeUpUnit'
            },
            {
                title: '发药数量',
                dataIndex: 'makeUpNum'
            },
            {
                title: '消耗方式',
                dataIndex: 'smallUit',
            }
        ];


        return (
            <div className='fullCol fadeIn'>
                <div className='fullCol-fullChild'>
                    <div style={{ display:'flex',justifyContent: 'space-between' }}>
                        <h3><b>基本信息</b></h3>
                    </div>
                    <Row gutter={30}>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                                <label>商品名称</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                <div className='ant-form-item-control requests'>{ baseData.drugname ? baseData.drugname: ''}</div>

                            </div>
                        </Col>
                        <Col span={7}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                <div className='ant-form-item-control requests'>{ baseData.specification ? baseData.specification: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                                <label>包装规格</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                <div className='ant-form-item-control'>{ baseData.specification ? baseData.specification: ''}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                                <label>生产厂家</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                                <div className='ant-form-item-control'>{ baseData.ctmmmanufacturername ? baseData.ctmmmanufacturername: ''}</div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                                <label>批号</label>
                            </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-19">
                                <div className='ant-form-item-control'>{ baseData.batch ? baseData.batch: ''}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Tabs onChange={this.getData}>
                    <TabPane tab="当前库存" key="1">
                        {this.getLayout(columns,tabsData)}
                    </TabPane>
                    <TabPane tab="采购/验收记录" key="2">
                        {this.getLayout(columns2,tabsData)}
                    </TabPane>
                    <TabPane tab="院内流通记录" key="3">
                        {this.getLayout(columns3,tabsData)}
                    </TabPane>
                    <TabPane tab="发药记录" key="4">
                        {this.getLayout(columns4,tabsData)}
                    </TabPane>
                    
                </Tabs>
            </div>
        )
    }
}
export default connect()(Form.create()(EditDrugDirectory))