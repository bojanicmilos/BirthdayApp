import React from 'react'
import {
    Route,
    Navigate,
    Routes,
    BrowserRouter as Router
} from 'react-router-dom'
import Login from '../pages/Login'

const LoginRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Navigate replace to='/login' />} />
            </Routes>
        </Router>
    )
}

export default LoginRoutes