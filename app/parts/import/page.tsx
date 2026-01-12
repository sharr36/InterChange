"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImportParts() {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", "temp-user-id"); // TODO: Get from auth session

      const response = await fetch("/api/parts/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Import error:", error);
      setResult({ error: "Failed to import file" });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "partNumber,manufacturerPartNumber,manufacturer,description,category,micronRating,size,material\n" +
      "ABC123,XYZ789,FilterCo,Hydraulic Filter,Filters,10,5x3,Metal\n" +
      "DEF456,UVW123,BearingPro,Ball Bearing,Bearings,,20mm,Steel\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parts_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Import Parts from CSV
          </h1>

          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              CSV Format Instructions
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Your CSV file should include the following required columns:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1 mb-3">
              <li>
                <strong>partNumber</strong> - Unique part number (required)
              </li>
              <li>
                <strong>manufacturer</strong> - Manufacturer name (required)
              </li>
              <li>
                <strong>description</strong> - Part description (required)
              </li>
              <li>
                <strong>category</strong> - Part category (e.g., Filters,
                Bearings)
              </li>
            </ul>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Additional columns will be imported as specifications (e.g.,
              micronRating, size, material, etc.)
            </p>
            <button
              onClick={downloadTemplate}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Download Template CSV
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-200"
              />
            </div>

            {file && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Selected file:</strong> {file.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isImporting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? "Importing..." : "Import Parts"}
            </button>
          </form>

          {result && (
            <div className="mt-8 border-t dark:border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Import Results
              </h2>

              {result.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">{result.error}</p>
                  {result.details && (
                    <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                      {result.details}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Rows
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.totalRows}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Processed
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.processedRows}
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Errors
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {result.errorRows}
                      </p>
                    </div>
                  </div>

                  {result.errors && result.errors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Errors
                      </h3>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 max-h-64 overflow-auto">
                        <pre className="text-xs text-red-800 dark:text-red-200">
                          {JSON.stringify(result.errors, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {result.success && result.errorRows === 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-green-800 dark:text-green-200">
                        All parts imported successfully! They are pending approval
                        by an administrator.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
