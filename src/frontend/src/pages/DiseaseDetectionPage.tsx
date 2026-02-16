import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageUploadField from '../components/ImageUploadField';
import AppAlert from '../components/AppAlert';
import HistorySection from '../components/HistorySection';
import { useDiseaseDetection } from '../hooks/useDiseaseDetection';
import { useGetPlantDiseaseHistory, useClearHistory } from '../hooks/useHistoryQueries';
import { validateImageFile } from '../utils/validation';
import { formatErrorMessage } from '../utils/formatErrorMessage';
import { AlertCircle, CheckCircle2, Leaf } from 'lucide-react';
import type { PlantDiseaseResult } from '../backend';

export default function DiseaseDetectionPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PlantDiseaseResult | null>(null);

  const detectMutation = useDiseaseDetection();
  const { data: history = [] } = useGetPlantDiseaseHistory();
  const clearHistoryMutation = useClearHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    const validationError = validateImageFile(imageFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    try {
      const detection = await detectMutation.mutateAsync(imageFile);
      setResult(detection);
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plant Disease Detection</h1>
          <p className="text-muted-foreground">
            Upload a leaf image to detect plant diseases and get treatment recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Leaf Image</CardTitle>
              <CardDescription>Select a clear image of the plant leaf for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <ImageUploadField
                  label="Leaf Image"
                  id="leafImage"
                  value={imageFile}
                  onChange={setImageFile}
                  error={error}
                  required
                />
                {detectMutation.isError && (
                  <AppAlert
                    type="error"
                    title="Detection Failed"
                    message={formatErrorMessage(detectMutation.error)}
                  />
                )}
                <Button type="submit" className="w-full" disabled={detectMutation.isPending}>
                  {detectMutation.isPending ? 'Analyzing...' : 'Detect Disease'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    Detection Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                          {result.diseaseName}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Confidence: {result.confidencePercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                          Suggested Treatment
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {result.suggestedTreatment}
                        </p>
                      </div>
                    </div>
                  </div>

                  {result.leafImage && (
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img
                        src={result.leafImage.getDirectURL()}
                        alt="Analyzed leaf"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <HistorySection
          title="Detection History"
          description="Your past plant disease detections"
          items={history}
          onClear={() => clearHistoryMutation.mutate()}
          isClearing={clearHistoryMutation.isPending}
          emptyMessage="No detections yet. Upload an image to see your history."
          renderItem={(item: PlantDiseaseResult) => (
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-medium">{item.diseaseName}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {item.confidencePercentage.toFixed(1)}% • Treatment:{' '}
                  {item.suggestedTreatment}
                </p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(Number(item.timestamp) / 1000000).toLocaleString()}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
