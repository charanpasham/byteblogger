import { Alert } from "@/components/ui/alert";
import { auth } from "@/server/auth";
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

  // protect the admin page
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        Admin Dashboard
      </div>
    </main>
  );
}
