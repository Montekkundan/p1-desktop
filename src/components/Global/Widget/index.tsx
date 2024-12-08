import { useMediaSources } from "@/hooks/useMediaSources";
import { fetchUserProfile } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import MediaConfiguration from "../MediaConfiguration";

const Widget = () => {
  const { user } = useUser();
  const {state, fetchMediaResources} = useMediaSources()
  const [profile, setProfile] = useState<{
    status: number;
    user:
      | ({
          subscription: {
            plan: "PRO" | "FREE";
          } | null;
          studio: {
            id: string;
            screen: string | null;
            mic: string | null;
            preset: "HD" | "SD";
            camera: string | null;
            userID: string | null;
          } | null;
        } & {
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          createdAt: Date;
          clerkid: string;
        })
      | null;
  } | null>(null);

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id).then((p) => setProfile(p));
    }
  }, [user]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader state={false} />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration 
            state={state}
            user={profile.user}
          />
        ) : (
          <div className="w-full f-full flex justify-center items-center">
            <Loader state={false} color="white" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
