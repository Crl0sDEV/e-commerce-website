'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check current session
      const { data: { session } } = await supabase.auth.getSession()

      // 2. Kung WALANG session, at HINDI ka nasa login page...
      if (!session && pathname !== '/admin/login') {
        // Kick them out to login
        router.replace('/admin/login')
      } 
      // 3. Kung MAY session, at nasa login page ka...
      else if (session && pathname === '/admin/login') {
        // Redirect to dashboard (bawal na mag login ulit)
        router.replace('/admin/dashboard')
      }
      
      setLoading(false)
    }

    checkSession()
  }, [router, pathname])

  // Show Loading Spinner habang chine-check ang session (para iwas "flash")
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  return <>{children}</>
}