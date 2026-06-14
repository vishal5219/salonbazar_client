import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './app/store'
import router from './app/routes'
import { GOOGLE_CLIENT_ID } from '@/constants/config'
import './assets/styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function AppShell() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default function App() {
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppShell />
      </GoogleOAuthProvider>
    )
  }
  return <AppShell />
}
