import { CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from './../contracts/api/repos/user-account'
import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { loadUserAccountRepository } from '@/data/contracts/api/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: loadFacebookUserApi,
    private readonly userAccountRepo: loadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(Params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.Load({ email: fbData.email })

      if (accountData?.name !== undefined) {
        await this.userAccountRepo.UpdateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId
        })
      } else { await this.userAccountRepo.createFromFacebook(fbData) }
    }

    return new AuthenticationError()
  }
}
