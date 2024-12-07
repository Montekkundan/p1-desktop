import { fetchUserProfile } from "@/lib/utils"
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const Widget = () => {
  const {user} = useUser()
  const [profile, setProfile] = useState<{
    status:number
    user: 
       | ({
        subscription: {
            plan: 'PRO' | 'FREE'
        } | null
        studio: {
            id: string
            screen: string | null
            mic: string | null
            preset: 'HD' | 'SD'
            camera: string | null
            userID: string | null
        } | null
       } & {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        createdAt: Date
        clerkid: string
       })
       | null
  } | null>(null)

  useEffect(() => {
    if(user && user.id) {
        fetchUserProfile(user.id).then((p)=>setProfile(p))
    }
  }, [user])


  return (
    <div className="p-5">
        <ClerkLoading>
            <div className="h-full flex justify-center items-center">
                <Loader />
            </div>
        </ClerkLoading>
        <SignedIn>
            {profile? <MediaConfiguration /> : <div className="w-full f-full flex justify-center items-center">
                <Loader color="white"/>
                </div>}
        </SignedIn>
    </div>
  )
}

export default Widget