// app/(tabs)/add-recipe.tsx (or your file path)

import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import {
  AlertDialog,
  Button,
  H4,
  Input,
  Label,
  Paragraph,
  ScrollView,
  XStack,
  YStack,
  useTheme,
} from 'tamagui';
import { ArrowLeft, Save } from '@tamagui/lucide-icons';

import { CREATE_RECIPE } from '../../../src/graphql/queries';
import { ThemeContext } from '../../_layout'; // Import for light/dark mode

export default function AddRecipeScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext); // Get current theme
  const tamaguiTheme = useTheme(); // Access theme tokens

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('lunch');
  const [image, setImage] = useState(''); // New state for image URL

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      router.back(); // Navigate back on success
    },
    onError: (error) => {
      // Use Tamagui AlertDialog for error instead of native Alert
      // You can trigger it here or handle via state
     // console.error('Error:', error);
    },
  });

  const handleSave = async () => {
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      // Trigger error dialog
      return;
    }

    try {
      const ingredientsArray = ingredients.split('\n').filter(i => i.trim());
      const stepsArray = instructions.split('\n').filter(i => i.trim());

      await createRecipe({
        variables: {
          input: {
            title: title.trim(),
            ingredients: ingredientsArray,
            steps: stepsArray,
            category,
            notes: description.trim(),
            image: image.trim() 
          }
        }
      });
    } catch (error) {
      //console.error('Error saving recipe:', error);
    }
  };

  // Dynamic styles based on theme
  const isDark = theme === 'dark';
  const inputBg = isDark ? '$backgroundHover' : '$background';
  const labelColor = isDark ? '$gray10' : '$gray12';

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack ai="center" jc="space-between" p="$4" bg="$backgroundStrong" elevation="$2">
        <Button icon={ArrowLeft} circular onPress={() => router.back()} />
        <H4> Add New Recipe </H4>
        <Button icon={Save} circular onPress={handleSave} disabled={loading} />
      </XStack>

      <ScrollView>
        <YStack space="$4" p="$4">
          {/* Title Input */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Recipe Title *</Label>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Enter recipe title"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Category Input */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Category *</Label>
            <Input
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., breakfast, lunch, dinner, dessert"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Description Input */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Description</Label>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description"
              multiline
              numberOfLines={3}
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Ingredients Input */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Ingredients * (one per line)</Label>
            <Input
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="e.g., 2 cups flour\n1 tsp salt\n3 eggs"
              multiline
              numberOfLines={5}
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Instructions Input */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Instructions * (one step per line)</Label>
            <Input
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g., Preheat oven to 350°F\nMix dry ingredients\nAdd wet ingredients"
              multiline
              numberOfLines={5}
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* New Image Input (URL) */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">Image URL</Label>
            <Input
              value={image}
              onChangeText={setImage}
              placeholder="Enter image URL (optional)"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Save Button */}
          <Button
            theme="active"
            size="$5"
            onPress={handleSave}
            disabled={loading}
            animation="bouncy"
            pressStyle={{ scale: 0.95 }}
          >
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>

          {/* Cancel Button */}
          <Button
            theme="alt1"
            size="$5"
            onPress={() => router.back()}
          >
            Cancel
          </Button>
        </YStack>
      </ScrollView>

      {/* Error Dialog Example (Trigger via state if needed) */}
      <AlertDialog>
        <AlertDialog.Trigger asChild>
          {/* Invisible trigger; open via state */}
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <Paragraph>Error saving recipe.</Paragraph>
            <AlertDialog.Action asChild>
              <Button>OK</Button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
