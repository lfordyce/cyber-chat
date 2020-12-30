import * as React from 'react';
import * as jspb from 'google-protobuf';
import { grpc } from '@improbable-eng/grpc-web';
import { getUnaryData, getDataStream } from './grpc/data';
import { GrpcClientContext } from './context';

export interface UnaryContextData {
  data: ReturnType<grpc.ProtobufMessage['toObject']> | null;
  loading: boolean;
  error: Error | null;
}

export function useUnary<
  TReq extends jspb.Message,
  TRes extends grpc.ProtobufMessage
>(
  request: TReq,
  service: grpc.UnaryMethodDefinition<TReq, TRes>
): UnaryContextData {
  const [data, setData] = React.useState<ReturnType<TRes['toObject']> | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Get client details
  const GrpcClient = React.useContext(GrpcClientContext);

  // Load data after the first render
  React.useEffect(() => {
    // Kick off
    setLoading(true);
    getUnaryData(request, service, GrpcClient.getHost())
      .then((response) => {
        setData(response);
        if (error) {
          setError(null);
        }
      })
      .catch((err) => {
        setError(err);
        if (data) {
          setData(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [GrpcClient, data, request, service, error]);

  return { data, loading, error };
}

export interface StreamContextData {
  data: ReturnType<grpc.ProtobufMessage['toObject']>[];
  loading: boolean;
  error: Error | null;
}

export function useStream<
  TReq extends jspb.Message,
  TRes extends grpc.ProtobufMessage
>(
  request: TReq,
  service: grpc.MethodDefinition<TReq, TRes>
): StreamContextData {
  const [data, setData] = React.useState<ReturnType<TRes['toObject']>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Get client details
  const GrpcClient = React.useContext(GrpcClientContext);

  React.useEffect(() => {
    setLoading(true);
    getDataStream(request, service, GrpcClient.getHost())
      .then((response) => {
        setData((state) => [...state, response]);
        if (error) {
          setError(null);
        }
      })
      .catch((err) => {
        setError(err);
        if (data) {
          setData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [GrpcClient, data, request, service, error]);

  return { data, loading, error };
}
