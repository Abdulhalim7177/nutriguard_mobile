import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function mapRiskToMessage(band: string): string {
    if (band === 'low_risk') {
        return "Your check looks within a normal range.";
    }
    if (band === 'possible_risk' || band === 'elevated_risk') {
        return "This suggests it may be worth getting checked. Please visit a health facility for a simple blood test.";
    }
    return "Could not determine risk band.";
}

export default function RiskResult() {
    const { riskBand, confidence } = useLocalSearchParams<{ riskBand: string, confidence: string }>();
    const router = useRouter();

    const band = riskBand || 'unknown';
    const confScore = confidence ? (parseFloat(confidence) * 100).toFixed(1) : '0';

    const getColors = () => {
        if (band === 'low_risk') return { bg: '#dcfce7', text: '#166534' };
        if (band === 'possible_risk') return { bg: '#fef08a', text: '#854d0e' };
        if (band === 'elevated_risk') return { bg: '#fee2e2', text: '#991b1b' };
        return { bg: '#f3f4f6', text: '#374151' };
    };

    const colors = getColors();
    const title = band.replace('_', ' ').toUpperCase();

    return (
        <View style={styles.container}>
            <View style={[styles.card, { backgroundColor: colors.bg }]}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={styles.confidence}>Confidence Score: {confScore}%</Text>
            </View>

            <View style={styles.messageBox}>
                <Text style={styles.messageLabel}>What does this mean?</Text>
                <Text style={styles.message}>{mapRiskToMessage(band)}</Text>
            </View>
            
            <View style={styles.disclaimerBox}>
                <Text style={styles.disclaimer}>
                    NutriGuard AI provides screening insights based on visual markers, not a medical diagnosis. Always consult a healthcare professional.
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>Return Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20, justifyContent: 'center' },
    card: { padding: 30, borderRadius: 16, alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    confidence: { fontSize: 16, color: '#475569' },
    messageBox: { backgroundColor: '#fff', padding: 25, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    messageLabel: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginBottom: 10, textTransform: 'uppercase' },
    message: { fontSize: 18, color: '#1e293b', lineHeight: 26 },
    disclaimerBox: { marginBottom: 40, padding: 15 },
    disclaimer: { fontSize: 14, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' },
    button: { backgroundColor: '#059669', padding: 18, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
