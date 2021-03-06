import { LoadFacebookUserApi } from '@/data/contracts/api'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/api/repos'
import { TokenGeranerator } from '@/data/contracts/crypto'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let crypto: MockProxy<TokenGeranerator>
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  let token: string

  beforeEach(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.Load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    )
  })

  it('should call loadFacebookUserApi with corret params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authenticatiopnError when loadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValue(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.Load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(userAccountRepo.Load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository With FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call OpenGenerator With correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id', expirationInMs: AccessToken.expirationInMs })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    const error = new Error('fb_error')
    facebookApi.loadUser.mockRejectedValueOnce(error)

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    const error = new Error('load_error')
    userAccountRepo.Load.mockRejectedValueOnce(error)

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    const error = new Error('save_error')
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(error)

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if TokenGeranerator throws', async () => {
    const error = new Error('Cripto_error')
    crypto.generateToken.mockRejectedValueOnce(error)

    const promise = sut.perform({ token })

    await expect(promise).rejects.toThrow(error)
  })
})
