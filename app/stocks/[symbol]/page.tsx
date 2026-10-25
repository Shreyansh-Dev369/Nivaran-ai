import React from "react";
import { INDIAN_STOCKS } from "../../../lib/data/stocks";
import { StockDetailClient } from "./StockDetailClient";

export function generateStaticParams() {
  return INDIAN_STOCKS.map((stock) => ({
    symbol: stock.symbol,
  }));
}

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetailPage({ params }: PageProps) {
  const { symbol } = await params;
  return <StockDetailClient symbol={symbol} />;
}
