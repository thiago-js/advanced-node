export interface TokenGeranerator {
  generateToken: (params: TokenGeranerator.Params) => Promise<TokenGeranerator.Result>
}

export namespace TokenGeranerator {
  export type Params = {
    key: string
    expirationInMs: number
  }

  export type Result = string
}
