import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

export const voiceService = {
  startListening: async (
    onResult: (text: string) => void,
    onError: (error: string) => void,
    language = 'en-NG'
  ) => {
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
