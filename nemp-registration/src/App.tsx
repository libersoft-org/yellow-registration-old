import React from 'react'
import './style/main.scss'
import RegistrationForm from './screens/RegistrationForm'
import SMSVerification from './screens/SmsVerification'
import Thanks from './screens/Thanks'

function App (): JSX.Element {
  return (
    <div className="registration">
      <RegistrationForm />
      <SMSVerification />
      <Thanks />
    </div>
  )
}

export default App
