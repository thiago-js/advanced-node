# Facebook API

> ## App Token (server)

-   Request to https://graph.facebook.com/uauth/access_token
-   Verb Get
-   Params: client_id, client_secret, grant_type (client_credentials)
-   Results: { access_token }

> ## Debug Token

-   Request to https://graph.facebook.com/uauth/access_token
-   Verb Get
-   Params: access_token (server), input_token (client)
-   Results: { data: { user_id } }

> ## User Info

-   Request to https://graph.facebook.com/uauth/access_token
-   Verb Get
-   Params: fields (id, name email), access_token (client)
-   Results: { id, name , email }
