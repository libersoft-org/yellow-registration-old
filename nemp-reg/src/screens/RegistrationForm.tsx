import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import CountryCodesSelect from '../components/CountryCodesSelect'
import FormHeader from '../components/FormHeader'
import FormError from '../components/FormError'
import 'react-datepicker/dist/react-datepicker.css'

export default function RegistrationForm (): JSX.Element {
  const [startDate, setStartDate] = useState<Date | null>(new Date())

  return (
    <div className="registration__step-1">
    <div className="form">
      <FormHeader title='Create your free NEMP account' />

      <FormError errors={[]} />

      <div className="form__item">
        <input className="size-2 mr" type="text" id="username" name="user-name" placeholder="User name" required />
        <select className="size-1" id="domain" name="domain" required>
          <option defaultValue="" disabled>Domain</option>
          <option value="nemp.io">@nemp.io</option>
        </select>
      </div>

      <div className="form__item">
        <input type="text" name="first-name" id="firstname" placeholder="First name" required />
      </div>

      <div className="form__item">
        <input type="text" name="last-name" id="lastname" placeholder="Last name" required />
      </div>
      <div className="form__item">
        <select name="gender" id="gender" required>
          <option defaultValue="" disabled>Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div className="form__item">
        <label className="form__item__label size-1" htmlFor="birth-date" >Birth date</label>
        <DatePicker
          showIcon
          className="size-2"
          name="birth-date"
          selected={startDate}
          onChange={(date) => { setStartDate(date) } }
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>
      <div className="form__item">
        <CountryCodesSelect />
        <input className="size-2" type="tel" name="phone" id="phone" pattern="\d{1,14}" placeholder="Phone number" required />
      </div>
      <div><input type="password" id="password" name="password" placeholder="Password" required /></div>
      <div><input type="password" id="confirmpassword" name="confirm-password" placeholder="Password again" required /></div>
      <div>
        <div className="button large" onClick={() => {}}>Continue</div>
      </div>
    </div>
  </div>
  )
}
