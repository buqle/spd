/*
 * @Author: yuwei  出库管理详情 /output/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal , message , Tooltip} from 'antd';
import { createData } from '../../../../common/data';
const Conform = Modal.confirm;
const columns = [
{
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },    
  {
    title: '通用名称',
    width:100,
    dataIndex: 'productName1',
    render:(text,record)=>record.productName
  },
  {
    title: '药品名称',
    width:150,
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
    width:150,
    dataIndex: 'fmodal',
  },
  {
    title: '包装单位',
    width:150,
    dataIndex: 'unit',
    render:(text)=>'g'
  },
  {
    title: '出库数量',
    width:150,
    dataIndex: 'approvalNo1',
  },
  {
    title: '生产批号',
    width:150,
    dataIndex: 'approvalNo2',
  },
  {
    title: '生产日期',
    width:150,
    dataIndex: 'approvalNo3',
  },
  {
    title: '有效期',
    width:150,
    dataIndex: 'approvalNo45',
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
  },
  {
    title: '供应商',
    width:150,
    dataIndex: 'gongyings',
  }
];

class DetailsOutput extends PureComponent{

  constructor(props){
    super(props)
    this.state={
      visible:false,
    }
  }
  //打印
  onBan = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/output"})
      },
      onCancel:()=>{}
    })
  }
  //确认
  onSubmit = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/output"})
      },
      onCancel:()=>{}
    })
  }

  render(){
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
          <h3>单据信息 
            <Button style={{float:'right'}} onClick={()=>this.onBan()} >不通过</Button>
            <Button type='primary' className='button-gap' style={{float:'right'}} onClick={()=>this.onSubmit()}>通过</Button>
          </h3>
          <Row className='detailContent'>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>出库单</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>PA002211807000086U</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>状态</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>待复核</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>申领药房</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>静配中心</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>制单人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>张三三</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>制单时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>2015-09-03 15:00:02
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>联系电话</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>13020082008</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>药房地址</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'>这是一个药房的地址</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核人</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'></div>
              </div>
            </Col>
            <Col span={8}>
              <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                  <label>复核时间</label>
              </div>
              <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                <div className='ant-form-item-control'></div>
              </div>
            </Col>
          </Row>
          </div>
          <div className='detailCard'>
            <Table
              dataSource={createData()}
              bordered
              title={()=>'产品信息'}
              scroll={{x: '100%'}}
               isDetail={true}
              columns={columns}
              rowKey={'id'}
              pagination={{
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal:(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`
              }}
            />
          </div>
      </div>
    )
  }
}
export default DetailsOutput;