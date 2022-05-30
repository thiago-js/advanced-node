import { LoadFacebookUserApi } from '@/data/contracts/api'
import { HttpGetClient } from '@/infra/http'

export class FacebookAPI {
  private readonly baseUrl: string

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string

  ) {
    this.baseUrl = 'https://graph.facebook.com'
  }

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/uauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}
