import { Redirect } from 'expo-router';

export default function StackIndex() {
  // Redirect to your main tabs or home screen to avoid showing "(stack)" as a blank page
  // This prevents the group from rendering an empty screen with the folder name as header
  return <Redirect href="/(tabs)/" />;
}
