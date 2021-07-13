function ParseData(data)  
{
  var intercept = parseFloat(data[3])
  var slope = parseFloat(data[4])
  var checkNum = parseInt(data[5]) 
  var loopBarData = []
  var labelsData = []
  var lineData = []
  var errorData = []
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
      lineData.push(null)
      errorData.push(null)
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

    if (temp > parseFloat(y))
    {
      errorData.push([null,(temp-parseFloat(y))])
    }
    else
    {
      errorData.push([(parseFloat(y)-temp),null])
    }
  }

    return [loopBarData, lineData, labelsData, errorData]
}

export default ParseData;