export interface loadFacebookUserApi {
  loadUser: (token: loadFacebookUserByTokenApi.Params) => Promise<loadFacebookUserByTokenApi.Result>
}

type FacebookReponse = {
  facebookId: string
  email: string
  name: string
}

export namespace loadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | FacebookReponse
}
