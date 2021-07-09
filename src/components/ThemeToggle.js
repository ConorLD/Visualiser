import React, {useState} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import {lightTheme, darkTheme, GlobalStyles} from './../Themes.js'
import Switch from './Switch.js'

const StyledApp = styled.div``;

function ThemeToggle()  {
    const [theme, setTheme] = useState("light")

    const [isToggled, setIsToggled] = useState(false)

    const themeToggler = () =>  {
        theme === "light" ? setTheme("dark") : setTheme("light") 
    }

    return (
    <ThemeProvider theme={isToggled === false ? lightTheme : darkTheme}>
        <GlobalStyles/>
        <StyledApp><Switch isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)}></Switch><p>Darkmode</p></StyledApp>
    </ThemeProvider>
    
    );
}

export default ThemeToggle;