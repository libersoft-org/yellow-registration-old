import React from 'react'
import FormHeader from '../components/FormHeader'

export default function SMSVerification (): JSX.Element {
  return (
    <div className="registration__step-2 registration__step--hidden">
    <div className="form">
      <FormHeader title='Verify your NEPM account' />

      <div id="form-errors-step2" className="form__errors"></div>

      <div className="form__item">
        <label className="form__item__label size-1" htmlFor="sms-code">SMS Code</label>
        <input className="size-2 ta-c" type="text" id="code" name="sms-code" required />
        <input hidden type="text" id="otpid" name="otp-id" value="" required />
      </div>
      <div>
        <div className="button large" onClick={() => {}}>Verify</div>
      </div>
    </div>
  </div>
  )
}
