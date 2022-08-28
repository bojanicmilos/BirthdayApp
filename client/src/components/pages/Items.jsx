import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { url } from '../../apiInfo/Url'
import { formatter } from '../currencyformatter/formatter'
import cancelImg from '../../assets/cancel.png'
import { useId } from 'react'
import { NotificationManager } from 'react-notifications'
import { IsImageOk } from '../imgChecker/imgChecker'

const Items = () => {

    const imgRef = useRef(null)

    const idItemName = useId()
    const idUrlLink = useId()
    const idPrice = useId()

    const [items, setItems] = useState([])

    const [itemName, setItemName] = useState('')
    const [urlLink, setUrlLink] = useState('')
    const [price, setPrice] = useState('')

    const getAllItems = async () => {
        const response = await fetch(`${url}/api/items`)
        const json = await response.json()
        setItems(json)
    }

    const deleteItem = async (itemId) => {
        const options = {
            method: 'DELETE'
        }

        const response = await fetch(`${url}/api/items/delete/${itemId}`, options)

        if (!response.ok) {
            NotificationManager.error('Error while deleting item !')
        }
        else {
            const filtered = items.filter(({ _id }) => _id !== itemId)
            setItems(filtered)
            NotificationManager.success('Item deleted !')
        }
    }

    const addNewItem = async (e) => {
        e.preventDefault();

        if (!itemName) {
            NotificationManager.warning('Please enter item name !')
            return
        }

        if (itemName.length < 2) {
            NotificationManager.warning('Too short item name !')
            return
        }

        if (!IsImageOk(imgRef.current)) {
            NotificationManager.warning('Url is not image !')
            return
        }

        if (!price || price < 1) {
            NotificationManager.warning('Price must be at least 1$!')
            return
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName, urlLink: urlLink, price: price })
        }

        const response = await fetch(`${url}/api/items/add`, options)

        if (!response.ok) {
            const text = await response.text();
            NotificationManager.error(text)
        }
        else {
            const json = await response.json();
            setItems([...items, { ...json }])
            setItemName('')
            setUrlLink('')
            setPrice('')
            NotificationManager.success('Item added !')
        }
    }

    useEffect(() => {
        getAllItems()
    }, [])
    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 12.5%)', gridRowGap: '20px', marginTop: '20px', marginLeft: '20px' }}>
                {items.map(item => {
                    return (
                        <div key={item._id}>
                            <img style={{ borderRadius: '5px', width: '10vw', height: '20vh' }} src={item.urlLink} alt='no' />
                            <p style={{ margin: '0' }}><b>{item.name}</b></p>
                            <p style={{ margin: '0' }}><b>{formatter.format(item.price)}</b></p>
                            <img className='x-button' onClick={() => deleteItem(item._id)} src={cancelImg} style={{ cursor: 'pointer', borderRadious: '5px', width: '1.5vw', height: '2.5vh' }} alt='no' />
                        </div>
                    )
                })}
            </div>
            <div className="form-container-additem">
                <form
                    onSubmit={addNewItem}
                    className="form"
                >
                    <div className="form-content">
                        <h3 className="form-title">Add New Item</h3>
                        <div className="form-group mt-3">
                            <label htmlFor={idItemName}>Item name</label>
                            <input
                                id={idItemName}
                                className="form-control mt-1"
                                placeholder="Enter item name"
                                value={itemName}
                                onChange={(e) => { setItemName(e.target.value) }}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor={idUrlLink}>Url link</label>
                            <input
                                id={idUrlLink}
                                className="form-control mt-1"
                                placeholder="Enter url link"
                                value={urlLink}
                                onChange={(e) => { setUrlLink(e.target.value) }}
                            />
                            <img style={{ display: 'none' }} ref={imgRef} src={urlLink} alt='no img' />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor={idPrice}>Price</label>
                            <input
                                id={idPrice}
                                className="form-control mt-1"
                                type='number'
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => { setPrice(e.target.value) }}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Add Item
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Items