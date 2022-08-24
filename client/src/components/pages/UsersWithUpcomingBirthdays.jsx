import React, { useState, useEffect, useId } from 'react'
import { url } from '../../apiInfo/Url'
import Table from 'react-bootstrap/Table'
import moment from 'moment'
import Pagination from '../pagination/Pagination'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { NotificationManager } from 'react-notifications'

const UsersWithUpcomingBirthdays = () => {
    const formInputId = useId()

    const [show, setShow] = useState(false);

    const [notes, setNotes] = useState('')
    const [userId, setUserId] = useState('')

    const handleShowModal = (user) => {
        setUserId(user._id)
        setShow(true);
    }

    const handleCloseModal = () => {
        setUserId('')
        setNotes('')
        setShow(false)
    };

    const handleSaveChanges = async () => {
        if (!notes) {
            NotificationManager.warning('Please enter your notes')
            return;
        }

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ birthdayPerson: userId, notes: notes })
        }

        const response = await fetch(`${url}/api/birthdayevents/add`, options)

        if (!response.ok) {
            const text = await response.text()
            NotificationManager.error(text)
        }
        else {
            NotificationManager.success('Birthday event started !')
            setShow(false)
        }
    }

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
                        <button onClick={() => handleShowModal(user)} className='btn btn-primary' style={{ float: 'right' }}>Start Birthday Event</button>
                    </td>
                </tr>
            )
        })
    }


    return (
        <>
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
            <Modal show={show} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Start birthday event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label htmlFor={formInputId}>Notes</Form.Label>
                    <Form.Control
                        type="text"
                        id={formInputId}
                        placeholder='Enter your notes'
                        value={notes}
                        autoComplete="off"
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Start birthday event
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UsersWithUpcomingBirthdays