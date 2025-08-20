import React, { useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import {
  Button,
  Input,
  Paragraph,
  Spinner,
  XStack,
  YStack,
  ScrollView,
  useTheme,
  H2,
} from 'tamagui';
import { Sun, Moon, Plus, Search } from '@tamagui/lucide-icons';
import { ImageBackground } from 'react-native';
import { GET_RECIPES } from '../../graphql/queries';
import { ThemeContext } from '../../../app/_layout';
import { HeaderCurve } from './HeaderCurve';
import { RecipeCard } from './RecipeCard';


const HERO_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

export default function HomeScreen() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_RECIPES);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useContext(ThemeContext);
  const tamaguiTheme = useTheme();

  const filteredRecipes = useMemo(() => {
    const recipes = data?.recipes || [];
    return searchQuery
      ? recipes.filter((r: any) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : recipes;
  }, [data, searchQuery]);

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Spinner size="large" color="$accent" />
        <Paragraph>Loading recipes...</Paragraph>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack f={1} jc="center" ai="center" space="$4" bg="$background">
        <Paragraph color="$red10">Error: {error.message}</Paragraph>
      </YStack>
    );
  }

  // Dynamic styles based on theme
  const isDark = theme === 'dark';
  const overlayColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)';
  const textColor = '$color';
  const searchBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.15)'; // Semi-transparent in both themes
  const placeholderColor = isDark ? '$gray8' : '$gray9';
  const borderColor = isDark ? 'rgba(255,255,255,0.2)' : '$gray6';

  return (
    <YStack f={1} bg="$background">
      {/* Fixed Hero Header */}
      <YStack height={300} overflow="hidden">
        <ImageBackground source={{ uri: HERO_IMAGE }} style={{ flex: 1 }}>
          {/* Overlay */}
          <YStack f={1} bg={overlayColor} jc="space-between" pb="$8" px="$4" pt="$4">
            
            {/* Top Bar: Title + Theme Toggle */}
            <XStack jc="space-between" ai="center">
              <H2 color={textColor}>Recipe Book</H2>
              <Button
                icon={isDark ? Sun : Moon}
                circular
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
                backgroundColor={tamaguiTheme.backgroundHover?.val}
                pressStyle={{ scale: 0.95 }}
                animation="bouncy"
              />
            </XStack>

            {/* Bottom: Search Bar (Made smaller and sleeker) */}
            <XStack
              bg={searchBg}
              borderRadius="$5" // Slightly smaller radius for a modern, less rounded look
              p="$2" // Reduced padding to make it less bulky
              ai="center"
              mt="$4"
              borderWidth={1}
              borderColor={borderColor}
              shadowColor={isDark ? undefined : '$shadowColor'}
              shadowOpacity={isDark ? 0 : 0.1}
              shadowRadius={isDark ? 0 : 4}
            >
              <Search color="$color" mr="$2" size="$3" /> {/* Smaller icon */}
              <Input
                f={1}
                placeholder="Find a recipe..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                bg="transparent"
                borderWidth={0}
                color={textColor}
                placeholderTextColor={placeholderColor}
                fontSize="$4" // Smaller font size for a more compact feel
                size="$2" // Tamagui size prop to control overall input height
              />
            </XStack>
          </YStack>
        </ImageBackground>
        <HeaderCurve />
      </YStack>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <XStack flexWrap="wrap" jc="space-between" px="$2" mt="$4">
          {filteredRecipes.map((recipe: any) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            />
          ))}
        </XStack>
        {filteredRecipes.length === 0 && (
          <YStack ai="center" p="$4">
            <Paragraph color="$color">No recipes found. Add some!</Paragraph>
          </YStack>
        )}
      </ScrollView>

      {/* FAB */}
      <Button
        icon={Plus}
        circular
        size="$6"
        pos="absolute"
        bottom="$4"
        right="$4"
        elevate
        onPress={() => router.push('/add-recipe')}
        animation="bouncy"
        pressStyle={{ scale: 0.95 }}
        backgroundColor={tamaguiTheme.accent?.val}
        color="$white"
        shadowColor="$shadowColor"
        shadowOpacity={0.25}
        shadowRadius={6}
      />
    </YStack>
  );
}
