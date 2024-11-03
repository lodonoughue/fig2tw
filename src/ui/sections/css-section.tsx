import React from "react";
import Section from "@ui/components/section";
import { SectionProps } from "@ui/types";
import Result from "@ui/components/result";
import { CssRequest, CssResult } from "@common/types";
import { useConfig } from "@ui/contexts/config";
import { useResult } from "@ui/hooks/use-result";
import { downloadFile } from "@ui/utils/download";

export default function CssSection({ className, broker }: SectionProps) {
  const { config } = useConfig();
  const { result, reload } = useResult<CssRequest, CssResult>(
    broker,
    "CSS_RESULT",
    "CSS_REQUEST",
    config,
  );

  return (
    <Section className={className}>
      <Result
        className="grow"
        onReload={reload}
        onDownload={it => downloadFile("fig2tw.css", it)}>
        {result}
      </Result>
    </Section>
  );
}
