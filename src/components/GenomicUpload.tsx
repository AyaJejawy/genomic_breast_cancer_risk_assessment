import React, { useCallback, useEffect, useState } from "react";
import { Upload, X, FileBarChart, Database, Dna } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  file: File;
  type: "dna" | "rna" | "mirna";
  size: string;
  records: number;
  dataUrl?: string;
}

interface GenomicUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

const GenomicUpload: React.FC<GenomicUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  // Notify parent when files change
  useEffect(() => {
    onFilesUploaded(files);
  }, [files, onFilesUploaded]);

  const dataTypes = [
    {
      id: "dna",
      label: "DNA",
      icon: Dna,
      description: "DNA sequencing data (.parquet)",
      color: "text-red-600 dark:text-red-400",
    },
    {
      id: "rna",
      label: "RNA",
      icon: FileBarChart,
      description: "RNA expression data (.parquet)",
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "mirna",
      label: "miRNA",
      icon: Database,
      description: "miRNA profile data (.parquet)",
      color: "text-purple-600 dark:text-purple-400",
    },
  ] as const;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const estimateRecords = (fileSize: number): number => {
    return Math.floor(fileSize / 1024);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], dataType: "dna" | "rna" | "mirna") => {
      acceptedFiles.forEach((file) => {
        if (!file.name.toLowerCase().endsWith(".parquet")) {
          toast({
            title: "Invalid file type",
            description: "Please upload .parquet files only",
            variant: "destructive",
          });
          return;
        }
        if (file.size > 100 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload files smaller than 100MB",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;

          const newFile: UploadedFile = {
            file,
            type: dataType,
            size: formatFileSize(file.size),
            records: estimateRecords(file.size),
            dataUrl,
          };

          setFiles((prevFiles) => {
            const existingTypeIndex = prevFiles.findIndex(
              (f) => f.type === dataType
            );
            let updatedFiles;
            if (existingTypeIndex >= 0) {
              updatedFiles = [...prevFiles];
              updatedFiles[existingTypeIndex] = newFile;
            } else {
              updatedFiles = [...prevFiles, newFile];
            }

            return updatedFiles;
          });

          toast({
            title: "Genomic data uploaded",
            description: `${dataType.toUpperCase()} file has been uploaded successfully`,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [onFilesUploaded, toast]
  );

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);

    toast({
      title: "File removed",
      description: "Genomic data file has been removed from the analysis",
    });
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    dataType: "dna" | "rna" | "mirna"
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    onDrop(selectedFiles, dataType);
    event.target.value = "";
  };

  const getUploadedFileForType = (type: "dna" | "rna" | "mirna") => {
    return files.find((f) => f.type === type);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Upload Genomic Data Files
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataTypes.map((dataType) => {
          const uploadedFile = getUploadedFileForType(dataType.id);
          const IconComponent = dataType.icon;

          return (
            <div key={dataType.id} className="space-y-4">
              <div className="text-center">
                <IconComponent
                  className={`w-8 h-8 mx-auto mb-2 ${dataType.color}`}
                />
                <h3 className="font-medium text-foreground">
                  {dataType.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dataType.description}
                </p>
              </div>

              {uploadedFile ? (
                <div className="relative">
                  <div className="border-2 border-green-500/30 rounded-lg p-4 bg-green-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {uploadedFile.file.name}
                      </span>
                      <button
                        onClick={() => removeFile(files.indexOf(uploadedFile))}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Size: {uploadedFile.size}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                      ✓ Uploaded
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drop {dataType.label} parquet file here or click to browse
                  </p>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                      Select File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".parquet"
                      onChange={(e) => handleFileSelect(e, dataType.id)}
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {files.length > 0 && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-semibold">
                  {files.length}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {files.length} of 3 genomic data files uploaded
              </span>
            </div>
            {files.length === 3 && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Ready for analysis
              </span>
            )}
          </div>
          <div className="mt-2 w-full bg-primary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(files.length / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenomicUpload;
