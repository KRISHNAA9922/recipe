// app/(stack)/recipe-notes/[id].tsx

import React, { useContext, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client';
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

import { CREATE_NOTE, UPDATE_NOTE, GET_NOTES, GET_RECIPE } from '../../../src/graphql/queries';
import { ThemeContext } from '../../_layout'; // Light / dark mode

export default function RecipeNotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const tamaguiTheme = useTheme();

  /* ───────────────────────────────────── Local state ───────────────────────────────────── */
  const [notes, setNotes] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('Recipe');
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);

  /* ───────────────────────────────────── Queries ───────────────────────────────────────── */
  // 1. Fetch recipe title (optional but nicer UX)
  useQuery(GET_RECIPE, {
    variables: { id },
    skip: !id,
    onCompleted: ({ recipe }) => {
      if (recipe?.title) setRecipeTitle(recipe.title);
    },
  });

  // 2. Fetch existing notes
  const { loading: notesLoading, error: notesError } = useQuery(GET_NOTES, {
    variables: { recipeId: id },
    skip: !id,
    onCompleted: ({ notes }) => {
      if (notes?.length) {
        const latest = notes[0];
        setNotes(latest.content);
        setExistingNoteId(latest.id);
      }
    },
  });

  /* ───────────────────────────────────── Mutations ─────────────────────────────────────── */
  const [createNote, { loading: createLoading }] = useMutation(CREATE_NOTE);
  const [updateNote, { loading: updateLoading }] = useMutation(UPDATE_NOTE);

  const saving = createLoading || updateLoading;

  const handleSaveNotes = async () => {
    if (!notes.trim()) {
      setErrorOpen(true);
      return;
    }
    try {
      if (existingNoteId) {
        await updateNote({ variables: { id: existingNoteId, content: notes } });
      } else {
        await createNote({ variables: { input: { recipeId: id, content: notes } } });
      }
      router.back();
    } catch (err) {
      console.error(err);
      setErrorOpen(true);
    }
  };

  /* ───────────────────────────────────── Loading & error states ────────────────────────── */
  if (notesLoading) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Spinner size="large" color="$accent" />
        <Paragraph>Loading notes…</Paragraph>
      </YStack>
    );
  }
  if (notesError) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Paragraph color="$red10">Error: {notesError.message}</Paragraph>
      </YStack>
    );
  }

  /* ─────────────────────────────────────────── UI ──────────────────────────────────────── */
  const isDark = theme === 'dark';
  const inputBg = isDark ? '$backgroundHover' : '$background';
  const labelColor = isDark ? '$gray10' : '$gray12';

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack ai="center" jc="space-between" p="$4" bg="$backgroundStrong" elevation="$2">
        <Button icon={ArrowLeft} circular onPress={() => router.back()} />
        <H2>{recipeTitle} – Notes</H2>
        <Button icon={Save} circular onPress={handleSaveNotes} disabled={saving} />
      </XStack>

      <ScrollView>
        <YStack space="$4" p="$4">
          <Label color={labelColor} fontWeight="bold">
            Your Notes
          </Label>
          <Input
            value={notes}
            onChangeText={setNotes}
            placeholder="Add your personal notes, tips, or modifications…"
            multiline
            numberOfLines={8}
            bg={inputBg}
            borderRadius="$4"
          />

          {/* Save / Cancel */}
          <Button
            theme="active"
            size="$5"
            onPress={handleSaveNotes}
            disabled={saving}
            animation="bouncy"
            pressStyle={{ scale: 0.95 }}
          >
            {saving ? 'Saving…' : 'Update Notes'}
          </Button>
          <Button theme="alt1" size="$5" onPress={() => router.back()}>
            Cancel
          </Button>
        </YStack>
      </ScrollView>

      {/* Validation / Error dialog */}
      <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <Paragraph>Please enter some notes or check your connection.</Paragraph>
            <AlertDialog.Action asChild>
              <Button>OK</Button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
