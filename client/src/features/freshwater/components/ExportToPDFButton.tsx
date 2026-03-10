import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { getCurrentWeek } from '../utils/reportFormatting';

interface ExportToPDFButtonProps {
  className?: string;
}

export function ExportToPDFButton({ className }: ExportToPDFButtonProps) {
  const { week, year } = getCurrentWeek();

  const handleExport = () => {
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        /* Hide non-report elements */
        nav, header, [data-tour], .sidebar-nav-item,
        [id="station-filter"], [role="tablist"],
        button:not(.print-visible) {
          display: none !important;
        }

        /* Reset layout */
        main { padding: 0 !important; margin: 0 !important; }
        .lg\\:ml-64 { margin-left: 0 !important; }

        /* Ensure tables don't break awkwardly */
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; }

        /* Chart sizing for print */
        .recharts-responsive-container { break-inside: avoid; }

        /* Header for printed report */
        body::before {
          content: "Freshwater Weekly Report — Week ${week}, ${year}";
          display: block;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 16px;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(style);
    window.print();

    setTimeout(() => {
      const el = document.getElementById('print-styles');
      if (el) el.remove();
    }, 1000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className={className}
    >
      <FileDown className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
}
