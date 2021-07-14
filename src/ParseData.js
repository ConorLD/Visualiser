function ParseData(data)  
{
  var intercept = parseFloat(data[3])
  var slope = parseFloat(data[4])
  var checkNum = data[5] 
  var loopBarData = []
  var labelsData = []
  var lineData = []
  var errorData = []
  var y 
  var x 
  var temp = 0
  var compareLineErr = []
  var counter = 0

  console.log(checkNum)
  if (checkNum < 0)
  {
    counter = parseInt(checkNum)
    temp = temp + 1
    for (var i = checkNum; i < 0; i++)
    {
      loopBarData.push([counter,temp])
      labelsData.push(i)
      lineData.push(null)
      counter++
    }
  }

  else
  {
    checkNum = 0 // hard fix for when data[5] is not definied
  }

  console.log(loopBarData)
  for (x = 6; x < data.length; x++)
  {
    if (parseInt(data[x]) === 1)
    {
      loopBarData.push([counter,temp])  
      temp = temp + 1
    }

    var before = y
    loopBarData.push([counter,temp])
    labelsData.push(data[x])
    y = slope*(x-6) + intercept
    y = y.toFixed(2)
    lineData.push(parseFloat(y))

    errorData.push(null)

    if (temp > parseFloat(y))
    {
      errorData.push([counter,(parseFloat(y))],[counter,temp])
      compareLineErr.push(before,before,before)

    }
    else
    {
      errorData.push([counter,temp],[counter,(parseFloat(y))])
      compareLineErr.push(y,y,y)

    }

    counter++
  }

    return [loopBarData, lineData, labelsData, errorData, compareLineErr, checkNum]
}

export default ParseData;