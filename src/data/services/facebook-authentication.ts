import { loadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserByToken: loadFacebookUserApi) {}

  async perform (Params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserByToken.loadUser(Params)
    return new AuthenticationError()
  }
}
