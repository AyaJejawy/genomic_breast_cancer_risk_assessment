import React, { useState } from "react";
import { Upload, Activity, Shield, CheckCircle, Dna } from "lucide-react";
import { Client } from "@gradio/client";
import GenomicUpload from "@/components/GenomicUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ThemeToggle from "@/components/ThemeToggle";

interface UploadedFile {
  file: File;
  type: "dna" | "rna" | "mirna";
  size: string;
  records: number;
  dataUrl?: string;
}
interface Confidence {
  label: string;
  confidence: number;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setAnalysisComplete(false);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length !== 3) return;

    setIsAnalyzing(true);
    const client = await Client.connect("AyaJejawy/graduation_project");
    const result = (await client.predict("/predict", {
      meth_file: uploadedFiles.find((f) => f.type === "dna")?.file,
      rna_file: uploadedFiles.find((f) => f.type === "rna")?.file,
      mirna_file: uploadedFiles.find((f) => f.type === "mirna")?.file,
    })) as any;
    result.data;
    const prediction = result?.data?.[0];
    console.log("Prediction:", prediction);
    const predictedLabel = prediction.label;
    console.log("Predicted label:", predictedLabel);
    const confidences = prediction.confidences as Confidence[];
    console.log("Confidences:", confidences);

    // Simulate AI analysis with realistic timing for genomic data
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Mock analysis results for genomic data
    const mockResults = {
      overallRisk: predictedLabel == "1" ? "high risk" : "low risk",
      confidence: parseFloat(
        (
          (confidences?.find((c) => c.label == predictedLabel)?.confidence ??
            0) * 100
        ).toFixed(3)
      ),
      recommendations:
        predictedLabel == "1"
          ? [
              "Visit your doctor for thorough clinical evaluations and monitoring",
              "Confirm all test results in a certified laboratory",
              "Maintain close follow-up with oncology genetics specialists for ongoing assessment and updates on preventive measures",
            ]
          : [
              "Continue standard screening protocols based on family history",
              "Genetic counseling may be beneficial for family planning",
              "Regular follow-up with oncology genetics if indicated",
            ],
    };

    setResults(mockResults);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg">
                <Dna className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Genomic Breast Cancer Risk Assessment
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  AI-powered analysis using DNA, RNA, and miRNA data
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {!analysisComplete ? (
          <div className="space-y-6 lg:space-y-8">
            {/* Instructions */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    Upload Genomic Data Files
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Please upload three parquet files containing DNA, RNA, and
                    miRNA data for comprehensive genomic analysis. Our AI system
                    will process the genomic information to assess breast cancer
                    risk.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>DNA Sequencing Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>RNA Expression Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>miRNA Profile Data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Component */}
            <GenomicUpload onFilesUploaded={handleFilesUploaded} />

            {/* Analysis Button */}
            {uploadedFiles.length === 3 && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
                <div className="text-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-6 sm:px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                        Processing Genomic Data...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Start Genomic Analysis
                      </>
                    )}
                  </button>
                  {isAnalyzing && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Our AI is analyzing your genomic data. This may take
                      several minutes...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResults
            results={results}
            onStartNew={() => {
              setUploadedFiles([]);
              setAnalysisComplete(false);
              setResults(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
