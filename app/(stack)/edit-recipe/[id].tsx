// app/(stack)/edit-recipe/[id].tsx

import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Button,
  H2,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Spinner,
  XStack,
  YStack,
  useTheme,
  AlertDialog,
} from 'tamagui';
import { ArrowLeft, Save } from '@tamagui/lucide-icons';

import { GET_RECIPE, UPDATE_RECIPE } from '../../../src/graphql/queries';
import { ThemeContext } from '../../_layout';

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const tamaguiTheme = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('lunch');
  const [image, setImage] = useState('');

  /* ───────────────────────────────────── Fetch existing recipe ──────────────────────────────────── */
  const { loading: loadingRecipe, error: errorRecipe } = useQuery(GET_RECIPE, {
    variables: { id },
    onCompleted: ({ recipe }) => {
      if (recipe) {
        setTitle(recipe.title);
        setDescription(recipe.notes || '');
        setCategory(recipe.category);
        setIngredients(recipe.ingredients.join('\n'));
        setInstructions(recipe.steps.join('\n'));
        setImage(recipe.image || '');
      }
    },
  });

  /* ───────────────────────────────────── Mutation to update ────────────────────────────────────── */
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, {
    onCompleted: () => {
      router.back();
    },
  });

  const handleSave = async () => {
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setErrorOpen(true);
      return;
    }
    const ingredientsArray = ingredients.split('\n').filter((i) => i.trim());
    const stepsArray = instructions.split('\n').filter((i) => i.trim());

    await updateRecipe({
      variables: {
        id,
        input: {
          title: title.trim(),
          ingredients: ingredientsArray,
          steps: stepsArray,
          category,
          notes: description.trim(),
          image: image.trim(),
        },
      },
    });
  };

  /* ── Error dialog state ── */
  const [errorOpen, setErrorOpen] = useState(false);

  /* ───────────────────────────────────── Loading & error states ────────────────────────────────── */
  if (loadingRecipe) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Spinner size="large" color="$accent" />
        <Paragraph>Loading recipe...</Paragraph>
      </YStack>
    );
  }
  if (errorRecipe) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Paragraph color="$red10">
          Error loading recipe: {errorRecipe.message}
        </Paragraph>
      </YStack>
    );
  }

  /* ─────────────────────────────────────────── UI ─────────────────────────────────────────────── */
  const isDark = theme === 'dark';
  const inputBg = isDark ? '$backgroundHover' : '$background';
  const labelColor = isDark ? '$gray10' : '$gray12';

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
        <H2>Edit Recipe</H2>
        <Button
          icon={Save}
          circular
          onPress={handleSave}
          disabled={updating}
        />
      </XStack>

      <ScrollView>
        <YStack space="$4" p="$4">
          {/* Title */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Recipe Title *
            </Label>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Enter recipe title"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Category */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Category *
            </Label>
            <Input
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., breakfast, lunch, dinner"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Description */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Description
            </Label>
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

          {/* Ingredients */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Ingredients * (one per line)
            </Label>
            <Input
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="2 cups flour\n1 tsp salt"
              multiline
              numberOfLines={5}
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Steps */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Instructions * (one step per line)
            </Label>
            <Input
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Preheat oven…"
              multiline
              numberOfLines={5}
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Image URL */}
          <YStack>
            <Label color={labelColor} fontWeight="bold">
              Image URL
            </Label>
            <Input
              value={image}
              onChangeText={setImage}
              placeholder="https://…"
              bg={inputBg}
              borderRadius="$4"
            />
          </YStack>

          {/* Save / Cancel */}
          <Button
            theme="active"
            size="$5"
            onPress={handleSave}
            disabled={updating}
            animation="bouncy"
            pressStyle={{ scale: 0.95 }}
          >
            {updating ? 'Updating...' : 'Update Recipe'}
          </Button>
          <Button theme="alt1" size="$5" onPress={() => router.back()}>
            Cancel
          </Button>
        </YStack>
      </ScrollView>

      {/* Simple validation error dialog */}
      <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <Paragraph>Please fill all required fields.</Paragraph>
            <AlertDialog.Action asChild>
              <Button onPress={() => setErrorOpen(false)}>OK</Button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
