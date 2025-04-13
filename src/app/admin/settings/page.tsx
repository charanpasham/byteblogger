import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/server/auth";

import DeleteProfile from "./deleteProfile";
import Image from "next/image";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ModeToggle } from "@/app/modeToggle";

export default async function CreateSettingPage() {
  const session = await auth();

  return (
    <Card className="mx-auto my-10 w-full max-w-3xl p-6 shadow-lg">
      <CardHeader>Settings</CardHeader>
      <CardContent>
        <form>
          <div className="flex items-center gap-3">
            <Label htmlFor="name">Name: </Label>
            <p className="text-gray-400">{session?.user?.name}</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="email">Email: </Label>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="image">Profile Image: </Label>
            <Avatar>
              <AvatarImage
                src={session?.user.image || "/default-avatar.png"}
                alt="Profile Image"
                className="h-12 w-12 rounded-full"
              />
            </Avatar>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="image">Role: </Label>
            <p className="text-gray-400">{session?.user?.role}</p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="image">Dark Mode Toggle: </Label>
            <ModeToggle />
          </div>
        </form>
        {session?.user?.email && <DeleteProfile email={session?.user?.email} />}
      </CardContent>
    </Card>
  );
}
