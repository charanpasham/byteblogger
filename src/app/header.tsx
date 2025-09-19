"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LogInIcon, LogOut as LogOutIcon, Settings } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";

export default function Header() {
  const { data: session, status } = useSession();

  const LogOut = () => {
    if (!session) {
      return null;
    }
    return (
      <Button
        size={"sm"}
        className="cursor-pointer"
        variant="destructive"
        onClick={() => signOut()}
      >
        <LogOutIcon />
        <span>Log out</span>
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
        size={"sm"}
        className="rounded bg-blue-800 dark:bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-500 dark:hover:bg-blue-700 cursor-pointer"
      >
        Login <LogInIcon />
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

  const LogOutMenu = () => {
    if (status === "loading" || !session || !session.user) {
      return null;
    }
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex items-center gap-2">
            {session?.user?.image && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={`${session?.user?.image}`} />
              </Avatar>
            )}
            <span className="text-sm">{session.user.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href={"/admin/settings"}
                className="flex w-full items-center justify-center gap-2"
              >
                <Settings />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-center">
              <LogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <header className="flex h-16 items-center justify-between border-b">
      <h1 className="text-2xl font-bold">
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
            <LogOutMenu />
            <LogIn />
          </>
        )}
      </nav>
    </header>
  );
}
