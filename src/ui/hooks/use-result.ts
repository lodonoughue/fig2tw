import { DependencyList, useCallback, useEffect, useState } from "react";
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

  const { reload } = useResultEffect(
    broker,
    resultChannel,
    requestChannel,
    result => setState({ isLoading: false, result }),
    args,
    [setState],
  );

  const _reload = useCallback(() => {
    setState({ result: null, isLoading: true });
    reload();
  }, [setState, reload]);

  return { result, isLoading, reload: _reload };
}

export function useResultEffect<
  TRequest extends Channel,
  TResult extends Channel,
>(
  broker: MessageBroker,
  resultChannel: TResult["name"],
  requestChannel: TRequest["name"],
  effect: (result: Parameters<TResult["handler"]>[0]) => void,
  args: Parameters<TRequest["handler"]>,
  deps: DependencyList,
) {
  const reload = useCallback(() => {
    broker.post<TRequest>(requestChannel, ...args);
  }, [broker, requestChannel, ...args]);

  useEffect(() => {
    const unsubscribe = broker.subscribe<TResult>(resultChannel, effect);
    return () => unsubscribe();
  }, [broker, resultChannel, ...deps]);

  useEffect(() => reload(), [reload]);

  return { reload };
}

interface State<TResult extends Channel> {
  result: Parameters<TResult["handler"]>[0] | null;
  isLoading: boolean;
}
