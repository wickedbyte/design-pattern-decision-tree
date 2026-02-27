"use client";

import { useMounted } from "@/_lib/utils/use-mounted";
import { useMediaQuery } from "@/_lib/utils/use-media-query";
import { DecisionTreeDesktop } from "./DecisionTreeDesktop";
import { DecisionTreeMobile } from "./DecisionTreeMobile";

export function DecisionTreeContainer() {
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!mounted) {
    return (
      <div className="h-[500px] w-full animate-pulse rounded-xl border border-border-primary bg-bg-surface shadow-sm" />
    );
  }

  return isMobile ? <DecisionTreeMobile /> : <DecisionTreeDesktop />;
}
