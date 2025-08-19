import React, { useState } from 'react';
import { ScrollView, YStack, XStack, Text, Button, Input, Card, Image, Spinner } from 'tamagui';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GET_RECIPES } from '../graphql/queries';
import { RootStackParamList } from '../navigation(optional)/types';
import { Recipe } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data, loading, error } = useQuery(GET_RECIPES);
  
  const recipes = data?.recipes || [];
  
  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(recipes.map((recipe: Recipe) => recipe.category))] as string[];

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
        <Text>Loading recipes...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Error loading recipes: {error.message}</Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold">Recipe Book</Text>
          <Button
            onPress={() => navigation.navigate('AddRecipe')}
            backgroundColor="$blue10"
            color="white"
          >
            Add Recipe
          </Button>
        </XStack>

        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          backgroundColor="$gray2"
          borderRadius="$4"
          padding="$3"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$2" paddingVertical="$2">
            <Button
              size="$2"
              backgroundColor={!selectedCategory ? '$blue10' : '$gray5'}
              onPress={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category: string) => (
              <Button
                key={category}
                size="$2"
                backgroundColor={selectedCategory === category ? '$blue10' : '$gray5'}
                onPress={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </XStack>
        </ScrollView>

        <YStack gap="$3">
          {filteredRecipes.map((recipe: Recipe) => (
            <Card
              key={recipe.id}
              padding="$4"
              borderRadius="$4"
              backgroundColor="$gray2"
              pressStyle={{ scale: 0.98 }}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
            >
              <XStack gap="$3">
                {recipe.image && (
                  <Image
                    source={{ uri: recipe.image }}
                    width={80}
                    height={80}
                    borderRadius="$2"
                  />
                )}
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="bold">{recipe.title}</Text>
                  <Text fontSize="$3" color="$gray11">{recipe.category}</Text>
                  <Text fontSize="$2" color="$gray10" numberOfLines={2}>
                    {recipe.ingredients.slice(0, 2).join(', ')}...
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
