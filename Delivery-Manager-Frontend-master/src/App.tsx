import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
// import { useEffect } from 'react'
// import OneSignal from 'react-onesignal';

import { Router } from './Router'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import { DeliveryContextProvider } from './context/DeliveryContext'

function App() {

  // useEffect(() => {
  //   OneSignal.init({ appId: 'b0d375dc-8f89-4bee-ac54-0a04fef00ebc' }).then(() => {
  //     OneSignal.Slidedown.promptPush();
  //   })
  // })

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <BrowserRouter>
        <DeliveryContextProvider>
          <Router />
        </DeliveryContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
