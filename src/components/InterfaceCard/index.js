
/**
 * @author QER
 * @date 19/3/26
 * @Description: 接口掉用card
*/
import React, { PureComponent } from 'react';
import { Card,Tag} from 'antd';
import { connect } from 'dva';
class AddRefund extends PureComponent{
    constructor(props){
        super(props)
        this.state={
            countList:[],
        }
    }
    componentDidMount = () =>{
        //汇总list
        this.props.dispatch({
            type: 'base/getLogCountByDate',
            callback: ({data, code, msg}) => {
                if(code === 200) {
                    this.setState({
                        countList: data
                    });
                }
            }
        });

    }
    render(){
        const gridStyle = {
            width: '20%',


        };
        const { countList} = this.state;
        return (
            <Card title="今日调用汇总">
                {
                    countList.map((item,index)=> <Card.Grid style={gridStyle} key={index}>
                        <label className='inter-label'>{item.logTypeExplain}：</label><Tag color="orange">{item.totalCount}次</Tag><br/>
                        <label className='inter-label'>失败：</label><Tag color="red" style={{marginTop:'8px'}}>{item.failCount}次</Tag>
                    </Card.Grid>)
                }


            </Card>
        )
    }
}
export default connect(state => state)(AddRefund);