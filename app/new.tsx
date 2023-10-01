import { ScrollView, Switch, Text, TextInput, Image, TouchableOpacity, View } from "react-native"
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { useState } from "react"
import { api } from "../src/assets/lib/api"

import Logo from '../src/assets/title.svg'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg'
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post('/memories', {
      content,
      isPublic,
      coverUrl
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <Logo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-redspecial">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{
              false: '#767577',
              true: '#7F1D1D'
            }}
            thumbColor={isPublic ? '#FE5B7F' : '#9E9EA0'}
          />
          <Text className="font-body text-base text-gray-200">
            Make memory public
          </Text>
        </View>

        <TouchableOpacity
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          onPress={openImagePicker}
          activeOpacity={0.7}
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Add cover photo or video
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565A"
          placeholder="Feel free to add photos, videos and stories about this experience that you want to remember forever."
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-3"
          onPress={handleCreateMemory}
        >
          <Text className="text-center font-alt text-lg uppercase text-black">
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}