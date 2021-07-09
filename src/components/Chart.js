import React, {Component} from 'react';
import {Bar, Line} from 'react-chartjs-2';


class Chart extends Component
{
    constructor(props){
        super(props);
        this.state = {
            chartData: props.chartData
        }
    }

    static defaultProps = {
        display: 'true',
        text: 'default text'
    }

    render(){
        return(
            <div className="chart" >
               <Line
                    data={this.state.chartData}
                    
                    options={{
                        plugins: {
                            title:   {
                            display: this.props.display,
                            text: this.props.text,
                            font:   {
                                size: 26
                            }
                            }
                        },
                        scales: {
                            yAxes: [{
                                display: true,
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }            
                }}
                ></Line>
            </div>
        )
    }
}

export default Chart;

