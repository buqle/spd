/**
 * @author QER
 * @date 19/1/11
 * @Description: 上传企业资质
*/
import React, { PureComponent } from 'react';
import { Table , Col, Button, Icon, Modal , message, Input , Row , Tooltip, Spin, Form, Select,Upload ,DatePicker} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'dva';
import UploadPic from '../uploadPic'
const FormItem = Form.Item;
const {Option} = Select;
const { RangePicker } = DatePicker;
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

class AddRefund extends PureComponent{
  constructor(props){
    super(props)
    this.state={
			query: {
        existDrugList: [],
      },
      selectedRowKey: [],
      spinLoading: false,
      visible: false,
      isRecall: true,
      btnLoading: false, // 添加产品modal 确认
      detailsData: {}, // 详情
      dataSource: [],
      selected: [],  // 新建, 编辑 table 勾选
      selectedRows: [],
      modalSelectedRows: [], // 模态框内勾选
      modalSelected: [],
      okLoading: false,
      display: 'none',
        previewVisible: false,
        previewImage: '',
        factorList: [
        ],//资质类型
        fileList: [{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
          newfileList:[],
        tabArr:[],
        changeLicShow: false

    }
  }




  //取消
    cancel=e=>{
        if(e){
            e.stopPropagation()
        }
        this.setState({
            visible:false,
            factorList:[]
        })
        this.props.form.resetFields();
    }


    okHandler=e=>{
        if(e){
            e.stopPropagation()
        }
        const {onOk,record:{id}}=this.props;
        const {newfileList,tabArr,factorList,changeLicShow}=this.state;
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const productTime = values.productTime === undefined ? '' : values.productTime;
                const validEndDate = values.validEndDate === undefined ? '' : values.validEndDate;
                if (validEndDate&&productTime) {
                    values.productTime = productTime.format('YYYY-MM-DD');
                    values.validEndDate= validEndDate.format('YYYY-MM-DD');
                }else {
                    values.productTime = '';
                    values.validEndDate = '';
                };
                if(newfileList.length){
                    let cc=[]
                    newfileList.forEach(function (value,index,arr) {
                        if(value.lastModified){
                            cc.push(value.response.data)
                            values.pictcontents=cc;
                        }else {
                            cc.push({
                                original:{
                                    name:value.name,
                                    filesize: value.filesize,
                                    path: value.url
                                }
                            })
                            values.pictcontents=cc;
                        }
                    });
                }else if(tabArr&&!values.pictcontents&&!newfileList.length){
                    let cc=[];
                    tabArr.forEach(function (value,index,arr) {
                        cc.push(JSON.parse(value.pictcontent))
                    });
                    values.pictcontents=cc;
                }
                //console.log(values.pictcontents)
                if(id){
                    values.id=id
                }
                if(changeLicShow=='another'){
                    values.licType=factorList.length-1
                }
                values.sort=values.licType;
                onOk(values)
                console.log(values)
                this.cancel()
            }
        })
    }
    setFileList=(v)=>{
        this.setState({
            newfileList:v
        })
    }
    //其它类型
    changeLic=(value,option)=>{
        this.setState({
            changeLicShow: value,
        });
    }
    showModal=e=>{
        if(e){
            e.stopPropagation()
        }
        if(this.state.visible){
            return false
        }
        let {factorList}=this.props;
        factorList.push({value: 'another', label: "其它"})
        this.setState({
            tabArr:this.props.record. pictcontents,
            visible:true,
            changeLicShow:this.props.record.licType,
            factorList:factorList
        })
        let cc=[];
        if(this.props.record.pictcontents){
            this.props.record.pictcontents.forEach(function (value,index,arr) {
                cc.push(JSON.parse(value.pictcontent))
            });
        }
        const dataList = cc.map((item,i) => ({
            uid: i,
            name: item.original.name,
            status: 'done',
            url: item.original.path,
            filesize:item.original.filesize
        }));
        this.setState({
            fileList: dataList
        })
    }
  render(){
      const {supplierList,children} =this.props;

    let { visible,display,factorList} = this.state;
    const { getFieldDecorator } = this.props.form;
    const expand = display === 'block';
      let {supplierCode,licType,productTime,validEndDate,licCode,type}=this.props.record;
      console.log(licType)
      let productTimes=''
      let validEndDates=''
      if(productTime&&validEndDate){
           productTimes=moment(productTime).format('YYYY-MM-DD');
          validEndDates=moment(validEndDate).format('YYYY-MM-DD');
      }else {
          productTimes='';
          validEndDates='';
      }


    return (
    <span onClick={this.showModal}>
        {children}
        <Modal
            destroyOnClose
            bordered
            title={'上传企业资质'}
            width={1200}
            style={{ top:'50%',marginTop:'-250px',height:'500px' }}
            onCancel={this.cancel} visible={visible}
            okText={'保存'}
            onOk={this.okHandler}
        >
            <div>
                <Form   className='uplaodpic'>
                    <div style={{width:'440px'}}>
                        <Row gutter={30}>
                            <Col span={20}>
                                <FormItem label={'供应商'} {...formItemLayout}>

                                    {getFieldDecorator('supplierCode', {
                                        initialValue:supplierCode,
                                        rules:[
                                            {required:true,message:'请选择供应商'}
                                        ]
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        </Row>
                        <Row gutter={30}>
                            <Col span={20}>
                                <FormItem label={'资质类型'} {...formItemLayout}>
                                    {getFieldDecorator('licType', {
                                        initialValue: type,
                                        rules:[
                                            {required:true,message:'请选择资质类型'}
                                        ]
                                    })(
                                        <Select
                                            showSearch
                                            placeholder={'请选择'}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                            onChange={this.changeLic}
                                        >
                                            {
                                                factorList.map((item,index)=> <Option key={index} value={item.value}>{item.label}</Option>)
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.changeLicShow=='another'?
                                <Row gutter={30}>
                                    <Col span={20}>
                                        <FormItem label={`其它类型`} {...formItemLayout}>
                                            {getFieldDecorator('licName',{
                                                initialValue: type,
                                                rules:[
                                                    {required:true,message:'请填写类型名称'}
                                                ]
                                            })(
                                                <Input placeholder='类型名称'/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>:null
                        }

                        <Row gutter={30}>
                            <Col span={20}>
                                {productTimes?
                                <FormItem  label={'发证日期'} {...formItemLayout}>
                                    {getFieldDecorator('productTime',{

                                        initialValue: moment(productTimes, 'YYYY-MM-DD'),
                                        rules:[
                                            {required:true,message:'发证日期不能为空'}
                                        ]
                                    })(
                                        <DatePicker format={'YYYY-MM-DD'}/>
                                    )}
                                </FormItem>:
                                    <FormItem  label={'发证日期'} {...formItemLayout}>
                                        {getFieldDecorator('productTime',{
                                            rules:[
                                                {required:true,message:'发证日期不能为空'}
                                            ]
                                        })(
                                            <DatePicker format={'YYYY-MM-DD'}/>
                                        )}
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={20}>
                                {validEndDate?

                                <FormItem  label={'有效期至'} {...formItemLayout}>
                                    {getFieldDecorator('validEndDate',{
                                        initialValue: moment(validEndDates, 'YYYY-MM-DD'),
                                        rules:[

                                            {required:true,message:'有效期不能为空'}
                                        ]
                                    })(
                                        <DatePicker format={'YYYY-MM-DD'}/>
                                    )}
                                </FormItem>:
                                    <FormItem  label={'有效期至'} {...formItemLayout}>
                                        {getFieldDecorator('validEndDate',{
                                            rules:[

                                                {required:true,message:'有效期不能为空'}
                                            ]
                                        })(
                                            <DatePicker format={'YYYY-MM-DD'}/>
                                        )}
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={20}>
                                <FormItem label={`证件编号`} {...formItemLayout}>
                                    {getFieldDecorator('licCode',{
                                        initialValue: licCode,
                                        rules:[
                                            {required:true,message:'证件编号不能为空'}
                                        ]
                                    })(
                                        <Input placeholder='证件编号'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <FormItem>
                        {getFieldDecorator('pictcontents',{
                            initialValue: ''
                        })(
                            <UploadPic  length={3} list={this.state.fileList} setList={this.setFileList}/>
                        )}
                    </FormItem>
                </Form>

            </div>

        </Modal>
    </span>
    )
  }
}
export default connect(state => state)(Form.create()(AddRefund));