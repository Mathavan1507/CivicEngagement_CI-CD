import { vi, describe, it, beforeEach, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Compare from './Compare'
import API from '../../api/axios'
 
vi.mock('../../api/axios', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))
 
const policies = [
  { id: 1, title: 'Health Policy', category: 'Health' },
  { id: 2, title: 'Education Act', category: 'Education' },
]
 
const wrap = () => render(<MemoryRouter><Compare /></MemoryRouter>)
 
describe('Compare page', () => {
  beforeEach(() => {
    API.get.mockResolvedValue({ data: policies })
    API.post.mockResolvedValue({})
  })
 
  it('renders page heading', async () => {
    wrap()
    expect(await screen.findByText(/Compare Policies/i)).toBeInTheDocument()
  })
 
  it('renders Policy A and Policy B selects', async () => {
    wrap()
    expect(await screen.findByText('-- Select first policy --')).toBeInTheDocument()
    expect(screen.getByText('-- Select second policy --')).toBeInTheDocument()
  })
 
  it('populates selects with loaded policies', async () => {
    wrap()
    expect(await screen.findAllByText(/Health Policy \(Health\)/)).toHaveLength(2)
  })
 
  it('shows error when Compare Now clicked with no selections', async () => {
    wrap()
    await screen.findByText('-- Select first policy --')
    fireEvent.click(screen.getByText(/Compare Now/i))
    expect(screen.getByText('Please select two policies.')).toBeInTheDocument()
  })
 
  it('shows error when both selects have the same policy', async () => {
    wrap()
    await screen.findAllByText(/Health Policy/)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.change(selects[1], { target: { value: '1' } })
    fireEvent.click(screen.getByText(/Compare Now/i))
    expect(screen.getByText('Please select two different policies.')).toBeInTheDocument()
  })
 
  it('calls POST /compare with correct payload', async () => {
    API.post.mockResolvedValue({
      data: {
        policy1: { title: 'Health Policy', category: 'Health', description: 'desc'.repeat(80), tags: '' },
        policy2: { title: 'Education Act', category: 'Education', description: 'desc'.repeat(80), tags: '' },
        blocks: [],
        insight: 'Key insight here',
      },
    })
    wrap()
    await screen.findAllByText(/Health Policy/)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.change(selects[1], { target: { value: '2' } })
    fireEvent.click(screen.getByText(/Compare Now/i))
    await waitFor(() =>
      expect(API.post).toHaveBeenCalledWith('/compare', { p1: 1, p2: 2 })
    )
  })
 
  it('renders comparison result with insight', async () => {
    API.post.mockResolvedValue({
      data: {
        policy1: { title: 'Health Policy', category: 'Health', description: 'x'.repeat(310), tags: '' },
        policy2: { title: 'Education Act', category: 'Education', description: 'y'.repeat(310), tags: '' },
        blocks: [{ type: 'COMMON', text: 'Shared theme here' }],
        insight: 'Key insight here',
      },
    })
    wrap()
    await screen.findAllByText(/Health Policy/)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.change(selects[1], { target: { value: '2' } })
    fireEvent.click(screen.getByText(/Compare Now/i))
    expect(await screen.findByText('Key insight here')).toBeInTheDocument()
    expect(screen.getByText('Shared theme here')).toBeInTheDocument()
  })
 
  it('shows error alert on API failure', async () => {
    API.post.mockRejectedValue({ response: { data: 'Comparison failed on server.' } })
    wrap()
    await screen.findAllByText(/Health Policy/)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.change(selects[1], { target: { value: '2' } })
    fireEvent.click(screen.getByText(/Compare Now/i))
    expect(await screen.findByText('Comparison failed on server.')).toBeInTheDocument()
  })
 
  it('disables Compare Now button while loading', async () => {
    API.post.mockImplementation(() => new Promise(() => {}))
    wrap()
    await screen.findAllByText(/Health Policy/)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.change(selects[1], { target: { value: '2' } })
    fireEvent.click(screen.getByText(/Compare Now/i))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Comparing/i })).toBeDisabled()
    )
  })
})
 