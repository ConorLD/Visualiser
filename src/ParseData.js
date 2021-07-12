function ParseData(data)  
{
  var intercept = parseFloat(data[3])
  var slope = parseFloat(data[4])
  var checkNum = parseInt(data[5]) 
  var loopBarData = []
  var labelsData = []
  var lineData = []
  var y 
  var x 
  var temp = 0
  var temp2 = 0
  
  if (checkNum < 0)
  {
    temp = temp + 1
    for (var i = checkNum; i < 0; i++)
    {
      loopBarData.push(temp)
      labelsData.push(i)
      lineData.push(0)
    }
  }

  for (x = 6; x < data.length; x++)
  {
    if (parseInt(data[x]) === 1)
    {
      temp = temp + 1
    }

    loopBarData.push(temp)
    labelsData.push(data[x])
    y = slope*(x-6) + intercept
    y = y.toFixed(2)
    lineData.push(parseFloat(y))
  }

    return [loopBarData, lineData, labelsData]
}

export default ParseData;