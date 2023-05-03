import React from 'react'

interface FormErrorProps {
  errors: string[]
}

export default function FormError ({ errors }: FormErrorProps): JSX.Element {
  return (
    <div id="form-errors-step1" className="form__errors">
      {errors.map((error) => {
        return `${error}\n`
      })}
    </div>
  )
}
