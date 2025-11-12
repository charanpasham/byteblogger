"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateBlogAction } from "./createBlogAction";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { MoveLeft, SkipBack } from "lucide-react";
import Link from "next/link";

export default function CreateBlogPage() {
  const user = useSession();
  const router = useRouter();
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[^\s]+$/, "Slug cannot contain spaces"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await CreateBlogAction(
        data.title,
        data.description || "",
        user.data?.user?.id || "",
        data.slug,
      );
      if (response.isSlugTaken) {
        form.setError("slug", {
          type: "manual",
          message: "This slug is already taken",
        });
      } else {
        router.push(`/admin/edit/${data.slug}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
    <Link href="/admin" aria-label="Back">
      <MoveLeft size={20} className="mb-5" />
    </Link>
      <Card className="p-5">
      <CardContent>
        <CardDescription className="my-5 text-xl font-bold">
          Create a new blog post
        </CardDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug ..." {...field} />
                  </FormControl>
                  <FormDescription>Slug should be unique</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="my-4">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    </>

  );
}
