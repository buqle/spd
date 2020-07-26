/*
 * @Author: yuwei  上架详情 /putaway/details
 * @Date: 2018-07-24 13:13:55 
* @Last Modified time: 2018-07-24 13:13:55 
 */
import React, { PureComponent } from 'react';
import { Row, Col, Select, Button, Tabs, message, Tooltip,InputNumber} from 'antd';
import {connect} from 'dva';
import querystring from 'querystring';
import RemoteTable from '../../../../components/TableGrid';
import wareHouse from '../../../../api/drugStorage/wareHouse';
import {filter} from 'loadsh'
import {TableSearchUrl} from "../../../../api/replenishment/replenishmentPlan.js";
import FetchSelect from "../../../../components/FetchSelect/index.js";
import {consoleDepotdetail} from "../../../../services/common/workbench";
const Option = Select.Option;
const {TabPane} = Tabs;

class DetailsPutaway extends PureComponent{
  state = {
    defaultActive: '',
    loading: true,
    info: {},
    selectedRowKeys: [],
    selectedRow: [],
    saveLoading: false,
    listwsjData: [], 
    listysjQuery: {
      distributeCode: querystring.parse(this.props.match.params.id).code,
      upFinishType: 1,hisDrugCodeList:''
    },
    listwsjQuery: {
      distributeCode: querystring.parse(this.props.match.params.id).code,
      upFinishType: 0,hisDrugCodeList:''
    },
  }
  // componentWillMount() {
  //   console.log(this.props);
    
  //   let infoCode = this.props.match.params.id;
    
  //   infoCode = querystring.parse(infoCode);
  //   this.setState({
  //     acceptanceCode: infoCode.code,
  //   })
  // }
  
  componentDidMount() {
    this.getDetails();
  }
  getDetails = () => {
    //roomacceptanceInfo
    this.props.dispatch({
      type: 'pharmacy/shelfInfoHead',
      payload: {
        distributeCode: this.state.listwsjQuery.distributeCode
      },
      callback: ({data, code, msg}) => {
        if(code !== 200) return message.error(msg);
        this.setState({
          info: data,
          defaultActive: data.auditStatus === 2? '1' : '2',
        })
      }
    })
  }
  
  //确认
  onSubmit = () =>{
    let {selectedRow} = this.state;
    if(selectedRow.length === 0) {
      message.warning('请选择一条数据');
      return;
    };
    let isNull = selectedRow.every((item,i)=>{
        if(!item.realNum&&item.storeType!='备选上架货位') {
            item.realNum=item.realReceiveQuantiry
        };
      if(!item.realReceiveStore) {
        message.warning('实际货位不能为空!');
        return false;
      };
      return true;
    });

    if(!isNull) return;
    this.setState({saveLoading: true});
      let detailListVo = {}, pickingDetail = [];
      selectedRow.map(item => pickingDetail.push({
          id: item.id,
          realNum: item.realNum,
          realReceiveStore: item.realReceiveStore,
          productBatchNo: item.productBatchNo,
          upParentId:item.upParentId
      }));
      detailListVo=pickingDetail
    let payload = {
      distributeCode: querystring.parse(this.props.match.params.id).code,
      detailListVo
    };
    
    this.props.dispatch({
      type: 'pharmacy/finish',
      payload,
      callback: (data) => {
        message.success('上架成功');
        this.getDetails();
        this.listysjTable && this.listysjTable.fetch();
        this.listwsjTable.fetch();
        this.setState({
          saveLoading: false,
          selectedRowKeys: [],
          selectedRow: [],
        });
      }
    });
  }

  changeTabs = (key) => {
    this.setState({defaultActive: key});
  }

  listysjTableCallBack = (data) => {
    if(data.length > 0) {
      data = data.map(item => {   //如果实际货位下拉框不包含指示货位，则默认第一个
        let isSame =  item.acceptoodsVo.some(itemNum => {
          if(item.realReceiveStore !== itemNum.id) {
            return false;
          }else {
            return true;
          }
        });
        if(!isSame) {
          item.realReceiveStore = item.acceptoodsVo[0].id;
        }
        return item;
      });
      this.setState({
        listwsjData: data
      });

    }
    this.setState({
      loading: false
    });
  }
    onChange = (record, index, value) => {
        let { selectedRow,listwsjData } = this.state;

        let filterId=filter(listwsjData,(o)=>{
            return o.upParentId!=record.upParentId&&o.id==record.id
        })

        filterId.every((item)=>{
            if(!item.realNum&&item.storeType!='备选上架货位'&&record.id==item.id){
                item.realNum=item.realReceiveQuantiry
            }
            if(record.id==item.id){
                if(value+item.realNum>record.realReceiveQuantiry){
                    value  = 0;
                    record.realNum =0;
                    //item.realNum=0
                    return message.warn(`相同药品补货指示货位与备选上架货位实际数量相加不能大于指示数量`);
                    return false;
                }
            }
        })
          if (value > record.realReceiveQuantiry) {
            value  = record.realReceiveQuantiry;
            record.realNum = record.realReceiveQuantiry;
            return message.warn(`上架数量不能大于指示数量`);
            return false;
        }else {
            record.realNum = value;
        };
        selectedRow = selectedRow.map((item,i) => {
            if(item.id === record.id&&i==index) {
                item.realNum = value;
            };
            return item;
        });
        this.setState({ selectedRow });
        //console.log(this.state.selectedRow)
    }
  render(){
    let {
      defaultActive, 
      info, 
      loading, 
      saveLoading,
      listysjQuery,
      listwsjQuery,
      selectedRow,
      listwsjData,
    } = this.state;
    const notColumns = [
     {
        title: '序号',
        width: 60,
         dataIndex: 'rowNo',
         render: (record, row, index) => {
             let filterId=filter(listwsjData,(o)=>{
                 return o.upParentId!=record.upParentId&&o.id==record.id
             })
             const obj = {
                 children:record.rowNo,
                 props: {},
             };
             if (record.storeType!='备选上架货位'&&filterId.length) {
                 obj.props.rowSpan = 2;
             }
             if (record.storeType=='备选上架货位') {
                 obj.props.rowSpan = 0;
             }
             return obj;
         }
      },
      {
        title: '指示货位',
        width: 180,
        dataIndex: 'actualStore',
      },
      {
        title: '货位类型',
        width: 100,
        dataIndex: 'storeType',
      },
      {
        title: '实际货位',
        width: 200,
        dataIndex: 'realReceiveStore',
        render: (text, record) => {
          return <Select
                  defaultValue={text}
                  onChange={(value)=>{
                    const whetherInclude = selectedRow.some((item) => item.id === record.id);
                    record.realReceiveStore = value;
                    if(whetherInclude) {
                      selectedRow = selectedRow.map(item => {
                        if(item.id === record.id) {
                          item.realReceiveStore = value;
                        };
                        return item;
                      })
                      this.setState({
                        selectedRow
                      });
                    };
                  }}
                  style={{width: '100%'}}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                 >
                  {
                    record.acceptoodsVo.map(item=>{
                      return <Option key={item.id} value={item.id}>{item.positionName}</Option>
                    })
                  }
                 </Select>
        }
      },
      {
        title: '指示数量',
        width: 100,
        dataIndex: 'realReceiveQuantiry',
      },
      {
        title: '实际上架数量',
        width: 110,
        dataIndex: 'realNum',
         /* render: (text, record, index) => {
              return <div>
                  {
                      defaultActive === "1" && info.auditStatus === 2||info.auditStatus === 3?
                          <InputNumber
                              defaultValue={text}
                              min={record.storeType=='备选上架货位'?0:1}
                              precision={0}
                              value={record.storeType!='备选上架货位'&&!record.realNum?record.realReceiveQuantiry:record.realNum}
                              onChange={this.onChange.bind(this, record, index)}
                          />:<span>{record.realNum}</span>
                  }
              </div>
          }*/
        // render: (text, record) => {
        //   return <InputNumber
        //           min={1}
        //           precision={0}
        //           onChange={(value) => {
        //             if(value > record.realReceiveQuantiry) {
        //               message.warning('注意：数量大于指示数量');
        //             };
        //             if(value <= 0) {
        //               message.warning('上架数量不能小于0');
        //             }
        //             record.realNum = value;
        //           }}
        //           defaultValue={text}
        //          />
        // }
      },
      {
        title: '单位',
        width: 90,
        dataIndex: 'replanUnit'
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
        width: 148,
        dataIndex: 'ctmmSpecification',
        className:'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },*/
      {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification',
      },
      {
        title: '生产厂家',
        width: 200,
        dataIndex: 'ctmmManufacturerName',
        className: 'ellipsis',
        render:(text)=>(
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        )
      },
      {
        title: '生产批号',
        width: 100,
        dataIndex: 'productBatchNo',
      },
      {
        title: '生产日期',
        width: 118,
        dataIndex: 'realProductTime',
      },
      {
        title: '有效期至',
        width: 118,
        dataIndex: 'realValidEndDate',
      }
    ];
    const hasColumns = [
     {
        title: '序号',
        width: 60,
         render: (record, row, index) => {
             return `${index+1}`
         }
      },  
      {
        title: '指示货位',
        width: 112,
        dataIndex: 'actualStore',
      },
      {
        title: '货位类型',
        width: 112,
        dataIndex: 'storeType',
      },
      {
        title: '实际货位',
        width: 112,
        dataIndex: 'realReceiveStoreName',
      },
      {
        title: '指示数量',
        width: 90,
        dataIndex: 'realReceiveQuantiry',
      },
      {
        title: '实际上架数量',
        width: 110,
        dataIndex: 'realNum',
      },
      {
        title: '单位',
        width: 102,
        dataIndex: 'replanUnit'
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
        width: 148,
        dataIndex: 'ctmmSpecification',
      },*/
      {
        title: '包装规格',
        width: 148,
        dataIndex: 'packageSpecification',
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
        width: 100,
        dataIndex: 'productBatchNo',
      },
      {
        title: '生产日期',
        width: 118,
        dataIndex: 'realProductTime',
      },
      {
        title: '有效期至',
        width: 118,
        dataIndex: 'realValidEndDate',
      }
    ];
    return (
      <div style={{padding: '0 16px'}} className='fadeIn ysynet-content'>
        <h3>单据信息 
        </h3>
        <Row>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收单</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.distributeCode || ''}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>状态</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.statusName || ''}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>验收时间</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.receptionTime || ''}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div className="ant-form-item-label-left ant-col-xs-24 ant-col-sm-5">
                <label>上架时间</label>
            </div>
            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
              <div className='ant-form-item-control'>{info.upUserDate || ''}</div>
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
              url={TableSearchUrl.searchputawayHouse}
              cb={(value, option) => {
                let {listwsjQuery,listysjQuery} = this.state;
                listwsjQuery = {
                  ...listwsjQuery,
                  hisDrugCodeList: value || ''
                };
                listysjQuery={
                    ...listysjQuery,
                    hisDrugCodeList: value || ''
                }
                this.setState({
                  listwsjQuery,listysjQuery,
                  value
                });
              }}
            />
          </Col>
        </Row>

        <Tabs 
          onChange={this.changeTabs} 
          activeKey={defaultActive} 
          tabBarExtraContent={
            defaultActive === "1" && info.auditStatus === 2 ||info.auditStatus === 3?
            <Button loading={saveLoading} onClick={this.onSubmit} type="primary">确认上架</Button> 
            : null
          }
        >
          <TabPane tab="待上架" key="1">
              {defaultActive=='1'?
                  <RemoteTable
                      ref={(node) => this.listwsjTable = node}
                      loading={loading}
                      query={listwsjQuery}
                      columns={notColumns}
                      scroll={{ x: '100%' }}
                      isDetail={true}
                      dataSource={listwsjData}
                      getTotal={this.getTotal}
                      cb={this.listysjTableCallBack}
                      url={wareHouse.SHELF_INFO_LIST}
                      rowKey='id+productBatchNo'
                      rowSelection={{
                          onChange: (selectedRowKeys, selectedRow) => {
                              this.setState({selectedRowKeys, selectedRow});
                          }
                      }}
                  />:null}
          </TabPane>
          <TabPane tab="已上架" key="2">
              {defaultActive==2?<RemoteTable
                  ref={(node) => this.listysjTable = node}
                  query={listysjQuery}
                  columns={hasColumns}
                  isDetail={true}
                  scroll={{ x: '100%' }}
                  url={wareHouse.SHELF_INFO_LIST}
                  rowKey='id productBatchNo'
              />:null}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default connect(state=>state)(DetailsPutaway);