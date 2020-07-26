/**
 * @author QER
 * @date 19/4/16
 * @Description: 药学科－配送缺货管理－生成补货计划
*/
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import RemoteTable from '../../../../components/TableGrid';
import {replenishmentPlan} from "../../../../api/replenishment/replenishmentPlan";
class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            visible: false,
            tabArr:this.props.record,
            jsonArr:[]

        }
    }
    componentWillReceiveProps = (nextProps) => {
        this.setState({
            tabArr:nextProps.record
        });
    }
    //取消


    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:false,
            tabArr:[]
        });

    }

    componentDidMount=()=>{
    }
    showModal=e=>{
        let { tabArr} = this.state;

        if(e){
            e.stopPropagation()
        }
        console.log(tabArr)
        if(!tabArr.length){
            message.warning('请选择生成补货计划的订单!');
            return false;
        }
        console.log(tabArr)
        this.setState({
            visible:true
        })
        if(this.state.visible&&tabArr.length){
            this.tableCallBack()
        }

    }
    tableCallBack=()=>{
        this.setState({
            jsonArr:this.state.tabArr
        })
}
    render(){
        let { visible,tabArr} = this.state;
        const columns = [
            {
                title: '序号',
                width: 60,
                render:(text,record,index)=>`${index+1}`,
            },
            {
                title: '订货日期',
                dataIndex: 'orderCode',
                width: 118
            },{
                title: '订单状态',
                dataIndex: 'orderStatusName',
                width: 112,
            },{
                title: '订单类型',
                dataIndex: 'orderTypeName',
                width: 168
            },{
                title: '供应商',
                dataIndex: 'supplierName',
                width: 168,
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },{
                title: '下单人',
                dataIndex: 'createUserName',
                width: 168
            },{
                title: '下单时间',
                dataIndex: 'createDate',
                width: 224,
            },{
                title: '收货地址',
                dataIndex: 'receiveAddress',
                width: 280,
                className: 'ellipsis',
                render:(text)=>(
                    <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                )
            },
        ];
        return (
            <span onClick={this.showModal} >
                {this.props.children}
                <Modal
                    destroyOnClose
                    bordered
                    title={'生成补货计划'}
                    width={1200}
                    style={{ top:'5%'}}
                    visible={visible}
                    onCancel={this.cancel}
                    okText={'提交'}
                    onOk={this.okHandler}
                >
                    <div>
                       <RemoteTable
                           columns={columns}
                           data={tabArr}
                           bordered
                           ref='table'
                           url={null}
                           isDetail={true}
                           scroll={{ x: '100%',  }}
                           cb={this.tableCallBack}
                           rowKey={'id'}
                           rowSelection={{
                               selectedRowKeys: this.state.selected,
                               onChange: (selectedRowKeys, selectedRows) => {
                                   this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                               }
                           }}
                       />
                    </div>

                </Modal>
            </span>
        )
    }
}
export default connect(state => state)(Form.create()(AddRefund));