import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { ABI, smartContractAddress } from "./ABI";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { PhotoIcon } from "@heroicons/react/24/outline";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MDEzNzFiOS1jOTkwLTQ2ZTctOGJlNi04MjZjMTdhYjg5ZWUiLCJlbWFpbCI6InRoaXNpc3NhdHlhaml0MDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjI0NGI1YzI4ZmQxYmI0MTBmZGVjIiwic2NvcGVkS2V5U2VjcmV0IjoiZWI1MGNmYzk2MDgyNDEyNDA2MjgzYzc0NDA5ZmJjOWY3NTc2ZTJhOTdhOGUzZjk0MWEwNDc0ZTY5ZWNmOGI4NiIsImlhdCI6MTcxMTgyOTM3MX0.yadQCDU2hudiOQun0W8DCyK875qW6XZROye3c__IHIA";

const NewPost = () => {
  const [certificate, setCertificate] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: smartContractAddress,
    abi: ABI,
    functionName: "safeMint",
  });
  const { address } = useAccount();

  useEffect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setUploading(true);
      const formData = new FormData();

      let ipfsHash = "QmPiBdvCPxCyTY5SuMQJ3s2jSb8Z9Bo7495mVDxWb6MNYJ";

      if (certificate) {
        formData.append("file", certificate);

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: formData,
        });

        const resData = await res.json();
        console.log("IMAGE", resData);

        ipfsHash = resData.IpfsHash;
      }

      formData.append("name", e.target.description.value);
      formData.append("description", e.target.description.value);
      const image = "https://apricot-legal-salamander-530.mypinata.cloud/ipfs/" + ipfsHash;
      formData.append("image", image);

      console.log(JSON.stringify(formData));

      const jsonData = {
        name: formData.get("name"),
        description: formData.get("description"),
        image: formData.get("image"),
      };

      const resJSON = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const resDataJSON = await resJSON.json();

      console.log("JSON", resDataJSON);

      const to = address;
      const uri = "https://apricot-legal-salamander-530.mypinata.cloud/ipfs/" + resDataJSON.IpfsHash;

      await writeAsync({
        args: [to, uri],
      });

      console.log("MINT", data);
      
      document.getElementById("my_modal_1").showModal();
    } catch (error) {
      console.log(error);
    } finally {

      setUploading(false);
    }
  };

  // const handleRemoveImage = () => {
  //   setCertificate(null);
  //   setImageURL(null);
  // };

  const handleFileChange = (e: any) => {
    setCertificate(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="max-w-[384px] w-full p-2 sm:p-5 rounded-lg border shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <input
            required
            type="text"
            className="outline-none bg-transparent w-full"
            placeholder="Write your win here..."
            name="description"
            id="description"
          />
        </div>
        {showImage && (
          <div>
            <input
              required
              type="file"
              className="border rounded w-full p-2 text-black"
              name="photo"
              id="photo"
              onChange={handleFileChange}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <button type="button" onClick={() => setShowImage(!showImage)}>
            <PhotoIcon className="h-5 w-5" />
          </button>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-full active:scale-95 transition-all"
          >
            {isLoading || uploading ? <span>Uploading...</span> : <span>Share Win</span>}
          </button>
        </div>
      </form>
      {/* {isSuccess && ( */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Your Achievement is Minted 🎉</h3>
            <p>Your can check your NFT on OpenSea, or share it on Whatsapp / Twitter.</p>
            <p>Link are avaible next to card, try refresing the app.</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      {/* )} */}
    </div>
  );
};

export default NewPost;
