import { LoadFacebookUserApi } from '@/data/contracts/api'
import { HttpGetClient } from '@/infra/http'

export class FacebookAPI implements LoadFacebookUserApi {
  private readonly baseUrl: string

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string

  ) {
    this.baseUrl = 'https://graph.facebook.com'
  }

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token)

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }

  private async getAppToken (): Promise<any> {
    return this.httpClient.get({
      url: `${this.baseUrl}/uauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientoken: string): Promise<any> {
    const appToken = await this.getAppToken()
    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientoken
      }
    })
  }

  private async getUserInfo (clientToken: string): Promise<any> {
    const debugToken = await this.getDebugToken(clientToken)

    return this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
