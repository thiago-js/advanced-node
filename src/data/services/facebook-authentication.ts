import { CreateFacebookAccountRepository } from './../contracts/api/repos/user-account'
import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { loadUserAccountRepository } from '@/data/contracts/api/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: loadFacebookUserApi,
    private readonly userAccountRepo: loadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(Params)

    if (fbData !== undefined) {
      await this.userAccountRepo.Load({ email: fbData.email })
      await this.userAccountRepo.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}
