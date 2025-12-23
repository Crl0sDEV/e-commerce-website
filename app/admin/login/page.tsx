'use client'

import { loginAction } from './actions'
import { Lock } from 'lucide-react'
import { useState } from 'react'

// Simpleng wrapper para sa form action
export default function AdminLogin() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="bg-black p-3 rounded-full">
            <Lock className="text-white" size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Admin Access Only
        </h2>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Password
            </label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}