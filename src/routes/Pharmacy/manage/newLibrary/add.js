/*
 * @Author: yuwei  新建入库新建 /newLibrary/add
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table , Col, Button, Modal , message, Input , Affix , Row, Icon , Tooltip } from 'antd';
import { createData } from '../../../../common/data';
const Conform = Modal.confirm;
const columns = [
 {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },     
 /* {
    title: '通用名称',
    width:100,
    dataIndex: 'productName1',
    render:(text,record)=>record.productName
  },*/
  {
    title: '药品名称',
    width:350,
    dataIndex: 'productName',
  },
  {
    title: '规格',
    width:150,
    dataIndex: 'spec',
    className:'ellipsis',
    render:(text)=>(
      <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    )
  },
  {
    title: '剂型',
    width:90,
    dataIndex: 'fmodal',
  },
  {
    title: '包装单位',
    width:150,
    dataIndex: 'fmodal123',
    render:()=>`瓶`
  },
  {
    title: '入库数量',
    width:150,
    dataIndex: 'rukushul',
  },
  {
    title: '生产批号',
    width:150,
    dataIndex: 'productCompany2',
  },
  {
    title: '生产日期',
    width:118,
    dataIndex: 'productCompany3',
  },
  {
    title: '有效期至',
    width:118,
    dataIndex: 'productCompany4',
  },
  {
    title: '货位',
    width:150,
    dataIndex: 'productCompany423',
  },
  {
    title: '批准文号',
    width:150,
    dataIndex: 'approvalNo',
  },
  {
    title: '生产厂家',
    width:150,
    dataIndex: 'productCompany',
  }
];
class AddNewLibrary extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      selectedRowKey:[],
    }
  }

  //提交该出库单
  onSubmit = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/newLibrary"})
      },
      onCancel:()=>{}
    })
  }

  render(){
    return (
      <div className='fullCol'>
        <div className='fullCol-fullChild' style={{height:70}}>
          <Col span={6}>
              <Icon type="qrcode" />&nbsp;&nbsp;
              <Input placeholder="输入配送单号/使用条码枪扫描" style={{width:250}}/>
          </Col>
          <Col span={6}>
              备注：
              <Input style={{width:250}}/>
          </Col>
        </div>
        <div className='fullCol-gap-firstChild'>
          <h3>单据信息</h3>
          <Row>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>库房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>药库</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>药房</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>中心药房</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>入库分类</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>申领入库</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>上架人</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>张光渝</div>
                </div>
            </Col>
            <Col span={8}>
                <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                    <label>上架时间</label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                  <div className='ant-form-item-control'>2018-07-12 17:09:15</div>
                </div>
            </Col>
          </Row>
        </div>
        <h3>产品信息</h3>
        <Table
          dataSource={createData()}
          bordered
          scroll={{x: '100%'}}
           isDetail={true} 
          columns={columns}
          rowKey={'id'}
          style={{marginTop: 24}}
        />

        <Affix offsetBottom={0} className='affix'>共10种产品
          <Button  type="danger" style={{float:'right'}} onClick={() => this.onSubmit()}>
            拒收
          </Button>
          <Button  type="primary" className='button-gap' style={{float:'right'}} onClick={() => this.onSubmit()}>
            确认入库
          </Button>
        </Affix>
      </div>
    )
  }
}
export default AddNewLibrary;