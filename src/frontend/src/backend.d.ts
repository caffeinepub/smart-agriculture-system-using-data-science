import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface PlantDiseaseResult {
    suggestedTreatment: string;
    leafImage: ExternalBlob;
    diseaseName: string;
    timestamp: Time;
    confidencePercentage: number;
}
export interface CropYieldInput {
    fertilizerUsage: number;
    soilType: string;
    temperature: number;
    humidity: number;
    rainfall: number;
}
export interface IrrigationResult {
    waterRequired: number;
    timestamp: Time;
    recommendation: boolean;
}
export interface IrrigationInput {
    temperature: number;
    weatherCondition: string;
    soilMoistureLevel: number;
}
export interface CropYieldResult {
    timestamp: Time;
    accuracyScore: number;
    predictedYield: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearHistory(): Promise<void>;
    detectDisease(leafImage: ExternalBlob): Promise<PlantDiseaseResult>;
    getCallerUserRole(): Promise<UserRole>;
    getCropYieldHistory(): Promise<Array<CropYieldResult>>;
    getIrrigationHistory(): Promise<Array<IrrigationResult>>;
    getIrrigationRecommendation(input: IrrigationInput): Promise<IrrigationResult>;
    getPlantDiseaseHistory(): Promise<Array<PlantDiseaseResult>>;
    isCallerAdmin(): Promise<boolean>;
    predictYield(input: CropYieldInput): Promise<CropYieldResult>;
}
