import { FacebookAPI } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

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
    httpClient.get.mockResolvedValueOnce({
      access_token: 'any_app_token'
    })

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

  it('should get debug', async () => {
    const tokenUser = { token: 'any_client_token' }
    await sut.loadUser(tokenUser)

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
