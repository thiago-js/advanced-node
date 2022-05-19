import { CreateFacebookAccountRepository } from './../contracts/api/repos/user-account'
import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { loadUserAccountRepository } from '@/data/contracts/api/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByToken: loadFacebookUserApi,
    private readonly loadUserAccountRepository: loadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserByToken.loadUser(Params)

    if (fbData !== undefined) {
      await this.loadUserAccountRepository.Load({ email: fbData.email })
      await this.createFacebookAccountRepository.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}
