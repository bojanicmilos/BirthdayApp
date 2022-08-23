import React, { useState, useEffect, useCallback } from 'react'
import { url } from '../../apiInfo/Url'
import Table from 'react-bootstrap/Table'
import moment from 'moment'
import Pagination from '../pagination/Pagination'

const UsersWithUpcomingBirthdays = () => {

    const [users, setUsers] = useState([])
    const [numOfPages, setNumOfPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const getUsersWithFutureBirthdays = async (pageNumber = 1) => {
        const response = await fetch(`${url}/api/users/upcomingbirthdays?page=${pageNumber}`)
        const json = await response.json()
        setNumOfPages(json.numOfPages)
        setCurrentPage(pageNumber)
        setUsers(json.paginatedResults)
    }

    useEffect(() => {
        getUsersWithFutureBirthdays()
    }, [])

    const showUsers = () => {
        return users.map((user) => {
            return (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{moment(user.birthDate).format('LL')}
                        <button className='btn btn-primary' style={{ float: 'right' }}>Start Birthday Event</button>
                    </td>
                </tr>
            )
        })
    }


    return (
        <div className='table-pagination'>
            <Table style={{ tableLayout: 'fixed' }} striped bordered hover variant='light'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birth date</th>
                    </tr>
                </thead>
                <tbody>{showUsers()}</tbody>
            </Table>
            <Pagination
                searchPaginatedData={getUsersWithFutureBirthdays}
                numOfPages={numOfPages}
                currentPage={currentPage}
            />
        </div>
    )
}

export default UsersWithUpcomingBirthdays