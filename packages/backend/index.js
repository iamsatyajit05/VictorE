const express = require("express");
const pinataSDK = require("@pinata/sdk");
const fetch = require("node-fetch");
const { PassThrough } = require("stream");

// API Key: da9d7b7ef32e8201e0fa
//  API Secret: 9c31bb114ecf098e7188f7a58d54d90b9c942fc5684fc5bf296ffd9e660038c1
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MDEzNzFiOS1jOTkwLTQ2ZTctOGJlNi04MjZjMTdhYjg5ZWUiLCJlbWFpbCI6InRoaXNpc3NhdHlhaml0MDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRhOWQ3YjdlZjMyZTgyMDFlMGZhIiwic2NvcGVkS2V5U2VjcmV0IjoiOWMzMWJiMTE0ZWNmMDk4ZTcxODhmN2E1OGQ1NGQ5MGI5Yzk0MmZjNTY4NGZjNWJmMjk2ZmZkOWU2NjAwMzhjMSIsImlhdCI6MTcxMTc3NDY3NH0.euCK0KuUHtyMm6Uts7W7uaPGLE9g6kaC7FTp0XsSGq0

const app = express();
const port = 5000;

const pinata = new pinataSDK({
  pinataJWTKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1MDEzNzFiOS1jOTkwLTQ2ZTctOGJlNi04MjZjMTdhYjg5ZWUiLCJlbWFpbCI6InRoaXNpc3NhdHlhaml0MDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRhOWQ3YjdlZjMyZTgyMDFlMGZhIiwic2NvcGVkS2V5U2VjcmV0IjoiOWMzMWJiMTE0ZWNmMDk4ZTcxODhmN2E1OGQ1NGQ5MGI5Yzk0MmZjNTY4NGZjNWJmMjk2ZmZkOWU2NjAwMzhjMSIsImlhdCI6MTcxMTc3NDY3NH0.euCK0KuUHtyMm6Uts7W7uaPGLE9g6kaC7FTp0XsSGq0",
});

app.use(express.json());

app.post("/api/files", async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    console.log(name, description);

    const json = {
      name: name,
      description: description,
      image:
        "https://apricot-legal-salamander-530.mypinata.cloud/ipfs/QmPiBdvCPxCyTY5SuMQJ3s2jSb8Z9Bo7495mVDxWb6MNYJ",
    };

    const pinataResponse = await pinata.pinJSONToIPFS(json);

    // // Respond with the IPFS hash and other details
    res.status(200).json({
      success: true,
      ipfsHash: pinataResponse.IpfsHash,
      pinataUrl:
        "https://apricot-legal-salamander-530.mypinata.cloud/ipfs/" +
        pinataResponse.IpfsHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle errors
    console.error("Error pinning JSON to IPFS:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
