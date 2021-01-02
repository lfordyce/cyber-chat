import { BroadcastClient } from './proto/service_pb_service';

export type GRPCClients = {
  broadcastClient: BroadcastClient;
};

export const gRPCClients = {
  broadcastClient: new BroadcastClient('http://localhost:8080'),
};
