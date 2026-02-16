import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormField from '../components/FormField';
import AppAlert from '../components/AppAlert';
import HistorySection from '../components/HistorySection';
import { useCropYieldPrediction } from '../hooks/useCropYieldPrediction';
import { useGetCropYieldHistory, useClearHistory } from '../hooks/useHistoryQueries';
import { validateCropYieldInput } from '../utils/validation';
import { formatErrorMessage } from '../utils/formatErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { CropYieldResult } from '../backend';

export default function CropYieldPage() {
  const [soilType, setSoilType] = useState('Loamy');
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [fertilizerUsage, setFertilizerUsage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CropYieldResult | null>(null);

  const predictMutation = useCropYieldPrediction();
  const { data: history = [] } = useGetCropYieldHistory();
  const clearHistoryMutation = useClearHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      soilType,
      rainfall: parseFloat(rainfall),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      fertilizerUsage: parseFloat(fertilizerUsage),
    };

    const validationErrors = validateCropYieldInput(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const prediction = await predictMutation.mutateAsync(input);
      setResult(prediction);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const chartData = result
    ? [
        { name: 'Predicted Yield', value: result.predictedYield },
        { name: 'Avg. Baseline', value: 3.5 },
      ]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Crop Yield Prediction</h1>
          <p className="text-muted-foreground">
            Predict crop yield based on soil type, weather conditions, and fertilizer usage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>Enter your agricultural data for yield prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Soil Type"
                  id="soilType"
                  type="select"
                  value={soilType}
                  onChange={setSoilType}
                  options={[
                    { value: 'Loamy', label: 'Loamy' },
                    { value: 'Sandy', label: 'Sandy' },
                    { value: 'Clay', label: 'Clay' },
                    { value: 'Silty', label: 'Silty' },
                  ]}
                  required
                />
                <FormField
                  label="Rainfall (mm)"
                  id="rainfall"
                  type="number"
                  value={rainfall}
                  onChange={setRainfall}
                  error={errors.rainfall}
                  placeholder="e.g., 800"
                  min={0}
                  step={0.1}
                  required
                />
                <FormField
                  label="Temperature (°C)"
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={setTemperature}
                  error={errors.temperature}
                  placeholder="e.g., 25"
                  min={-50}
                  max={60}
                  step={0.1}
                  required
                />
                <FormField
                  label="Humidity (%)"
                  id="humidity"
                  type="number"
                  value={humidity}
                  onChange={setHumidity}
                  error={errors.humidity}
                  placeholder="e.g., 65"
                  min={0}
                  max={100}
                  step={0.1}
                  required
                />
                <FormField
                  label="Fertilizer Usage (kg/hectare)"
                  id="fertilizerUsage"
                  type="number"
                  value={fertilizerUsage}
                  onChange={setFertilizerUsage}
                  error={errors.fertilizerUsage}
                  placeholder="e.g., 150"
                  min={0}
                  step={0.1}
                  required
                />
                {predictMutation.isError && (
                  <AppAlert
                    type="error"
                    title="Prediction Failed"
                    message={formatErrorMessage(predictMutation.error)}
                  />
                )}
                <Button type="submit" className="w-full" disabled={predictMutation.isPending}>
                  {predictMutation.isPending ? 'Predicting...' : 'Predict Yield'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Prediction Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-muted-foreground mb-1">Predicted Yield</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                          {result.predictedYield.toFixed(2)} t/ha
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-muted-foreground mb-1">Accuracy Score</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {result.accuracyScore.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Yield Comparison</CardTitle>
                    <CardDescription>Predicted vs. baseline average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Tons/Hectare', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="oklch(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <HistorySection
          title="Prediction History"
          description="Your past crop yield predictions"
          items={history}
          onClear={() => clearHistoryMutation.mutate()}
          isClearing={clearHistoryMutation.isPending}
          emptyMessage="No predictions yet. Submit a prediction to see your history."
          renderItem={(item: CropYieldResult) => (
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  Predicted Yield: <span className="text-green-600">{item.predictedYield.toFixed(2)} t/ha</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Accuracy: {item.accuracyScore.toFixed(1)}%
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
