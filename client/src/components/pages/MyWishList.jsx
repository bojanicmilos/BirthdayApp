import React from 'react'
import { useState, useEffect } from 'react'
import { url } from '../../apiInfo/Url'
import Card from 'react-bootstrap/Card'
import moment from 'moment'
import cancelImg from '../../assets/cancel.png'
import plusImg from '../../assets/plus-5-xxl.png'
import { NotificationManager } from 'react-notifications'

const MyWishList = () => {
    const [user, setUser] = useState({})
    const [items, setItems] = useState([])

    const getUserByUsername = async () => {
        const response = await fetch(`${url}/api/users/${localStorage.getItem('username')}`)
        const json = await response.json()
        setUser(json)
    }

    const getAllItems = async () => {
        const response = await fetch(`${url}/api/items`)
        const json = await response.json()
        setItems(json)
    }

    const addItemToWishList = async (itemId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(`${url}/api/users/additemtowishlist/${itemId}`, options)
        if (!response.ok) {
            const text = await response.text()
            NotificationManager.error(text)
        }
        else {
            const json = await response.json()
            setUser(prev => ({ ...prev, wishList: [...user.wishList, { ...json }] }))
            NotificationManager.success('Item added to WishList !')
        }

    }

    const deleteItemFromWishList = async (itemId) => {
        const options = {
            method: 'DELETE'
        }

        const response = await fetch(`${url}/api/users/itemfromwishlist/${itemId}`, options)

        if (!response.ok) {
            NotificationManager.error('Error while deleting item from user wishlist !')
        }
        else {
            const filteredWishList = user.wishList.filter(item => item._id !== itemId)
            setUser(prev => ({ ...prev, wishList: filteredWishList }))
            NotificationManager.success('Item deleted from wishlist !')
        }
    }

    useEffect(() => {
        getUserByUsername()
        getAllItems()
    }, [])


    return (
        <div className='flex-container-wishlist'>
            <div>
                <Card style={{ width: "30vw" }}>
                    <Card.Body>
                        <Card.Title>User information</Card.Title>
                        <Card.Text>
                            Username: <b>{user.name}</b>
                        </Card.Text>
                        <Card.Text>
                            Birth date: <b>{moment(user.birthDate).format('LL')}</b>
                        </Card.Text>
                        <Card.Text>
                            My WishList: <b>{user.wishList?.length === 0 && 'Empty'}</b>
                        </Card.Text>
                        {
                            user.wishList?.map((item, index) => {
                                return (
                                    <Card.Text key={item._id}>
                                        <img
                                            style={{ width: "5vw", height: "10vh", borderRadius: '5px' }}
                                            src={item.urlLink}
                                            alt="no"
                                        />
                                        <img
                                            className='x-button'
                                            onClick={() => deleteItemFromWishList(item._id)}
                                            style={{
                                                width: "1.5vw",
                                                height: "2.5vh",
                                                cursor: "pointer",
                                                float: "right",
                                                marginRight: "15px",
                                            }}
                                            alt="no"
                                            src={cancelImg}
                                        />
                                        <span style={{ display: 'block' }}><b>{item.name}</b></span>
                                    </Card.Text>
                                );
                            })}
                    </Card.Body>
                </Card>

            </div>
            <div>
                <h4>Other items</h4>
                <div>

                    <div className='item-grid'>
                        {
                            items.filter(({ name: name1 }) => !user.wishList?.some(({ name: name2 }) => name2 === name1)).map(item => {
                                return (
                                    <div key={item._id}>
                                        <img
                                            style={{ width: "8vw", height: "16vh", borderRadius: '5px' }}
                                            src={item.urlLink}
                                            alt="no"
                                        />
                                        <span style={{ display: 'block' }}><b>{item.name.length > 15 ? item.name.slice(0, 14) + '...' : item.name}</b></span>
                                        <img
                                            className='plus-button'
                                            onClick={() => addItemToWishList(item._id)}
                                            style={{ width: "1.5vw", height: "3vh", cursor: 'pointer' }}
                                            src={plusImg}
                                            alt='no'
                                        />
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyWishList