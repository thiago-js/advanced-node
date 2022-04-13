import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let LoadfacebookUserApi: MockProxy<loadFacebookUserApi>
  const token = 'any_token'

  beforeEach(() => {
    LoadfacebookUserApi = mock()
    sut = new FacebookAuthenticationService(LoadfacebookUserApi)
  })

  it('should call loadFacebookUserApi with corret params', async () => {
    await sut.perform({ token })

    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    LoadfacebookUserApi.loadUser.mockResolvedValue(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
