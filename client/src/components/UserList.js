// The component to display the list of users
import React, { useState } from 'react'

function UserList({ users }) {
    return (
        <div id='userList'>
            {users.map((user, index) => (
                <div key={index}>{user.username}</div>
            ))}
        </div>
    )
}

export default UserList