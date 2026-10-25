import React from "react";
import { InviteClient } from "./InviteClient";

export function generateStaticParams() {
  return [
    { code: "alpha-2026" },
    { code: "growth-mandate" },
    { code: "advisory-demo" },
  ];
}

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;
  return <InviteClient code={code} />;
}
