import React, { useState } from 'react';
import { ScrollView, YStack, XStack, Text, Button, TextArea, Card } from 'tamagui';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation(optional)/types';
import { GET_NOTES, CREATE_NOTE, DELETE_NOTE } from '../graphql/queries';
import { Note } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RecipeNotesScreen({ route }: { route : any }) {
  const navigation = useNavigation<NavigationProp>();
  const { recipeId, recipeTitle } = route.params;
  
  const [content, setContent] = useState('');

  // Query to get notes for this recipe
  const { data, loading, error, refetch } = useQuery(GET_NOTES, {
    variables: { recipeId },
  });

  // Mutation to create a new note
  const [createNote] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      setContent('');
      refetch(); // Refresh the notes list
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    }
  });

  // Mutation to delete a note
  const [deleteNote] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      refetch(); // Refresh the notes list
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
    }
  });

  const handleAddNote = () => {
    if (content.trim()) {
      createNote({
        variables: {
          input: {
            recipeId,
            content: content.trim()
          }
        }
      });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote({
      variables: { id: noteId }
    });
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading notes...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">Error loading notes: {error.message}</Text>
      </YStack>
    );
  }

  const notes = data?.notes || [];

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">Notes for {recipeTitle}</Text>

        <YStack gap="$3">
          <TextArea
            placeholder="Add a note..."
            value={content}
            onChangeText={setContent}
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$3"
            minHeight={100}
          />
          <Button
            onPress={handleAddNote}
            backgroundColor="$blue10"
            color="white"
            disabled={!content.trim()}
          >
            Add Note
          </Button>
        </YStack>

        <YStack gap="$3">
          {notes.map((note: Note) => (
            <Card
              key={note.id}
              padding="$4"
              backgroundColor="$gray2"
              borderRadius="$4"
            >
              <XStack justifyContent="space-between" alignItems="flex-start">
                <Text fontSize="$3" flex={1}>{note.content}</Text>
                <Button
                  size="$2"
                  backgroundColor="$red10"
                  color="white"
                  onPress={() => handleDeleteNote(note.id)}
                >
                  Delete
                </Button>
              </XStack>
              <Text fontSize="$2" color="$gray11" marginTop="$2">
                {new Date(note.createdAt).toLocaleDateString()}
              </Text>
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
