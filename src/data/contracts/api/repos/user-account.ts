export interface LoadUserAccountRepository {
  Load: (params: loadUserAccountRepository.Params) => Promise<loadUserAccountRepository.Result>
}

export namespace loadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<void>
}
export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }
}
