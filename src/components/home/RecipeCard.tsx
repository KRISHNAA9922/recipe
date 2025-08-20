// src/components/RecipeCard.tsx

import React from 'react';
import { Card, H4, Paragraph, useTheme, Button, XStack, YStack } from 'tamagui';
import { Image } from 'expo-image';
import { ChevronRight } from '@tamagui/lucide-icons';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    category?: string;
    image?: string;
  };
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevate
      size="$4"
      bordered
      margin="$2"
      width="45%"
      animation="bouncy"
      hoverStyle={{
        scale: 1.02,
        borderColor: theme.accent?.val || '#007AFF',
      }}
      pressStyle={{
        scale: 0.97,
        opacity: 0.85,
        backgroundColor: theme.backgroundHover?.val,
      }}
      onPress={onPress}
    >
      <Card.Header padded>
        <Image
          source={{ uri: recipe.image || 'https://via.placeholder.com/150' }}
          style={{ width: '100%', height: 120, borderRadius: 8 }}
          contentFit="cover"
        />
      </Card.Header>
      {/* Row: Content left, arrow right */}
      <XStack ai="center" jc="space-between" px="$3" pb="$2">
        <YStack>
          <H4 marginTop="$2">{recipe.title}</H4>
          {recipe.category && (
            <Paragraph theme="alt2">{recipe.category}</Paragraph>
          )}
        </YStack>
        <Button
          pt="$4"
          size="$1"
          icon={ChevronRight}
          onPress={onPress}
          chromeless
          color="$accent"
          hoverStyle={{ backgroundColor: theme.accentHover?.val }}
          pressStyle={{ scale: 0.95 }}
          animation="quick"
        />
      </XStack>
    </Card>
  );
}
