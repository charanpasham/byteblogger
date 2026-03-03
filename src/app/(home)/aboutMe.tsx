import { Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutMe() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="items-center space-y-4">
        <CardTitle className="text-base font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          About Me
        </CardTitle>
        <div className="relative">
          <div className="mx-auto h-36 w-36 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 p-[2px] shadow-md md:h-40 md:w-40">
            <div className="h-full w-full rounded-full bg-background p-[2px]">
              <Image
                src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOuCrVi7c86VLCjOlv1KDwzMdkNhA50ycbugq28"
                width={160}
                height={160}
                alt="Charan profile photo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Hi, I&apos;m <span className="font-semibold text-foreground">Charan</span> — a software
          engineer who loves turning ideas into real products. I enjoy exploring new tech,
          building polished experiences, and sharing what I learn here on Byte Blogger.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/charanpasham"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            <img
              src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOujcW2xTaZpedGxmtyVDbkN2o16rnWuF38LMXj"
              alt="GitHub"
              className="h-5 w-5 dark:hidden"
            />
            <img
              src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOu9aF1Dsv2F3nI1hoptZJCeXGs9arqwjWRmLVl"
              alt="GitHub"
              className="hidden h-5 w-5 dark:block"
            />
            <span>GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/scharan19/"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
            <span>LinkedIn</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}