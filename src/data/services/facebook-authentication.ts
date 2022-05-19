import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/api/repos'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(Params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.Load({ email: fbData.email })
      const facebookAccount = new FacebookAccount(fbData, accountData)

      await this.userAccountRepo.saveWithFacebook(facebookAccount)
    }

    return new AuthenticationError()
  }
}
