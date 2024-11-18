import { useCallback, useEffect, useState } from "react";
import { Channel, MessageBroker } from "@common/messages";

export function useResult<TRequest extends Channel, TResult extends Channel>(
  broker: MessageBroker,
  resultChannel: TResult["name"],
  requestChannel: TRequest["name"],
  ...args: Parameters<TRequest["handler"]>
) {
  const [{ result, isLoading }, setState] = useState<State<TResult>>({
    result: null,
    isLoading: true,
  });

  const reload = useCallback(() => {
    setState({ result: null, isLoading: true });
    broker.post<TRequest>(requestChannel, ...args);
  }, [broker, requestChannel, ...args]);

  useEffect(() => {
    const unsubscribe = broker.subscribe<TResult>(resultChannel, result =>
      setState({ isLoading: false, result }),
    );
    return () => unsubscribe();
  }, [broker, resultChannel, setState]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { result, isLoading, reload };
}

interface State<TResult extends Channel> {
  result: Parameters<TResult["handler"]>[0] | null;
  isLoading: boolean;
}
