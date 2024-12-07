import { SourceDeviceStateProps } from "@/hooks/useMediaSources"

type Props = {
    state: SourceDeviceStateProps
    user:
       | ({
         subscription: {
            plan: "PRO" | "FREE"
         } | null
         studio: {
            id: string
            screen: string | null
            mic: string | null
            preset: "HD" | "SD"
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
        }) | null
}

function MediaConfiguration({state, user}: Props) {

  return (
    <form className="flex h-full relative w-full flex-col gap-y-5" action="">

    </form>
  )
}

export default MediaConfiguration