import React from 'react'
import { useState, useEffect } from 'react'
import { url } from '../../apiInfo/Url'
import Card from 'react-bootstrap/Card'
import moment from 'moment'
import cancelImg from '../../assets/cancel.png'
import plusImg from '../../assets/plus-5-xxl.png'

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
                            My WishList:
                        </Card.Text>
                        {
                            user.wishList?.map((item, index) => {
                                return (
                                    <Card.Text key={item._id}>
                                        <img
                                            style={{ width: "5vw", height: "10vh" }}
                                            src={item.urlLink}
                                            alt="no"
                                        />
                                        <img
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
                                        Price: {item.price}
                                    </Card.Text>
                                );
                            })}
                    </Card.Body>
                </Card>

            </div>
            <div>
                <div>
                    <h4>Other items</h4>
                    <div className='item-grid'>
                        {
                            items.filter(({ name: name1 }) => !user.wishList?.some(({ name: name2 }) => name2 === name1)).map(item => {
                                return (
                                    <div key={item._id}>
                                        <img
                                            style={{ width: "8vw", height: "16vh" }}
                                            src={item.urlLink}
                                            alt="no"
                                        />
                                        <span style={{ display: 'block' }}><b>{item.name.length > 15 ? item.name.slice(0, 14) + '...' : item.name}</b></span>
                                        <img
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