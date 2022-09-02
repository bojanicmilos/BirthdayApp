import React from 'react'
import { useState, useEffect, useRef, useId } from 'react'
import { url } from '../../apiInfo/Url'
import Table from 'react-bootstrap/Table'
import Pagination from '../pagination/Pagination'
import moment from 'moment'
import { getCurrentDate } from '../datefunctions/getCurrentDate'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { formatter } from '../currencyformatter/formatter'
import { NotificationManager } from 'react-notifications'

const BirthdayEvents = () => {

    const [selectedImgIndexFromWishList, setSelectedImgIndexFromWishList] = useState('')
    const [selectedImgIndexFromOtherItems, setSelectedImgIndexFromOtherItems] = useState('')

    const formTextInputId = useId()
    const formNumberInputId = useId()

    const [show, setShow] = useState(false);

    const [birthdayEvent, setBirthdayEvent] = useState({})
    const [messageAndAmount, setMessageAndAmount] = useState({
        message: '',
        amount: 0
    });

    const [items, setItems] = useState([])

    const [presentToBuy, setPresentToBuy] = useState(null)

    const [boughtPresent, setBoughtPresent] = useState({})

    const selectPresentFromWishList = (index, item) => {
        if (localStorage.getItem('username') === birthdayEvent?.eventCreator?.name) {
            setSelectedImgIndexFromWishList(index)
            setPresentToBuy(item)
            setSelectedImgIndexFromOtherItems('')
        }
    }

    const selectPresentFromOtherItems = (index, item) => {
        if (localStorage.getItem('username') === birthdayEvent?.eventCreator?.name) {
            setSelectedImgIndexFromOtherItems(index)
            setPresentToBuy(item)
            setSelectedImgIndexFromWishList('')
        }
    }

    const handleShowModal = (birthdayEvent) => {
        setBirthdayEvent(birthdayEvent)
        if (birthdayEvent.isBoughtPresent) {
            getPresentByBirthdayEvent(birthdayEvent._id)
        }
        setShow(true)
    }

    const handleCloseModal = () => {
        setSelectedImgIndexFromWishList('')
        setSelectedImgIndexFromOtherItems('')
        setTimeout(() => { setBirthdayEvent({}) }, 180)
        setMessageAndAmount({ message: '', amount: 0 });
        setPresentToBuy(null);
        setTimeout(() => { setBoughtPresent({}) }, 180)
        selectFilterRef.current?.value === 'all' ? getAllBirthdayEvents(currentPage) : getCurrentBirthdayEvents(currentPage)
        setShow(false)
    }

    const [allBirthdayEvents, setAllBirthdayEvents] = useState([])
    const [numOfPages, setNumOfPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const selectFilterRef = useRef(null)

    const getAllBirthdayEvents = async (pageNumber = 1) => {
        const response = await fetch(`${url}/api/birthdayevents?page=${pageNumber}`)
        const json = await response.json()
        setNumOfPages(json.numOfPages)
        setCurrentPage(pageNumber)
        setAllBirthdayEvents(json.paginatedResults)
    }

    const getCurrentBirthdayEvents = async (pageNumber = 1) => {
        const response = await fetch(`${url}/api/birthdayevents/allcurrent?page=${pageNumber}`)
        const json = await response.json()
        setNumOfPages(json.numOfPages)
        setCurrentPage(pageNumber)
        setAllBirthdayEvents(json.paginatedResults)
    }

    const getPresentByBirthdayEvent = async (eventId) => {
        const response = await fetch(`${url}/api/birthdayevents/presentforevent/${eventId}`)

        if (!response.ok) {
            NotificationManager.error('Error while fetching present !')
        }
        else {
            const json = await response.json()
            setBoughtPresent(json)
        }
    }

    const submitMessageAndAmount = async () => {
        if (!messageAndAmount.message) {
            NotificationManager.warning('Please enter your message')
            return
        }

        if (messageAndAmount.message.length < 3) {
            NotificationManager.warning('Message too short')
            return
        }
        if (!messageAndAmount.amount) {
            NotificationManager.warning('Please enter your amount')
            return
        }

        if (messageAndAmount.amount < 1) {
            NotificationManager.warning('Amount must be at least 1$')
            return
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageAndAmount.message, amount: messageAndAmount.amount, birthdayEventId: birthdayEvent._id })
        }

        const response = await fetch(`${url}/api/birthdayevents/addparticipant`, options)

        if (!response.ok) {
            const text = await response.text()
            NotificationManager.error(text)
        }
        else {
            setMessageAndAmount({ message: '', amount: 0 });
            setBirthdayEvent({ ...birthdayEvent, totalMoneyAmount: birthdayEvent.totalMoneyAmount + +messageAndAmount.amount, participants: [...birthdayEvent.participants, { _id: 'currentId', userId: { name: localStorage.getItem('username') } }] })
            NotificationManager.success('You are now participant in this birthday event !')
        }
    }

    const buyPresent = async () => {
        if (!presentToBuy) {
            NotificationManager.warning('Please choose an item for a present !')
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ birthdayEventId: birthdayEvent._id, presentToBuyId: presentToBuy._id })
        }

        const response = await fetch(`${url}/api/birthdayevents/buypresent`, options)

        if (!response.ok) {
            const text = await response.text()
            NotificationManager.error(text)
        }
        else {
            const json = await response.json()
            NotificationManager.success('You have just bought a present for this event !')
            setBirthdayEvent({ ...birthdayEvent, isBoughtPresent: true })
            setBoughtPresent({ presentBought: { ...json.item } })
        }

    }

    const getAllItems = async () => {
        const response = await fetch(`${url}/api/items`)
        const json = await response.json()
        setItems(json)
    }

    useEffect(() => {
        getAllBirthdayEvents()
        getAllItems()
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
                        <button onClick={() => handleShowModal(event)} className='btn btn-primary' style={{ float: 'right' }}>Birthday Event Details</button>
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
        <>
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
            <Modal dialogClassName="modal-90w" show={show} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Birthday event for {birthdayEvent.birthdayPerson?.name}, &nbsp; started by {birthdayEvent.eventCreator?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Header >
                    <Modal.Title>Total money: {formatter.format(birthdayEvent.totalMoneyAmount)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Present {birthdayEvent.isBoughtPresent ? `${boughtPresent.presentBought?.name} is bought for this birthday event.` : 'needs to be bought for this birthday event.'}</p>
                    <p>Participants: {birthdayEvent.participants?.map((participant, i) => {
                        return (
                            <span key={participant._id}><b>{participant.userId?.name}</b>{birthdayEvent.participants?.length !== i + 1 && ','}&nbsp;</span>
                        )
                    })}</p>
                    <p>User wishlist {!birthdayEvent?.birthdayPerson?.wishList.length ? 'is empty.' : ':'}</p>
                    <div className='item-grid-modal-big'>
                        {birthdayEvent.birthdayPerson?.wishList?.map((item, index) => {
                            return (
                                <div className={localStorage.getItem('username') === birthdayEvent.eventCreator?.name ? 'single-item' : undefined} onClick={() => selectPresentFromWishList(index, item)} key={item._id}>
                                    <img
                                        style={{ width: "7vw", height: "14vh", borderRadius: '5px', border: index === selectedImgIndexFromWishList ? '3px solid blue' : 'none' }}
                                        src={item.urlLink}
                                        alt="no"
                                    />
                                    <span style={{ display: 'block' }}><b>{item.name?.length > 10 ? item.name.slice(0, 9) + '...' : item.name}</b></span>
                                    <span style={{ display: 'block' }}><b>{formatter.format(item.price)}</b></span>
                                </div>
                            )
                        })}
                    </div>
                    <p style={{ marginTop: '20px' }}>Other items: </p>
                    <div className='item-grid-modal-big'>
                        {items.filter(({ name: name1 }) => !birthdayEvent?.birthdayPerson?.wishList?.some(({ name: name2 }) => name2 === name1)).map((item, index) => {
                            return (
                                <div className={localStorage.getItem('username') === birthdayEvent.eventCreator?.name ? 'single-item' : undefined} onClick={() => selectPresentFromOtherItems(index, item)} key={item._id}>
                                    <img
                                        style={{ width: "7vw", height: "14vh", borderRadius: '5px', border: index === selectedImgIndexFromOtherItems ? '3px solid blue' : 'none' }}
                                        src={item.urlLink}
                                        alt="no"
                                    />
                                    <span style={{ display: 'block' }}><b>{item.name.length > 15 ? item.name.slice(0, 14) + '...' : item.name}</b></span>
                                    <span style={{ display: 'block' }}><b>{formatter.format(item.price)}</b></span>
                                </div>
                            )
                        })}

                    </div>
                    <Form>
                        <Form.Label style={{ marginTop: '25px' }} htmlFor={formTextInputId}>Message</Form.Label>
                        <Form.Control
                            type="text"
                            id={formTextInputId}
                            placeholder='Enter your message'
                            value={messageAndAmount.message}
                            autoComplete="off"
                            onChange={(e) => setMessageAndAmount(prev => ({ ...prev, message: e.target.value }))}
                        />
                        <Form.Label style={{ marginTop: '25px' }} htmlFor={formNumberInputId}>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            id={formNumberInputId}
                            placeholder='Enter your amount'
                            value={messageAndAmount.amount}
                            autoComplete="off"
                            onChange={(e) => setMessageAndAmount(prev => ({ ...prev, amount: e.target.value }))}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button disabled={birthdayEvent.isBoughtPresent} variant="primary" onClick={submitMessageAndAmount}>
                        Add amount
                    </Button>
                    {localStorage.getItem('username') === birthdayEvent.eventCreator?.name &&
                        <Button disabled={birthdayEvent.isBoughtPresent} variant="primary" onClick={buyPresent}>
                            Buy present
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BirthdayEvents