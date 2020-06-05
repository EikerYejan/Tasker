import React, { useState } from "react"
import Button from "./Button"
import "../assets/styles/components/Form.scss"

type HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void
type HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => void

const Form: React.FC = () => {
  /* State */
  const [data, setData] = useState({})

  /**
   * Handle form change
   * @param e
   */
  const handleChange: HandleChange = (e) => {
    const { name, value } = e.currentTarget

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  /**
   * Handle form submit
   * @param e
   */
  const handleSubmit: HandleSubmit = (e) => {
    e.preventDefault()

    console.log(data)
  }

  /**
   * Spread input props
   */
  const inputProps = (
    name: string,
    placeholder: string,
    required = false,
    className?: string
  ): Record<string, unknown> => ({
    name,
    placeholder,
    required,
    type: "text",
    className: `form-input ${required ? "is-required" : ""} ${className}`,
    onChange: handleChange,
  })

  return (
    <div className="column is-5 add-form">
      <h2>Add a new item.</h2>
      <form onSubmit={handleSubmit}>
        <input {...inputProps("title", "Item title", true)} />
        <textarea
          {...inputProps(
            "description",
            "Item description",
            false,
            "description"
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}

export default Form
