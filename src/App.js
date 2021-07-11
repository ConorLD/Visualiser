import React, {Component} from 'react'
import './App.css';
import Chart from './components/Chart'
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
      csvfile: {},
      date: "",
      name: [],
      weight: [],
      penalty: [],
      sumofpenalty: 0,
      charts: [],
      flag: false,
      backgroundColor: '#fff'
    }
    this.updateData = this.updateData.bind(this);
    this.handler = this.handler.bind(this);
  }

  componentDidMount() 
  {
    this.importCSVLocal()
    this.getTotalPenalty()

  }

  handler() {
    this.setState({
      flag: !this.state.flag
    })

    if (this.state.flag)
    {
      this.setState({
        backgroundColor: '#363537'
      })
    }

    else
    {

      this.setState({
        backgroundColor: '#fff'
      })
    }

    console.log(this.state.backgroundColor)
  }  
  
  importCSVLocal()
  {
    var counter = 0
    Papa.parse(tsvData, {
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
          this.setInfo(results.data[0], results.data[1], results.data[2])
          var parsedData = ParseData(results.data)
          this.getChartData(parsedData[0], parsedData[1], parsedData[2], counter-2)
          this.getTotalPenalty()

        }

        counter = counter + 1

      }});

  }

  setInfo(name, weight, penalty)
  {
    this.setState({
      name: [...this.state.name, name],
      weight: [...this.state.weight, weight],
      penalty: [...this.state.penalty, penalty],
      //sumofpenalty: sumofpenalty + parseFloat(results.data[2])
    })
  }

  getChartData(barData, lineData, labelData, index)
  {

    this.setState({
      chartData: {
        type: "mixed", // 1. Specify your mixed chart type.
        plot: {
          tooltip: {
            text: "%t"
          }
        },
        scaleX: {
          labels: labelData,
          itemsOverlap: true
        },
       
        series: [ // 2. Specify the chart type for each series object.
          {
            type: 'bar',
            values: barData,
            aspect: "histogram",
            text: "Bar Chart"
          },
          {
            type: "line",
            values: lineData,
            text: "Line Chart"
          }
        ]
      }
    })

    this.setState({
      charts: [... this.state.charts, <p>{this.state.name[index]}のペナルティ = {this.state.penalty[index]}</p>, <p>{this.state.name[index]}の重み = {this.state.weight[index]}</p>, <ZChart chartData={this.state.chartData}/>]
    })

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

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: false,
      skipEmptyLines: true
    });
  };

  updateData(result) {
    var data = result.data
    console.log(data)
  }

  render(){
    return (
      <div className="App">
        <div className="darkmode">
          <ThemeToggle handler = {this.handler}></ThemeToggle>
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