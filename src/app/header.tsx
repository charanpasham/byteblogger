"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut as LogOutIcon } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();

  const LogOut = () => {
    if (!session) {
      return null;
    }
    return (
      <Button variant="destructive" onClick={() => signOut()}>
        <LogOutIcon />
        Log out
      </Button>
    );
  };

  const LogIn = () => {
    if (session) {
      return null;
    }
    return (
      <Button
        variant="default"
        onClick={() => signIn("google")}
        draggable={true}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Login
      </Button>
    );
  };

  const UserAvatar = () => {
    if (!session || !session.user || !session.user.image) {
      return null;
    }
    return (
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarImage src={`${session?.user?.image}`} />
        </Avatar>
        {session && `${session.user?.name}`}
      </div>
    );
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-gray-900 px-4 text-gray-300 shadow-sm">
      <h1 className="text-xl font-bold">
        <Link href="/">Byte Blogger</Link>
      </h1>
      <nav className="flex items-center gap-2">
        {status === "loading" ? (
          <Skeleton />
        ) : (
          <>
            {session?.user?.role === "admin" && (
              <Button asChild variant={"outline"}>
                <Link href="/admin">Admin</Link>
              </Button>
            )}

            <ModeToggle />
            <UserAvatar />
            <LogOut />
            <LogIn />
          </>
        )}
      </nav>
    </header>
  );
}
