export interface loadUserAccountRepository {
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

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}
export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
}

export interface UpdateFacebookAccountRepository {
  UpdateWithFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<void>
}
export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string
    name?: string
    facebookId: string
  }
}
