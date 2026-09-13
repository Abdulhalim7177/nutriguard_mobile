import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { scanFaces } from 'react-native-vision-camera-face-detector';
import { runOnJS } from 'react-native-worklets-core';
import { useRouter } from 'expo-router';
import { runAnemiaInference } from '../../ml/anemiaInference';

export default function PhotoCheck() {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [eyeDetected, setEyeDetected] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const router = useRouter();

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        try {
            const faces = scanFaces(frame);
            if (faces.length > 0) {
                runOnJS(setEyeDetected)(true);
            } else {
                runOnJS(setEyeDetected)(false);
            }
        } catch (e) {
            // ignore frame errors
        }
    }, []);

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (device == null) {
        return <View style={styles.container}><Text style={styles.message}>No Camera Found</Text></View>;
    }

    const takePicture = async () => {
        if (cameraRef.current && eyeDetected) {
            const photo = await cameraRef.current.takePhoto({
                qualityPrioritization: 'quality',
                flash: 'off'
            });
            setPhotoUri('file://' + photo.path);
        }
    };

    const analyzePhoto = async () => {
        if (!photoUri) return;
        setAnalyzing(true);
        const result = await runAnemiaInference(photoUri);
        setAnalyzing(false);
        router.push({
            pathname: '/(screening)/risk-result',
            params: { riskBand: result.riskBand, confidence: result.confidence.toString() }
        });
    };

    if (photoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setPhotoUri(null)}>
                        <Text style={styles.secondaryButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={analyzePhoto} disabled={analyzing}>
                        <Text style={styles.buttonText}>{analyzing ? 'Analyzing...' : 'Analyze Photo'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
                frameProcessor={frameProcessor}
                pixelFormat="yuv"
            />
            <View style={styles.overlay}>
                <Text style={styles.overlayText}>Position the inner lower eyelid within the box</Text>
                <View style={[styles.targetBox, eyeDetected ? styles.targetBoxDetected : styles.targetBoxSearching]} />
                <Text style={[styles.statusText, { color: eyeDetected ? '#059669' : '#ef4444' }]}>
                    {eyeDetected ? 'Eye Detected! Ready to Capture.' : 'Searching for Face/Eye...'}
                </Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={[styles.captureButton, !eyeDetected && styles.captureButtonDisabled]} 
                    onPress={takePicture}
                    disabled={!eyeDetected}
                >
                    <View style={[styles.captureInner, !eyeDetected && styles.captureInnerDisabled]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    message: { textAlign: 'center', color: '#fff', paddingBottom: 10 },
    camera: { flex: 1 },
    overlay: { position: 'absolute', top: 0, bottom: 150, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
    overlayText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 20, marginBottom: 20, textShadowColor: '#000', textShadowRadius: 10 },
    targetBox: { width: 250, height: 100, borderWidth: 3, borderRadius: 10, backgroundColor: 'transparent' },
    targetBoxSearching: { borderColor: '#ef4444' },
    targetBoxDetected: { borderColor: '#059669' },
    statusText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10 },
    controls: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 30, paddingBottom: 50, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center' },
    captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', padding: 5, alignItems: 'center', justifyContent: 'center' },
    captureButtonDisabled: { opacity: 0.5 },
    captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#059669' },
    captureInnerDisabled: { backgroundColor: '#9ca3af' },
    preview: { flex: 1, width: '100%' },
    buttonRow: { flexDirection: 'row', padding: 20, gap: 15, backgroundColor: '#000' },
    button: { flex: 1, backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center' },
    secondaryButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#059669' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryButtonText: { color: '#059669', fontSize: 16, fontWeight: 'bold' },
});
