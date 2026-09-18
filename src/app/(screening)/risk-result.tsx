import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/sqlite';

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
    const { riskBand, confidence, budget, symptoms } = useLocalSearchParams<{ riskBand: string, confidence: string, budget?: string, symptoms?: string }>();
    const router = useRouter();

    const band = riskBand || 'unknown';
    const confScore = confidence ? (parseFloat(confidence) * 100).toFixed(1) : '0';

    useEffect(() => {
        if (band !== 'unknown') {
            db.insertScreening({ userId: 'demo_user', riskBand: band }).catch(console.error);
        }
    }, [band]);

    const getColors = () => {
        if (band === 'low_risk') return { bg: '#E8F5E9', text: '#2E5C31', icon: 'checkmark-circle' };
        if (band === 'possible_risk') return { bg: '#FFF7E6', text: '#FF7A45', icon: 'alert-circle' };
        if (band === 'elevated_risk') return { bg: '#FEE2E2', text: '#DC2626', icon: 'warning' };
        return { bg: '#F3F4F6', text: '#374151', icon: 'help-circle' };
    };

    const colors = getColors();
    const title = band.replace('_', ' ').toUpperCase();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#2E5C31" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Result</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.bg }]}>
                    <Ionicons name={colors.icon as any} size={48} color={colors.text} style={{ marginBottom: 12 }} />
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={styles.confidence}>Confidence Score: {confScore}%</Text>
                </View>

                <View style={styles.messageBox}>
                    <Text style={styles.messageLabel}>What does this mean?</Text>
                    <Text style={styles.message}>{mapRiskToMessage(band)}</Text>
                </View>
                
                <View style={styles.disclaimerBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
                    <Text style={styles.disclaimer}>
                        NutriGuard AI provides screening insights based on visual markers, not a medical diagnosis. Always consult a healthcare professional.
                    </Text>
                </View>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={styles.primaryButton} onPress={() => router.push({
                    pathname: '/(nutrition)/meal-plan',
                    params: { budget, symptoms }
                })}>
                    <Text style={styles.primaryButtonText}>Get Personalized Meal Plan</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, padding: 24 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#2E5C31' },
    card: { padding: 32, borderRadius: 24, alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
    confidence: { fontSize: 16, color: '#4B5563', fontWeight: '500' },
    messageBox: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
    messageLabel: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
    message: { fontSize: 18, color: '#1F2937', lineHeight: 28, fontWeight: '500' },
    disclaimerBox: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16, alignItems: 'flex-start' },
    disclaimer: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 20, marginLeft: 12 },
    primaryButton: { backgroundColor: '#2E5C31', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#2E5C31', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
