import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{role}</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
