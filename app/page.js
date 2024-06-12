"use client";
import Image from "next/image";
import holdersList from "./HoldersList/holdersList_20067778.json";
import aacABI from "./ABI/AAC_ABI.json";
import { ethers, JsonRpcProvider } from 'ethers';
import Web3 from 'web3';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import { Link, Button } from "@nextui-org/react";
import { useEffect, useState } from 'react';

const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const infuraUrl = `https://mainnet.infura.io/v3/${infuraProjectId}`;

// Initialize web3
const web3 = new Web3(infuraUrl);

// Contract address
const aacContractAddress = '0x3edDc7ebC7db94f54b72D8Ed1F42cE6A527305bB';
const aacContract = new web3.eth.Contract(aacABI, aacContractAddress);

// Function to decode event data
function decodeData(data) {
  const sender = '0x' + data.slice(26, 66);
  const receiver = '0x' + data.slice(90, 130);
  const amountHex = data.slice(130, 194);
  const amount = parseInt(amountHex, 16);
  return { sender, receiver, amount };
}

function formatAddress(address) {
  return address.length > 10 ? `${address.slice(0, 12)}...${address.slice(-12)}` : address;
}

export default function Home() {
  const isMobile = window.innerWidth <= 768;
  const [holders, setHolders] = useState([]);
  const [ensNames, setEnsNames] = useState({
    "0x30ae41d5f9988d359c733232c6c693c0e645c77e": "WAAC Wrapper Contract",
    "0x338678fb544e101bc57ea4d3e316b3d2c79c5338": "goatishduck",
    "0x6cd9e417c21a4fd3eafa2bffd939411d40cc5ef4": "ngmi42069.eth",
    "0x5ce9ad759e41bf1b3dfc1a41db940a90d7a43460": "chainquantum.eth",
    "0x0ee01fd0bdb6b449cf343ecafa7116be49b5286a": "sexdog.eth",
    "0x6c1ddfb81a3666188267296f10253a5a9b5bae40": "johnnyguitar.eth",
    "0x15429b0ce3405bf4bb634035e15410f62ecb2647": "ayeaye.blanka.eth",
    "0x4c88d833f6c9ff72c87eb44a1ed4cb0f428d6aa0": "kindadumb.eth",
    "0xd3c8820d05d3d4be5bca47fccd677bd2fc116027": "tbar.eth",
    "0xa54df51afd6e6dec8e733ec66ec9c3c2484b5f71": "lowground.eth",
    "0x935d2fd458fdf41b6f7b62471f593797866a3ce6": "spreek.eth",
    "0x21c8dc59f2e9a11c4c1a0c310641968132c6b1be": "talrasha.eth",
    "0xb3897952ce7a4cea159d232dae8d02ca8273372e": "pimplenis.eth",
    "0xecee5497b9dbb82e1804e3224f67d00d8d891c69": "lono.eth",
    "0x0982f0115b5855004e37df6f2c0ed927dd2ed796": "photonwhale.eth",
    "0xa830488a25751f7da0f5488f714c96f0035687de": "hardporn.eth",
    "0xbb8eeb1b3494e123144ce38e1aac8f7b96b5efa5": "williamx.eth",
    "0xaf0f0b5c4110df25ab46dd9f025084229a9f8352": "thefunkghoulbrother.eth",
    "0xb109e15bb4f808e8cb64aad7d1e4588e0a1f4608": "happystaker.eth"
  });

  useEffect(() => {
    const fetchCoinTransferEvents = async () => {
      try {
        const events = await aacContract.getPastEvents('CoinTransfer', {
          fromBlock: 20067778,
          toBlock: 'latest'
        });

        const initialHoldersMap = new Map();
        holdersList.holders.forEach(holder => {
          initialHoldersMap.set(holder.address.toLowerCase(), { ...holder });
        });

        for (const event of events) {
          const { sender, receiver, amount } = decodeData(event.raw.data);

          const senderLower = sender.toLowerCase();
          const receiverLower = receiver.toLowerCase();

          // Update sender balance
          if (initialHoldersMap.has(senderLower)) {
            initialHoldersMap.get(senderLower).balance -= amount;
          } else {
            initialHoldersMap.set(senderLower, { address: sender, balance: -amount });
          }

          // Update receiver balance
          if (initialHoldersMap.has(receiverLower)) {
            initialHoldersMap.get(receiverLower).balance += amount;
          } else {
            initialHoldersMap.set(receiverLower, { address: receiver, balance: amount });
          }
        }
        const filteredHolders = Array.from(initialHoldersMap.values()).filter(holder => holder.balance > 0);

        // Sort holders by balance in descending order
        const sortedHolders = filteredHolders.sort((a, b) => b.balance - a.balance);

        // Update state with sorted holders list
        setHolders(sortedHolders);
      } catch (error) {
        console.error('Failed to fetch CoinTransfer events:', error);
      }
    };

    fetchCoinTransferEvents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-700">

      <div className='py-2 px-3 md:pt-2 md:pb-4 md:px-6 mt-2 bg-stone-600 text-center rounded-2xl border-yellow-500 border-8 w-auto text-yellow-500'>
        <h3 className=' text-6xl md:text-7xl'>AyeAyeCoin</h3>
        <h3 className=' text-4xl md:text-4xl mt-3 md:mb-1 mb-2'>Holders List</h3>
      </div>

      <Link href={`https://wrapper.ayeayecoin.xyz`} className="md:text-base text-xs mt-3" isExternal>
        <Button auto className=" bg-yellow-500 border-2 border-black" >
         AyeAyeCoin Wrapper Interface&nbsp;&rarr;
        </Button>
      </Link>

      <Table
        aria-label="AyeAyeCoin Holders List"
        className="text-center text-lg md:w-auto w-screen mb-4 mt-3"
        classNames={{
          wrapper: "bg-yellow-500 md:rounded-2xl rounded-none",
          th: "bg-yellow-200",
        }}
      >
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Address/Name</TableColumn>
          <TableColumn>AAC Balance</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Fetching data from the blockchain..."} >
          {holders.map((holder, index) => (
            <TableRow key={index}>
              <TableCell className={(index & 1 ? "bg-yellow-200 rounded-l-lg md:text-base text-xs" : "bg-yellow-500 md:text-base text-xs")}>{index > 0 ? index + "." : ""}</TableCell>
              <TableCell className={(index & 1 ? "bg-yellow-200 md:text-base text-xs" : "bg-yellow-500 md:text-base text-xs")}
              >
                <Link href={`https://etherscan.io/address/${holder.address}`} className={`md:text-base text-xs truncate-address`} isExternal>
                  {index > 0 ? ensNames[holder.address] || (isMobile ? formatAddress(holder.address) : holder.address) : <p>WAAC Wrapper Contract {isMobile ? <br></br> : ""}({((holder.balance / 6000000) * 100).toFixed(1)}%/6M wrapped)</p>}
                </Link>
              </TableCell>
              <TableCell className={(index & 1 ? "bg-yellow-200 rounded-r-lg md:text-base text-xs" : "bg-yellow-500 md:text-base text-xs")}>{holder.balance.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Link href={`https://ayeayecoin.xyz/`} className='mt-0' isExternal>
        <Image
          src="/AyeAyeCircle.png"
          width={300}
          height={300}
          alt="AyeAye"
        />
      </Link>

      <div className="flex flex-row bg-stone-600 gap-5 p-3 px-5 md:px-7 rounded-xl mt-4 mx-2 border-yellow-500 border-5">
        <Link href={`https://etherscan.io/address/0x30ae41d5f9988d359c733232c6c693c0e645c77e`} isExternal>
          <Image src="/etherscan.png" width={29} height={29} alt="etherscan" />
        </Link>
        <Link href={`https://etherscan.io/address/${aacContractAddress}`} isExternal>
          <Image src="/etherscan.png" width={29} height={29} alt="etherscan" />
        </Link>
        <Link href={`https://github.com/tschoerv/ayeayecoinholderslist-frontend`} isExternal>
          <Image src="/github.png" width={30} height={30} alt="github" />
        </Link>
        <Link href={`https://discord.gg/nft-relics`} isExternal>
          <Image src="/discord.png" width={30} height={30} alt="discord" />
        </Link>
        <Link href={`https://t.me/ayeayeportal`} isExternal>
          <Image src="/telegram.svg" width={30} height={30} alt="telegram" />
        </Link>
        <Link href={`https://x.com/AyeAyeCoin2015`} isExternal>
          <Image src="/twitter.png" width={30} height={30} alt="x" />
        </Link>
        <Link href={`https://dexscreener.com/ethereum/0xeba623e4f5c7735427a9ef491ecee082dd4bf6ce`} isExternal>
          <Image src="/dexscreener.png" width={30} height={30} alt="dexscreener" />
        </Link>
        <Link href={`https://www.coingecko.com/en/coins/wrapped-ayeayecoin`} isExternal>
          <Image src="/coingecko.png" width={30} height={30} alt="coingecko" />
        </Link>
      </div>

      <div className="flex flex-row mb-4 mt-2 text-white">
        <p>made by&nbsp;</p>
        <Link href={`https://twitter.com/tschoerv`} className=" bg-yellow-500 rounded-md" color='primary' isExternal>
          &nbsp;tschoerv.eth&nbsp;
        </Link>
        <p>&nbsp;- donations welcome!</p>
      </div>
    </div>
  );
}
