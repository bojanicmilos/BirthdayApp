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
import Items from '../pages/Items'
import BirthdayMessages from '../pages/BirthdayMessages'
import moment from 'moment'
import { getCurrentDate } from '../datefunctions/getCurrentDate'

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route path='/users' element={<UsersWithUpcomingBirthdays />} />
                <Route path='/birthdayevents' element={<BirthdayEvents />} />
                <Route path='/mywishlist' element={<MyWishList />} />
                <Route path='/items' element={<Items />} />
                {moment(localStorage.getItem('birthDate')).set('year', moment().year()).startOf('day').isSame(getCurrentDate()) && <Route path='/birthdaymessages' element={<BirthdayMessages />} />}
                <Route path="/*" element={<Navigate replace to="/users" />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes