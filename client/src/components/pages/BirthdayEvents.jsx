import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { url } from '../../apiInfo/Url'
import Table from 'react-bootstrap/Table'
import Pagination from '../pagination/Pagination'
import moment from 'moment'
import { getCurrentDate } from '../datefunctions/getCurrentDate'

const BirthdayEvents = () => {
    const [allBirthdayEvents, setAllBirthdayEvents] = useState([])
    const [numOfPages, setNumOfPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const selectFilterRef = useRef(null)

    const getAllBirthdayEvents = async (pageNumber = 1) => {
        const response = await fetch(`${url}/api/birthdayevents?page=${pageNumber}&limit=2`)
        const json = await response.json()
        setNumOfPages(json.numOfPages)
        setCurrentPage(pageNumber)
        setAllBirthdayEvents(json.paginatedResults)
    }

    const getCurrentBirthdayEvents = async (pageNumber = 1) => {
        const response = await fetch(`${url}/api/birthdayevents/allcurrent?page=${pageNumber}&limit=2`)
        const json = await response.json()
        setNumOfPages(json.numOfPages)
        setCurrentPage(pageNumber)
        setAllBirthdayEvents(json.paginatedResults)
    }

    useEffect(() => {
        getAllBirthdayEvents()
    }, [])

    const showAllBirthdayEvents = () => {
        return allBirthdayEvents.map(event => {
            return (
                <tr key={event._id}>
                    <td>{event.birthdayPerson?.name}</td>
                    <td>{event.eventCreator?.name}</td>
                    <td>{moment(event.eventDate).format('LL')}</td>
                    <td>{moment(event.eventDate) < getCurrentDate() ? 'No' : 'Yes'}</td>
                    <td>
                        {event.isBoughtPresent ? 'Yes' : 'No'}
                        <button className='btn btn-primary' style={{ float: 'right' }}>Birthday Event Details</button>
                    </td>
                </tr>
            )
        })
    }

    const handlerEventFilter = (e) => {
        if (e.target.value === 'all') {
            getAllBirthdayEvents()
        }
        else {
            getCurrentBirthdayEvents()
        }
    }

    return (
        <div className='table-pagination'>
            <Table style={{ tableLayout: 'fixed' }} striped bordered hover variant='light'>
                <thead>
                    <tr>
                        <th>Birthday person</th>
                        <th>Created by</th>
                        <th>Event date</th>
                        <th>Current event
                            &nbsp;
                            <select ref={selectFilterRef} onChange={handlerEventFilter} className='form-select' style={{ display: 'inline-block', width: '30%', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px', fontSize: '90%' }}>
                                <option value='all'>All</option>
                                <option value='current'>Current</option>
                            </select>
                        </th>
                        <th>Present bought</th>
                    </tr>
                </thead>
                <tbody>{showAllBirthdayEvents()}</tbody>
            </Table>
            <Pagination
                searchPaginatedData={selectFilterRef.current?.value === 'all' ? getAllBirthdayEvents : getCurrentBirthdayEvents}
                numOfPages={numOfPages}
                currentPage={currentPage}
            />
        </div>
    )
}

export default BirthdayEvents