/*
 * @Author: yuwei  退库详情 /refund/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal, Tooltip, Spin, message,InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
import RemoteTable from '../../../../components/TableGrid';
const Conform = Modal.confirm;


class DetailsRefund extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible: false,
      spinning: false,
      loading: false,
      detailsData: {},
      dataSource: [],query:{},
      selected: [],
      selectedRows: [],
      saveLoading:false
    }
  }
  componentDidMount = () =>{
      this.getData()

  }


  getData=()=>{
     if (this.props.match.params.backNo) {
      let { backNo,isDraft } = this.props.match.params;
      this.setState({ spinning: true });
         this.props.dispatch({
             type:'base/getBackStorageDetail',
             payload: { backNo,...this.state.query },
             callback:(data)=>{
                 this.setState({ detailsData: data,dataSource: data.list, spinning: false });
             }
         });
      }
  }
  // 确认退货
  backStroage = () =>{
    Conform({
      content:"是否确认退货？",
      onOk:()=>{
        this.setState({ loading: true });
        const { dispatch, history } = this.props;
        const {  dataSource, detailsData } = this.state;
        let postData = {}, backDrugList = [];
        dataSource.map(item => backDrugList.push({ backNum: item.backNum, drugCode: item.drugCode }));
        postData.backDrugList = backDrugList;
        postData.backcause = detailsData.backCause;
        console.log(postData,'postData')
        dispatch({
          type: 'base/submitBackStorage',
          payload: { ...postData },
          callback: () => {
            message.success('退货成功');
            this.setState({ loading: false });
            history.push({pathname:"/drugStorage/outStorage/backStorage"})
          }
        })
      },
      onCancel:()=>{}
    })
  }

  //提交草稿
  submit=()=>{
      let {detailsData, selectedRows} = this.state;
      if(selectedRows.length === 0) {
          message.warning('请选择一条数据');
          return;
      };
      let detailListVo = [], pickingDetail = [];
      let backDrugList = selectedRows.map(item => {
          return {
              backNum: item.backNum,
              drugCode: item.drugCode,
              lot:item.lot,
              inStoreCode:item.inStoreCode,
              supplierCode:item.supplierCode
          }
      });
      this.setState({
          saveLoading: true
      });
      this.props.dispatch({
          type: 'base/submitDraft',
          payload: {
              backDrugList,
              backcause:detailsData.backCause,
              backNo:detailsData.backNo,
              deptCode:detailsData.acceptDeptCode,
          },
          callback: ()=>{
              message.success('提交草稿成功');
              this.props.history.go(-1);
          }
      });
  }
  render(){
    const { detailsData, dataSource, spinning,saveLoading } = this.state;
    const {backNo}=this.props.match.params;
    let {path} = this.props.match;
    path = path.split('/');
    path.length = 4;
    path = path.join('/');
      const { isDraft } = this.props.match.params;
      const columns = [
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
          /*{
            title: '规格',
            width: 168,
            dataIndex: 'ctmmSpecification',
          },*/
          {
              title: '入库单号',
              width: 168,
              dataIndex: 'inStoreCode',
          },
          {
              title: '包装规格',
              width: 148,
              dataIndex: 'packageSpecification',
          },
          {
              title: '单位',
              width: 112,
              dataIndex: 'replanUnit',
          },
          {
              title: '出库数量',
              width: 112,
              dataIndex: 'backNum'
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
              title: '有效期至',
              width: 118,
              dataIndex: 'validEndDate',
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
              title: '批准文号',
              dataIndex: 'approvalNo',
              width: 200
          }
      ];
    return (
      <div className='fadeIn ysynet-content'>
        <Spin spinning={spinning}>
          <div style={{margin: '0 16px'}}>
            <div className='ysynet-details-flex-header'>
              <h3>单据信息</h3>
              {
                detailsData.backStatus === 3 &&
                <div style={{ textAlign: 'right' }}>
                  <Link to={{pathname: `${path}/edit/${this.props.match.params.backNo}`}}><Button type='default'>编辑</Button></Link>
                </div>
              }
                {
                    isDraft==1?
                        <Button type='default' style={{marginLeft: 8}}> <Link to={{pathname: `/pharmacy/outStorage/refund/editAdd/${backNo}`}}>编辑草稿</Link></Button>:null
                }
            </div>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库单</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backNo }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>状态</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backStatusName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>受理部门</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.backDpetName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createUserName }</div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>退库时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.createDate }
                    </div>
                  </div>
              </Col>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>复核人</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.reviewUserName }</div>
                  </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                  <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                      <label>复核时间</label>
                  </div>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                    <div className='ant-form-item-control'>{ detailsData.reviewDate }</div>
                  </div>
              </Col>
            </Row>
          

          <hr className='hr'/>

          <Row style={{display: 'flex', alignItems: 'center'}}>
          <Col span={12} style={{ marginLeft: 4 }}>
            <FetchSelect
              allowClear
              value={this.state.value}
              style={{ width: '100%' }}
              placeholder='药品名称'
              deptStateb={' '}
              url={TableSearchUrl.searchoutStoragerefund}
              cb={(value, option) => {
                let {query} = this.state;
                query = {
                  ...query,
                  hisDrugCodeList: value || ''
                };
                this.setState({
                  query,
                  value
                },()=>{
                    this.getData();
                });
              }}
            />
          </Col>
        </Row><br/>

          <h3>产品信息</h3>
          <Table  
            bordered
             isDetail={true}
            dataSource={dataSource}
            scroll={{x: '100%'}}
            columns={columns}
            rowKey={'drugCode'}
            pagination={false}
          />
          </div>
        </Spin>
      </div>
    )
  }
}
export default  connect(state => state)(DetailsRefund) ;
