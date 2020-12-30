// package: proto
// file: service.proto

import * as service_pb from './service_pb';
import { grpc } from '@improbable-eng/grpc-web';

type BroadcastCreateStream = {
  readonly methodName: string;
  readonly service: typeof Broadcast;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof service_pb.Connect;
  readonly responseType: typeof service_pb.Message;
};

type BroadcastBroadcastMessage = {
  readonly methodName: string;
  readonly service: typeof Broadcast;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof service_pb.Message;
  readonly responseType: typeof service_pb.Close;
};

export class Broadcast {
  static readonly serviceName: string;
  static readonly CreateStream: BroadcastCreateStream;
  static readonly BroadcastMessage: BroadcastBroadcastMessage;
}

export type ServiceError = {
  message: string;
  code: number;
  metadata: grpc.Metadata;
};
export type Status = { details: string; code: number; metadata: grpc.Metadata };

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(
    type: 'data',
    handler: (message: ResT) => void
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'end',
    handler: (status?: Status) => void
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'status',
    handler: (status: Status) => void
  ): BidirectionalStream<ReqT, ResT>;
}

export class BroadcastClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  createStream(
    requestMessage: service_pb.Connect,
    metadata?: grpc.Metadata
  ): ResponseStream<service_pb.Message>;
  broadcastMessage(
    requestMessage: service_pb.Message,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: service_pb.Close | null
    ) => void
  ): UnaryResponse;
  broadcastMessage(
    requestMessage: service_pb.Message,
    callback: (
      error: ServiceError | null,
      responseMessage: service_pb.Close | null
    ) => void
  ): UnaryResponse;
}
