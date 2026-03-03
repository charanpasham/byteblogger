import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "@/server/auth";
import DeleteProfile from "./deleteProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/app/modeToggle";

export default async function CreateSettingPage() {
  const session = await auth();

  return (
    <Card className="mx-auto my-10 w-full max-w-3xl border border-border/60 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Settings
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Manage your profile details and account preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Profile</Label>
            <p className="text-sm text-muted-foreground">
              This information comes from your Google account.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium text-foreground">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 p-[2px] shadow-md">
                <div className="h-full w-full rounded-full bg-background p-[2px]">
                  <Avatar className="h-full w-full">
                    {session?.user?.image ? (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name ?? "Profile image"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-sm font-medium">
                        {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <p className="text-sm text-muted-foreground">
              {session?.user?.role}
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="theme">Theme</Label>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <span className="text-xs text-muted-foreground">
                Toggle dark / light mode
              </span>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 pt-4">
          <Label className="mb-2 block text-sm">Danger zone</Label>
          <p className="mb-3 text-xs text-muted-foreground">
            Deleting your profile is permanent and will remove all of your data.
          </p>
          {session?.user?.email && (
            <DeleteProfile email={session.user.email} />
          )}
        </section>
      </CardContent>
    </Card>
  );
}
