import { ImageBackground } from "react-native"
import { styled } from 'nativewind'
import { StatusBar } from "expo-status-bar"
import { SplashScreen, Stack } from "expo-router"
import { useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import Stripes from '../src/assets/stripes.svg'
import blurBg from '../src/assets/bg_blur.png'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then(token => {
      setIsAuthenticated(true)
    })
  }, [])

  if (!hasLoadedFonts) return <SplashScreen />;

  return (
    <ImageBackground
      source={blurBg}
      className="bg-gray-900 flex-1 relative"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />

      <StatusBar style="light" translucent/>

      <Stack screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent'
        },
        animation: 'fade',
      }}
      >
        <Stack.Screen name="index" redirect={isAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  )
}