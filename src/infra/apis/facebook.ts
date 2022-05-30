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
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}/uauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })

    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token
      }
    })

    await this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: params.token
      }
    })
  }
}
