"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { smartContractAddress } from "~~/components/ABI";
import NewPost from "~~/components/NewPost";
import Post from "~~/components/Post";

const Posts = () => {
  const [wins, setWins] = useState([]);

  useEffect(() => {
    const fetchWins = async () => {
      const result = await fetch(
        `https://polygon-mumbai.g.alchemy.com/nft/v3/7zhiF2LgPiX_2CDpozmcEHcdbtl0pERZ/getNFTsForContract?contractAddress=${smartContractAddress}&withMetadata=true&pageSize=100`,
        {
          method: "GET",
        },
      );
      const json = await result.json();
      setWins(json.nfts.reverse());
    };

    fetchWins();
  }, []);

  return (
    <div className="space-y-3">
      {wins.length !== 0 && <p className="text-right m-0">Total {wins.length} Wins Shared</p>}
      {wins.map((item: any, index: number) => (
        <Post
          key={index}
          text={item.description}
          address={item.mint.mintAddress}
          time={item.mint.timestamp}
          img={item.image.originalUrl}
          id={item.tokenId}
        />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 px-5">
        <NewPost />
        <div className="space-y-3 mt-3 max-w-[384px] w-full">
          <Posts />
        </div>
      </div>
    </>
  );
};

export default Home;
