import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with corret params', async () => {
    const LoadfacebookUserApi = mock<loadFacebookUserApi>()

    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    await sut.perform({ token: 'any_token' })

    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    const LoadfacebookUserApi = mock<loadFacebookUserApi>()

    LoadfacebookUserApi.loadUser.mockResolvedValue(undefined)

    const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
