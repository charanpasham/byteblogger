import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/server/auth";
import { Trash } from "lucide-react";
import { db } from "@/server/db";
import { users, accounts, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function CreateSettingPage() {
  const session = await auth();
  const onDeleteAction = async (form: FormData) => {
    "use server";
    // Add your delete profile logic here
    const email = form.get("email") as string;
    // For example, you might want to call an API to delete the user
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const userId = user[0]?.id;
    if (!userId) {
      throw new Error("User not found");
    }

    // Delete the current users session.
    await db.delete(sessions).where(eq(sessions.userId, userId));
    // Delete the user account
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
    redirect("/");
  };
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
            <p className="break-all text-gray-400">{session?.user.image}</p>
          </div>
        </form>
        <form action={onDeleteAction}>
          <input
            type="text"
            hidden
            name="email"
            value={session?.user?.email ?? ""}
            readOnly
          />
          <Button variant={"destructive"} size={"lg"} className="mt-10">
            <Trash className="mr-2" />
            Delete Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
