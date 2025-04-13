import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const utapi = new UTApi();

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }: { req: Request }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.user.id };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: { userId: string };
        file: { ufsUrl: string };
      }) => {
        // This code RUNS ON YOUR SERVER after upload

        console.log("file url", file.ufsUrl);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      },
    ),
  profilePicture: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
      additionalProperties: {
        width: 200,
        aspectRatio: 1,
      },
    },
  })
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      const currentImageKey = user.user.image?.split("/f/")[1];
      return { userId: user.user.id, currentImageKey };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db
        .update(users)
        .set({
          image: file.ufsUrl,
        })
        .where(eq(users.id, metadata.userId));
      if (metadata.currentImageKey) {
        await utapi.deleteFiles(metadata.currentImageKey);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
