import React from 'react'

interface FormHeaderProps {
  title: string
}

export default function FormHeader ({ title }: FormHeaderProps): JSX.Element {
  return (
    <div className="form__header">
      <div className="form__header__logo"></div>
      <div className="form__header__title">{title}</div>
    </div>
  )
}
