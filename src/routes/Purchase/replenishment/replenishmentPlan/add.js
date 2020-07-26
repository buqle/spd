/*
 * @Author: wwb 
 * @Date: 2018-07-24 18:49:01 
 * @Last Modified by: wwb
 * @Last Modified time: 2018-09-06 23:47:54
 */
/**
 * @file 药库 - 补货管理--补货计划--新建计划
 */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Table, Modal, Icon, Tooltip, message, Select, Spin, InputNumber, Checkbox ,Upload} from 'antd';
import {replenishmentPlan} from '../../../../api/replenishment/replenishmentPlan';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from "../../../../components/FetchSelect";
import _ from 'lodash';
import {validAmount} from '../../../../utils/utils';
import {connect} from 'dva';
import request from '../../../../utils/request';

const { Option } = Select;



class NewAdd extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      modalLoading: false,
      spinLoading: true,
      isShow: false,
      visible: false,
      loading: false,
      deptModules: [],// 补货部门
      query: {
        medDrugType: '1',
        purchaseType: 1
      },
      selected: [],
      selectedRows: [],
      modalSelected: [],
      modalSelectedRows: [],
      info: {},
      isEdit: false,
      dataSource: [],
      btnLoading: false,
      saveLoading: false,
      addDrugType: 1,    //添加库存方式
      value: undefined
    }
  }
  componentWillMount = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'base/getModule',
      payload: { deptType : '3' },
      callback: (data) =>{
        this.setState({ deptModules: data })
      }
    });
  };
  componentDidMount = () => {
    if(this.props.match.path === "/purchase/replenishment/replenishmentPlan/edit/:planCode") {
      let { planCode } = this.props.match.params;
      this.setState({loading: true})
      this.props.dispatch({
        type:'base/ReplenishDetails',
        payload: { planCode },
        callback:({data, code, msg})=>{
          if(code === 200) {
            let deptCode;
            let {deptModules, query} = this.state;
            deptModules.map(item=>{
              if(data.deptCode === item.id) {
                deptCode = item.id
              };
              return item;
            });
            let existDrugCodeList = data.list.map(item => item.drugCode);
            this.setState({ 
              info: data, 
              isEdit: true, 
              dataSource: data.list,
              loading: false,
              query: {
                ...query,
                deptCode,
                existDrugCodeList
              },
              spinLoading: false
            });
          }else {
            message.error(msg);
          };
        }
      });
    }else {
      this.setState({spinLoading: false})
    }
  }
  handleOk = (setYes) => {
    let {modalSelectedRows, query, dataSource, addDrugType} = this.state;

    if(modalSelectedRows.length === 0) {
        if(query.filterThreeMonthFlag){
            this.setState({
                dataSource: [],
            })
            return
        }else {
            message.warning('至少选择一条信息');
            return;
        }

    };

    this.setState({btnLoading: true});
    modalSelectedRows = modalSelectedRows.map(item=>item.drugCode);
    this.props.dispatch({
      type: 'base/addDrug',
      payload: {
        deptCode: query.deptCode,
        drugCodeList: modalSelectedRows,
        addDrugType
      },
      callback: (data) => {
          dataSource.push(...data);
          dataSource = dataSource.map((item) => {
              if(!item.id) {
                  item.supplierCode = item.supplierList[0].ctmaSupplierCode;
                  if(item.demandQuantity || item.demandQuantity === 0) {
                      item.totalPrice = item.demandQuantity*item.supplierList[0].referencePrice
                  };
              };
              return item;
          });
          this.setState({
              dataSource: [...dataSource],
              btnLoading: false,
              visible: false,
          })

          this.setState({
              query: {
                  ...query,
                  hisDrugCodeList: [],
              },
              value: undefined
          });
      }
    })
  }
  
  showModal = () => {
    this.showModalLogic(1);
  }
  autoShowModal = () => {
    this.showModalLogic(2);
  }
  
  ExcelShowModal = (e) => {
    let {query} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      e.stopPropagation();
      return;
    };  
  }

  showModalLogic = (addDrugType) => {
    let {query, dataSource} = this.state;
    if(!query.deptCode) {
      message.warning('请选择部门');
      return;
    };
    let existDrugCodeList = dataSource.map((item) => item.drugCode);
    this.setState({ 
      visible: true,
      addDrugType: addDrugType,
      modalSelected: [],
      modalSelectedRows: [],
      query: {
        ...query,
        id:1,
        existDrugCodeList,
        hisDrugCodeList: [],
        filterThreeMonthFlag: false,
        addDrugType:addDrugType
      },
      value: undefined
    });
  }
  delete = () => {  //删除
    let {selectedRows, dataSource, query} = this.state;
    dataSource = _.difference(dataSource, selectedRows);
    let existDrugCodeList = dataSource.map((item) => item.drugCode)
    this.setState({
      dataSource,
      selected: [],
      selectedRows: [],
      query: {
        ...query,
        existDrugCodeList
      }
    });
  }
    //excel导出功能
    ExcelOut = (e) => {
      const { dispatch } = this.props;
      dispatch({
      type: 'base/excelOut',
      });
    }
  submit = (auditStatus) => {   //提交  保存
    let {isEdit, info, dataSource, submitLoading, saveLoading} = this.state;
    if(submitLoading || saveLoading) return;
    let isNull = dataSource.every(item => {
      if(!item.supplierCode) {
        message.warning('供应商不能为空');
        return false;
      };
      if(!item.demandQuantity) {
        message.warning('需求数量不能为空');
        return false;
      }
      return true
    });
    if(!isNull) return;
    dataSource = dataSource.map(item => {
      return {
        bigDrugCode: item.bigDrugCode,
        demandQuantity: item.demandQuantity,
        drugCode: item.drugCode,
        drugPrice: item.drugPrice,
        supplierCode: item.supplierCode,
        hisDrugCode: item.hisDrugCode
      }
    })
    if(auditStatus === 1){
      this.setState({ submitLoading: true  })
    }else{
      this.setState({ saveLoading: true });
    }
    this.props.dispatch({
      type: 'base/submit',
      payload: {
        auditStatus: auditStatus,
        id: isEdit? info.id : '',
        planType: '1',
        purchaseType: 1,
        list: dataSource,
        deptCode: this.state.query.deptCode
      },
      callback: (data)=>{
        message.success(`${auditStatus === 1? '保存' : '提交'}成功`);
        if(auditStatus === 1){
          this.setState({ submitLoading: false  })
        }else{
          this.setState({ saveLoading: false });
        }
        this.props.history.go(-1);
      }
    })
  }
  absfun = (e) => {
     const {modalSelectedRows, query, deptCode} = this.state;
     var newData=modalSelectedRows;
    if(query.hisDrugCodeList.length==0){
      return;
     }

      query.pagesize=10;
      this.setState({btnLoading: true});
     request(replenishmentPlan.QUERYDRUGBYDEPT,{
      method: 'POST',
      type: 'base/submit',
      body: query
    }).then((data)=>{
    
      if(data.code === 200 && data.msg === 'success') {
        // console.log(data.data.list)
        var list = data.data.list;
        console.log(list)
        newData=list;
        if(list.length){
            this.setState({ modalSelectedRows:newData,btnLoading: false})
            this.handleOk();
        }else {
            this.setState({btnLoading: false})
            message.error('暂无此产品');
        }
      }else {
        message.error(data.msg);
      }
    })
  }
  setRowInput = (val, record, i) => {
    let {dataSource} = this.state;
    dataSource = JSON.parse(JSON.stringify(dataSource));
    let validResult = validAmount(val);
    if(val === "") {
      dataSource[i].demandQuantity = val;
      this.setState({dataSource});
    }
    if(validResult) {
      dataSource[i].demandQuantity = val;
      dataSource[i].totalPrice = Number(val * dataSource[i].drugPrice).toFixed(4);
      this.setState({dataSource});
    }else {
      this.setState({dataSource});
    }
  }
  changeQuery = (e) => {
    const {query} = this.state;
    this.setState({
      query: {
        ...query,
        filterThreeMonthFlag: e.target.checked
      }
    });
  }
    changeQuery2=(e)=>{
        const {query,modalSelectedRows,dataSource} = this.state;
        if(!query.deptCode){
            message.error('请选择补货部门');
            return false
        }else if(!query.hisDrugCodeList||!query.hisDrugCodeList.length){
            message.error('请输入药品名称');
            return false
        }
        if(query.deptCode){
            this.setState({
                query: {
                    ...query,
                    filterThreeMonthFlag: e.target.checked
                }
            },()=>{
                this.props.dispatch({
                    type: 'base/queryDrug',
                    payload: {
                        ...query,
                        filterThreeMonthFlag: e.target.checked
                    },
                    callback: (data)=>{
                        this.setState({ modalSelectedRows:data.list})
                        this.setState({
                            dataSource:[]
                        })
                        this.handleOk();
                    }
                })
            });
        }


  }
  onCancel = () => {
    this.setState({ 
      visible: false,
    });
  }
  render() {
    let { 
      visible, 
      deptModules, 
      query,  
      isEdit, 
      dataSource, 
      loading, 
      modalLoading,
      spinLoading,
      btnLoading,
      saveLoading,
      value,
      submitLoading,
      modalSelected,
      modalSelectedRows
    } = this.state;
    const props = {
      data:{
        file:'补货计划',
        addDrugType:'1',
        deptCode:query.deptCode
      },
      action:replenishmentPlan.IMPORTEXCEL,
      headers: {
        authorization: 'authorization-text',
      },
        onChange:(info) =>{
            var that = this;
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                let data = info.file.response.data;
                if(!data) {
                    message.warning('所选部门与导入药品不一致！');
                    return;
                }else{
                    message.success('导入成功');
                    this.setState({
                        dataSource:data
                    })

                }

            } else if (info.file.status === 'error') {
                message.error('导入失败');
            }
        }
    }
    // console.log(3,dataSource);
    const columns = [
     /* {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, */
      {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      }, {
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, /*{
        title: '规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
      }, */{
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '供应商',
        dataIndex: 'supplierCode',
        width: 200,
        render: (text, record, i) => {
          let {supplierList} = record;
          let supplier = supplierList.map(item=>{
            return <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
          });
          return (
            <Select
              style={{width: '100%'}}
              onSelect={(value)=>{
                let {dataSource} = this.state;
                dataSource = JSON.parse(JSON.stringify(dataSource));
                let referencePrice;
                supplierList.map(item=>{
                  if(item.ctmaSupplierCode === value) {
                    referencePrice = item.referencePrice;
                  };
                  return item;
                });
                dataSource[i].supplierCode = value;
                dataSource[i].drugPrice = referencePrice;
                dataSource[i].totalPrice = referencePrice * record.demandQuantity;
                
                this.setState({dataSource});
                
              }} 
              defaultValue={text} 
            >
              {supplier}
            </Select>
          )
        }
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168,
      }, {
        title: '单位',
        dataIndex: 'replanUnit',
        width: 112,
      },{
            title: '整包装单位',
            dataIndex: 'ctpHdmsPackageDesc',
            width: 100
        }, {
            title: '可采库存',
            dataIndex: 'stockqty',
            width: 100
        },  {
        title: '需求数量',
        dataIndex: 'demandQuantity',
        width: 130,
        render: (text, record, i) => {
          return <InputNumber
                    defaultValue={text}
                    min={1}
                    precision={0}
                    onChange={(value)=>{
                      this.setRowInput(value, record, i);
                    }} 
                 />
        }
      }, {
            title: '月使用量',
            dataIndex: 'recentlyUseNum',
            width: 112
        },{
        title: '总库存',
        dataIndex: 'totalStoreNum',
        width: 112
      }, {
        title: '当前库存',
        dataIndex: 'usableQuantity',
        width: 112
      }, {
        title: '库存上限',
        dataIndex: 'upperQuantity',
        width: 112
      }, {
        title: '库存下限',
        dataIndex: 'downQuantity',
        width: 112
      }, /*{
        title: '参考价格',
        dataIndex: 'drugPrice',
        width: 112
      }, {
        title: '金额',
        dataIndex: 'totalPrice',
        width: 168
      }, */ {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 200,
      },
        {
            title: '药品编码',
            dataIndex: 'hisDrugCode',
            width: 168
        }
    ];
    const modalColumns = [
     /* {
        title: '通用名称',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/ 
      {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      }, {
        title: '药品名称',
        dataIndex: 'ctmmTradeName',
        width: 350,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '总库存',
        dataIndex: 'totalStoreNum',
        width: 100,
      }, {
        title: '当前库存',
        dataIndex: 'usableQuantity',
        width: 100,
      }, {
        title: '剂型',
        dataIndex: 'ctmmDosageFormDesc',
        width: 90
      }, {
        title: '包装规格',
        dataIndex: 'packageSpecification',
        width: 168
      }, {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className: 'ellipsis',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 200,
      },
        {
            title: '药品编码',
            dataIndex: 'hisDrugCode',
            width: 200,
        },
    ];
    return (
      <Spin spinning={spinLoading} size="large">
        <div className="fullCol fullCol-plan" style={{ padding: 24, background: '#f0f2f5' }}>
          <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
            <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
              <Col span={8}>
                <h2>{isEdit? '编辑计划' : '新建计划'}</h2>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-lg-8 ant-col-xl-6">
                  <label>补货部门</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-lg-16 ant-col-xl-18">
                  <div className='ant-form-item-control'>
                    <Select
                      disabled={dataSource.length === 0? false : true}
                      showSearch
                      placeholder="请选择"
                      deptCode={query.deptCode}
                      deptState={1}
                      value={query.deptCode}
                      onChange={(value) => {
                        let {query} = this.state;
                 
                        this.setState({
                          query: {
                            ...query,
                            deptCode: value,
                            deptState:1
                          }
                        });
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.indexOf(input) >= 0} 
                      style={{ width: '100%' }}

                    >
                      {
                        deptModules.map((item,index)=> <Option key={index} value={item.id}>{ item.deptName }</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
  
              <Button type='default' onClick={this.autoShowModal} style={{ margin: '0 8px' }}>一键添加低库存产品</Button>
              <Button onClick={this.delete} type='default'>删除</Button>
              <Button onClick={this.ExcelOut} style={{marginLeft: '8px' }}>导出excel表格模板</Button>    
              <Upload 
              {...props}
              style={{ marginLeft: '8px' }}
              >
                <Button onClick={this.ExcelShowModal}>一键导入excel表格</Button>
              </Upload>
              
            </Row>
          </div>
          <Modal
            bordered
            title={'添加产品'}
            visible={visible}
            width={1100}
            style={{height: 630, top: 20 }}
            onCancel={this.onCancel}
            footer={[
              <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>确认</Button>,
              <Button key="back" onClick={this.onCancel}>取消</Button>
            ]}
          >
            <Row style={{display: 'flex', alignItems: 'center'}}>
              <Col span={12} style={{ marginLeft: 4 }}>
                <FetchSelect
                  allowClear
                  value={value}
                  style={{ width: '100%' }}
                  placeholder='药品名称'
                  url={replenishmentPlan.QUERY_DRUG_BY_LIST}
                  cb={(value, option) => {
                    let {query} = this.state;
                    
                    query = {
                      ...query,
                      hisDrugCodeList: value ? [value] : [],

                    };

                    this.setState({
                      query,
                      value,

                    });
                    
                  }}
                />
              </Col>
              <Col span={7} style={{ marginLeft: 4 }}>
                <Checkbox checked={query.filterThreeMonthFlag} onChange={this.changeQuery}>
                  不显示三个月内无采购的药品
                </Checkbox>
              </Col>
            </Row>
            <div className='detailCard'>
              <RemoteTable
                query={query}
                url={replenishmentPlan.QUERYDRUGBYDEPT}
                isJson={true}
                ref="table"
                isDetail={true}
                modalLoading={modalLoading}
                columns={modalColumns}
                scroll={{ x: '100%' }}
                pagesize={10}
                rowKey='drugCode'
                rowSelection={{
                  selectedRowKeys: this.state.modalSelected,
                  onChange: (selectedRowKeys, selectedRows) => {
                    if(selectedRowKeys.length > modalSelected.length) {
                      this.setState({ 
                        modalSelected: selectedRowKeys, 
                        modalSelectedRows: [...new Set([...modalSelectedRows, ...selectedRows])] 
                      });
                    }else {
                      selectedRows = modalSelectedRows.filter(item => {
                        for (let i = 0; i < selectedRowKeys.length; i++) {
                          if(item.drugCode === selectedRowKeys[i]) {
                            return true;
                          };
                        };
                        return false;
                      });
                      this.setState({ 
                        modalSelected: selectedRowKeys, 
                        modalSelectedRows: selectedRows
                      });
                    };
                  }
                }}
                pagination={false}
              />
            </div> 
          </Modal>

          <div className='detailCard detailCards' id='detailCards'>

            <Row style={{display: 'flex', alignItems: 'baseline'}}>
              <Col span={12} style={{ marginLeft: 4,marginBottom:14 }}>
                <FetchSelect
                  allowClear
                  value={value}
                  style={{ width: '100%' }}
                  placeholder='药品名称'
                  deptName={this.state.query.deptCode}
                  deptState={1}
                  url={replenishmentPlan.QUERY_DRUG_BY_LIST}
                  cb={(value, option) => {
                    let {query} = this.state;
                    query.pageSize=10;
                    query.hisDrugCodeList=value ? [value] : [];
                    query = {
                      ...query,
                      hisDrugCodeList: value ? [value] : [],
                      deptState:1
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
              {/*<Col span={7} style={{ marginLeft: 4 }}>
                  <Checkbox checked={query.filterThreeMonthFlag} onChange={this.changeQuery2}>
                      不显示三个月内无采购的药品
                  </Checkbox>
              </Col>*/}
            </Row>


            <Table
              title={()=>'产品信息'}
              loading={btnLoading}
              bordered
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: '100%' }} 
               isDetail={true}
              rowKey='drugCode'
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ 
                    selected: selectedRowKeys, 
                    selectedRows: selectedRows
                  })
                }
              }}
              pagination={false}
            />
          </div>
          {
            dataSource.length === 0 ? null : 
            <div className="detailCard" style={{margin: '-12px -8px 0px -8px'}}>
              <Row>
                <Col style={{ textAlign: 'right', padding: '10px' }}>
                  <Button loading={saveLoading} onClick={()=>{this.submit(2)}} type='primary'>提交</Button>
                  <Button loading={submitLoading} onClick={()=>{this.submit(1)}} type='danger' style={{ marginLeft: 8 }} ghost>保存</Button>
                </Col>
              </Row>
            </div>
          }
        </div>
      </Spin>
    )
  }
}
export default connect(state=>state)(NewAdd);

// <Button type='primary' icon='plus' onClick={this.showModal}>添加产品</Button>