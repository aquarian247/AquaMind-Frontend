import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Thermometer, Upload, Calendar as CalendarIcon, TrendingUp, Info, Download, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * Full Temperature Profile Creation Dialog
 * 
 * PRD Section 3.3.1: Multi-Method Data Entry System
 * 
 * Supports 3 methods:
 * 1. CSV Upload - Bulk upload with template download
 * 2. Date Range Input - Define temperature ranges (e.g., Jan-Mar: 8°C, Apr-Jun: 10°C)
 * 3. Quick Create - Simple profile creation (readings added later)
 * 
 * Future Enhancements (PRD Section 3.3.1):
 * - Visual data editor (interactive line charts)
 * - Formula-based input (linear increase, seasonal variation)
 * - Template library (predefined profiles)
 */

// Date Range Schema
const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  value: z.number().min(-5, "Too cold").max(30, "Too warm"),
});

// CSV Upload Schema
const csvUploadSchema = z.object({
  profileName: z.string().min(1, "Profile name required").max(255),
  file: z.instanceof(File).refine((file) => file.size > 0, "File is required"),
  validateOnly: z.boolean().default(false),
});

// Date Range Bulk Schema
const dateRangeBulkSchema = z.object({
  profileName: z.string().min(1, "Profile name required").max(255),
  ranges: z.array(dateRangeSchema).min(1, "At least one range required"),
  mergeAdjacent: z.boolean().default(true),
  fillGaps: z.boolean().default(true),
  interpolationMethod: z.enum(['linear', 'step']).default('linear'),
});

type DateRangeFormData = z.infer<typeof dateRangeSchema>;
type CSVUploadFormData = z.infer<typeof csvUploadSchema>;
type DateRangeBulkFormData = z.infer<typeof dateRangeBulkSchema>;

interface TemperatureProfileCreationDialogFullProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function TemperatureProfileCreationDialogFull({ 
  children, 
  onSuccess 
}: TemperatureProfileCreationDialogFullProps) {
  const [open, setOpen] = useState(false);
  const [activeMethod, setActiveMethod] = useState("csv");
  const [ranges, setRanges] = useState<DateRangeFormData[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Date Range Form
  const rangeForm = useForm<DateRangeBulkFormData>({
    resolver: zodResolver(dateRangeBulkSchema),
    defaultValues: {
      profileName: "",
      ranges: [],
      mergeAdjacent: true,
      fillGaps: true,
      interpolationMethod: 'linear',
    },
  });

  // CSV Upload Form
  const csvForm = useForm<CSVUploadFormData>({
    resolver: zodResolver(csvUploadSchema),
    defaultValues: {
      profileName: "",
      validateOnly: false,
    },
  });

  const [currentRange, setCurrentRange] = useState<Partial<DateRangeFormData>>({
    value: 10,
  });

  // CSV Upload Mutation
  const uploadCsvMutation = useMutation({
    mutationFn: async (data: CSVUploadFormData) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('profile_name', data.profileName);
      formData.append('validate_only', String(data.validateOnly));

      const response = await fetch('/api/v1/scenario/temperature-profiles/upload_csv/', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - browser will set it with boundary
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Temperature Profile Created",
          description: `Successfully imported ${data.imported_count || 0} readings.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/temperature-profiles/"] });
        queryClient.invalidateQueries({ queryKey: ["scenario"] });
        csvForm.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast({
          title: "Validation Errors",
          description: data.errors?.join(', ') || "Please check your CSV format",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV",
        variant: "destructive",
      });
    },
  });

  // Date Range Bulk Mutation
  const bulkDateRangeMutation = useMutation({
    mutationFn: async (data: DateRangeBulkFormData) => {
      return apiRequest("POST", "/api/v1/scenario/temperature-profiles/bulk_date_ranges/", {
        profile_name: data.profileName,
        ranges: data.ranges.map(r => ({
          start_date: format(r.startDate, 'yyyy-MM-dd'),
          end_date: format(r.endDate, 'yyyy-MM-dd'),
          value: r.value,
        })),
        merge_adjacent: data.mergeAdjacent,
        fill_gaps: data.fillGaps,
        interpolation_method: data.interpolationMethod,
      });
    },
    onSuccess: () => {
      toast({
        title: "Temperature Profile Created",
        description: "Profile created successfully from date ranges.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/temperature-profiles/"] });
      queryClient.invalidateQueries({ queryKey: ["scenario"] });
      rangeForm.reset();
      setRanges([]);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/v1/scenario/temperature-profiles/download_template/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'temperature_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Template Downloaded",
        description: "CSV template downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download template",
        variant: "destructive",
      });
    }
  };

  const handleAddRange = () => {
    if (currentRange.startDate && currentRange.endDate && currentRange.value !== undefined) {
      setRanges([...ranges, currentRange as DateRangeFormData]);
      rangeForm.setValue('ranges', [...ranges, currentRange as DateRangeFormData]);
      setCurrentRange({ value: currentRange.value }); // Keep value, reset dates
    }
  };

  const handleRemoveRange = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    setRanges(newRanges);
    rangeForm.setValue('ranges', newRanges);
  };

  const handleSubmitDateRanges = (data: DateRangeBulkFormData) => {
    bulkDateRangeMutation.mutate(data);
  };

  const handleSubmitCsv = (data: CSVUploadFormData) => {
    uploadCsvMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Create Temperature Profile
          </DialogTitle>
          <DialogDescription>
            Choose your preferred method to create a temperature profile. PRD Section 3.3.1 multi-method data entry.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeMethod} onValueChange={setActiveMethod} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="ranges">Date Ranges</TabsTrigger>
          </TabsList>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with daily temperature values. Up to 900+ readings supported.
                <br />Format: date,temperature (e.g., 2024-01-01,8.5)
              </AlertDescription>
            </Alert>

            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>

            <Form {...csvForm}>
              <form onSubmit={csvForm.handleSubmit(handleSubmitCsv)} className="space-y-4">
                <FormField
                  control={csvForm.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Faroe Islands Winter 2024'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={csvForm.control}
                  name="file"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>CSV File *</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept=".csv"
                          onChange={(e) => onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload CSV with columns: date,temperature
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={csvForm.control}
                  name="validateOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Validate Only</FormLabel>
                        <FormDescription className="text-xs">
                          Check CSV format without importing
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={uploadCsvMutation.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadCsvMutation.isPending ? "Uploading..." : "Upload & Create"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Date Ranges Tab */}
          <TabsContent value="ranges" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Define temperature values for date ranges instead of daily entries.
                <br />Example: Jan-Mar: 8°C, Apr-Jun: 10°C, Jul-Sep: 12°C
              </AlertDescription>
            </Alert>

            <Form {...rangeForm}>
              <form onSubmit={rangeForm.handleSubmit(handleSubmitDateRanges)} className="space-y-4">
                <FormField
                  control={rangeForm.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Scotland Summer 2024'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Add Range Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Temperature Range</CardTitle>
                    <CardDescription>Define a period with constant temperature</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date *</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentRange.startDate ? format(currentRange.startDate, 'PPP') : 'Pick start date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentRange.startDate}
                              onSelect={(date) => setCurrentRange({ ...currentRange, startDate: date })}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date *</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentRange.endDate ? format(currentRange.endDate, 'PPP') : 'Pick end date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={currentRange.endDate}
                              onSelect={(date) => setCurrentRange({ ...currentRange, endDate: date })}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Temperature (°C) *</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="-5"
                        max="30"
                        value={currentRange.value || ''}
                        onChange={(e) => setCurrentRange({ ...currentRange, value: parseFloat(e.target.value) })}
                        placeholder="10.5"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleAddRange}
                      disabled={!currentRange.startDate || !currentRange.endDate || currentRange.value === undefined}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Range
                    </Button>
                  </CardContent>
                </Card>

                {/* Ranges List */}
                {ranges.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Configured Ranges ({ranges.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {ranges.map((range, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="text-sm">
                            <span className="font-medium">{format(range.startDate, 'MMM d, yyyy')}</span>
                            {' → '}
                            <span className="font-medium">{format(range.endDate, 'MMM d, yyyy')}</span>
                            {': '}
                            <span className="text-primary font-semibold">{range.value}°C</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRange(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={rangeForm.control}
                    name="mergeAdjacent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Merge Adjacent</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={rangeForm.control}
                    name="fillGaps"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Fill Gaps</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={rangeForm.control}
                  name="interpolationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interpolation Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="linear">Linear Interpolation</SelectItem>
                          <SelectItem value="step">Step (Constant)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How to fill gaps between ranges
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={ranges.length === 0 || bulkDateRangeMutation.isPending}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {bulkDateRangeMutation.isPending ? "Creating..." : `Create Profile (${ranges.length} ranges)`}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

