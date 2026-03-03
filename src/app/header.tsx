"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut as LogOutIcon, Settings } from "lucide-react";
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

  // const LogIn = () => {
  //   if (session) {
  //     return null;
  //   }
  //   return (
  //     <Button
  //       variant="default"
  //       onClick={() => signIn("google")}
  //       size={"sm"}
  //       className="rounded bg-blue-800 dark:bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-500 dark:hover:bg-blue-700 cursor-pointer"
  //     >
  //       Login <LogInIcon />
  //     </Button>
  //   );
  // };

  const LogOutMenu = () => {
    if (status === "loading" || !session || !session.user) {
      return null;
    }
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border/70 shadow-sm">
              {session.user.image ? (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name ?? "Profile"}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-xs font-medium">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">{session.user.name}</span>
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
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          <Link href="/" className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Byte Blogger
          </Link>
        </h1>
        <nav className="flex items-center gap-2">
          {status === "loading" ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              {session?.user?.role === "admin" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}

              <ModeToggle />
              <LogOutMenu />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
