import React from 'react';
import {Select, Spin, message} from 'antd';
// import querystring from 'querystring';
import request from '../../utils/request';
import {debounce} from 'lodash';
const Option = Select.Option;
// let timeout;
// let currentValue;

// function fake(value, callback, url, query, parmas) {
  
//   if (timeout) {
//     clearTimeout(timeout);
//     timeout = null;
//   }
//   currentValue = value;
//    fetch(url + '?searchName=' + value + '&' + querystring.stringify(query), {
//         method: 'get',
//         mode:'cors',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//     })
//     .then(response => {
//       return response.json();
//     })
//     .then(d => {
//         if (currentValue === value) {
//           let result = d;
//           const data = [];
//           if(parmas){
//             result.forEach((r) => {
//               data.push({
//                 value: r.value.toString(),
//                 text: r.text,
//                 [parmas]: r[parmas]
//               });
//             });
//           }else{
//             result.forEach((r) => {
//               data.push({
//                 value: r.value.toString(),
//                 text: r.text
//               });
//             });
//           }
//           callback(data);   
//         }
//     })
//     .catch(e => console.log("Oops, error", e))

// }




class FetchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      value: undefined,
      isPropsValue: false,  //判断是否用propsValue
        marginB:false
    };
    this.handleChange = debounce(this.handleChange, 800);
  }
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.value !== undefined && !this.state.isPropsValue) {
      this.setState({
        isPropsValue: true
      });
    };
  }
  getValues = (value,option) => {
    this.setState({
      value
    });
    let {cb} = this.props;
    if(typeof cb === 'function') {
      cb && cb(value,option);
    }
  }
  handleChange = (value) => {
    if(value === '') return;
    // fake(value, data => this.setState({ data }), this.props.url, this.props.query,this.props.parmas);
    this.setState({ data: [], fetching: true });
    let body;
    console.log(this.props.type );
    if(this.props.queryKey) {
      body = {
        [this.props.queryKey]: value 
      };
    }else {
      body = {
        paramName: value,
        queryType: 3
      }
    } 
    request(this.props.url, {
      method: this.props.method || 'POST',
      type: this.props.type || 'formData',
      body
    })
    .then((data)=>{
      if(data.code === 200 && data.msg === 'success') {
        this.setState({
          data: data.data,
          fetching: false
        });
      }else {
        message.error(data.msg);
      }
    })
  }
  listRender = () => {
    let {data} = this.state;
    let {valueAndLabel} = this.props;
    if(valueAndLabel) {
      let {value, label} = valueAndLabel;
      return data.map((item, i) => {
        return <Option key={i} value={item[value]}>{item[label]}</Option>
      })
    }else {
      return data.map(item=>{
        return <Option key={item.bigDrugCode} value={item.bigDrugCode}>{item.ctmmParam}</Option>
      })
    }
  }
    handleFocus=()=>{
        this.setState({
            marginB: true
        })
    }
    handleBlur=()=>{
        this.setState({
            marginB: false
        })
    }
  render() {
    let {fetching, value, isPropsValue,marginB} = this.state;
    let realValue = isPropsValue ? this.props.value : value;
    return (
      <Select
       className={marginB?'margin-pub':null}
        showSearch
        defaultValue={this.props.defaultValue}
        onSearch={this.handleChange}
        value={realValue}
        onChange={this.props.onChange || this.getValues}
        notFoundContent={fetching ? <Spin size="small" /> : "暂无搜索结果"}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        allowClear={this.props.allowClear}
        filterOption={false}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
      >
        {this.listRender()}
      </Select>
    );
  }
}

export default FetchSelect;