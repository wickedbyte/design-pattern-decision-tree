"use client";

import { useMounted } from "@/_lib/utils/use-mounted";
import { DecisionTreeGraph } from "./DecisionTreeGraph";

export function DecisionTreeGraphWrapper() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="h-[700px] w-full animate-pulse rounded-xl border border-border-primary bg-bg-surface shadow-sm" />
    );
  }

  return <DecisionTreeGraph />;
}
