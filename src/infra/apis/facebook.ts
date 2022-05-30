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

  private async getDebugToken (accessToken: string, token: string): Promise<any> {
    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: accessToken,
        input_token: token
      }
    })
  }

  private async getUserInfo (userId: string, token: string): Promise<any> {
    return this.httpClient.get({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      url: `${this.baseUrl}/${userId}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: token
      }
    })
  }

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const appToken = await this.getAppToken()
    const debugToken = await this.getDebugToken(appToken.access_token, params.token)
    const userInfo = await this.getUserInfo(debugToken.data.user_id, params.token)

    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email
    }
  }
}
