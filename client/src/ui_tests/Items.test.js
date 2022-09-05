import { render, screen, act, waitFor, getByText } from '@testing-library/react';
import Items from '../components/pages/Items'
import userEvent from '@testing-library/user-event'
import * as imgChecker from '../components/imgChecker/imgChecker'

describe('<Items/>', () => {
    test('renders list of items', async () => {
        window.fetch = jest.fn()
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ _id: '1', name: 'test item', price: 25 }]
        })

        render(<Items />)

        const items = await screen.findAllByText('test item', { exact: false })

        expect(items).toHaveLength(1)
    })

    test('deletes item unsuccessfully', async () => {

        window.fetch = jest.fn()
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ _id: '1', name: 'test item', price: 25 }]
        }).mockResolvedValueOnce({
            ok: true,
            text: async () => 'something went wrong'
        })

        render(<Items />)

        const clickElements = await screen.findAllByAltText('no')
        userEvent.click(clickElements[1])

        await waitFor(() => {
            expect(screen.queryByText('test item')).not.toBeInTheDocument()
        })
    })

    test('deletes item successfully', async () => {
        window.fetch = jest.fn()
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ _id: '1', name: 'test item', price: 25 }]
        }).mockResolvedValueOnce({
            ok: true,
            text: async () => 'random str'
        })

        render(<Items />)


        const clickElements = await screen.findAllByAltText('no')

        userEvent.click(clickElements[1])

        await waitFor(() => {
            expect(screen.queryByText('test item')).not.toBeInTheDocument()
        })
    })

    test('adds item unsuccessfully', async () => {
        window.fetch = jest.fn()
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ _id: '1', name: 'test item', price: 25 }]
        }).mockResolvedValueOnce({
            ok: false,
            text: async () => 'random text'
        })
        render(<Items />)

        await waitFor(() => {
            expect(screen.queryAllByText('test item')).toHaveLength(1)
        })
    })

    test('adds item successfully', async () => {
        imgChecker.IsImageOk = jest.fn().mockReturnValue(true)
        window.fetch = jest.fn()
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ _id: '1', name: 'test item', price: 25 }]
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ _id: '2', name: 'test item2', price: 30 })
        })


        render(<Items />)

        const inputItemName = await screen.findByPlaceholderText('Enter item name', { exact: false })
        const inputUrlLink = await screen.findByPlaceholderText('Enter url link', { exact: false })
        const inputPrice = await screen.findByPlaceholderText('Enter price', { exact: false })

        userEvent.type(inputItemName, 'test item2')
        userEvent.type(inputUrlLink, 'random url link')
        userEvent.type(inputPrice, '24')

        const addItemButton = await screen.findByText('Add Item')

        userEvent.click(addItemButton)


        await waitFor(() => {
            expect(screen.getAllByText('test item', { exact: false })).toHaveLength(2)
        })
    })
})