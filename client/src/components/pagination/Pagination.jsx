import React from 'react'
import PaginationBTrap from 'react-bootstrap/Pagination'
import { useState } from 'react'

const Pagination = ({ numOfPages, searchPaginatedData, currentPage, setCurrentPage }) => {
    const pageNumbers = []

    for (let i = 1; i <= numOfPages; i++) {
        pageNumbers.push(i)
    }

    const pageNumberClickHandler = (pageNumber) => {
        searchPaginatedData(pageNumber);
    }

    return (
        <PaginationBTrap className='pagination-container'>
            {
                pageNumbers.map((pageNumber, index) => {
                    return (
                        <PaginationBTrap.Item key={index} active={pageNumber === currentPage} onClick={() => { pageNumberClickHandler(pageNumber) }}>{pageNumber}</PaginationBTrap.Item>
                    )
                })
            }
        </PaginationBTrap>
    )
}

export default Pagination