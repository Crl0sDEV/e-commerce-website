import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js' 
import { Profile } from '@/types'

interface UserState {
  user: User | null        
  profile: Profile | null  
  loading: boolean
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true })
    
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
        
        
        const profile = data as Profile | null

        set({ user, profile, loading: false })
    } else {
        set({ user: null, profile: null, loading: false })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
    toast.success('Logged out successfully')
  }
}))

export default useUserStore