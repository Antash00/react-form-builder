import { createTheme } from '@mui/material/styles'

export function playgroundTheme(dark: boolean) {
    return createTheme({
        palette: {
            mode: dark ? 'dark' : 'light',
            primary: { main: dark ? '#64d6ac' : '#08765d' },
            text: {
                primary: dark ? '#edf4f0' : '#202825',
                secondary: dark ? '#adbdb4' : '#55655d',
            },
            success: { main: dark ? '#64d6ac' : '#08765d' },
            background: {
                default: dark ? '#111715' : '#f8faf9',
                paper: dark ? '#1b2320' : '#ffffff',
            },
        },
        typography: {
            fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 4 },
        components: {
            MuiButton: { defaultProps: { disableElevation: true } },
            MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
            MuiFormControl: { defaultProps: { fullWidth: true, size: 'small' } },
        },
    })
}
