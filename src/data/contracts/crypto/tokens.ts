export interface TokenGeranerator {
  generateToken: (params: TokenGeranerator.Params) => Promise<void>
}

export namespace TokenGeranerator {
  export type Params = {
    key: string
  }
}
