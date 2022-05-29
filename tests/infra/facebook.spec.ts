import { LoadFacebookUserApi } from '@/data/contracts/api'
import { mock } from 'jest-mock-extended'

class FacebookAPI {
  private readonly baseUrl: string

  constructor (private readonly httpClient: HttpGetClient) {
    this.baseUrl = 'https://graph.facebook.com'
  }

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({ url: `${this.baseUrl}/uauth/access_token` })
  }
}

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookAPI', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookAPI(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/uauth/access_token'
    })
  })
})
