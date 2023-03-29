import { AuthProvider } from 'react-admin'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
  },
  checkError: (error) => {
    const status = error.status
    if (status === 401 || status === 403) {
      return Promise.reject({ redirectTo: '/login', logoutUser: true })
    }
    return Promise.resolve()
  },
  checkAuth: async () => {
    const response = await fetch('/auth/status')
    if (!response.ok) {
      throw new Error(response.statusText)
    }
  },
  getPermissions: () => {
    return Promise.resolve()
  },
  logout: async () => {
    await fetch('/auth/logout')
    return Promise.resolve()
  },
}
