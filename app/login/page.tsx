'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, LogIn } from 'lucide-react'
import useUserStore from '@/store/useUserStore'

export default function LoginPage() {
  const router = useRouter()
  const { fetchUser } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        })

        if (error) throw error

        // Refresh user state in Zustand
        await fetchUser()

        toast.success("Welcome back!")
        router.push('/') // Redirect sa Home

    } catch (error: unknown) { // FIX: Changed 'any' to 'unknown'
        console.error(error)
        
        // Strict Type Checking
        if (error instanceof Error) {
            // Check if specific Supabase error
            if (error.message.includes('Invalid login credentials')) {
                toast.error("Invalid email or password.")
            } else {
                toast.error(error.message)
            }
        } else {
            toast.error("Failed to log in.")
        }
    } finally {
        setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Please log in to your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                    <input required name="email" type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                    </div>
                    <input required name="password" type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" onChange={handleChange} />
                </div>

                <button disabled={loading} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex justify-center items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <><LogIn size={20}/> Log In</>}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-500">
                Don&apos;t have an account? <Link href="/register" className="text-black font-bold hover:underline">Sign Up</Link>
            </p>
        </div>
    </div>
  )
}