import * as jspb from 'google-protobuf';
import { grpc } from '@improbable-eng/grpc-web';

export function getUnaryData<
  TReq extends jspb.Message,
  TRes extends grpc.ProtobufMessage
>(
  request: TReq,
  service: grpc.UnaryMethodDefinition<TReq, TRes>,
  host: string
): Promise<ReturnType<TRes['toObject']>> {
  return new Promise((resolve, reject) => {
    grpc.unary(service, {
      request,
      host,
      onEnd: (res: grpc.UnaryOutput<TRes>) => {
        const { status, statusMessage, message } = res;
        if (status !== grpc.Code.OK) {
          return reject(new Error(`Error ${status}: ${statusMessage}`));
        }
        if (!message) {
          return reject(
            new Error(`Error ${grpc.Code.NotFound} : No data found`)
          );
        }
        return resolve(message.toObject() as ReturnType<TRes['toObject']>);
      },
    });
  });
}

export function getDataStream<
  TReq extends jspb.Message,
  TRes extends grpc.ProtobufMessage
>(
  request: TReq,
  service: grpc.MethodDefinition<TReq, TRes>,
  host: string
): Promise<ReturnType<TRes['toObject']>> {
  return new Promise<ReturnType<TRes['toObject']>>((resolve, reject) => {
    const client = grpc.client(service, {
      host,
    });
    client.onMessage((message: grpc.ProtobufMessage) => {
      return resolve(message.toObject() as ReturnType<TRes['toObject']>);
    });
    client.onEnd(
      (code: grpc.Code, message: string, trailers: grpc.Metadata) => {
        if (code !== grpc.Code.OK) {
          return reject(
            new Error(`Error ${code}: ${message} Trailers: ${trailers}`)
          );
        }
        // return resolve(message);
        return null;
      }
    );
    client.start();
    client.send(request);
  });
}
