export interface loadUserAccountRepository {
  Load: (params: loadUserAccountRepository.Params) => Promise<void>
}

export namespace loadUserAccountRepository {
  export type Params = {
    email: string
  }
}
