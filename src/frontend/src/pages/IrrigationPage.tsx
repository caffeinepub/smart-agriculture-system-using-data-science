import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormField from '../components/FormField';
import AppAlert from '../components/AppAlert';
import HistorySection from '../components/HistorySection';
import { useIrrigationRecommendation } from '../hooks/useIrrigationRecommendation';
import { useGetIrrigationHistory, useClearHistory } from '../hooks/useHistoryQueries';
import { validateIrrigationInput } from '../utils/validation';
import { formatErrorMessage } from '../utils/formatErrorMessage';
import { Droplets, CheckCircle2, XCircle } from 'lucide-react';
import type { IrrigationResult } from '../backend';

export default function IrrigationPage() {
  const [soilMoistureLevel, setSoilMoistureLevel] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [temperature, setTemperature] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<IrrigationResult | null>(null);

  const recommendMutation = useIrrigationRecommendation();
  const { data: history = [] } = useGetIrrigationHistory();
  const clearHistoryMutation = useClearHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      soilMoistureLevel: parseFloat(soilMoistureLevel),
      weatherCondition,
      temperature: parseFloat(temperature),
    };

    const validationErrors = validateIrrigationInput(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const recommendation = await recommendMutation.mutateAsync(input);
      setResult(recommendation);
    } catch (error) {
      console.error('Recommendation error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Smart Irrigation Recommendation</h1>
          <p className="text-muted-foreground">
            Get irrigation recommendations based on soil moisture and weather conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>Enter current soil and weather conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Soil Moisture Level (%)"
                  id="soilMoistureLevel"
                  type="number"
                  value={soilMoistureLevel}
                  onChange={setSoilMoistureLevel}
                  error={errors.soilMoistureLevel}
                  placeholder="e.g., 25"
                  min={0}
                  max={100}
                  step={0.1}
                  required
                />
                <FormField
                  label="Weather Condition"
                  id="weatherCondition"
                  type="select"
                  value={weatherCondition}
                  onChange={setWeatherCondition}
                  options={[
                    { value: 'Sunny', label: 'Sunny' },
                    { value: 'Cloudy', label: 'Cloudy' },
                    { value: 'Rainy', label: 'Rainy' },
                    { value: 'Windy', label: 'Windy' },
                  ]}
                  required
                />
                <FormField
                  label="Temperature (°C)"
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={setTemperature}
                  error={errors.temperature}
                  placeholder="e.g., 28"
                  min={-50}
                  max={60}
                  step={0.1}
                  required
                />
                {recommendMutation.isError && (
                  <AppAlert
                    type="error"
                    title="Recommendation Failed"
                    message={formatErrorMessage(recommendMutation.error)}
                  />
                )}
                <Button type="submit" className="w-full" disabled={recommendMutation.isPending}>
                  {recommendMutation.isPending ? 'Analyzing...' : 'Get Recommendation'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    Irrigation Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-6 rounded-lg border-2 ${
                      result.recommendation
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-950/20 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {result.recommendation ? (
                        <CheckCircle2 className="w-8 h-8 text-blue-600" />
                      ) : (
                        <XCircle className="w-8 h-8 text-gray-600" />
                      )}
                      <div>
                        <p className="text-2xl font-bold">
                          {result.recommendation ? 'Irrigation Needed' : 'No Irrigation Needed'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Based on current conditions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">Water Required</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.waterRequired.toFixed(0)} L/acre
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <HistorySection
          title="Recommendation History"
          description="Your past irrigation recommendations"
          items={history}
          onClear={() => clearHistoryMutation.mutate()}
          isClearing={clearHistoryMutation.isPending}
          emptyMessage="No recommendations yet. Submit a request to see your history."
          renderItem={(item: IrrigationResult) => (
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {item.recommendation ? (
                    <span className="text-blue-600">✓ Irrigation Recommended</span>
                  ) : (
                    <span className="text-gray-600">✗ No Irrigation Needed</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Water Required: {item.waterRequired.toFixed(0)} L/acre
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(Number(item.timestamp) / 1000000).toLocaleString()}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
