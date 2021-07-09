import React, {Component} from 'react'
import ReactDOM from "react-dom";
import './App.css';
import jsonData from './data/data.json'
import Chart from './components/Chart'
import ThemeToggle from './components/ThemeToggle'
import Dropzone from './components/MyDropzone'
import Papa from 'papaparse'
import ParseData from './ParseData.js'

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      chartData:{},
      csvfile: {},
      date: "",
      name: "",
      weight: "",
      sumofpenalty: "",
      penalty: [],
      charts: [],
    }
    this.updateData = this.updateData.bind(this);
    this.getChartData = this.getChartData.bind(this);
  }

  getChartData()
  {
    this.setState({
      chartData:
      {
        labels: [0, 1, 2, 3, 4, 5],
        datasets: [
            {
                type: 'bar',
                label: "名無し",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                data: [0, 1, 2, 3, 4, 5],
                borderWidth: 1        
            },
            {
                type: 'line',
                label: "行",
                backgroundColor: "black",
                data: [0.4, 1, 1.6, 2.2, 2.8, 3.4],
                borderWidth: 3
            }
        ]
      }
    })

    this.setState({
      charts: [... this.state.charts, <Chart text="Chart Example" chartData={this.state.chartData}/>]
    })
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
      skipEmptyLines: true
    });
  };

  updateData(result) {
    var data = result.data
    console.log(data)
    
    var collectedData
    var allpenalty = 0

    data.forEach(e => {
        collectedData = ParseData(e)
        if (collectedData != null)
        {
          this.setState({
            chartData:
            {
              labels: collectedData[2],
              datasets: [
                  {
                      type: 'bar',
                      label: "名無し",
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      data: collectedData[0],
                      borderWidth: 1        
                  },
                  {
                      type: 'line',
                      label: "行",
                      backgroundColor: "black",
                      data: collectedData[1],
                      borderWidth: 3
                  }
              ]
            }
          })

          this.setState({
            sequence: collectedData[3],
            date: "時間 = 2021/10/1"
          })

          this.setState({
            charts: [... this.state.charts, <p>{e.仕様の表示名}のペナルティ = {e.ペナルティ}</p>, <p>{e.仕様の表示名}の重み = {e.重み}</p>, <Chart text={this.state.sequence} chartData={this.state.chartData}/>]
          })

          allpenalty = allpenalty + parseFloat(e.ペナルティ)
        }
    })

    this.setState({
      sumofpenalty: "全体のペナルティ = " + allpenalty
    })

  }

  test()  {
    console.log("hello")
  }

  render(){
    return (
      <div className="App">
        <ThemeToggle></ThemeToggle>
        <div className="FileReader">
          <h2>Import TSV File</h2>
          <input
            className="csv-input"
            type="file"
            ref={input => {
              this.filesInput = input;
            }}
            name="file"
            placeholder={null}
            onChange={this.handleChange}
          />
          <p />
          <button onClick={this.importCSV}> Upload </button>
          <h3>... or click <button onClick={this.getChartData}>here</button> for an example</h3>
        </div>
          <h1>{this.state.sumofpenalty}</h1>
          <h1>{this.state.weight}</h1>
          <h1>{this.state.date}</h1>
          <div className="Chart">
            {this.state.charts}
          </div>
      </div>
      
    );
  }
}

export default App;