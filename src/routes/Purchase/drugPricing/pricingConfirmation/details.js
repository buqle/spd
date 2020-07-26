import React, {PureComponent} from 'react';
import {Row, Col, Tooltip, message} from 'antd';
import RemoteTable from '../../../../components/TableGrid';
import {drugPricing} from '../../../../api/purchase/purchase';
import {connect} from 'dva';
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
const columns = [
   /* {
        title: '通用名',
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
    }, /* {
        title: '药品规格',
        dataIndex: 'ctmmSpecification',
        width: 168,
    },*/ {
        title: '生产厂家',
        dataIndex: 'ctmmManufacturerName',
        width: 200,
        className:'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    }, {
        title: '计量单位',
        dataIndex: 'ctmmValuationUnit',
        width: 112,
    }, {
        title: '生效时间',
        dataIndex: 'fromDate',
        width: 118,
    }, {
        title: '调整后价格',
        dataIndex: 'newPrice',
        width: 112,
    }, {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 168,
    }, {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 200,
        className: 'ellipsis',
        render:(text)=>(
            <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
    },{
        title: '商品编码',
        dataIndex: 'hisDrugCode',
        width: 200,
    }
];

class Details extends PureComponent{
    constructor(props) {
        super(props);
        let {id} = this.props.match.params;
        this.state = {
            query: {
                updatePriceNo: id
            },
            info: {}
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'drugPricing/checkpriceGetDetail',
            payload: {
                updatePriceNo: this.state.query.updatePriceNo
            },
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({info: data});
                }else {
                    message.error(msg);
                };
            }
        })
    }
    render() {
        let {query, info} = this.state;
        return (
            <div className="fullCol">
              <div className="fullCol-fullChild">
                <h3>单据信息</h3>
                <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                            <label>单号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.updatePriceNo || ''}</div>
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
                            <label>确认人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
                            <div className='ant-form-item-control'>{info.createUserName || ''}</div>
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
                      url={TableSearchUrl.searchpricingConfirmation}
                      cb={(value, option) => {
                        let {query} = this.state;
                        query = {
                          ...query,
                          hisDrugCodeList: value ? [value] : []
                        };
                        this.setState({
                          query,
                          value
                        });
                      }}
                    />
                  </Col>
                </Row>
                <div className='detailCard'>
                  <h3 style={{marginBottom: 16}}>产品信息</h3>
                  <RemoteTable
                    query={query}
                    scroll={{x: '100%'}}
                     isDetail={true}
                    url={drugPricing.CHECK_PRICE_DETAIL}
                    
                    ref="table"
                    columns={columns} 
                    rowKey='id' 
                  />
                </div>
                
            </div>
        )
    }
};

export default connect(state=>state)(Details);