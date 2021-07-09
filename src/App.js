import React, {Component} from 'react'
import './App.css';
import Chart from './components/Chart'
import ThemeToggle from './components/ThemeToggle'
import Dropzone from './components/MyDropzone'
import Papa from 'papaparse'
import ParseData from './ParseData.js'
import tsvData from './tsv/leveling_penalty.tsv'

class App extends Component
{
  constructor()
  {
    super();
    this.state = {
      chartData: {},
      csvfile: {},
      date: "",
      name: "",
      weight: "",
      sumofpenalty: "",
      penalty: [],
      charts: [],
      flag: true
    }
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() 
  {
    Papa.parse(tsvData, {
      complete: this.updateData,
      download: true,
      header: true,
      skipEmptyLines: true
    });
  }

  /*
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
  */

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
      download: true,
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

          var penalty

          if (this.state.flag === false)
          {
            penalty = parseFloat(e.ペナルティ)
          }
          else 
          {
            penalty = parseFloat(e.ペナルティ) * parseFloat(e.重み)
          }

          this.setState({
            charts: [... this.state.charts, <p>{e.仕様の表示名}のペナルティ = {penalty}</p>, <p>{e.仕様の表示名}の重み = {e.重み}</p>, <Chart text={this.state.sequence} chartData={this.state.chartData}/>]
          })

          allpenalty = allpenalty + penalty

        }
    })

    this.setState({
      sumofpenalty: "全体のペナルティ = " + allpenalty
    })

  }

  render(){
    return (
      <div className="App">
        <div className="darkmode">
          <ThemeToggle></ThemeToggle>
        </div>
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
        <div className="Text">
          <h1>{this.state.sumofpenalty}</h1>
          <h2>{this.state.date}</h2>
        </div>
        <div className="RadioButton">
          <p>重みをかける前<input type="radio" name="test"></input></p>
          <p>重みをかけた後<input type="radio" name="test"></input></p>
        </div>
          <div className="Chart">
            {this.state.charts}
          </div>
      </div>
      
    );
  }
}

export default App;