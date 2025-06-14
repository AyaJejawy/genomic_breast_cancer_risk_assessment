import React from "react";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  RotateCcw,
  Shield,
} from "lucide-react";

interface AnalysisResult {
  overallRisk: string;
  confidence: number;
  findings: Array<{
    type: string;
    status: string;
    details: string;
  }>;
  recommendations: string[];
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  onStartNew: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  onStartNew,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low risk":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800";
      case "moderate risk":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800";
      case "high risk":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    return status.toLowerCase() === "normal" ? (
      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    );
  };

  const generateReport = () => {
    const reportContent = `
BREAST CANCER DETECTION ANALYSIS REPORT
=====================================

Overall Assessment: ${results.overallRisk}
Confidence Level: ${results.confidence}%
Analysis Date: ${new Date().toLocaleDateString()}

RECOMMENDATIONS:
${results.recommendations
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

DISCLAIMER:
This AI analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult with a qualified healthcare provider for proper medical evaluation and treatment decisions.
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breast-cancer-analysis-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Analysis Complete
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                AI-powered breast cancer detection results
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={generateReport}
              className="inline-flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
            <button
              onClick={onStartNew}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          Overall Risk Assessment
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div
            className={`px-4 sm:px-6 py-3 rounded-lg border-2 ${getRiskColor(
              results.overallRisk
            )}`}
          >
            <div className="text-center">
              <p className="text-xs sm:text-sm font-medium mb-1">Risk Level</p>
              <p className="text-lg sm:text-xl font-bold">
                {results.overallRisk}
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              AI Confidence
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-24 sm:w-32 bg-muted rounded-full h-2 sm:h-3">
                <div
                  className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.confidence}%` }}
                ></div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                {results.confidence}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Medical Recommendations
          </h3>
        </div>
        <div className="space-y-3">
          {results.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-sm sm:text-base text-foreground">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">
              Medical Disclaimer
            </h4>
            <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
              This AI analysis is for informational and educational purposes
              only. It should not be used as a substitute for professional
              medical diagnosis, treatment, or advice. Always consult with
              qualified healthcare providers for proper medical evaluation and
              treatment decisions. The accuracy of AI analysis may vary and
              should be validated by medical professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
