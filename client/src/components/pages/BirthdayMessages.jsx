import React from 'react'
import { useEffect, useState } from 'react'
import { url } from '../../apiInfo/Url'
import Spinner from '../Spinner'

const BirthdayMessages = () => {
    const [birthdayEvent, setBirthdayEvent] = useState({ participants: [] })
    const noMessages = 'There are no birthday messages at the moment'
    const [isLoading, setIsLoading] = useState(true)

    const getEventForPerson = async () => {
        const response = await fetch(`${url}/api/birthdayevents/currenteventforperson/${localStorage.getItem('id')}`)
        if (!response.ok) {
            setIsLoading(false)
            return
        }
        else {
            const json = await response.json()
            setBirthdayEvent(json)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getEventForPerson()
    }, [])
    return (
        <>
            {
                isLoading ? <Spinner /> :
                    <>
                        {birthdayEvent.participants.length === 0 ? <h2 style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>{noMessages}</h2> :
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className='birthday-messages-grid'>
                                    {birthdayEvent.participants.map((participant) => {
                                        return (
                                            <div key={participant._id} id="birthdayCard">
                                                <h1>{participant.userId?.name.length > 13 ? `${participant.userId?.name.slice(0, 10)}...` : participant.userId?.name}</h1>
                                                <p>{participant.message}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </>
            }
        </>

    )
}

export default BirthdayMessages