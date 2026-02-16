import type { CropYieldInput, IrrigationInput } from '../backend';

export function validateCropYieldInput(input: CropYieldInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (isNaN(input.rainfall) || input.rainfall < 0) {
    errors.rainfall = 'Rainfall must be a positive number';
  }

  if (isNaN(input.temperature) || input.temperature < -50 || input.temperature > 60) {
    errors.temperature = 'Temperature must be between -50°C and 60°C';
  }

  if (isNaN(input.humidity) || input.humidity < 0 || input.humidity > 100) {
    errors.humidity = 'Humidity must be between 0% and 100%';
  }

  if (isNaN(input.fertilizerUsage) || input.fertilizerUsage < 0) {
    errors.fertilizerUsage = 'Fertilizer usage must be a positive number';
  }

  return errors;
}

export function validateIrrigationInput(input: IrrigationInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (isNaN(input.soilMoistureLevel) || input.soilMoistureLevel < 0 || input.soilMoistureLevel > 100) {
    errors.soilMoistureLevel = 'Soil moisture level must be between 0% and 100%';
  }

  if (isNaN(input.temperature) || input.temperature < -50 || input.temperature > 60) {
    errors.temperature = 'Temperature must be between -50°C and 60°C';
  }

  return errors;
}

export function validateImageFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a PNG or JPG image';
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  return null;
}
