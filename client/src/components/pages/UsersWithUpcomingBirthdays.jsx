import React, { useState, useEffect, useCallback } from 'react'
import { url } from '../../apiInfo/Url'
import Table from 'react-bootstrap/Table'
import moment from 'moment'

const UsersWithUpcomingBirthdays = () => {

    const [users, setUsers] = useState([])
    const [pageNumber, setPageNumber] = useState(1)

    const getUsersWithFutureBirthdays = useCallback(async () => {
        const response = await fetch(`${url}/api/users/upcomingbirthdays?page=${pageNumber}`)
        const json = await response.json()
        setUsers(json.paginatedResults)

    }, [pageNumber])

    useEffect(() => {
        getUsersWithFutureBirthdays()
    }, [getUsersWithFutureBirthdays])

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
        <div>
            <Table striped bordered hover variant='light'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birth date</th>
                    </tr>
                </thead>
                <tbody>{showUsers()}</tbody>
            </Table>
        </div>
    )
}

export default UsersWithUpcomingBirthdays