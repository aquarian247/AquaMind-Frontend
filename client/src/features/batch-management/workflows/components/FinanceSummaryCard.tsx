/**
 * Finance Summary Card - Shows intercompany transaction details for workflows.
 * 
 * Displays when workflow.is_intercompany is true.
 * Shows transaction status, amount, and approval actions.
 */

import { DollarSign, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BatchTransferWorkflowDetail } from '@/api/generated';

interface FinanceSummaryCardProps {
  workflow: BatchTransferWorkflowDetail;
  onApprove?: () => void;
  canApprove?: boolean;
}

export function FinanceSummaryCard({
  workflow,
  onApprove,
  canApprove = false,
}: FinanceSummaryCardProps) {
  if (!workflow.is_intercompany) {
    return null;
  }

  // Transaction exists if workflow is completed
  const hasTransaction = workflow.status === 'COMPLETED' && workflow.finance_transaction;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
            <CardTitle>Intercompany Transaction</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            {workflow.source_subsidiary} → {workflow.dest_subsidiary}
          </Badge>
        </div>
        <CardDescription>
          This transfer crosses subsidiary boundaries and will create a financial transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflow.status === 'COMPLETED' && !hasTransaction && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Clock className="h-4 w-4" />
            <span>Transaction will be created shortly...</span>
          </div>
        )}

        {hasTransaction && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="text-sm font-medium">#{workflow.finance_transaction}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="warning" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Approval
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Transferred Biomass</p>
              <p className="text-2xl font-bold">
                {parseFloat(workflow.total_biomass_kg).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} kg
              </p>
            </div>

            {canApprove && onApprove && (
              <Button
                onClick={onApprove}
                className="w-full"
                variant="default"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Transaction
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`/finance/intercompany-transactions/${workflow.finance_transaction}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Transaction Details
            </Button>
          </>
        )}

        {workflow.status === 'IN_PROGRESS' && (
          <div className="text-sm text-muted-foreground">
            <p>Transaction will be automatically created when all actions are completed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

