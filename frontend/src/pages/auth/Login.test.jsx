import { vi, describe, it, beforeEach, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Login    from './Login'
import Register from './Register'
import API from '../../api/axios'
 
vi.mock('../../api/axios', () => ({
  default: { post: vi.fn() },
}))
 
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))
 
const loginFn = vi.fn()
const wrapLogin = () =>
  render(
    <AuthContext.Provider value={{ login: loginFn }}>
      <MemoryRouter><Login /></MemoryRouter>
    </AuthContext.Provider>
  )
 
describe('Login page', () => {
  beforeEach(() => {
    loginFn.mockClear()
    mockNavigate.mockClear()
    API.post.mockReset()
  })
 
  it('renders email and password inputs', () => {
    wrapLogin()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
  })
 
  it('renders the Sign In button', () => {
    wrapLogin()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })
 
  it('renders a link to /register', () => {
    wrapLogin()
    expect(screen.getByText('Create one')).toHaveAttribute('href', '/register')
  })
 
  it('shows the CivicEngage branding', () => {
    wrapLogin()
    expect(screen.getByText('CivicEngage')).toBeInTheDocument()
  })
 
  it('updates email field on change', async () => {
    wrapLogin()
    const emailInput = screen.getByPlaceholderText('you@example.com')
    await userEvent.type(emailInput, 'user@test.com')
    expect(emailInput.value).toBe('user@test.com')
  })
 
  it('updates password field on change', async () => {
    wrapLogin()
    const pwInput = screen.getByPlaceholderText('Your password')
    await userEvent.type(pwInput, 'secret123')
    expect(pwInput.value).toBe('secret123')
  })
 
  it('calls login and navigates to /admin/dashboard for ADMIN role', async () => {
    API.post.mockResolvedValue({ data: { token: 'tok', role: 'ADMIN', name: 'Alice', userId: '1' } })
    wrapLogin()
    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'admin@test.com')
    await userEvent.type(screen.getByPlaceholderText('Your password'), 'pass')
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() => {
      expect(loginFn).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard')
    })
  })
 
  it('calls login and navigates to /contributor/dashboard for CONTRIBUTOR', async () => {
    API.post.mockResolvedValue({ data: { token: 'tok', role: 'CONTRIBUTOR', name: 'Bob' } })
    wrapLogin()
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/contributor/dashboard'))
  })
 
  it('calls login and navigates to /dashboard for USER', async () => {
    API.post.mockResolvedValue({ data: { token: 'tok', role: 'USER', name: 'Carol' } })
    wrapLogin()
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'))
  })
 
  it('shows error message on failed login (API error with response data)', async () => {
    API.post.mockRejectedValue({ response: { data: 'Invalid credentials' } })
    wrapLogin()
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    )
  })
 
  it('shows default error message when no response data', async () => {
    API.post.mockRejectedValue({})
    wrapLogin()
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
    )
  })
 
  it('disables the Sign In button while loading', async () => {
    API.post.mockImplementation(() => new Promise(() => {}))
    wrapLogin()
    fireEvent.submit(screen.getByRole('button', { name: /Sign In/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Signing in/i })).toBeDisabled()
    )
  })
})
 
describe('Register page', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    API.post.mockReset()
  })
 
  const wrapReg = () => render(<MemoryRouter><Register /></MemoryRouter>)
 
  it('renders all required fields', () => {
    wrapReg()
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Minimum 6 characters')).toBeInTheDocument()
  })
 
  it('renders Register As selector with USER default', () => {
    wrapReg()
    expect(screen.getByDisplayValue('Regular User')).toBeInTheDocument()
  })
 
  it('does NOT show contributor type selector by default (USER role)', () => {
    wrapReg()
    expect(screen.queryByText('Contributor Type')).not.toBeInTheDocument()
  })
 
  it('shows contributor type selector when CONTRIBUTOR is selected', async () => {
    wrapReg()
    await userEvent.selectOptions(screen.getByDisplayValue('Regular User'), 'CONTRIBUTOR')
    expect(screen.getByText('Contributor Type')).toBeInTheDocument()
  })
 
  it('shows Educator, Civic Organization, Civic Management options for contributor', async () => {
    wrapReg()
    await userEvent.selectOptions(screen.getByDisplayValue('Regular User'), 'CONTRIBUTOR')
    expect(screen.getByText('Educator')).toBeInTheDocument()
    expect(screen.getByText('Civic Organization')).toBeInTheDocument()
    expect(screen.getByText('Civic Management')).toBeInTheDocument()
  })
 
  it('shows error when CONTRIBUTOR selected but no contributor type chosen', async () => {
    wrapReg()
    await userEvent.selectOptions(screen.getByDisplayValue('Regular User'), 'CONTRIBUTOR')
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByText('Please select your contributor type.')).toBeInTheDocument()
    )
  })
 
  it('resets contributorType when switching back to USER', async () => {
    wrapReg()
    const roleSelect = screen.getByDisplayValue('Regular User')
    await userEvent.selectOptions(roleSelect, 'CONTRIBUTOR')
    await userEvent.selectOptions(roleSelect, 'USER')
    expect(screen.queryByText('Contributor Type')).not.toBeInTheDocument()
  })
 
  it('navigates to / on successful registration', async () => {
    API.post.mockResolvedValue({})
    wrapReg()
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })
 
  it('shows API error on registration failure', async () => {
    API.post.mockRejectedValue({ response: { data: 'Email already in use' } })
    wrapReg()
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    )
  })
 
  it('shows default error message when no response data', async () => {
    API.post.mockRejectedValue({})
    wrapReg()
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByText('Registration failed.')).toBeInTheDocument()
    )
  })
 
  it('disables Create Account button while loading', async () => {
    API.post.mockImplementation(() => new Promise(() => {}))
    wrapReg()
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Creating account/i })).toBeDisabled()
    )
  })
 
  it('has a Sign in link pointing to /', () => {
    wrapReg()
    expect(screen.getByText('Sign in')).toHaveAttribute('href', '/')
  })
})
 