import React, { ComponentType, useCallback, useContext, useState } from "react";
import { createContext, PropsWithChildren } from "react";
import mixpanel from "mixpanel-figma";
import { assert } from "@common/assert";
import { useResultEffect } from "@ui/hooks/use-result";
import { MessageBroker } from "@common/messages";
import { DocumentIdRequest, DocumentIdResult } from "@common/types";
import { v4 as uuid } from "uuid";

const MIXPANEL_KEY = import.meta.env.VITE_MIXPANEL_KEY;
const DEFAULT_DOCUMENT_ID = uuid();

const AnalyticsContext = createContext<State | null>(null);

export function AnalyticsProvider({ broker, section, children }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useResultEffect<DocumentIdRequest, DocumentIdResult>(
    broker,
    "DOCUMENT_ID_RESULT",
    "DOCUMENT_ID_REQUEST",
    documentId => {
      initMixpanel(documentId);
      setIsLoading(false);
    },
    [DEFAULT_DOCUMENT_ID],
    [setIsLoading],
  );

  const track = useCallback<State["track"]>(
    (event, properties = {}) => {
      const defaultProps = { "Section Name": section };
      mixpanel.track(event, { ...defaultProps, ...properties });
    },
    [section],
  );

  return (
    <AnalyticsContext.Provider value={{ track, section }}>
      {isLoading ? null : children}
    </AnalyticsContext.Provider>
  );
}

function initMixpanel(documentId: string) {
  mixpanel.init(MIXPANEL_KEY, {
    disable_cookie: true,
    disable_persistence: true,
  });

  mixpanel.identify(documentId);
}

export function useAnalytics() {
  const result = useContext(AnalyticsContext);
  assert(result, "useAnalytics must be used within a AnalyticsProvider");
  return result;
}

interface Props extends PropsWithChildren {
  broker: MessageBroker;
  section: string;
}

interface State {
  track: (event: string, properties?: Record<string, string>) => void;
  section: string;
}

/* v8 ignore next */
export const analyticsProviderFixtures = {
  analyticsProviderOf({
    section = "<mocked>",
    track = () => {},
  }: Partial<State>): ComponentType<PropsWithChildren> {
    return function AnalyticsProvider({ children }) {
      return (
        <AnalyticsContext.Provider value={{ track, section }}>
          {children}
        </AnalyticsContext.Provider>
      );
    };
  },
};
