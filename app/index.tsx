import { Text, TouchableOpacity, View } from 'react-native'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/assets/lib/api'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'

import Logo from '../src/assets/title.svg'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/bbd19a89df1b2e1631e1',
};

export default function App() {
  const router = useRouter()

  const [request, response, githubSignin] = useAuthRequest(
    {
      clientId: 'bbd19a89df1b2e1631e1',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'my-wormhole'
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {

    /* checar endereço url depois
      console.log(
        makeRedirectUri({
        scheme: 'my-wormhole'
      })
      )
    */
    if (response?.type === 'success') {
      const { code } = response.params;

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className=" flex-1 items-center justify-center px-8 py-10">
      <View className="space-y-10">
        <View className="justify-center items-center">
          <Logo />
        </View>

        <View className="space-y-2">
          <Text className="text-center font-title text-3xl leading-tight text-gray-50">
            Your wormhole is here!
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Collect remarkable moments of your journey and share them (if you want) with the world!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => githubSignin()}
        >
          <Text className="text-center font-alt text-lg uppercase text-black">
            CREATE MEMORY
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200 absolute bottom-4">
        Made with 💜 @ NLW. Powered by Rocketseat
      </Text>
    </View>
  );
}
