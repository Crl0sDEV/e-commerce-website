'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const password = formData.get('password')

  // Check kung tama ang password
  if (password === process.env.ADMIN_PASSWORD) {
    
    // Pag tama, bigyan ng cookie (Ticket) na valid for 1 day
    (await
          // Pag tama, bigyan ng cookie (Ticket) na valid for 1 day
          cookies()).set('admin_session', 'true', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    redirect('/admin/dashboard')
  } else {
    // Pag mali, return error
    return { error: 'Wrong password boss!' }
  }
}