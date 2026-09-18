import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import Constants from 'expo-constants';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
const isVoiceAvailable = !isExpoGo && !!Voice;

export const voiceService = {
  startListening: async (
    onResult: (text: string) => void,
    onError: (error: string) => void,
    language = 'en-NG'
  ) => {
    if (!isVoiceAvailable) {
      onError('Voice recognition is not supported in Expo Go. Please type your response.');
      return;
    }
    try {
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
          onResult(e.value[0]);
        }
      };
      
      Voice.onSpeechError = (e: SpeechErrorEvent) => {
        onError(e.error?.message || 'Unknown voice error');
      };

      await Voice.start(language);
    } catch (e) {
      console.error(e);
      onError('Failed to start voice recognition');
    }
  },

  stopListening: async () => {
    if (!isVoiceAvailable) return;
    try {
      await Voice.stop();
      Voice.destroy().then(Voice.removeAllListeners);
    } catch (e) {
      console.error(e);
    }
  },

  speak: (text: string, language = 'en-NG') => {
    Speech.speak(text, { language });
  }
};
