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
    httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' })
    httpClient.get.mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
    httpClient.get.mockResolvedValueOnce({
      id: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })

    sut = new FacebookAPI(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

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
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    const token = 'any_client_token'
    await sut.loadUser({ token })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: token
      }
    })
  })

  it('should return Facebook user', async () => {
    const token = 'any_client_token'
    const fbUser = await sut.loadUser({ token })

    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })
})
