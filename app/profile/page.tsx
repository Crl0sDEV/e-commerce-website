'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Camera, Save, LogOut } from 'lucide-react'
import useUserStore from '@/store/useUserStore'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, fetchUser, logout, loading: storeLoading } = useUserStore()
  
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: ''
  })
  
  // State para sa Avatar Upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // 1. Load data from Store to Form
  useEffect(() => {
    if (!storeLoading && !user) {
        router.push('/login')
    }
    if (profile) {
        setFormData({
            full_name: profile.full_name || '',
            phone_number: profile.phone_number || '',
            address: profile.address || ''
        })
    }
  }, [user, profile, storeLoading, router])

  // 2. Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // 3. Upload Image Logic
  const uploadAvatar = async (userId: string) => {
    if (!avatarFile) return null

    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return data.publicUrl
  }

  // 4. Save Updates
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setUpdating(true)

    try {
        let finalAvatarUrl = profile?.avatar_url

        // Kung may bagong inupload na image
        if (avatarFile) {
            const url = await uploadAvatar(user.id)
            if (url) finalAvatarUrl = url
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                address: formData.address,
                avatar_url: finalAvatarUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) throw error

        await fetchUser() // Refresh Store
        toast.success("Profile updated successfully!")

    } catch (error: unknown) {
        console.error(error)
        toast.error("Failed to update profile.")
    } finally {
        setUpdating(false)
    }
  }

  if (storeLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LEFT: AVATAR CARD */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4 group">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 relative">
                             {/* Priority Logic: Preview > Profile URL > Default */}
                             <Image 
                                src={avatarPreview || profile?.avatar_url || '/placeholder-avatar.png'} // Note: Make sure you have a placeholder or logic handle empty
                                alt="Avatar" 
                                fill 
                                className="object-cover"
                                // Fallback kung walang image (optional handling)
                             />
                        </div>
                        
                        {/* Camera Overlay */}
                        <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-md">
                            <Camera size={18} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    <h2 className="font-bold text-lg">{profile?.full_name || 'User'}</h2>
                    <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                    
                    <button 
                        onClick={() => { logout(); router.push('/login') }}
                        className="text-red-600 text-sm font-medium hover:underline flex items-center justify-center gap-2 w-full"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="md:col-span-2">
                <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                    placeholder="09123456789"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                            <textarea 
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Unit, Street, Barangay, City, Province"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-2">This will be used as your default shipping address.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={updating}
                            className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 ml-auto"
                        >
                            {updating ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </main>
  )
}