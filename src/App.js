import React, {Component} from 'react'
import './App.css';
import ThemeToggle from './components/ThemeToggle'
import Dropzone from './components/MyDropzone'
import Papa from 'papaparse'
import ParseData from './ParseData'
import tsvData from './tsv/leveling_penalty.tsv'
import ZChart from './components/ZChart';

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      chartData: {},
      graphset: [],
      csvfile: tsvData,
      date: "",
      name: [],
      weight: [],
      penalty: [],
      normalPenalty: [],
      mulPenalty: [],
      barData: [],
      lineData: [],
      errorData: [],
      sumofpenalty: 0,
      charts: [],
      flag: false,
      backgroundColor: '#363537',
      textColor: "#fffafa",
      values: "0:50:1"
    }
    this.updateData = this.updateData.bind(this);
    this.handler = this.handler.bind(this);
    this.multiplyWeight = this.multiplyWeight.bind(this);
    this.normalWeight = this.normalWeight.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() 
  {
    this.importCSV()
  }

  handler() {
    this.setState({
      flag: !this.state.flag
    })

    if (this.state.flag)
    {
      this.setState({
        backgroundColor: '#363537',
        textColor: '#fffafa'
      })
    }

    else
    {
      this.setState({
        backgroundColor: '#fffafa',
        textColor: '#363537'
      })
    }

    this.importCSV()
  }  
  
  importCSV()
  {
    this.setState({
      charts: [],
      graphset: [],
      name: [],
      weight: [],
      penalty: [],
      mulPenalty:[],
      normalPenalty:[]
    })

    var counter = 0
    var datalength
    Papa.parse(this.state.csvfile, {
      complete: this.updateData,
      download: true,
      header: false,
      skipEmptyLines: true,
      step: (results, parser) => {

        if (counter === 0)
        {
          this.setState({
            date: results.data
          })
        }

        if (counter === 1)
        {
            datalength = results.data[results.data.length-1]
        }

        if (counter >= 2)
        {
          console.log(results)
          var parsedData = ParseData(results.data)
          this.setInfo(results.data[0], results.data[1], results.data[2], parsedData[5], datalength)
          this.getChartData(parsedData[0], parsedData[1], parsedData[2], parsedData[3], parsedData[4],counter-2)
        }

        counter = counter + 1

      }});

  }

  setInfo(name, weight, penalty, values,datalength)
  {
    this.setState({
      name: [...this.state.name, name],
      weight: [...this.state.weight, weight],
      normalPenalty: [...this.state.normalPenalty, (Math.round(penalty*100)/100).toFixed(2)],
      mulPenalty: [...this.state.mulPenalty, parseFloat(penalty)*parseFloat(weight)],
      values: values + ":" + datalength  + ":1"
    })
  }

  getChartData(barData, lineData, labelData, errorData, compareLineErr, index)
  {
    console.log(lineData,errorData)
    this.setState({
      graphset: [...this.state.graphset, {
          type: "mixed", 
          title: {
            text: this.state.name[index] + "    ペナルティ x  重み = " + (this.state.normalPenalty[index]*this.state.weight[index]),
            color: this.state.textColor,
            fontSize: "14px",
          },
          'scroll-x': {

          },
          'scroll-y': {

          },
          backgroundColor: this.state.backgroundColor,
          plot: {
            tooltip: {
              text: "%v",
            }
          },
          scaleX: {
            lineColor: this.state.textColor,
            lineWidth: 2,
            values: this.state.values,
            zooming: true,
            item: {
              'font-color': this.state.textColor,
              "text-align": "right"
            },
            tick: {
              'line-color': this.state.textColor,
            },
            guide: {
              'line-width':2,
              'line-style': "solid", //"solid", "dotted", "dashed", "dashdot"
              'line-color': "#808080",
              alpha: 0.4,
              visible: true
            },
            
          },
          scaleY: {
            lineColor: this.state.textColor,
            lineWidth: 2,
            item: {
              'font-color': this.state.textColor,
            },
            tick: {
              'line-color': this.state.textColor,
            },
            zooming: true,
            guide: {
              'line-width':2,
              'line-style': "solid", //"solid", "dotted", "dashed", "dashdot"
              'line-color': "#808080",
              alpha: 0.4,
              visible: true,
              itemsOverlap: true
            }
          },
        
          series: [ // 2. Specify the chart type for each series object.
            {
              type: 'line',
              values: barData,
              lineColor: "#66b2ff",
              lineWidth: 2,
              marker: {
                visible: false,
              },
              text: "" ,
              animation: {
                effect: 1,
                method: 0,
                sequence: 1
              }
            },
            {
              type: "line",
              lineColor: this.state.textColor,
              lineWidth: 1,
              values: lineData,
              text: "",
              marker: {
                visible: false
              },
              animation: {
                effect: 1,
                method: 0,
                sequence: 1
              }
            },
            {
              type: "line",
              lineColor: "#ff6666",
              lineWidth: 4,
              values: errorData,
              "data-series" : compareLineErr,
              marker: {
                visible: false
              },     
             
                rules: [{
                    rule: "%v <= %data-series",
                    lineColor: "#00cc00"
                }],
                  tooltip: {
                    "text": "%v, data = %data-series"
                  },
                   animation: {
                    effect: 1,
                    method: 0,
                    sequence: 1 ,
                 }
              
                  
            }
          ]
        }]
    })

    this.setState({
      penalty: this.state.normalPenalty,
    })
    this.getTotalPenalty()

  }

  getTotalPenalty()
  {
    var totalpenalty = 0
    
    for (var i = 0; i < this.state.penalty.length; i++)
    {
      totalpenalty = totalpenalty + parseFloat(this.state.penalty[i])
    }

    this.setState({
      sumofpenalty: totalpenalty
    })
  }

  normalWeight()
  {
    this.setState({
      penalty: this.state.normalPenalty,
    }, () => this.getTotalPenalty());  
  }

  multiplyWeight()
  {
    this.setState({
      penalty: this.state.mulPenalty,
    }, () => this.getTotalPenalty());

  }

  handleChange(file) 
  {
    console.log(file)
    this.setState({
      csvfile: file[0]
    })

    this.importCSV()

  };

  updateData(result) {
    var data = result.data
    console.log(data)
    
    this.setState({
      chartData: {
        layout: "horizontal",
        graphset: this.state.graphset
      },
    }, ()=> console.log(this.state.chartData))

    this.setState({
      charts: <ZChart chartData={this.state.chartData}></ZChart>  
    })
  }

 
  render(){
    return (
      <div className="App">
        <div className="FileReader">
        <div>
          <Dropzone handleChange2={this.handleChange}></Dropzone>
        </div>
        <div className="darkmode">
          <ThemeToggle handler = {this.handler}></ThemeToggle>
        </div>
            <p>日時 = {this.state.date}</p>
        </div>
        <div className="Text">
          <h1>          全体のペナルティ = <strong>{this.state.sumofpenalty.toFixed(3)}</strong></h1>
          <div className="RadioButton">
            <p>重みをかける前<input type="radio" name="test" onClick={this.normalWeight} defaultChecked></input></p>
            <p>重みをかけた後<input type="radio" name="test" onClick={this.multiplyWeight}></input></p>
        </div>
        </div>
          <div className="Chart" style={{backgroundColor: `${this.state.backgroundColor}`}}>
            {this.state.charts}
          </div>
      </div>
      
    );
  }
}

export default App;