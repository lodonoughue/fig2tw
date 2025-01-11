import React from "react";
import Section from "@ui/components/section";
import { SectionProps } from "@ui/types";
import Result from "@ui/components/result";
import { TailwindRequest, TailwindResult } from "@common/channels";
import { useResult } from "@ui/hooks/use-result";
import { downloadFile } from "@ui/utils/download";

export default function TailwindSection({ className, broker }: SectionProps) {
  const { result, reload } = useResult<TailwindRequest, TailwindResult>(
    broker,
    "TAILWIND_RESULT",
    "TAILWIND_REQUEST",
  );

  return (
    <Section className={className}>
      <Result
        className="grow"
        onReload={reload}
        onDownload={it => downloadFile("tailwind.fig2tw.ts", it)}>
        {result}
      </Result>
    </Section>
  );
}
