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

const Post = ({ text, address, time, img, id }: { text: string; address: string; time: string; img: string | null, id: string }) => {
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
    <>
      <div className="w-full p-2 sm:p-5 rounded-lg border shadow-md space-y-2 cursor-pointer" onClick={()=>document.getElementById('my_modal_69').showModal()}>
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
      <dialog id="my_modal_69" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Share with other</h3>
            <p><Link target="_blank" href={`https://testnets.opensea.io/assets/mumbai/0x1b1a7ef99fa21f06b31aa84f058b191983b9a52d/${id}`}>OpenSea</Link></p>
            <p><Link target="_blank" href={`https://api.whatsapp.com/send/?text=Check%20what%20I%20achieved%20at%2C%20https%3A%2F%2Ftestnets.opensea.io%2Fassets%2Fmumbai%2F0x1b1a7ef99fa21f06b31aa84f058b191983b9a52d%2F${id}&type=custom_url&app_absent=0`}>Whatsapp</Link></p>
            <p><Link target="_blank" href={`https://twitter.com/intent/tweet?text=Check%20what%20I%20achieved%20at%2C%20https%3A%2F%2Ftestnets.opensea.io%2Fassets%2Fmumbai%2F0x1b1a7ef99fa21f06b31aa84f058b191983b9a52d%2F${id}`}>Twitter</Link></p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
    </>
  );
};

export default Post;
