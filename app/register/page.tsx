'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. Validations
    if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!")
        return
    }
    if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters.")
        return
    }

    setLoading(true)

    try {
        // 2. Sign Up with Supabase
        // FIX: Tinanggal natin yung 'data' dito kasi 'error' lang naman ang need natin i-check
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.name, // Saves to metadata -> triggers profiles table
                }
            }
        })

        if (error) throw error

        toast.success("Account created! Please confirm your email before logging in.")
        router.push('/login')

    } catch (error: unknown) { // FIX: Changed 'any' to 'unknown'
        console.error(error)
        
        // Strict Type Checking
        if (error instanceof Error) {
            toast.error(error.message)
        } else {
            toast.error("An unexpected error occurred during registration.")
        }
    } finally {
        setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm">Join us to track your orders and faster checkout.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                    <input required name="name" type="text" placeholder="Juan Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                    <input required name="email" type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                    <input required name="password" type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                    <input required name="confirmPassword" type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>

                <button disabled={loading} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex justify-center items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <><UserPlus size={20}/> Sign Up</>}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Log In</Link>
            </p>
        </div>
    </div>
  )
}