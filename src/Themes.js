import { createGlobalStyle } from "styled-components"

export const lightTheme = {
    body: '#fff',
    fontColor: '#363537'
}

export const darkTheme = {
    body: '#363537',
    fontColor: '#FAFAFA'
}

export const GlobalStyles = createGlobalStyle`

    body    {
        background: ${props => props.theme.body};
        color: ${props => props.theme.fontColor};
    }

`