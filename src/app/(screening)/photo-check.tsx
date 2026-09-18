import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { runAnemiaInference } from '../../ml/anemiaInference';

export default function PhotoCheck() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [eyeDetected, setEyeDetected] = useState(true); // Mocked for Expo Go
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.fallbackContainer}>
                <Text style={styles.message}>We need your permission to show the camera.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
                    <Text style={styles.primaryButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && eyeDetected) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
            });
            if (photo) setPhotoUri(photo.uri);
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
                <View style={styles.previewControls}>
                    <TouchableOpacity style={styles.skipButton} onPress={() => setPhotoUri(null)}>
                        <Text style={styles.skipButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButtonSolid} onPress={analyzePhoto} disabled={analyzing}>
                        <Text style={styles.captureButtonText}>{analyzing ? 'Analyzing...' : 'Analyze Photo'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
            />
            
            {/* Top Navigation */}
            <SafeAreaView style={styles.topNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.stepText}>STEP 2 OF 2</Text>
                    <Text style={styles.headerText}>Camera Scan</Text>
                </View>
            </SafeAreaView>

            {/* Target Reticle overlay */}
            <View style={styles.reticleContainer}>
                <View style={styles.bracketContainer}>
                   <View style={[styles.cornerTopLeft, eyeDetected && styles.bracketDetected]} />
                   <View style={[styles.cornerTopRight, eyeDetected && styles.bracketDetected]} />
                   <View style={[styles.cornerBottomLeft, eyeDetected && styles.bracketDetected]} />
                   <View style={[styles.cornerBottomRight, eyeDetected && styles.bracketDetected]} />
                </View>
                <View style={styles.focusPill}>
                    <Text style={styles.focusPillText}>FOCUS ON EYES</Text>
                </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                <Text style={styles.instructionText}>Pull down your lower eyelid and look straight ahead.</Text>
                <Text style={styles.scanningText}>Scanning for signs of anaemia...</Text>
                
                <TouchableOpacity 
                    style={[styles.captureButtonSolid, !eyeDetected && styles.captureButtonDisabled]} 
                    onPress={takePicture}
                    disabled={!eyeDetected}
                >
                    <Ionicons name="camera" size={20} color="#FFFFFF" style={{marginRight: 8}} />
                    <Text style={styles.captureButtonText}>Capture Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(tabs)')}>
                    <Text style={styles.skipButtonText}>Skip Scan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    fallbackContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 },
    message: { textAlign: 'center', color: '#fff', fontSize: 16, marginBottom: 20 },
    camera: { ...StyleSheet.absoluteFillObject },
    
    topNav: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    headerTitles: {
        flex: 1,
        alignItems: 'center',
    },
    stepText: {
        color: '#D1D5DB',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },

    reticleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100, // adjust for top nav
    },
    bracketContainer: {
        width: 280,
        height: 180,
        position: 'relative',
    },
    // The bracket corners (Orange)
    cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FF7A45', borderTopLeftRadius: 16 },
    cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FF7A45', borderTopRightRadius: 16 },
    cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FF7A45', borderBottomLeftRadius: 16 },
    cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FF7A45', borderBottomRightRadius: 16 },
    bracketDetected: { borderColor: '#4ADE80' }, // Green when face/eye detected

    focusPill: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 122, 69, 0.4)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 122, 69, 0.8)',
        top: '60%',
    },
    focusPillText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },

    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
    },
    instructionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 24,
    },
    scanningText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 32,
    },
    captureButtonSolid: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FF7A45',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    captureButtonDisabled: {
        opacity: 0.5,
    },
    captureButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    skipButton: {
        width: '100%',
        backgroundColor: '#2D2D2D',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    
    // Preview mode
    preview: { flex: 1, width: '100%' },
    previewControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#FF7A45',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    }
});
