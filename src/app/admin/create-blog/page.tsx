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
import { MoveLeft } from "lucide-react";
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
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: "An error occurred while creating the blog post",
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        onClick={() => router.push("/admin")}
        aria-label="Back to admin"
      >
        <MoveLeft size={18} />
        <span>Back to dashboard</span>
      </button>
      <Card className="border border-border/60 bg-card/80 shadow-sm">
        <CardContent className="pt-6">
          <CardDescription className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            New post
          </CardDescription>
          <h1 className="mb-2 text-xl font-semibold tracking-tight">
            Create a new blog post
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Add a title, optional description, and a unique slug. You can write the full content after creating the post.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My next big idea..." {...field} />
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
                      <Input placeholder="Optional short summary for the list view" {...field} />
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
                      <Input placeholder="my-next-big-idea" {...field} />
                    </FormControl>
                    <FormDescription>Slug should be unique</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2 w-full md:w-auto">
                Create post
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
