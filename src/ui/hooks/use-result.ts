import { useCallback, useEffect, useState } from "react";
import { Channel, MessageBroker } from "@common/messages";

export function useResult<TRequest extends Channel, TResult extends Channel>(
  broker: MessageBroker,
  resultChannel: TResult["name"],
  requestChannel: TRequest["name"],
  ...args: Parameters<TRequest["handler"]>
) {
  const [result, setResult] = useState<
    Parameters<TResult["handler"]>[0] | null
  >(null);

  const reload = useCallback(() => {
    setResult(null);
    broker.post<TRequest>(requestChannel, ...args);
  }, [broker, requestChannel, ...args]);

  useEffect(
    () => broker.subscribe<TResult>(resultChannel, setResult),
    [broker, resultChannel, setResult],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { result, reload };
}
