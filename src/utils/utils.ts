import RNFS from 'react-native-fs';
import { Platform, Linking, Alert } from 'react-native';
import Share, { Social } from 'react-native-share';

// import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
export const saveToFile = async (uri: string): Promise<string> => {
  const filePath = `${RNFS.CachesDirectoryPath}/storyImage.jpg`;
  await RNFS.copyFile(uri, filePath);
  return `file://${filePath}`;
};

export const shareToInstagramStory = async (imageUri: string) => {
  /**
   * Shares an image directly to Instagram Stories without using the native share modal.
   *
   * This function saves a given image to the local file system and uses Instagram's
   * custom URL scheme (iOS) or Android intent to open the Instagram Stories composer
   * with the image preloaded as the background.
   *
   * ✅ iOS:
   *   - Uses `instagram-stories://share` URL scheme to open the Instagram Stories editor.
   *   - Only supports preloading an image or sticker (no caption support).
   *   - Requires adding `LSApplicationQueriesSchemes` to `Info.plist`.
   *
   * ✅ Android:
   *   - Uses `Intent` with action `com.instagram.share.ADD_TO_STORY` to open Stories.
   *   - Can preload background image and attribution URL.
   *   - Requires FileProvider setup in `AndroidManifest.xml` and `provider_paths.xml`.
   *
   * ⚠️ Requirements:
   *   - Instagram must be installed on the device.
   *   - The image URI must be a local file URI (e.g., from `react-native-view-shot` + `react-native-fs`).
   *
   * @param imageUri - The local URI of the image to share (e.g., `file://...`)
   */

  const filePath = await saveToFile(imageUri);

  if (Platform.OS === 'ios') {
    const url = 'instagram-stories://share';

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Instagram not installed');
      return;
    }

    const pasteboardOptions = {
      'com.instagram.sharedSticker.backgroundImage': filePath,
    };

    // iOS: set pasteboard
    try {
      const result = await Share.share({
        url: filePath,
        message: '', // Can't set caption here
      });

      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sharing to Instagram Stories:', error);
    }
  } else if (Platform.OS === 'android') {
    const canOpen = await Linking.canOpenURL('intent://');

    const shareOptions = {
      method: 'shareToStory',
      backgroundImage: filePath,
      attributionURL: 'https://your-link.com', // Optional
    };

    try {
      const intentParams = {
        action: 'com.instagram.share.ADD_TO_STORY',
        type: 'image/*',
        extra: {
          source_application: 'your.package.name',
          interactive_asset_uri: filePath,
        },
      };

      const uri = `intent://${filePath.replace(
        'file://',
        '',
      )}#Intent;scheme=content;package=com.instagram.android;end`;

      await Linking.openURL(uri);
    } catch (err) {
      console.log('Failed to share on Android:', err);
    }
  }
};

export const shareToInstagramStoryV2 = async (imageUri: string) => {
  try {
    if (Platform.OS !== 'android') {
      Alert.alert('Only Android is supported in this function');
      return;
    }

    // Ensure Instagram is installed
    const isInstagramInstalled = await Share.isPackageInstalled(
      'com.instagram.android',
    );
    // if (!isInstagramInstalled.isInstalled) {
    //   Alert.alert('Instagram is not installed');
    //   return;
    // }

    // Copy image to shareable ˝
    const destPath = `${RNFS.CachesDirectoryPath}/storyImage.jpg`;

    await RNFS.copyFile(imageUri, destPath);
    const fileUri = `file://${destPath}`;

    // Share to Instagram story
    await Share.shareSingle({
      social: Social.InstagramStories,
      backgroundImage: fileUri,
      appId: 'com.foxolearning', // your package name
    });
  } catch (error) {
    console.error('Failed to share on Android:', error);
    Alert.alert('Error', 'Could not share to Instagram Story');
  }
};
