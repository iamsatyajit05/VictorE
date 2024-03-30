"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import { useTheme } from "next-themes";

const options = {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const Post = ({ text, address, time, img }: { text: string; address: string; time: string; img: string | null }) => {
  // const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  console.log(mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", options);
  };

  const trimAddress = (address: string) => {
    return `${address?.slice(0, 6)}...${address?.slice(-5, -1)}`;
  };

  return (
    <div className="w-full p-2 sm:p-5 rounded-lg border shadow-md space-y-2">
      <div>
        <Link href={`/profile/${address}`} className="text-xs opacity-80 hover:underline">
          {trimAddress(address)}
        </Link>
        <p className="m-0">{text}</p>
      </div>
      {img && img !== "https://ipfs.io/ipfs/QmPiBdvCPxCyTY5SuMQJ3s2jSb8Z9Bo7495mVDxWb6MNYJ" && (
        <div>
          <Image src={img} alt="" height={100} width={100} className="w-full h-auto rounded" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xs opacity-80">{formattedDate(time)}</span>
      </div>
    </div>
  );
};

export default Post;
