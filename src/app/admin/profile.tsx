"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { data: session, status } = useSession();
  const UserAvatar = ({ imageUrl }: { imageUrl: string }) => {
    if (!imageUrl) {
      return null;
    }
    // Ensure the image URL is valid
    return (
      <Avatar>
        <AvatarImage
          src={imageUrl}
          onError={(e) => {
            console.error("Error loading avatar image:", e);
          }}
        />
      </Avatar>
    );
  };
  return (
    <>
      {status === "loading" ? (
        <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
      ) : (
        <>
          <div className="mb-10 flex items-center gap-2">
            {/* Display User Avatar and Name */}
            <UserAvatar imageUrl={session?.user?.image ?? ""} />
            <div className="flex flex-col gap-3">
              {session?.user?.name}

              <Button
                variant="destructive"
                className="text-gray-200 cursor-pointer"
                size={"sm"}
                onClick={() => signOut()}
              >
                <LogOut />
                Log out
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
