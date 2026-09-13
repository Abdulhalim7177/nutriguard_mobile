export function classifyMuac(muacCm: number, ageMonths: number): string {
  if (ageMonths < 6 || ageMonths > 59) return 'out_of_range_for_muac';
  if (muacCm <= 11.5) return 'severe_acute_malnutrition';
  if (muacCm < 12.5) return 'moderate_acute_malnutrition';
  return 'normal';
}

export function classifyWhz(whz: number): string {
  if (whz <= -3.0) return 'severe_wasting';
  if (whz < -2.0) return 'moderate_wasting';
  return 'normal';
}

export function classifyWaz(waz: number): string {
  if (waz <= -3.0) return 'severely_underweight';
  if (waz < -2.0) return 'underweight';
  return 'normal';
}

export function classifyHaz(haz: number): string {
  if (haz <= -3.0) return 'severely_stunted';
  if (haz < -2.0) return 'stunted';
  return 'normal';
}

export interface PhotoSignal {
  source: 'photo_model';
  category: string;
  confidence: number;
}

export interface ClinicalSignal {
  muacCm?: number;
  ageMonths?: number;
  whz?: number;
  waz?: number;
  haz?: number;
}

export function combineChildSignals(photo: PhotoSignal, clinical: ClinicalSignal) {
  // If clinical data exists (e.g., MUAC or WHZ/WAZ/HAZ), it overrides the photo model.
  if (clinical.muacCm && clinical.ageMonths) {
    const muacClass = classifyMuac(clinical.muacCm, clinical.ageMonths);
    if (muacClass !== 'out_of_range_for_muac') {
      return { finalCategory: muacClass, source: 'manual_clinical_entry' };
    }
  }

  if (clinical.whz !== undefined) {
    return { finalCategory: classifyWhz(clinical.whz), source: 'manual_clinical_entry' };
  }

  if (clinical.waz !== undefined) {
    return { finalCategory: classifyWaz(clinical.waz), source: 'manual_clinical_entry' };
  }

  if (clinical.haz !== undefined) {
    return { finalCategory: classifyHaz(clinical.haz), source: 'manual_clinical_entry' };
  }

  // Fallback to photo model if no valid clinical overrides exist
  return { finalCategory: photo.category, source: 'photo_model' };
}
