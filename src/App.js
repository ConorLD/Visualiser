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
      showing: true,
      backgroundColor: '#363537',
      textColor: "#fffafa",
      values: "",
      yvalues: ""
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
          var parsedData = ParseData(results.data)
          this.setInfo(results.data[0], results.data[1], results.data[2], parsedData[5], parsedData[0])
          this.getChartData(parsedData[0], parsedData[1], parsedData[2], parsedData[3], parsedData[4],counter-2)
        }

        counter = counter + 1

      }});

  }

  setInfo(name, weight, penalty, values, datalength)
  {
    this.setState({
      name: [...this.state.name, name],
      weight: [...this.state.weight, weight],
      normalPenalty: [...this.state.normalPenalty, (Math.round(penalty*100)/100).toFixed(2)],
      mulPenalty: [...this.state.mulPenalty, parseFloat(penalty)*parseFloat(weight)],
      values: values + ":" + (datalength[datalength.length-1][0]) + ":1",
      yvalues: "0:" + (datalength[datalength.length-1][1]) + ":1"
    })
  }

  getChartData(barData, lineData, labelData, errorData, compareLineErr, index)
  {
    console.log(this.state.yvalues)
    this.setState({
      graphset: [...this.state.graphset, {
          type: "mixed", 
          title: {
            text: this.state.name[index] + "    ペナルティ x  重み = " ,
            color: this.state.textColor,
            fontSize: "12px",
          },

          subtitle: {
            text: this.state.normalPenalty[index] + " x " + this.state.weight[index] + " = " + (this.state.normalPenalty[index]*this.state.weight[index]),
            color: this.state.textColor,
            fontSize: "13px",
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
            values: this.state.yvalues,
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
              }
            },
            {
              type: "line",
              lineColor: "#ff6666",
              lineWidth: 4,
              values: errorData,
              "data-series" : compareLineErr,
              marker: {
                type: "triangle",
                backgroundColor: "#00cc00",
                'border-color': "#00cc00",
                size: "5",
                visible: true,
                rules: [
                  {
                  rule: "%v > %data-series",
                  visible: true,
                  backgroundColor: "#ff6666",
                  'border-color': "#ff6666",
                  angle: 180,
                  },
                  {
                    rule: "%vv %1 == 0",
                    visible: false
                  }]
              },     
             
                rules: [{
                    rule: "%v <= %data-series",
                    lineColor: "#00cc00",
                }
              ],
                 
                animation: {
                effect: 1,
                method: 0,
              },
                  
            }
          ]
        }]
    })

    this.setState({
      penalty: this.state.mulPenalty,
    })
    this.getTotalPenalty()

    if ((index+1) %3 === 0)
    {
      this.updateData();
      this.setState({
        graphset: []
      })
    }

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

  updateData() {
    
    this.setState({
      chartData: {
        layout: "horizontal",
        graphset: this.state.graphset
      },
    }, ()=> console.log(this.state.chartData))

    if (this.state.graphset.length)
    {
      this.setState({
        charts: [...this.state.charts, <ZChart chartData={this.state.chartData}></ZChart>]
      })
    }
  }

 
  render(){
    return (
      <div className="App">
        <div className="FileReader">
        <div className="Darkmode">
          <ThemeToggle handler = {this.handler}></ThemeToggle>
        </div>
            <p>日時 = {this.state.date}</p>
        </div>
        <div className="Text">
          <h1>全体のペナルティ = <strong>{this.state.sumofpenalty.toFixed(3)}</strong></h1>
          <div className="RadioButton">
            <p>重みをかける前<input type="radio" name="test" onClick={this.normalWeight} defaultChecked></input></p>
            <p>重みをかけた後<input type="radio" name="test" onClick={this.multiplyWeight}></input></p>
        </div>
        </div>
          <div className="Chart" style={{backgroundColor: `${this.state.backgroundColor}`}}>
            {this.state.charts}
          </div>
          <div className="DropFile">
            {
              this.state.showing 
              ?  <Dropzone handleChange2={this.handleChange}></Dropzone>
              : null
            }
        </div>
        <p><input type ="checkbox" onClick={() => { this.setState({showing: !this.state.showing})}} defaultChecked></input></p>
      </div>
      
    );
  }
}

export default App;