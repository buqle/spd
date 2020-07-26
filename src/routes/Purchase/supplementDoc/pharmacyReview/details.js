/*
 * @Author: yuwei  新建出库详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table, Row, Col, Button, Tooltip, message,Tabs} from 'antd';
import {connect} from 'dva';
import {outStorage} from '../../../../api/drugStorage/outStorage';
import RemoteTable from '../../../../components/TableGrid';
import querystring from 'querystring';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
import request from '../../../../utils/request';
const {TabPane} = Tabs;
const columns = [
   {
        title: '序号',
        width: 60,
        dataIndex: 'serialNumber',
        render:(text,record,index)=>`${index+1}`,
      },
  /*{
    title: '通用名',
    width: 224,
    dataIndex: 'ctmmGenericName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },*/
  {
    title: '药品名称',
    width: 350,
    dataIndex: 'ctmmTradeName',
    className: 'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
 /* {
    title: '规格',
    width: 168,
    dataIndex: 'ctmmSpecification',
  },*/
  {
    title: '剂型',
    width: 90,
    dataIndex: 'ctmmDosageFormDesc',
  },
  {
    title: '包装规格',
    width: 168,
    dataIndex: 'packageSpecification'
  },
  {
    title: '单位',
    width: 112,
    dataIndex: 'replanUnit'
  },
  {
    title: '出库数量',
    width: 112,
    dataIndex: 'backNum'
  },
  {
    title: '生产批号',
    width: 112,
    dataIndex: 'lot',
  },
  {
    title: '生产日期',
    width: 118,
    dataIndex: 'productDate',
  },
  {
    title: '有效期至',
    width: 118,
    dataIndex: 'validEndDate'
    
  },
  {
    title: '批准文号',
    width: 200,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width: 200,
    dataIndex: 'ctmmManufacturerName',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '采购方式',
    dataIndex: 'purchaseType',
    width: 112,
    render: (text) => text === 1 ? '零库存' : '自采'
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 112
  },
  {
    title: '供应商',
    width: 224,
    dataIndex: 'supplierName',
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    let info = this.props.match.params.id;
    info = querystring.parse(info);
    this.state={
      info: {},
      loading: false,
      id: info.id,
      banLoading: false,
      checkLoading: false,
        selected: [],
        selectedRows: [],
        tabsData:[],
        tabKey:'',query:{},
        pendingQuery:{
            backNo:info.id,
            checkStatus:'0'
        },
        unpendingQuery:{
            backNo:info.id,
            checkStatus:'1'
        },
        dataSources:[],
        dataSource:[],
        checkLoadings: false
    }
  }
  componentDidMount() {
    this.getDetail();
  }
  getDetail = () => {
    this.setState({loading: true});
    this.props.dispatch({
      type: 'outStorage/outStoreDetailInfo',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        this.setState({
          info: data, 
          loading: false,
        });
          if(data.status==3){
              this.setState({
                  tabKey:'1'
              });
          }else {
              this.setState({
                  tabKey:'0'
              });
          }
      }
    })
  }
  //不通过
  onBan = () =>{
      let { selectedRows } = this.state;
      if (selectedRows.length === 0) {
          return message.warn('请选择一条数据');
      };
    this.setState({
      banLoading: true
    });
    this.props.dispatch({
      type: 'outStorage/rejectOutStore',
      payload: {
        backNo: this.state.id
      },
      callback: (data) => {
        if(data.code === 200 && data.msg === 'success') {
          message.success('操作成功');
          this.getDetail();
            this.tableOnChange();
        }else {
          message.error(data.msg);
        }
        this.setState({ banLoading: false });
      }
    })
  }
    tableOnChange = () => {
        this.setState({
            selected: [],
            selectedRows: [],
        });
    }
    absfun = () => {
        const { query,tabKey} = this.state;
        this.setState({
            checkLoadings:true
        })
        request(outStorage.OUTSTOREDETAILLIST,{
            method: 'POST',
            type: 'base/submit',
            body: query
        }).then((data)=>{

            if(data.code === 200 && data.msg === 'success') {
                this.setState({
                    dataSource:tabKey==0?data.data.list:[],
                    dataSources:tabKey==1?data.data.list:[],
                    checkLoadings:false
                })
            }else {
                message.error(data.msg);
            }
        })
    }
    tableCallBack=(data)=>{
        this.setState({
            dataSource:data,
        })
    }
    unVerfiyTableCallBack = (data) =>{
        this.setState({
            tabsData:data.length,
            dataSources:data
        })
    }
  //确认
  onSubmit = (event) => {
      event.persist();
      let { selectedRows, query } = this.state;
      if (selectedRows.length === 0) {
          return message.warn('请选择一条数据');
      };
      let {info} = this.state
      let {backNo, deptCode} = info;
      let outStoreDetail = selectedRows.map(item => {
          return {
              backSumNum: item.backNum,
              batchNo: item.batchNo,
              drugCode: item.drugCode
          }
      });
    this.setState({
      checkLoading: true
    });
    this.props.dispatch({
     type: event.target.value?'outStorage/buildCheckAccept':'outStorage/checkOutStore',
      payload: {
        backNo,
        deptCode,
        outStoreDetail
      },
        callback: ({data, code, msg}) => {
            if(code === 200) {
                message.success(event.target.value?'生成验收单成功':'复核单据成功');
                this.getDetail();
                this.setState({
                    defaultKey: '1',
                    tabKey:'1'
                });
                this.tableOnChange();
            }else {
                message.error(msg);
            };
            this.setState({
                checkLoading: false
            });
        }
    })
  }

  //打印
  print = () => {
    const {id} = this.state;
    window.open(`${outStorage.PRINT_DETAIL}?backNo=${id}`, '_blank');
  }
//复核与未复核list
    getData=key=>{
        this.setState({
            tabKey:key,
        })

    }
  render(){
    let {info, tabsData, banLoading, checkLoading,tabKey,pendingQuery,unpendingQuery,dataSources,dataSource, checkLoadings} = this.state;
      const operations = info.type!=4 && info.type!=9&&info.type!=11&&info.status === 1||info.type!=4 && info.type!=9&&info.type!=11&&info.status === 2?<Button loading={checkLoading} type='primary' key="1"  onClick={this.onSubmit}  style={{marginRight: 8}} value='yanshou'>生成验收单</Button>:null;
    return (
      <div className='fullCol fadeIn'>
        <div className="fullCol-fullChild">
          <Row>
            <Col span={6}>
              <h2>
                单据信息
              </h2>
            </Col>
              <Col style={{textAlign:'right', float: 'right'}}>
                  {
                      info.status && info.status === 1 &&tabKey==0||info.status === 2  &&tabKey==0?
                          <Button loading={checkLoading} type='primary' key="1" className='button-gap' style={{marginRight: 8}} onClick={this.onSubmit}>复核通过</Button>:null
                  }
                  {
                      info.status && info.status === 1 ?<Button loading={banLoading} key="2" onClick={()=>this.onBan()} >不通过</Button>: null
                  }
                  <Button icon='printer' onClick={this.print} style={{marginLeft:8}}>打印</Button>
              </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>出库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.backNo || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.statusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>申领药房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptName || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>发起时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.createDate || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.phone || ''}</div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.deptAddress || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.checkDate || ''}</div>
              </div>
            </Col>
          </Row>
        </div>
        <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col span={12} style={{ marginLeft: 4 }}>
            <FetchSelect
              allowClear
              value={this.state.value}
              style={{ width: '100%' }}
              placeholder='药品名称'
              deptStateb={' '}
              url={TableSearchUrl.searchpharmacyReview}
              cb={(value, option) => {
                  let {query} = this.state;
                  query = {
                      ...query,
                      hisDrugCode: value ? value : '',
                      backNo:info.backNo,
                      checkStatus:tabKey
                  };
                  this.setState({
                      query,
                      value
                  },()=>{
                      this.absfun();
                  });
              }}
            />
          </Col>
        </Row>
        <div className="detailCard">
            <Tabs onChange={this.getData} activeKey={this.state.tabKey}>
                <TabPane tab="未复核" key="0">
                    {
                        tabKey==0?<RemoteTable
                            ref={(node) => this.pickingTable = node}
                            query={pendingQuery}
                            columns={columns}
                            data={dataSource}
                            cb={this.tableCallBack}
                            loading={checkLoadings}
                            scroll={{ x: '100%' }}
                            isJson={true}
                            url={outStorage.OUTSTOREDETAILLIST}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                },
                                getCheckboxProps: record => ({
                                disabled:record.isCheckAccept==1
                            })
                            }}
                            rowKey='batchNo'
                            pagination={{
                                onChange: this.tableOnChange
                            }}
                        />:null
                    }
                </TabPane>
                <TabPane tab="已复核" key="1">
                    {
                        tabKey==1? <RemoteTable
                            ref={(node) => this.pickingTable = node}
                            query={unpendingQuery}
                            columns={columns}
                            scroll={{ x: '100%' }}
                            isJson={true}
                            url={outStorage.OUTSTOREDETAILLIST}
                            rowKey='batchNo'
                            loading={checkLoadings}
                            data={dataSources}
                            cb={this.unVerfiyTableCallBack}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                },
                                getCheckboxProps: record => ({
                                    disabled:record.isCheckAccept==1
                                })
                            }}
                            pagination={{
                                onChange: this.tableOnChange
                            }}
                        />:null
                    }
                </TabPane>
            </Tabs>
        </div>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsOutput);