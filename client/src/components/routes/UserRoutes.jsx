import React from 'react'
import {
    Route,
    Navigate,
    Routes
} from 'react-router-dom'
import DefaultLayout from '../layouts/DefaultLayout'
import BirthdayEvents from '../pages/BirthdayEvents'
import MyWishList from '../pages/MyWishList'
import UsersWithUpcomingBirthdays from '../pages/UsersWithUpcomingBirthdays'

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path='/users' element={<UsersWithUpcomingBirthdays />} />
                <Route path='/birthdayevents' element={<BirthdayEvents />} />
                <Route path='/mywishlist' element={<MyWishList />} />
                <Route path="/*" element={<Navigate replace to="/users" />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes