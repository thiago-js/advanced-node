import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with corret params', async () => {
    const LoadfacebookUserApi = {
      loadUser: jest.fn()
    }

    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    await sut.perform({ token: 'any_token' })

    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    const LoadfacebookUserApi = {
      loadUser: jest.fn()
    }

    LoadfacebookUserApi.loadUser.mockResolvedValue(undefined)

    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
