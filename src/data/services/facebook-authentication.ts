import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/api/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGeranerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGeranerator
  ) {}

  async perform (Params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const expirationInMs = AccessToken.expirationInMs
    const fbData = await this.facebookApi.loadUser(Params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.Load({ email: fbData.email })
      const facebookAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs })
      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
