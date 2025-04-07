import { Alert } from "@/components/ui/alert";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { redirect } from "next/navigation";
export default async function Admin() {
  const session = await auth();
  if (!session) {
    redirect("api/auth/signin");
  }

  if (session.user.role !== "admin") {
    return (
      <Alert variant={"destructive"} className="mx-auto mt-10 w-full max-w-md">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </Alert>
    );
  }

  const userList = await db.select().from(users);
  const blogPosts = await db.select().from(posts);

  // protect the admin page
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-5 px-4 py-16">
        <span>Number of Users: {userList.length}</span>
        <span>Total Blog Posts: {blogPosts.length}</span>
      </div>
    </main>
  );
}
