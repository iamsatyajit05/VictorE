"use client";

import { useEffect, useState } from "react";
import Post from "~~/components/Post";

const Page = ({ params }: { params: { address: string } }) => {
  const [wins, setWins] = useState([]);

  useEffect(() => {
    const fetchWins = async () => {
      const result = await fetch(
        `https://polygon-mumbai.g.alchemy.com/nft/v3/7zhiF2LgPiX_2CDpozmcEHcdbtl0pERZ/getNFTsForOwner?owner=${params.address}&withMetadata=true&pageSize=100`,
        {
          method: "GET",
        },
      );
      const json = await result.json();

      setWins(json.ownedNfts.reverse());
    };

    fetchWins();
  }, [params.address]);

  return (
    <div className="max-w-[384px] w-full mx-auto space-y-3">
      {wins.length !== 0 && <p className="text-right m-0">Total {wins.length} Wins Shared</p>}
      {wins.map((item: any, index: number) => (
        <Post
          key={index}
          text={item.description}
          address={item.mint.mintAddress}
          time={item.mint.timestamp}
          img={item.image.originalUrl}
        />
      ))}
      {wins.length === 0 && <div className="text-center mt-10">No NFTs found</div>}
    </div>
  );
};

export default Page;
