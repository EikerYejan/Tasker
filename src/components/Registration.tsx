import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Connected } from '@types'
import { saveUser } from '../redux/actions'
import Button from './Button'
import '../assets/styles/components/Registration.scss'

type Props = {
  save: (name: string) => void
}

type OnChange = (e: React.ChangeEvent<HTMLInputElement>) => void
type HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => void

const Registration: React.FC<Props> = ({ save }) => {
  /* Name ref */
  const [name, setName] = useState('')

  /* Handle change */
  const onChange: OnChange = (e) => setName(e.currentTarget.value)

  /* Handle submit */
  const handleSubmit: HandleSubmit = (e) => {
    e.preventDefault()

    // Dispatch function
    save(name)
  }

  return (
    <div className="column is-flex is-12 registration-form">
      <form onSubmit={handleSubmit}>
        <h2>Let me know your name.</h2>
        <input
          onChange={onChange}
          type="text"
          placeholder="Your name"
          required
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}

const connected: Connected = connect(null, { save: saveUser })(Registration)

export default connected
