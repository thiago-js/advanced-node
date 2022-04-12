import { FacebookAuthentication } from '@/domain/features/facebook-authentication'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserByToken: loadFacebookUserApi) {}

  async perform (Params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByToken.loadUser(Params)
  }
}

interface loadFacebookUserApi {
  loadUser: (token: loadFacebookUserByTokenApi.Params) => Promise<void>
}

namespace loadFacebookUserByTokenApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserByTokenApiSpy implements loadFacebookUserApi {
  token?: string

  async loadUser (params: loadFacebookUserByTokenApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with corret params', async () => {
    const LoadfacebookUserApi = new LoadFacebookUserByTokenApiSpy()
    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    await sut.perform({ token: 'any_token' })

    expect(LoadfacebookUserApi.token).toBe('any_token')
  })
})
