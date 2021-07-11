import React, {Component} from 'react';
import 'zingchart/es6';
import ZingChart from 'zingchart-react';


class ZChart extends Component
{
    constructor(props){
        super(props);
        this.state = {
            chartData: props.chartData
        }
    }

    static defaultProps = {
        backgroundColor: "#fff"
    }

    render() {
        return (
          <div >
            <ZingChart data={this.state.chartData} />
          </div>
        );
    }
}

export default ZChart;