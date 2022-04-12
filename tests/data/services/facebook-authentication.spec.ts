import { loadFacebookUserApi, loadFacebookUserByTokenApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

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
