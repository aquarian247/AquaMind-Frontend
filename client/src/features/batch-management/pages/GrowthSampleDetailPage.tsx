/**
 * Growth Sample Detail Page
 * 
 * Displays detailed view of a growth sample including:
 * - Aggregate statistics (avg, std dev, min, max, K-factor)
 * - Individual fish observations table
 * - Sample metadata (batch, container, date)
 */

import { useParams, useLocation } from 'wouter'
import { 
  ArrowLeft, 
  Fish, 
  Ruler, 
  TrendingUp, 
  Activity, 
  Scale,
  Maximize2,
  Minimize2,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useGrowthSample } from '../api'

export function GrowthSampleDetailPage() {
  const params = useParams()
  const [, navigate] = useLocation()
  const sampleId = params.id ? parseInt(params.id) : undefined

  const { data: sample, isLoading, error } = useGrowthSample(sampleId)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !sample) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive">Failed to load growth sample</p>
            <Button onClick={() => navigate('/batch')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Batch Management
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const assignmentDetails = sample.assignment_details as any
  const batchNumber = assignmentDetails?.batch?.batch_number || 'Unknown'
  const containerName = assignmentDetails?.container?.name || 'Unknown'
  const fishObservations = (sample as any).fish_observations || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/batch')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Growth Sample #{sample.id}</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Batch {batchNumber} • Container {containerName} •{' '}
            {new Date(sample.sample_date || '').toLocaleDateString()}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Fish className="h-4 w-4 mr-2" />
          {sample.sample_size} fish sampled
        </Badge>
      </div>

      {/* Primary Statistics - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sample Size */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sample Size</CardTitle>
            <Fish className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sample.sample_size}</div>
            <p className="text-xs text-muted-foreground">
              Individual fish measured
            </p>
          </CardContent>
        </Card>

        {/* Average Weight */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <Scale className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sample.avg_weight_g ? `${Number(sample.avg_weight_g).toFixed(2)} g` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Mean weight per fish
            </p>
          </CardContent>
        </Card>

        {/* Average Length */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Length</CardTitle>
            <Ruler className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sample.avg_length_cm ? `${Number(sample.avg_length_cm).toFixed(2)} cm` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Mean length per fish
            </p>
          </CardContent>
        </Card>

        {/* K-Factor */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Condition Factor (K)</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sample.condition_factor ? Number(sample.condition_factor).toFixed(2) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Fulton's K-factor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution & Variability - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight Distribution */}
        {sample.min_weight_g && sample.max_weight_g ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Range</CardTitle>
              <BarChart3 className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Min</span>
                  <span className="font-semibold">{Number(sample.min_weight_g).toFixed(2)} g</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Max</span>
                  <span className="font-semibold">{Number(sample.max_weight_g).toFixed(2)} g</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-bold">{(Number(sample.max_weight_g) - Number(sample.min_weight_g)).toFixed(2)} g</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Range</CardTitle>
              <BarChart3 className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">N/A</div>
              <p className="text-xs text-muted-foreground">No data</p>
            </CardContent>
          </Card>
        )}

        {/* Length Distribution (if we have data) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Length Range</CardTitle>
            <Maximize2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {sample.avg_length_cm ? (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Avg ± Std Dev
                </div>
                <div className="text-lg font-bold">
                  {Number(sample.avg_length_cm).toFixed(2)} ±{' '}
                  {sample.std_deviation_length ? Number(sample.std_deviation_length).toFixed(2) : '0.00'} cm
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">No data</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Standard Deviation - Weight */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Std Dev</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sample.std_deviation_weight ? `± ${Number(sample.std_deviation_weight).toFixed(2)} g` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Weight variability
            </p>
          </CardContent>
        </Card>

        {/* Standard Deviation - Length */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Length Std Dev</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sample.std_deviation_length ? `± ${Number(sample.std_deviation_length).toFixed(2)} cm` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Length variability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notes (if any) */}
      {sample.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sample.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Individual Fish Observations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Fish Observations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed measurements for each fish in this sample
          </p>
        </CardHeader>
        <CardContent>
          {fishObservations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fish ID</TableHead>
                    <TableHead>Weight (g)</TableHead>
                    <TableHead>Length (cm)</TableHead>
                    <TableHead>K-Factor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fishObservations.map((fish: any) => (
                    <TableRow key={fish.id}>
                      <TableCell className="font-medium">
                        {fish.fish_identifier}
                      </TableCell>
                      <TableCell>
                        {Number(fish.weight_g).toFixed(2)}g
                      </TableCell>
                      <TableCell>
                        {Number(fish.length_cm).toFixed(2)}cm
                      </TableCell>
                      <TableCell className="font-mono">
                        {fish.calculated_k_factor 
                          ? Number(fish.calculated_k_factor).toFixed(2)
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No individual fish observations recorded for this sample
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

