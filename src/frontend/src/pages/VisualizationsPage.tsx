import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCropYieldHistory, useGetPlantDiseaseHistory, useGetIrrigationHistory } from '../hooks/useHistoryQueries';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Leaf, Droplets } from 'lucide-react';
import AuthGate from '../components/AuthGate';

export default function VisualizationsPage() {
  const { data: cropHistory = [], isLoading: cropLoading } = useGetCropYieldHistory();
  const { data: diseaseHistory = [], isLoading: diseaseLoading } = useGetPlantDiseaseHistory();
  const { data: irrigationHistory = [], isLoading: irrigationLoading } = useGetIrrigationHistory();

  const isLoading = cropLoading || diseaseLoading || irrigationLoading;

  // Crop yield accuracy trend
  const cropYieldData = cropHistory.map((item, index) => ({
    index: index + 1,
    accuracy: item.accuracyScore,
    yield: item.predictedYield,
  }));

  // Disease confidence distribution
  const diseaseConfidenceRanges = [
    { range: '0-50%', count: 0 },
    { range: '50-70%', count: 0 },
    { range: '70-85%', count: 0 },
    { range: '85-100%', count: 0 },
  ];

  diseaseHistory.forEach((item) => {
    const conf = item.confidencePercentage;
    if (conf < 50) diseaseConfidenceRanges[0].count++;
    else if (conf < 70) diseaseConfidenceRanges[1].count++;
    else if (conf < 85) diseaseConfidenceRanges[2].count++;
    else diseaseConfidenceRanges[3].count++;
  });

  // Irrigation recommendation breakdown
  const irrigationBreakdown = [
    { name: 'Irrigation Needed', value: irrigationHistory.filter((i) => i.recommendation).length },
    { name: 'No Irrigation', value: irrigationHistory.filter((i) => !i.recommendation).length },
  ];

  const COLORS = ['oklch(var(--chart-1))', 'oklch(var(--chart-2))', 'oklch(var(--chart-3))', 'oklch(var(--chart-4))'];
  const PIE_COLORS = ['oklch(var(--chart-1))', 'oklch(var(--chart-3))'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize insights and trends from your agricultural data
          </p>
        </div>

        <AuthGate
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Sign In Required</CardTitle>
                <CardDescription>Please sign in to view your analytics dashboard</CardDescription>
              </CardHeader>
            </Card>
          }
        >
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading analytics...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {/* Crop Yield Accuracy Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Crop Yield Accuracy Trend
                  </CardTitle>
                  <CardDescription>
                    Model accuracy scores over time ({cropHistory.length} predictions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cropYieldData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No crop yield predictions yet
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={cropYieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke={COLORS[0]} name="Accuracy Score" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Disease Confidence Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      Disease Detection Confidence
                    </CardTitle>
                    <CardDescription>
                      Distribution of confidence levels ({diseaseHistory.length} detections)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {diseaseHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No disease detections yet
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={diseaseConfidenceRanges}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill={COLORS[1]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Irrigation Recommendation Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      Irrigation Recommendations
                    </CardTitle>
                    <CardDescription>
                      Yes/No breakdown ({irrigationHistory.length} recommendations)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {irrigationHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No irrigation recommendations yet
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={irrigationBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {irrigationBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </AuthGate>
      </div>
    </div>
  );
}
