import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  LoadfacebookUserApi: MockProxy<loadFacebookUserApi>
}

const makeStu = (): SutTypes => {
  const LoadfacebookUserApi = mock<loadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(LoadfacebookUserApi)

  return {
    sut,
    LoadfacebookUserApi
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with corret params', async () => {
    const { sut, LoadfacebookUserApi } = makeStu()

    await sut.perform({ token: 'any_token' })

    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(LoadfacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    const { sut, LoadfacebookUserApi } = makeStu()

    LoadfacebookUserApi.loadUser.mockResolvedValue(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
