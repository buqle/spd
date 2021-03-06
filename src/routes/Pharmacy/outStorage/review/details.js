/*
 * @Author: yuwei  发药复核详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, message, Tooltip,Input,Form,Button } from 'antd';
import RetomeTable from '../../../../components/TableGrid';
import outStorage from '../../../../api/pharmacy/outStorage';
import {connect} from 'dva';
import {formItemLayout} from "../../../../utils/commonStyles";
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";

const FormItem = Form.Item;
const styles={
    display:'flex',
    justifyContent: 'space-between'
}
const columns = [
   {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      }, 
 /* {
    title: '通用名称',
    width: 200,
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
  /*{
    title: '规格',
    width: 148,
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
    dataIndex: 'packageSpecification'
  },
  {
    title: '发药单位',
    width: 100,
    dataIndex: 'replanUnit'
  },
  {
    title: '发药数量',
    width: 100,
    dataIndex: 'oEORIDispDrugQuantity'
  },
  {
    title: '出库数量',
    width: 100,
    dataIndex: 'backSumNum'
  },
  {
    title: '货位类别',
    width: 148,
    dataIndex: 'outStoreName'
  },
  {
    title: '批准文号',
    width: 180,
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
    title: '生产批号',
    width: 118,
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
        title: '状态',
        dataIndex: 'confirmStatusName',
        width: 90,
    },
    {
        title: '配药人',
        width: 80,
        dataIndex: 'confirmUserName'
    },
    {
        title: '配药时间',
        width: 160,
        dataIndex: 'confirmDate'
    }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      query: {
        backNo: this.props.match.params.id,hisDrugCodeList:''
      },
      info: {},
        updateUserId:'',
        dispensingCode:'',
        uname:'',
        confUserName:'',
        key:'',
        selected: [],
        selectedRows: [],
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'outStorage/billoutsotreDetail',
      payload: {
        backNo: this.props.match.params.id
      },
      callback: (data) => {
        if(data.msg === 'success') {
          this.setState({
            info: data.data,
          });
            this.setState({
                dispensingCode: this.state.info.dispensingCode,
                confUserName:this.state.info.confirmUserName
            });
            if(this.state.info.confirmStatus===2){
                this.setState({
                    key:true
                })
            }
        }else {
          message.error(data.msg);
        }
      }
    })
  }


    handleGetInputValue=(e)=>{
        if(e.target.value===''){
            message.success('请输入配药人工号');
            this.setState({
                key:''
            })
           if(this.state.info.confirmStatus===2){
               this.setState({
                   confUserName:'nulls'
               })
           }

            return false;
        }else{
            this.setState({
                confUserName:e.target.value,key:true
            })

        }
    }

    handleSave=()=>{
        let { selectedRows} = this.state;
        if(this.state.key===''){
            message.warn('请输入配药人工号');
            return false;
        }
      if(this.state.info.confirmStatus===2&&this.state.confUserName!=='nulls'&&this.state.confUserName===this.state.info.confirmUserName){
          message.warn('配药人相同无需重复提交');
          return false;
      }else if(this.state.confUserName==='nulls'){
          message.warn('请输入配药人工号');
          return false;
      }else  if (selectedRows.length === 0) {
          return message.warn('请选择一条数据');
      }
        let confirmStatusDtoList = selectedRows.map(item => {
            return {
                dispensingNo: item.dispensingNo,
                dispensingDetail: item.dispensingDetail,
                updateUserId:this.state.updateUserId
            }
        });

        this.props.dispatch({
            type:'outStorage/reviewSave',
            payload: confirmStatusDtoList,
            callback: (data) => {
                if(data.msg === 'success') {
                    message.success('配药成功');
                    this.props.history.go(-1);
                }else {
                    message.error(data.msg);
                }
            }
        })
    }

    handleEnterKey=(e)=>{
        if(e.nativeEvent.keyCode === 13&&e.target.value!==''){
            this.props.dispatch({
                type: 'outStorage/reviewSearch',
                payload: {
                    loginName: e.target.value
                },
                callback: ({data,msg,code}) => {
                    console.log(data)
                    if(code ===200) {
                        this.setState({
                            updateUserId: data.id,
                            uname:data.name
                        });
                        //console.log(this.state.updateUserId)
                    }else {
                        message.error(msg);
                    }
                }
            })
        }else if(e.nativeEvent.keyCode === 13&&e.target.value==='') {
            message.success('请输入配药人工号');
        }
    }


  render(){
    let {query, info} = this.state;
      const { getFieldDecorator } = this.props.form;
    return (
      <div  className='ysynet-main-content' >

          <div className='ysynet-tit' style={styles}>
              <h3>单据信息</h3>
              <Button type="primary" htmlType="button" onClick={this.handleSave}>保存</Button>
          </div>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发药单</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.dispensingCode || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>内部药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.innerDeptName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>外部药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.outDeptName || ''}</div>
                </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>出库分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.backTypeName || ''}</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>发药时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>{info.dispensingDate || ''}</div>
                </div>
            </Col>
              <Col span={8}>
                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18" style={styles}>
                      <Form style={{flex:'2'}}>
                          <FormItem {...formItemLayout} label={`配药人`}>
                              {
                                  getFieldDecorator('confirmUserName',{
                                      initialValue:info.confirmUserName,
                                      rules:[
                                          {required:true,message:'请输入配药人工号'}
                                      ]
                                  })(<Input placeholder="配药人工号"  onKeyPress={this.handleEnterKey} onChange={this.handleGetInputValue}/>)
                              }
                          </FormItem>

                      </Form>
                      <label style={{'marginTop': '10px','marginLeft': '10px'}}>{this.state.uname}</label>
                  </div>

              </Col>
          </Row>

          <hr className='hr'/>
          <div className="detailCard detailCards">
              <Row style={{display: 'flex', alignItems: 'center',marginBottom:0 }}>
                  <Col span={12} style={{ marginLeft: 4}}>
                      <FetchSelect
                          allowClear
                          value={this.state.value}
                          style={{ width: '100%' }}
                          placeholder='药品名称'
                          deptStateb={' '}
                          url={TableSearchUrl.searchoutStoragereview}
                          cb={(value, option) => {
                              let {query} = this.state;
                              query = {
                                  ...query,
                                  hisDrugCodeList: value || ''
                              };
                              this.setState({
                                  query,
                                  value
                              });
                          }}
                      />
                  </Col>
              </Row>
              <RetomeTable
                  title={()=>'产品信息'}
                  query={query}
                  url={outStorage.DETAIL_LIST}
                  scroll={{x: 2450}}
                  isDetail={true}
                  columns={columns}
                  rowKey={'id'}
                  rowSelection={{
                      selectedRowKeys: this.state.selected,
                      onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                      }
                  }}
              />
          </div>
      </div>
    )
  }
}
export default connect()(Form.create()(DetailsOutput));