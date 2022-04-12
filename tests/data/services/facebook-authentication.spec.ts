import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserByToken: loadFacebookUserApi) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByToken.loadUser(Params)
    return new AuthenticationError()
  }
}

interface loadFacebookUserApi {
  loadUser: (token: loadFacebookUserByTokenApi.Params) => Promise<loadFacebookUserByTokenApi.Result>
}

namespace loadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

class LoadFacebookUserByTokenApiSpy implements loadFacebookUserApi {
  token?: string
  result: undefined

  async loadUser (params: loadFacebookUserByTokenApi.Params): Promise<loadFacebookUserByTokenApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with corret params', async () => {
    const LoadfacebookUserApi = new LoadFacebookUserByTokenApiSpy()
    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    await sut.perform({ token: 'any_token' })

    expect(LoadfacebookUserApi.token).toBe('any_token')
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    const LoadfacebookUserApi = new LoadFacebookUserByTokenApiSpy()

    LoadfacebookUserApi.result = undefined

    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
