// app/(stack)/recipe/[id].tsx
import React, { useContext, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  Button,
  H2,
  Paragraph,
  ScrollView,
  Spinner,
  XStack,
  YStack,
  useTheme,
  Image as TamaguiImage, // Tamagui's Image for better integration
} from 'tamagui';
import { Edit3, Notebook, ArrowLeft } from '@tamagui/lucide-icons';

import { GET_RECIPE } from '../../../src/graphql/queries';
import { ThemeContext } from '../../_layout'; // Import for light/dark mode

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const tamaguiTheme = useTheme();

  const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
    variables: { id },
  });

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleEditRecipe = () => {
    router.push(`/edit-recipe/${id}`);
  };

  const handleAddNotes = () => {
    router.push(`/recipe-notes/${id}`);
  };

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Spinner size="large" color="$accent" />
        <Paragraph>Loading recipe...</Paragraph>
      </YStack>
    );
  }

  if (error || !data?.recipe) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Paragraph color="$red10">{error ? `Error: ${error.message}` : 'Recipe not found'}</Paragraph>
      </YStack>
    );
  }

  const recipe = data.recipe; // Assuming Recipe type is handled in your app

  // Dynamic styles based on theme
  const isDark = theme === 'dark';
  const sectionBg = isDark ? '$backgroundHover' : '$backgroundStrong';
  const textColor = '$color';

  // Handle MongoDB date format (extract $date string if it's an object)
  const createdDate = recipe.createdAt
    ? new Date(parseInt(recipe.createdAt)).toLocaleDateString()
    : 'N/A';
  const updatedDate = recipe.updatedAt
    ? new Date(parseInt(recipe.updatedAt)).toLocaleDateString()
    : 'N/A';

  console.log('Recipe Data:', recipe); // Debugging output

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack
        ai="center"
        jc="space-between"
        p="$4"
        bg="$backgroundStrong"
        elevation="$2"
      >
        <Button icon={ArrowLeft} circular onPress={() => router.back()} />
        <H2>{recipe.title}</H2>
        <YStack w={40} /> {/* Spacer to center the title */}
      </XStack>

      <ScrollView>
        {/* Recipe Image */}
        {recipe.image && (
          <YStack p="$4" ai="center">
            <TamaguiImage
              source={{ uri: recipe.image }}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              resizeMode="cover"
            />
          </YStack>
        )}

        {/* Ingredients Section */}
        <YStack space="$2" p="$4" bg={sectionBg}>
          <H2 color={textColor}>Ingredients</H2>
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <Paragraph key={index} color="$color11">• {ingredient}</Paragraph>
          ))}
        </YStack>

        {/* Steps Section */}
        <YStack space="$2" p="$4" bg={sectionBg}>
          <H2 color={textColor}>Steps</H2>
          {recipe.steps.map((step: string, index: number) => (
            <Paragraph key={index} color="$color11">{index + 1}. {step}</Paragraph>
          ))}
        </YStack>

        {/* Notes Section */}
        <YStack space="$2" p="$4" bg={sectionBg}>
          <H2 color={textColor}>Notes</H2>
          {recipe.notes ? (
            <Paragraph color="$color11">{recipe.notes}</Paragraph>
          ) : (
            <Paragraph color="$color10" fontStyle="italic">No notes added yet.</Paragraph>
          )}
        </YStack>

        {/* Details Section */}
        <YStack space="$2" p="$4" bg={sectionBg}>
          <H2 color={textColor}>Details</H2>
          <Paragraph color="$color11">Category: {recipe.category}</Paragraph>
          <Paragraph color="$color11">Created: {createdDate}</Paragraph>
          <Paragraph color="$color11">Last Updated: {updatedDate}</Paragraph>
        </YStack>

        {/* Actions */}
        <XStack space="$4" p="$4" jc="space-around">
          <Button
            theme="active"
            icon={Edit3}
            onPress={handleEditRecipe}
            flex={1}
            animation="bouncy"
            pressStyle={{ scale: 0.95 }}
          >
            Edit Recipe
          </Button>
          <Button
            theme="alt1"
            icon={Notebook}
            onPress={handleAddNotes}
            flex={1}
            animation="bouncy"
            pressStyle={{ scale: 0.95 }}
          >
            View Notes
          </Button>
        </XStack>
      </ScrollView>
    </YStack>
  );
}
