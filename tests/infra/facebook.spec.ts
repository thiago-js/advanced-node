import { LoadFacebookUserApi } from '@/data/contracts/api'
import { mock, MockProxy } from 'jest-mock-extended'

class FacebookAPI {
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

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

describe('FacebookAPI', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookAPI
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_id'
    httpClient = mock<HttpGetClient>()
  })

  beforeEach(() => {
    sut = new FacebookAPI(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    const tokenUser = { token: 'any_client_token' }
    await sut.loadUser(tokenUser)

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/uauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
