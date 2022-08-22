import React from 'react'
import {
    Route,
    Navigate,
    Routes
} from 'react-router-dom'
import Login from '../pages/Login'

const LoginRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/*' element={<Navigate replace to='/login' />} />
        </Routes>
    )
}

export default LoginRoutes