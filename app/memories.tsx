import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { api } from "../src/assets/lib/api"

import Logo from '../src/assets/title.svg'
import Memory from "../src/components/memory"

interface MemoryInterface {
  coverUrl: string
  excerpt: string
  id: string
  createdAt: string
}

export default function Memories() {
  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()
  const [memories, setMemories] = useState<MemoryInterface[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 px-8 flex-row items-center justify-between">
        <Logo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="mt-6 space-y-10">
          {memories.map((memory) => {
            return (
              <View
                key={memory.id}
                className="space-y-4"
              >
                <View className="flex-row items-center gap-2">
                  <View className="h-px w-5 bg-gray-50" />

                  <Text className="font-body text-xs text-gray-100">
                    {dayjs(memory.createdAt).format("MMMM D[, ]YYYY")}
                  </Text>
                </View>
                <View className="space-y-4 px-8">
                  <Image
                    source={{ uri: memory.coverUrl, }}
                    className="aspect-video w-full rounded-lg"
                    alt="imagem"
                  />

                  <Text className="font-body text-base leading-relaxed text-gray-100">
                    {memory.excerpt}
                  </Text>

                  <Link href="/memories/id" asChild>
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <Text className="font-body text-sm text-gray-200">
                        Read more
                      </Text>

                      <Icon name="arrow-right" size={16} color="#9e9ea0" />
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}