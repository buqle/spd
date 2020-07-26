/**
 * @file 药房 - 日对账单 - 详情
 */
import React, { PureComponent } from 'react';
import { Row, Col, Input, Tooltip, message, Button } from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import FetchSelect from '../../../../components/FetchSelect';
import {dayStatements, common} from '../../../../api/purchase/purchase';
import {connect} from 'dva';

const {Search} = Input;

class Details extends PureComponent {
  state = {
    value: undefined,
    query: {
      balanceCode: this.props.match.params.id,
      hisDrugCodeList: [],
      dispensingNo: ""
    },
    info: {},
      showButtton:'',
      showButtton2:'',
      selectedRowKeys: [],
      selectedRow: [],
      okLoading:false
  }
  componentDidMount() {
      if(this.props.location.pathname.indexOf('new')!=-1){
          this.setState({
              // newList:newss,
              showButtton2:true
          })
      }else {
          this.setState({
              showButtton:true
          })
      }
    this.props.dispatch({
      type: 'settlementMgt/dailyDetail',
      payload: {
        balanceCode: this.props.match.params.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.setState({
            info: data.data
          });
        }else {
          message.error(data.msg);
        }
      }
    })
  }
  changeSelect = (value) => {
    let {query} = this.state;
    query = {
      ...query,
      dispensingNo: value
    };
    this.setState({
      query
    });
  }
  changeFetchSelect = (value) => {
    let {query} = this.state;
    query = {
      ...query,
      hisDrugCodeList: value? [value] : []
    };
    this.setState({
      query,
      value
    });
  }
  //打印
  print = () => {
    const {id} = this.props.match.params;
    window.open(`${dayStatements.PRINT_DELIVERY_DETAIL}?sendId=${id}`, '_blank');
  }
    backStroage = (flag) => {
        let { selectedRow,info,query} = this.state;
        const { dispatch, history } = this.props;
        if(selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return;
        };
        let postData = {},balanceDetailIdList=[];
        selectedRow.map(item => balanceDetailIdList.push(item.id));
        postData.balanceCode=info.balanceCode;
        postData.balanceStatus=flag;
        postData.balanceDetailIdList=balanceDetailIdList;
        this.setState({
            okLoading: flag
        })
        dispatch({
            type:'settlementMgt/balanceStatus',
            payload: { ...postData },
            callback: () => {
                //message.success('操作成功');
                this.setState({
                    okLoading:false,
                    selectedRow:[],
                    selectedRowKeys:[]
                })
                this.refs.table.fetch(query);
                //history.push({pathname:"/purchase/settlementMgt/dayStatementsnew"})
            }
        })
    }
  render() {
    let {query, value, info,okLoading} = this.state;
    const columns = [
    {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },  
      {
        title: '对账反馈',
        dataIndex: 'feedBackRemark',
        width: 112
      },{
            title: '对账状态',
            dataIndex: 'accountStatus',
            width: 112
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
      /*{
        title: '通用名',
        dataIndex: 'ctmmGenericName',
        width: 224,
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/
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
        dataIndex: 'ctmmSpecification',
        width: 168,
      },*/
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
      <div className='fullCol'>
        <div className='fullCol-fullChild'>
          <Row>
            <Col span={12}>
              <h2>对账单: <span>{info.balanceCode}</span></h2>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Button onClick={this.print}>打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.confirmStatusName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-6">
                <label>对账人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.balanceUserName || ''}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-7">
                <label>对账完成时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>{info.balanceEndTime || ''}</div>
              </div>
            </Col>
          </Row>
          <div style={{borderBottom: '1px dashed #d9d9d9', marginBottom: 10}}></div>
          <Row align="middle">
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left">
                  <label>单号</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <Search 
                      placeholder='发药单'
                      onSearch={this.changeSelect}
                     />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-row">
                <div className="ant-col-4 ant-form-item-label-left">
                  <label>名称</label>
                </div>
                <div className="ant-col-18">
                  <div className="ant-form-item-control">
                    <FetchSelect
                      allowClear
                      value={value}
                      style={{width: '100%'}}
                      url={common.QUERY_DRUG_BY_LIST}
                      placeholder='产品名'
                      cb={this.changeFetchSelect}
                     />
                  </div>
                </div>
              </div>
            </Col>
            {/* <Col span={8} style={{lineHeight: '39px'}}>
                <Checkbox>只显示异常</Checkbox>
            </Col> */}
          </Row>
        </div>
        <div className="detailCard">
          <Row>
              <Col span={24} style={{ paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }} >产品信息</Col>
          </Row>
            {this.state.showButtton2?
                <Row style={{ marginTop: 10 }}>
                    <Col>
                        <Button type='primary' className='button-gap' onClick={this.backStroage.bind(this, 2)} loading={okLoading==2?true:false}>
                            对账成功
                        </Button>
                        <Button onClick={this.delete}  onClick={this.backStroage.bind(this, 3)} loading={okLoading==3?true:false}>对账失败</Button>
                    </Col>
                </Row>:null}
        </div>
        <div className="ysynet-main-content">
            {
              this.state.showButtton?
                  <RemoteTable
                      isJson={true}
                      query={query}
                      url={dayStatements.DAILY_DETAIL_LIST}
                      scroll={{x: '100%'}}
                      isDetail={true}
                      columns={columns}
                      rowKey={'id'}
                  />:null
            }
            {
                this.state.showButtton2?
                    <RemoteTable
                        isJson={true}
                        query={query}
                        url={dayStatements.DAILY_DETAIL_LIST}
                        scroll={{x: '100%'}}
                        isDetail={true}
                        columns={columns}
                        ref='table'
                        rowKey={'id'}
                        rowSelection={{
                            onChange: (selectedRowKeys, selectedRow) => {
                                this.setState({
                                    selectedRowKeys,
                                    selectedRow:selectedRow
                                });
                            },
                        }}
                    />:null
            }
        </div>
      </div>
    )
  }
}
export default connect()(Details);
