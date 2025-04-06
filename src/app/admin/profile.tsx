"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { ModeToggle } from "../modeToggle";

export default function Profile() {
  const { data: session, status } = useSession();
  const UserAvatar = () => {
    if (!session || !session.user || !session.user.image) {
      return null;
    }
    return (
      <Avatar>
        <AvatarImage src={`${session?.user?.image}`} />
      </Avatar>
    );
  };
  return (
    <>
      {status === "loading" ? (
        <Skeleton className="h-10 w-32 rounded-md bg-gray-200" />
      ) : (
        <>
          <ModeToggle />
          <div className="mb-10 flex items-center gap-2">
            {/* Display User Avatar and Name */}
            <UserAvatar />
            <div className="flex flex-col gap-3">
              {session?.user?.name}

              <Button
                variant="destructive"
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
