import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'

export default function Memory() {
  return (
    <View className="space-y-4">
      <View className="flex-row items-center gap-2">
        <View className="h-px w-5 bg-gray-50" />

        <Text className="font-body text-xs text-gray-100">
          Date
        </Text>
      </View>
      <View className="space-y-4 px-8">
        <Image
          source={{ uri: null }}
          className="aspect-video w-full rounded-lg"
          alt="imagem"
        />

        <Text className="font-body text-base leading-relaxed text-gray-100">
          Text
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
}