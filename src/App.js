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
      backgroundColor: '#fff',
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
        backgroundColor: '#fff'
      })
    }

    else
    {
      this.setState({
        backgroundColor: '#363537'
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

        if (counter >= 2)
        {
          var parsedData = ParseData(results.data)
          this.setInfo(results.data[0], results.data[1], results.data[2])
          this.getChartData(parsedData[0], parsedData[1], parsedData[2], parsedData[3], counter-2)
        }

        counter = counter + 1

      }});

  }

  setInfo(name, weight, penalty)
  {
    this.setState({
      name: [...this.state.name, name],
      weight: [...this.state.weight, weight],
      normalPenalty: [...this.state.normalPenalty, penalty],
      mulPenalty: [...this.state.mulPenalty, parseFloat(penalty)*parseFloat(weight)],
    })
  }

  getChartData(barData, lineData, labelData, errorData, index)
  {

    this.setState({
      graphset: [...this.state.graphset, {
          type: "mixed", // 1. Specify your mixed chart type.
          title: {
            text: this.state.name[index] + " のペナルティ = " + this.state.normalPenalty[index] + " 重み = " + this.state.weight[index],
            fontSize: "12px"
          },
          'scroll-x': {

          },
          'scroll-y': {

          },
          backgroundColor: this.state.backgroundColor,
          plot: {
            tooltip: {
              text: "%t"
            }
          },
          scaleX: {
            itemsOverlap: true,
            values: this.state.values,
            zooming: true,
          },
          scaleY: {
            zooming: true,
          },
        
          series: [ // 2. Specify the chart type for each series object.
            {
              type: 'line',
              lineColor: "#FFE4B5",
              lineWidth: 2,
              values: barData,
              aspect: "stepped",
              marker: {
                visible: false
              },
              errors: errorData,
              error: {
                size: "7px",
                  rules: [
                      {
                        rule: "%v == [null,%v]",
                        'line-color': "green"
                      }
                    ],
            
                'line-color': "#cc0000",
                'line-width':2,
                alpha:0.7
              },
              text: "Some Info" 
            },
            {
              type: "line",
              lineColor: "blue",
              lineWidth: 2,
              values: lineData,
              text: "Other Info",
              marker: {
                visible: false
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
        graphset: this.state.graphset
      },
    })

    this.setState({
      charts: <ZChart chartData={this.state.chartData}></ZChart>  
    })
  }

  render(){
    return (
      <div className="App">
       
        <div className="FileReader">
        <div className="darkmode">
          <ThemeToggle handler = {this.handler}></ThemeToggle>
        </div>
          <h2>Import TSV or CSV File</h2>
          <Dropzone handleChange2={this.handleChange}></Dropzone>
          <p></p>
          
        </div>
        <div className="Text">
          <h1>全体のペナルティ = {this.state.sumofpenalty} &emsp; 日時 = {this.state.date}</h1>
          <div className="RadioButton">
            <p>重みをかける前<input type="radio" name="test" onClick={this.normalWeight} defaultChecked></input></p>
            <p>重みをかけた後<input type="radio" name="test" onClick={this.multiplyWeight}></input></p>
        </div>
        </div>
          <div className="Chart">
            {this.state.charts}
          </div>
      </div>
      
    );
  }
}

export default App;