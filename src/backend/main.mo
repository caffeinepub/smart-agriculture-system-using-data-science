import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Crop Yield Prediction Module Types and Storage
  public type CropYieldInput = {
    soilType : Text;
    rainfall : Float;
    temperature : Float;
    humidity : Float;
    fertilizerUsage : Float;
  };

  public type CropYieldResult = {
    predictedYield : Float;
    accuracyScore : Float;
    timestamp : Time.Time;
  };

  let cropYieldHistory = Map.empty<Principal, List.List<CropYieldResult>>();

  // Plant Disease Detection Module Types and Storage
  public type PlantDiseaseResult = {
    diseaseName : Text;
    confidencePercentage : Float;
    suggestedTreatment : Text;
    timestamp : Time.Time;
    leafImage : Storage.ExternalBlob;
  };

  let plantDiseaseHistory = Map.empty<Principal, List.List<PlantDiseaseResult>>();

  // Smart Irrigation Recommendation Module Types and Storage
  public type IrrigationInput = {
    soilMoistureLevel : Float;
    weatherCondition : Text;
    temperature : Float;
  };

  public type IrrigationResult = {
    waterRequired : Float;
    recommendation : Bool;
    timestamp : Time.Time;
  };

  let irrigationHistory = Map.empty<Principal, List.List<IrrigationResult>>();

  // Crop Yield Prediction API
  public shared ({ caller }) func predictYield(input : CropYieldInput) : async CropYieldResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform crop yield prediction");
    };

    validateCropYieldInput(input);

    let result : CropYieldResult = {
      predictedYield = input.rainfall * 0.8 + input.temperature * 0.5; // Simplified prediction logic
      accuracyScore = 85.0;
      timestamp = Time.now();
    };

    storeCropYieldHistory(caller, result);
    result;
  };

  // Plant Disease Detection API
  public shared ({ caller }) func detectDisease(leafImage : Storage.ExternalBlob) : async PlantDiseaseResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform disease detection");
    };

    let result : PlantDiseaseResult = {
      diseaseName = "Powdery Mildew";
      confidencePercentage = 92.5;
      suggestedTreatment = "Apply fungicide";
      timestamp = Time.now();
      leafImage;
    };

    storePlantDiseaseHistory(caller, result);
    result;
  };

  // Smart Irrigation Recommendation API
  public shared ({ caller }) func getIrrigationRecommendation(input : IrrigationInput) : async IrrigationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get irrigation recommendations");
    };

    validateIrrigationInput(input);

    let result : IrrigationResult = {
      waterRequired = if (input.soilMoistureLevel < 30.0) { 500.0 } else {
        200.0;
      };
      recommendation = input.soilMoistureLevel < 30.0;
      timestamp = Time.now();
    };

    storeIrrigationHistory(caller, result);
    result;
  };

  // Authorization and History Retrieval Functions
  public query ({ caller }) func getCropYieldHistory() : async [CropYieldResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view history");
    };

    let history = cropYieldHistory.get(caller);
    switch (history) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public query ({ caller }) func getPlantDiseaseHistory() : async [PlantDiseaseResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view history");
    };

    let history = plantDiseaseHistory.get(caller);
    switch (history) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public query ({ caller }) func getIrrigationHistory() : async [IrrigationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view history");
    };

    let history = irrigationHistory.get(caller);
    switch (history) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public shared ({ caller }) func clearHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear history");
    };

    cropYieldHistory.remove(caller);
    plantDiseaseHistory.remove(caller);
    irrigationHistory.remove(caller);
  };

  // Helper Functions
  func validateCropYieldInput(input : CropYieldInput) {
    if (input.rainfall < 0.0 or input.temperature < -50.0 or input.humidity < 0.0 or input.fertilizerUsage < 0.0) {
      Runtime.trap("Invalid input values for crop yield prediction");
    };
  };

  func validateIrrigationInput(input : IrrigationInput) {
    if (input.soilMoistureLevel < 0.0 or input.temperature < -50.0) {
      Runtime.trap("Invalid input values for irrigation recommendation");
    };
  };

  func storeCropYieldHistory(user : Principal, result : CropYieldResult) {
    let currentHistory = switch (cropYieldHistory.get(user)) {
      case (null) { List.empty<CropYieldResult>() };
      case (?entries) { entries };
    };
    currentHistory.add(result);
    cropYieldHistory.add(user, currentHistory);
  };

  func storePlantDiseaseHistory(user : Principal, result : PlantDiseaseResult) {
    let currentHistory = switch (plantDiseaseHistory.get(user)) {
      case (null) { List.empty<PlantDiseaseResult>() };
      case (?entries) { entries };
    };
    currentHistory.add(result);
    plantDiseaseHistory.add(user, currentHistory);
  };

  func storeIrrigationHistory(user : Principal, result : IrrigationResult) {
    let currentHistory = switch (irrigationHistory.get(user)) {
      case (null) { List.empty<IrrigationResult>() };
      case (?entries) { entries };
    };
    currentHistory.add(result);
    irrigationHistory.add(user, currentHistory);
  };
};
