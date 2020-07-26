/*
 * @Author: yuwei  退库新建 /refund/add
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, InputNumber, Input , Affix , Row , Tooltip, Spin, Form, Select } from 'antd';
import { outStorage } from '../../../../api/drugStorage/outStorage';
import { Link } from 'react-router-dom';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect';
import _ from 'lodash';
import { connect } from 'dva';
const FormItem = Form.Item;
const Conform = Modal.confirm;
const {Option} = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },//5
    md: {span: 10}
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },//17
    md: {span: 14}
  },
}
const formRemarkLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },//5
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },//17
  },
}
const modalColumns = [
 {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
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
 /* {
    title: '规格',
    dataIndex: 'ctmmSpecification',
    width: 168,
  },*/
  {
    title: '生产批号',
    width: 148,
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
    dataIndex: 'validEndDate',
  },
  {
    title: '剂型',
    dataIndex: 'ctmmDosageFormDesc',
    width: 90,
  },
  {
    title: '包装单位',
    width: 112,
    dataIndex: 'unit',
  },
  {
    title: '批准文号',
    dataIndex: 'approvalNo',
    width: 148,
  },
  {
    title: '生产厂家',
    dataIndex: 'ctmmManufacturerName',
    width: 200,
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    width: 224,
    className: 'ellipsis',
    render:(text)=>(
        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  }
]
class RemarksForm extends PureComponent{
  state = {
    recallReason: [],
    remarks: ''
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'base/orderStatusOrorderType',
      payload: {
        type: 'back_cause_room'
      },
      callback: (data) => {
        data = data.filter(item => item.value !== '');
        this.setState({
          recallReason: data
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.detailsData.backCause !== nextProps.detailsData.backCause) {
      this.setState({
        remarks: nextProps.detailsData.backCause
      })
    };
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { detailsData ,editdetailsData} = this.props;
    let {recallReason, remarks} = this.state;
    recallReason = recallReason.map(item => (
      <Option key={item.value} value={item.value}>{item.label}</Option>
    ));
    return (
      <Form>
        <Row gutter={30}>
          <Col span={12}>
              {editdetailsData?<FormItem label={`退库原因`} {...formRemarkLayout}>
                  {getFieldDecorator('backCause', {
                      initialValue: editdetailsData.backCause ? editdetailsData.backCause : undefined,
                      rules: [{
                          required: true, message: '请选择退库原因',
                      }]
                  })(
                      <Select
                          placeholder="请选择退库原因"
                          onChange={(value) => {
                              this.setState({
                                  remarks: value
                              })
                          }}
                          style={{width: '100%'}}
                      >
                          {recallReason}
                      </Select>
                  )}
              </FormItem>:<FormItem label={`退库原因`} {...formRemarkLayout}>
                  {getFieldDecorator('backCause', {
                      initialValue: detailsData.backCause ? detailsData.backCause : undefined,
                      rules: [{
                          required: true, message: '请选择退库原因',
                      }]
                  })(
                      <Select
                          placeholder="请选择退库原因"
                          onChange={(value) => {
                              this.setState({
                                  remarks: value
                              })
                          }}
                          style={{width: '100%'}}
                      >
                          {recallReason}
                      </Select>
                  )}
              </FormItem>}
          </Col>
          <Col span={12}>
            {
              remarks === '其他' ? 
                <FormItem label={`原因`} {...formRemarkLayout}>
                  {getFieldDecorator('backcauseOther',{
                    initialValue: detailsData.backCauseOther ? detailsData.backCauseOther : '',
                    rules: [{
                        required: true, message: '请输入原因',
                    }]
                  })(
                  <Input placeholder='请输入原因'/>
                  )}
                </FormItem>
              : null
            }
          </Col>
        </Row>
      </Form>
    )
  }
}
const RemarksFormWarp = Form.create()(RemarksForm);
class AddRefund extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      display: 'none',
      query: {},
      selectedRowKey: [],
      spinLoading: false,
      visible: false,
      isEdit: false,
      btnLoading: false, // 添加产品modal 确认
      detailsData: {}, // 详情
      dataSource: [],
      selected: [],  // 新建, 编辑 table 勾选
      selectedRows: [],
      modalSelectedRows: [], // 模态框内勾选
      modalSelected: [],
      supplierList: [],
      deptList: [], //所有药库部门
      okLoading: false,
      appDeptCode:''
    }
  }
  toggle = () => {
    const { display, expand } = this.state;
    this.setState({
      display: display === 'none' ? 'block' : 'none',
      expand: !expand
    })
  }
  componentDidMount = () =>{
    const {dispatch} = this.props;
    if(this.props.match.path === "/pharmacy/outStorage/refund/edit/:backNo") {
      let { backNo } = this.props.match.params;
      this.setState({spinLoading: true});
      this.props.dispatch({
        type:'base/getBackStorageDetail',
        payload: { backNo },
        callback:(data)=>{
          let { query } = this.state;
          let existDrugCodeList = data.list.map(item => item.drugCode);
          this.setState({ 
            detailsData: data, 
            isEdit: true, 
            dataSource: data.list,
            spinLoading: false,
            query: {
              ...query,
              deptCode: data.acceptDeptCode,
              existDrugCodeList
            }
          });
        }
      });
    };
    dispatch({
      type: 'base/genSupplierList',
      callback: ({data, code, msg}) => {
        if(code === 200) {
          this.setState({
            supplierList: data
          });
        }else {
          message.error(msg);
        };
      }
    });
    dispatch({
      type: "base/findDepotDeptlist",
      callback: ({code, msg, data}) => {
        if(code === 200) {
          this.setState({
            deptList: data
          });
        }else {
          message.error(msg);
        };
      }
    });
      if(this.props.match.path === "/pharmacy/outStorage/refund/editAdd/:backNo"){
          this.getDetail();

      }
  }
    //草稿单详情
    getDetail = () => {
        if (this.props.match.params.backNo) {
            let { backNo,acc } = this.props.match.params;
            let query=this.state
            this.props.dispatch({
                type:'base/editDraft',
                payload: { backNo},
                callback:(data)=>{
                    this.setState({dataSource: data});
                }
            });
            this.props.dispatch({
                type:'base/editDraftHead',
                payload: { backNo},
                callback:(data)=>{
                    this.setState({
                        editdetailsData: data,
                        query: {
                            ...query,
                            deptCode: data.acceptDeptCode
                        },
                    });
                }
            });
        }
    }

  // 模态框表单搜索
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, '查询条件');  
        let { query } = this.state;
        values.hisDrugCodeList = values.hisDrugCodeList ? [values.hisDrugCodeList] : [];
        // this.refs.table.fetch({ ...query, ...values });
        this.setState({ query: { ...query, ...values } })
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    let values = this.props.form.getFieldsValue();
    let { query } = this.state;
    this.refs.table.fetch({ ...query, ...values });
  }

  //提交该出库单
  backStroage = (flag) =>{
    const {  dataSource, query,selectedRows ,editdetailsData} = this.state;
      if(selectedRows.length === 0&&!editdetailsData) {
          message.warning('请选择一条数据');
          return;
      };
    this.refs.remarksForm.validateFields((err, values) => {
      if(!err) {
        Conform({
          content:flag==2?"是否确认退库":'是否确认保存草稿',
          onOk:()=>{
            const { dispatch, history } = this.props;
            let postData = {}, backDrugList = [];
              if(!editdetailsData){
                  backDrugList = selectedRows.map(item => {
                      return {
                          backNum: item.backNum,
                          drugCode: item.drugCode,
                          inStoreCode: item.inStoreCode,
                          lot: item.lot,
                          supplierCode: item.supplierCode
                      }
                  });
              }else {
                  dataSource.map(item => backDrugList.push({
                      backNum: item.backNum,
                      drugCode: item.drugCode,
                      inStoreCode: item.inStoreCode,
                      lot: item.lot,
                      supplierCode: item.supplierCode
                  }));
              }
              if(editdetailsData){
                  postData.backNo=editdetailsData.backNo;
              }
            postData.backDrugList = backDrugList;
            postData.backcause = values.backCause;
            postData.deptCode = query.deptCode?query.deptCode:editdetailsData.acceptDeptCode;
            if(values.backcauseOther) {
              postData.backcauseOther = values.backcauseOther;
            }
            this.setState({okLoading:flag})
              this.setState({okLoading:flag})
            dispatch({
              type:flag==2?'base/submitBackStorage':'base/saveDraft',
              payload: { ...postData },
              callback: () => {
                message.success(flag==2?'退库成功':'保存草稿成功');
                this.setState({okLoading:flag})
                history.push({pathname:"/pharmacy/outStorage/refund"})
              }
            })
          },
          onCancel:()=>{}
        })
      }
    })
    
  }
//提交草稿
    submit=()=>{
        let {editdetailsData, selectedRows,dataSource} = this.state;
        this.refs.remarksForm.validateFields((err, values) => {
            if(!err){
                let  backDrugList = [];
                dataSource.map(item => backDrugList.push({
                    backNum: item.backNum,
                    drugCode: item.drugCode,
                    lot:item.lot,
                    inStoreCode:item.inStoreCode,
                    supplierCode:item.supplierCode
                }));
                this.setState({
                    okLoading: 3
                });
                this.props.dispatch({
                    type: 'base/submitDraft',
                    payload: {
                        backDrugList,
                        backcause:values.backCause,
                        backNo:editdetailsData.backNo,
                        deptCode:editdetailsData.acceptDeptCode,
                    },
                    callback: ()=>{
                        message.success('提交草稿成功');
                        this.props.history.push('/pharmacy/outStorage/refund');
                    }
                });
            }
        })
        return

    }
  //添加产品 到 主表
  handleOk = () => {
    let { modalSelectedRows } = this.state;
    if(modalSelectedRows.length === 0) {
      message.warning('至少选择一条信息');
      return;
    }
    let { dataSource } = this.state;
    modalSelectedRows.map(item => item.backNum = 1);
    let newDataSource = [];
    newDataSource = [ ...dataSource, ...modalSelectedRows ];
    this.setState({ dataSource: newDataSource, visible: false, modalSelected: [], modalSelectedRows: [] }) 
  }
  delete = () => {  //删除
    let { selectedRows, dataSource, query } = this.state;
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
  //选择指向药库
  changePointToDrugStorage = (value) => {
    const {query} = this.state;

    this.setState({
      query: {
        ...query,
        deptCode: value
      },
    })

  }
  //showMoadl
  showAddDrugModal = () => {
    const {dataSource, query} = this.state;
      if(query.deptCode === undefined || query.deptCode === "") {
          return message.warning('请先选择指向药库');
      };

    let existInstoreCodeList = [];
    dataSource.map(item => existInstoreCodeList.push(item.batchNo));
    this.setState({
      visible:true,
      query: {
        ...query, 
        existInstoreCodeList,
        deptCode:query.deptCode?query.deptCode:null
      }
    });
  }

  render(){
    const columns = [
      {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },   
      {
      title: '退库数量',
      width: 120,
      dataIndex: 'backNum',
      render:(text, record) =>{
        return <InputNumber
                min={1}
                max={record.usableQuantity}
                onChange={(value) => {
                  record.backNum = value;
                }}
                defaultValue={text}
               />
        }
      },
      {
        title: '当前库存',
        width: 112,
        dataIndex: 'usableQuantity',
      },
      {
        title: '单位',
        width: 112,
        dataIndex: 'unit',
      },
      {
        title: '有效期至',
        width: 118,
        dataIndex: 'validEndDate',
      },
     /* {
        title: '通用名称',
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
        width: 148,
        dataIndex: 'packageSpecification',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产批号',
        width: 148,
        dataIndex: 'lot',
      },
      {
        title: '生产日期',
        width: 118,
        dataIndex: 'productDate',
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
        title: '供应商',
        width: 200,
        dataIndex: 'supplierName',
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      }
    ];
    const { supplierList, visible, isEdit, dataSource, query, spinLoading, display, detailsData, deptList,okLoading,editdetailsData} = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
    <Spin spinning={spinLoading} size="large">
      <div className="fullCol" style={{ padding: 24, background: '#f0f2f5' }}>
        <div className="fullCol-fullChild" style={{margin: '-9px -24px 0'}}>
          <Row style={{borderBottom: '1px solid rgba(0, 0, 0, .1)', marginBottom: 10}}>
            <Col span={8}>
              <h2>{isEdit? '编辑退货' :editdetailsData?'编辑草稿': '新建退货'}</h2>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.props.history.go(-1)}><Icon type="close" style={{ fontSize: 26, marginTop: 8 }} /></span>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col    span={editdetailsData?10:4}>
              <Button type='primary' className='button-gap' onClick={this.showAddDrugModal}>
                添加产品
                </Button>
              <Button onClick={this.delete} >移除</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <Select
                placeholder="请选择退库指向药库"
                onChange={this.changePointToDrugStorage}
                style={{
                  width: '100%',
                  marginTop: 4
                }}
                disabled={dataSource.length > 0}
                value={query.deptCode}
              >
                {
                  deptList.map(item => (
                    <Option key={item.id} value={item.id}>{item.deptName}</Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={12}>
              <RemarksFormWarp
                detailsData={detailsData}
                dispatch={this.props.dispatch}
                ref="remarksForm"
                editdetailsData={editdetailsData}
              />
            </Col>
          </Row>
          </div>
          <div className='detailCard' style={{margin: '-12px -8px -8px', minHeight: 'calc(100vh - 224px)'}}>
            <Table
              pagination={false}
              dataSource={dataSource}
              title={()=>'产品信息'}
              bordered
              scroll={{x: '100%'}}
               isDetail={true}
              columns={columns}
              rowKey={'id'}
              style={{marginTop: 24}}
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ selected: selectedRowKeys, selectedRows })
                }
              }}
            />
          </div>
          {
            dataSource.length === 0 ? null : 
            <div className="detailCard" style={{margin: '-12px -8px 0px -8px'}}>
              <Affix offsetBottom={0} className='affix'>
                <Row>
                  <Col style={{ textAlign: 'right', padding: '10px' }}>
                      {
                          editdetailsData? <Button onClick={this.submit} type='primary' style={{ marginRight: 8 }} loading={okLoading==3?true:false}>提交草稿</Button>:
                              <Button onClick={this.backStroage.bind(this, '2')} type='primary' style={{ marginRight: 8 }} loading={okLoading==2?true:false}>提交</Button>
                      }
                      <Button onClick={this.backStroage.bind(this, '1')} type='primary' style={{ marginRight: 8 }} loading={okLoading==1?true:false}>保存草稿</Button>
                    <Button type='primary' ghost>
                      <Link to={{pathname:`/pharmacy/outStorage/refund`}}>取消</Link>
                    </Button>
                  </Col>
                </Row>
              </Affix>
            </div>
          }
          {/*选择产品-弹窗*/}
          <Modal 
            bordered
            title={'添加产品'}
            visible={visible}
            width={1200}
            style={{ top: 20 }}
            onCancel={() => this.setState({ visible: false, modalSelected: [] })}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
              <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>
            ]}
          >
            <Form onSubmit={this.handleSearch}>
              <Row gutter={30}>
                <Col span={8}>
                  <FormItem label={`药品名称`} {...formItemLayout}>
                    {getFieldDecorator('hisDrugCodeList')(
                      <FetchSelect
                        style={{width: '100%'}}
                        allowClear
                        placeholder='药品名称'
                        url={outStorage.QUERY_DRUG_BY_LIST}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label={`生产批号`} {...formItemLayout}>
                    {getFieldDecorator('lot',{
                      initialValue: ''
                    })(
                    <Input placeholder='生产批号'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{display: display}}>
                  <FormItem label={`供应商`} {...formItemLayout}>
                    {getFieldDecorator('supplierCode')(
                      <Select 
                        showSearch
                        placeholder={'请选择'}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        >
                          {
                            supplierList.map(item => (
                              <Option key={item.ctmaSupplierCode} value={item.ctmaSupplierCode}>{item.ctmaSupplierName}</Option>
                            ))
                          }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{display: display}}>
                  <FormItem label={`入库单号`} {...formItemLayout}>
                    {getFieldDecorator('inStoreCode', {
                      initialValue: ''
                    })(
                      <Input placeholder='入库单号'/>
                    )}
                  </FormItem>
                </Col>
                <Col span={ this.state.expand ? 16: 8} style={{ textAlign: 'right', marginTop: 4}} >
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                  <a style={{marginLeft: 8, fontSize: 14}} onClick={this.toggle}>
                    {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                  </a>
                </Col>
              </Row>
            </Form>
            <RemoteTable
              query={query}
              ref="table"
              bordered
              isJson={true}
              url={outStorage.BACKSTORAGE_ADDPRODUCT_LIST}
              scroll={{x: '100%'}}
              columns={modalColumns}
              rowKey={'id'}
               isDetail={true}
              rowSelection={{
                selectedRowKeys: this.state.modalSelected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ modalSelected: selectedRowKeys, modalSelectedRows: selectedRows })
                }
              }}
            />
          </Modal>
      </div>
    </Spin>
    )
  }
}
export default connect(state => state)(Form.create()(AddRefund));