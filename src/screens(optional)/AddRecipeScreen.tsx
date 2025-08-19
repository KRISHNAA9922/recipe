import React, { useState } from 'react';
import { ScrollView, YStack, XStack, Text, Button, Input, TextArea, Image } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE } from '../graphql/queries';
import { RootStackParamList } from '../navigation(optional)/types';
import { RecipeInput } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function AddRecipeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      navigation.goBack();
    },
    refetchQueries: [{ query: CREATE_RECIPE }],
  });

  const handleSubmit = () => {
    if (!title || !ingredients || !steps || !category) {
      alert('Please fill in all required fields');
      return;
    }

    const recipeInput: RecipeInput = {
      title,
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      steps: steps.split('\n').filter(s => s.trim()),
      category,
      image: image || undefined,
      notes: notes || undefined,
    };

    createRecipe({
      variables: { input: recipeInput },
    });
  };

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">Add New Recipe</Text>

        <YStack gap="$3">
          <Input
            placeholder="Recipe Title"
            value={title}
            onChangeText={setTitle}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
          />

          <Input
            placeholder="Category (e.g., breakfast, dessert)"
            value={category}
            onChangeText={setCategory}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
          />

          <TextArea
            placeholder="Ingredients (one per line)"
            value={ingredients}
            onChangeText={setIngredients}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
            minHeight={100}
          />

          <TextArea
            placeholder="Steps (one per line)"
            value={steps}
            onChangeText={setSteps}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
            minHeight={100}
          />

          <Input
            placeholder="Image URL (optional)"
            value={image}
            onChangeText={setImage}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
          />

          <TextArea
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
            minHeight={80}
          />
        </YStack>

        <XStack gap="$3">
          <Button
            flex={1}
            backgroundColor="$blue10"
            color="white"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Recipe'}
          </Button>
          <Button
            flex={1}
            backgroundColor="$gray5"
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
