import React, {useState} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import {lightTheme, darkTheme, GlobalStyles} from './../Themes.js'
import Switch from './Switch.js'

const StyledApp = styled.div``;

function ThemeToggle({handler})  
{

    const [isToggled, setIsToggled] = useState(true)

    return (
    <ThemeProvider theme={isToggled === false ? lightTheme : darkTheme}>
        <GlobalStyles/>
        <StyledApp><Switch isToggled={isToggled} onToggle={() => {setIsToggled(!isToggled); {handler()}}}></Switch></StyledApp>
    </ThemeProvider>    
    );
}

export default ThemeToggle;