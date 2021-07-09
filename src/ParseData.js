function ParseData(data)  {

    var sequence = []

    for (var key in data)
    {
        if (data.hasOwnProperty(key) && !isNaN(key))
        {
            sequence.push(data[key])
        }
    }

    if (sequence.length === 0)
    {
        console.log("Error")
        return null
    }
    
    var slope = data.slope
    var intercept = parseFloat(data.intercept)
    var sequenceLength = sequence.length
    var loopBarData = []
    var labelsData = []
    var lineData = []
    var y 
    var x 
    var loopData
    var temp = 0

    for (x = 0; x < sequenceLength; x++)
    {
      loopData = sequence[x];
      if (parseInt(loopData) === 1)
      {
        temp = temp + 1;
      }
    
      loopBarData.push(temp);  
      labelsData.push(x);

      y = slope*x + intercept;
      y = y.toFixed(2);
      lineData.push(y);        
    }

    return [loopBarData, lineData, labelsData, sequence.toString().replace(/,/g, ' ')]
}

export default ParseData;