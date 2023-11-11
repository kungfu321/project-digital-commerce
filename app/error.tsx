'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const AdminError = () => {
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="text-center w-full max-w-lg flex flex-col items-center">
        <h3>Sorry, page not found!</h3>
        <div className="text-muted-foreground text-sm mt-2">{`Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.`}</div>
        <Image
          src="/images/illustration_404.svg"
          width={354}
          height={260}
          className="py-8"
          alt="404" />
        <Link href="/">
          <Button>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AdminError;
