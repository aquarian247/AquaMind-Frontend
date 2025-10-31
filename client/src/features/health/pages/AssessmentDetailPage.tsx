import { useParams, useLocation } from 'wouter'
import { ArrowLeft, Calendar, Stethoscope, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useHealthSamplingEvent } from '../api'
import { formatCount } from '@/lib/formatFallback'

/**
 * Health Assessment Detail Page
 * 
 * Displays a single health assessment with all individual fish observations
 * and parameter scores in a clean, readable format.
 * 
 * Route: /health/assessments/:id
 */
export function AssessmentDetailPage() {
  const params = useParams()
  const [, navigate] = useLocation()
  const assessmentId = params.id ? parseInt(params.id) : undefined

  const { data: assessment, isLoading, error } = useHealthSamplingEvent(assessmentId)

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/health')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Health
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/health')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Health
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Assessment not found or failed to load.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const observations = (assessment as any).fish_observations || []
  const fishCount = observations.length
  const hasScores = observations.some((obs: any) => obs.parameter_scores?.length > 0)

  // Extract unique parameters from first fish (all fish should have same parameters)
  const parameters = hasScores && observations[0]?.parameter_scores
    ? observations[0].parameter_scores.map((score: any) => ({
        id: score.parameter,
        name: score.parameter_name || `Parameter ${score.parameter}`,
      }))
    : []

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/health')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Health
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              // TODO: Implement delete with confirmation
              alert('Delete functionality coming soon. Use Django Admin for now.')
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Assessment
          </Button>
        </div>
      </div>

      {/* Assessment Overview */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Stethoscope className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Health Assessment #{assessment.id}</h1>
            <p className="text-muted-foreground">
              Veterinary parameter scoring
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">#{assessment.assignment}</p>
            <p className="text-xs text-muted-foreground">
              {(assessment as any).batch_number || 'Batch ID'} - {(assessment as any).container_name || 'Container'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assessment Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-semibold">
                {assessment.sampling_date 
                  ? new Date(assessment.sampling_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fish Assessed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{formatCount(fishCount)} fish</p>
            <p className="text-xs text-muted-foreground">
              {assessment.number_of_fish_sampled} declared
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Parameters Scored</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{parameters.length} parameters</p>
            <p className="text-xs text-muted-foreground">
              {fishCount * parameters.length} total scores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Notes */}
      {assessment.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{assessment.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Individual Fish Scores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Fish Parameter Scores</CardTitle>
          <CardDescription>
            Detailed scores for each fish on each health parameter
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasScores ? (
            <Alert>
              <AlertDescription>
                No parameter scores recorded for this assessment.
                This may be a growth measurement (weight/length only) rather than a health assessment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Fish ID</TableHead>
                    {parameters.map((param: any) => (
                      <TableHead key={param.id} className="min-w-[120px]">
                        {param.name}
                      </TableHead>
                    ))}
                    {observations.some((obs: any) => obs.weight_g || obs.length_cm) && (
                      <>
                        <TableHead className="min-w-[100px]">Weight (g)</TableHead>
                        <TableHead className="min-w-[100px]">Length (cm)</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {observations.map((obs: any) => (
                    <TableRow key={obs.id}>
                      <TableCell className="font-medium">{obs.fish_identifier}</TableCell>
                      
                      {parameters.map((param: any) => {
                        const score = obs.parameter_scores?.find(
                          (s: any) => s.parameter === param.id
                        )
                        
                        return (
                          <TableCell key={param.id}>
                            {score ? (
                              <Badge 
                                variant={
                                  score.score === 0 ? 'default' : 
                                  score.score === 1 ? 'secondary' : 
                                  score.score === 2 ? 'outline' : 
                                  'destructive'
                                }
                              >
                                {score.score}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )
                      })}
                      
                      {observations.some((o: any) => o.weight_g || o.length_cm) && (
                        <>
                          <TableCell>
                            {obs.weight_g ? `${parseFloat(obs.weight_g).toFixed(1)}g` : '-'}
                          </TableCell>
                          <TableCell>
                            {obs.length_cm ? `${parseFloat(obs.length_cm).toFixed(1)}cm` : '-'}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aggregate Statistics (if we have biometric data) */}
      {(assessment.avg_weight_g || assessment.avg_length_cm || assessment.avg_k_factor) && (
        <Card>
          <CardHeader>
            <CardTitle>Aggregate Growth Metrics</CardTitle>
            <CardDescription>Calculated from individual fish measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {assessment.avg_weight_g && (
                <div>
                  <p className="text-sm text-muted-foreground">Average Weight</p>
                  <p className="text-2xl font-bold">{parseFloat(assessment.avg_weight_g as string).toFixed(1)}g</p>
                  {assessment.std_dev_weight_g && (
                    <p className="text-xs text-muted-foreground">
                      ±{parseFloat(assessment.std_dev_weight_g as string).toFixed(1)}g
                    </p>
                  )}
                </div>
              )}
              {assessment.avg_length_cm && (
                <div>
                  <p className="text-sm text-muted-foreground">Average Length</p>
                  <p className="text-2xl font-bold">{parseFloat(assessment.avg_length_cm as string).toFixed(1)}cm</p>
                  {assessment.std_dev_length_cm && (
                    <p className="text-xs text-muted-foreground">
                      ±{parseFloat(assessment.std_dev_length_cm as string).toFixed(1)}cm
                    </p>
                  )}
                </div>
              )}
              {assessment.avg_k_factor && (
                <div>
                  <p className="text-sm text-muted-foreground">K-Factor</p>
                  <p className="text-2xl font-bold">{parseFloat(assessment.avg_k_factor as string).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Condition factor</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

