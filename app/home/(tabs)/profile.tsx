import React from 'react';
import { View, YStack, Text, Avatar, Button, Separator } from 'tamagui';
import { useAuth } from '../../../src/contexts/AuthContext';
import { User, LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/splash');
  };

  return (
    <View flex={1} backgroundColor="$background">
      <YStack flex={1} padding="$4" space="$4">
        {/* Header */}
       <YStack ai="center" space="$4" py="$6"> {/* Ensure horizontal centering with ai="center" */}
  <Avatar
    circular
    size="$10" // Larger size for better visibility
    bg="$accent5" // Using accent for theme-aware blue
    borderWidth={2}
    borderColor="$accent8"
  >
    {user?.avatar ? (
      <Avatar.Image source={{ uri: user.avatar }} />
    ) : (
      <Avatar.Fallback
        bg="$accent5"
        jc="center" // Center content vertically
        ai="center" // Center content horizontally
      >
        <User size={48} color="$accent10" />
      </Avatar.Fallback>
    )}
  </Avatar>

          
          <YStack alignItems="center" space="$1">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              {user?.name || 'User Name'}
            </Text>
            <Text fontSize="$4" color="$gray11">
              {user?.email || 'user@example.com'}
            </Text>
          </YStack>
        </YStack>

        <Separator />

        {/* User Info Section */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Account Information
          </Text>
          
          <YStack space="$2" padding="$2" backgroundColor="$gray2" borderRadius="$4">
            <YStack space="$1">
              <Text fontSize="$3" color="$gray11">User ID</Text>
              <Text fontSize="$4" color="$color">{user?.id || 'N/A'}</Text>
            </YStack>
            
            <YStack space="$1">
              <Text fontSize="$3" color="$gray11">Email</Text>
              <Text fontSize="$4" color="$color">{user?.email || 'N/A'}</Text>
            </YStack>
            
            <YStack space="$1">
              <Text fontSize="$3" color="$gray11">Name</Text>
              <Text fontSize="$4" color="$color">{user?.name || 'N/A'}</Text>
            </YStack>
          </YStack>
        </YStack>

        <Separator />

        {/* Logout Button */}
        <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
          <Button
            size="$2"
            width={100}
            backgroundColor="$red10"
            color="white"
            icon={<LogOut size={20} />}
            onPress={handleLogout}
            pressStyle={{ backgroundColor: '$red11' }}
          >
            Logout
          </Button>
        </YStack>
      </YStack>
    </View>
  );
}
