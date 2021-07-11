
function TSVParse(file)
{
    const reader = new FileReader()
    reader.onload = () =>  {
        console.log(reader.result)
    }
    reader.readAsText(file)

}

export default TSVParse;