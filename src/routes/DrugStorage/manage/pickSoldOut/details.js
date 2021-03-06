/*
 * @Author: yuwei  拣货下架详情 /pickSoldOut/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Table ,Row, Col, Button, Modal , message , Input , Tooltip} from 'antd';
import { createData } from '../../../../common/data';
const Conform = Modal.confirm;
class DetailsPickSoldOut extends PureComponent{

  //确认
  onSubmit = () =>{
    Conform({
      content:"您确定要执行此操作？",
      onOk:()=>{
        message.success('操作成功！')
        const { history } = this.props;
        history.push({pathname:"/drugStorage/drugStorageManage/pickSoldOut"})
      },
      onCancel:()=>{}
    })
  }

  render(){
    const columns = [
       {
        title: '序号',
        width: 60,
        render:(text,record,index)=>`${index+1}`,
      },    
      {
        title: '通用名称',
        width: 180,
        dataIndex: 'productName1',
        render:(text,record)=>record.productName
      },
      {
        title: '药品名称',
        width: 150,
        dataIndex: 'productName',
      },
      {
        title: '规格',
        width: 150,
        dataIndex: 'spec',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '剂型',
        width: 150,
        dataIndex: 'fmodal',
      },
      {
        title: '包装单位',
        width: 150,
        dataIndex: 'unit',
        render:(text)=>'g'
      },
      {
        title: '最小单位',
        width: 150,
        dataIndex: 'unit1',
      },
      {
        title: '批准文号',
        width: 150,
        dataIndex: 'approvalNo',
      },
      {
        title: '生产厂家',
        width: 150,
        dataIndex: 'productCompany1',
      },
      {
        title: '生产批号',
        width: 150,
        dataIndex: 'productCompany2',
      },
      {
        title: '生产日期',
        width: 150,
        dataIndex: 'productCompany3',
      },
      {
        title: '有效期至',
        width: 150,
        dataIndex: 'productCompany4',
      },
      {
        title: '指示货位',
        width: 150,
        dataIndex: 'productCompany23',
      },
      {
        title: '配货数量',
        width: 150,
        dataIndex: 'productCompany12',
      },
      {
        title: '实际数量',
        width: 150,
        dataIndex: 'productCompany5',
        render:(text)=>(<Input/>)
      },
      {
        title: '申领数量',
        width: 150,
        dataIndex: 'productCompany123',
      },
      {
        title: '欠品数',
        width: 150,
        dataIndex: 'productCompany6',
      }
    ];
    return (
      <div className='fullCol fadeIn'>
        <div className='fullCol-fullChild'>
        <h3>单据信息 
          <Button type='primary' className='button-gap' style={{float:'right'}} onClick={()=>this.onSubmit()}>确定下架</Button>
        </h3>
        <Row>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>配货单</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>JN00221180700005JS</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>申领单</label>
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
              <div className='ant-form-item-control'>待确认</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>申请药房</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>静配中心</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>拣货人</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
              <label>拣货时间</label>
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
export default DetailsPickSoldOut;