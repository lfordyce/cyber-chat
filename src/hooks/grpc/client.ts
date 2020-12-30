export interface IGrpcClientOptions {
  host: string;
}

export class GrpcClient {
  private readonly host: string;

  public constructor(options: IGrpcClientOptions) {
    this.host = GrpcClient.validateHost(options.host);
  }

  public getHost(): string {
    return this.host;
  }

  private static validateHost(host: string): string {
    return host;
  }
}
