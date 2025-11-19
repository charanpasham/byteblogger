import { Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AboutMe() {
    return(
        <>
            <h2 className="text-lg font-semibold">About Me</h2>
            <Image src="https://media.licdn.com/dms/image/v2/C5603AQGP6BIGUu9IfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1542478223844?e=1764806400&v=beta&t=rJpa1VUEf1SkermJo8Cqx4crg6BY-yqIaZkKluMUOS8" width={200} height={200} alt="Profile Picture" className="rounded-full mx-auto" />
            <p className="text-base text-gray-800 dark:text-gray-300">
              Hi, I'm Charan! I'm a software engineer who loves turning ideas into reality through code. I love exploring new tech and sharing my journey here on Byte Blogger.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="https://github.com/charanpasham" target="_blank" className="mt-2">
                <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOujcW2xTaZpedGxmtyVDbkN2o16rnWuF38LMXj" alt="GitHub Logo" className="dark:hidden w-6 h-6" />
                <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOu9aF1Dsv2F3nI1hoptZJCeXGs9arqwjWRmLVl" alt="GitHub Logo" className="hidden dark:block w-6 h-6" />
              </Link>
              <Link href="https://www.linkedin.com/in/scharan19/" target="_blank" className="mt-2">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </>
    );
}