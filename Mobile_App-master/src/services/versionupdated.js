// versionUpdate.js
import VersionCheck from 'react-native-version-check';
import { Linking, Platform } from 'react-native';

export const checkAppUpdate = async () => {
  try {
    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = VersionCheck.getCurrentVersion();

    console.log('Current Version:', currentVersion);
    console.log('Latest Version:', latestVersion);

    if (VersionCheck.needUpdate({ currentVersion, latestVersion }).isNeeded) {
      return true; 
    }

    return false;
  } catch (error) {
    console.error('Error checking app version:', error);
    return false;
  }
};

export const openAppStore = () => {
  const url =
    Platform.OS === 'android'
      ? 'market://details?id=' + VersionCheck.getPackageName()
      : 'itms-apps://apps.apple.com/app/1:490509769992:android:15eec0e7b16570e5c9a0bd'

  Linking.openURL(url).catch(err =>
    console.error('Error opening app store:', err)
  );
};
