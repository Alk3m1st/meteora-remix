import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

type PairInfo = {
  address: string; // Address of the liquidity pair
  apr: number; // 24-hour APR
  apy: number; // 24-hour APY
  base_fee_percentage: string; // Base fee rate
  bin_step: number; // Bin step
  cumulative_fee_volume: string; // Cumulative fee volume
  cumulative_trade_volume: string; // Cumulative trading volume
  current_price: number; // Price of the liquidity pair
  farm_apr: number; // Farm reward APR
  farm_apy: number; // Farm reward APY
  fees_24h: number; // Trading fees earned in the last 24 hours
  hide: boolean; // Flag to indicate whether the pair should be shown in the UI
  liquidity: string; // Total liquidity the liquidity pair holds (Total Value Locked)
  max_fee_percentage: string; // Maximum fee rate
  mint_x: string; // Address of token X mint of the liquidity pair
  mint_y: string; // Address of token Y mint of the liquidity pair
  name: string; // Name of the liquidity pair
  protocol_fee_percentage: string; // Protocol fee rate (cut from trade fee)
  reserve_x: string; // Address of token X reserve of the liquidity pair
  reserve_x_amount: number; // Token X amount the liquidity pair holds
  reserve_y: string; // Address of token Y reserve of the liquidity pair
  reserve_y_amount: number; // Token Y amount the liquidity pair holds
  reward_mint_x: string; // Address of the farming reward X of the liquidity pair
  reward_mint_y: string; // Address of the farming reward Y of the liquidity pair
  today_fees: number; // Trading fees earned since the beginning of the day
  trade_volume_24h: number; // Trading volume in the last 24 hours
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  const [pairs, setPairs] = useState([]);

  const getAllPairs = async () => {
    // use collect?
    try {
      // TODO: Do this server-side and reduce the result set (it's currently over 1.8 MB)
      const pairs = await fetch("https://dlmm-api.meteora.ag/pair/all");
      setPairs(await pairs.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPairs();
  }, []);

  const getTopTenFees = () => {
    return pairs
      .sort((a: PairInfo, b: PairInfo) => b.fees_24h - a.fees_24h)
      .slice(0, 10);
  };

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix (SPA Mode)</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/guides/spa-mode"
            rel="noreferrer"
          >
            SPA Mode Guide
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
      {pairs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl">Top 10 Fees</h2>
          {getTopTenFees().map((pair: PairInfo) => (
            <p key={`topten_${pair.address}`}>
              {pair.name} - {pair.fees_24h}
            </p>
          ))}
        </div>
      )}
      {pairs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl">All Pairs</h2>
          {pairs.map((pair: PairInfo) => (
            <p key={pair.address}>
              {pair.name} - {pair.fees_24h}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
