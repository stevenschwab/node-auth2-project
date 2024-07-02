import React, { useState } from 'react'
import AuthForm from './components/AuthForm'
import UserList from './components/UserList'

function App() {
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const handleResponse = (data) => {
    setMessage(data.message)
    if (data.token) {
      setToken(data.token)
      localStorage.setItem('token', data.token)
    }
  }

  const handleError = (err) => {
    setMessage(err.message)
  }

  const logout = () => {
    if (token) {
      setToken('')
      localStorage.removeItem('token')
      setUsers([])
      setMessage('Bye!')
    } else {
      setMessage('Log in before logging out')
    }
  }

  const getUsers = () => {
    fetch('http://localhost:9000/api/users', {
      headers: token ? { 'Authorization': token } : {}
    })
      .then(res => res.json())
      .then(users => {
        if (Array.isArray(users)) {
          setUsers(users)
        } else {
          setMessage(users.message)
          setUsers([])
        }
      })
      .catch(handleError)
  }

  return (
    <div className='App'>
      <AuthForm onResponse={handleResponse} onError={handleError} />
      <button onClick={logout}>Logout</button>
      <div id='message'>{message}</div>
      <UserList users={users} />
      <button onClick={getUsers}>Get Users</button>
    </div>
  );
}

export default App;
