import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

const DefaultLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default DefaultLayout