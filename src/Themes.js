import { createGlobalStyle } from "styled-components"

export const lightTheme = {
    body: '#FAFAFA',
    fontColor: '#363537'
}

export const darkTheme = {
    body: '#242624',
    fontColor: '#FAFAFA'
}

export const GlobalStyles = createGlobalStyle`

    body    {
        background: ${props => props.theme.body};
        color: ${props => props.theme.fontColor};
    }

`