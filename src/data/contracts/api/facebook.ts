export interface LoadFacebookUserApi {
  loadUser: (token: LoadFacebookUserByTokenApi.Params) => Promise<LoadFacebookUserByTokenApi.Result>
}

type FacebookReponse = {
  facebookId: string
  email: string
  name: string
}

export namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | FacebookReponse
}
