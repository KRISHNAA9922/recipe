import React from 'react';
import { ScrollView, YStack, XStack, Text, Button, Image, Card } from 'tamagui';
import { useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { GET_RECIPE } from '../graphql/queries';
import { RootStackParamList } from '../navigation/types';
import { Recipe } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RecipeDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { recipeId } = route.params as { recipeId: string };

  const { data, loading, error } = useQuery(GET_RECIPE, {
    variables: { id: recipeId }
  });

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading recipe details...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Error loading recipe: {error.message}</Text>
      </YStack>
    );
  }

  const recipe = data?.recipe;

  if (!recipe) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Recipe not found</Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        {recipe.image && (
          <Image
            source={{ uri: recipe.image }}
            width="100%"
            height={200}
            borderRadius="$4"
          />
        )}
        
        <YStack gap="$2">
          <Text fontSize="$8" fontWeight="bold">{recipe.title}</Text>
          <Text fontSize="$4" color="$gray11">{recipe.category}</Text>
        </YStack>

        <Card padding="$4" backgroundColor="$gray2" borderRadius="$4">
          <Text fontSize="$5" fontWeight="bold" marginBottom="$2">Ingredients</Text>
          <YStack gap="$1">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <Text key={index} fontSize="$3">• {ingredient}</Text>
            ))}
          </YStack>
        </Card>

        <Card padding="$4" backgroundColor="$gray2" borderRadius="$4">
          <Text fontSize="$5" fontWeight="bold" marginBottom="$2">Steps</Text>
          <YStack gap="$2">
            {recipe.steps.map((step: string, index: number) => (
              <Text key={index} fontSize="$3">{index + 1}. {step}</Text>
            ))}
          </YStack>
        </Card>

        {recipe.notes && (
          <Card padding="$4" backgroundColor="$gray2" borderRadius="$4">
            <Text fontSize="$5" fontWeight="bold" marginBottom="$2">Notes</Text>
            <Text fontSize="$3">{recipe.notes}</Text>
          </Card>
        )}

        <XStack gap="$3" marginTop="$4">
          <Button
            flex={1}
            backgroundColor="$blue10"
            color="white"
            onPress={() => navigation.navigate('EditRecipe', { recipeId: recipe.id })}
          >
            Edit Recipe
          </Button>
          <Button
            flex={1}
            backgroundColor="$green10"
            color="white"
            onPress={() => navigation.navigate('RecipeNotes', { 
              recipeId: recipe.id, 
              recipeTitle: recipe.title 
            })}
          >
            View Notes
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
