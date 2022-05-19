import { loadFacebookUserApi } from '@/data/contracts/api'
import { CreateFacebookAccountRepository, loadUserAccountRepository } from '@/data/contracts/api/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let LoadfacebookUserApi: MockProxy<loadFacebookUserApi>
  let LoadUserAccountRepo: MockProxy<loadUserAccountRepository>
  let CreateFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    LoadfacebookUserApi = mock()
    LoadUserAccountRepo = mock()
    CreateFacebookAccountRepo = mock()

    LoadfacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(
      LoadfacebookUserApi,
      LoadUserAccountRepo,
      CreateFacebookAccountRepo
    )
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

  it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
    await sut.perform({ token })

    expect(LoadUserAccountRepo.Load).toHaveBeenCalledWith({
      email: 'any_fb_email'
    })
    expect(LoadUserAccountRepo.Load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    LoadUserAccountRepo.Load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(CreateFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(CreateFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
