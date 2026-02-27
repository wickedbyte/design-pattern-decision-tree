"use client";

import { useMounted } from "@/_lib/utils/use-mounted";
import { DecisionWizard } from "./DecisionWizard";

export function DecisionWizardWrapper() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="mx-auto h-[320px] w-full max-w-2xl animate-pulse rounded-2xl border border-border-primary bg-bg-surface shadow-sm" />
    );
  }

  return <DecisionWizard />;
}
