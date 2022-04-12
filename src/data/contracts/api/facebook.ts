export interface loadFacebookUserApi {
  loadUser: (token: loadFacebookUserByTokenApi.Params) => Promise<loadFacebookUserByTokenApi.Result>
}

export namespace loadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}
