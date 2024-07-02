// The form for registration and login.
import React, { useState } from 'react'

function AuthForm({ onResponse, onError }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (action) => (e) => {
        e.preventDefault()
        const credentials = { username, password }

        fetch(`http://localhost:9000/api/auth/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
            .then(res => res.json())
            .then(data => {
                onResponse(data)
                if (data.token) {
                    setUsername('')
                    setPassword('')
                }
            })
            .catch(onError)
    }

    return (
        <form>
            <div>
                <input
                    type='type'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleSubmit('register')}>Register</button>
                <button onClick={handleSubmit('login')}>Log in</button>
            </div>
        </form>
    )
}

export default AuthForm