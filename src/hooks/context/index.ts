import { createContext } from 'react';
import { GrpcClient } from '../grpc/client';

export const GrpcClientContext = createContext(
  new GrpcClient({ host: 'http://localhost:8080' })
);

export default {
  GrpcClientContext,
};
