// Mock implementation of Azure Blob Storage service
// Original implementation used @azure/storage-blob which is not available
/**
 * Service for interacting with Azure Blob Storage
 * Note: This is a client-side implementation that would typically require server-side proxy
 * for secure SAS token generation in production environments.
 */
// Configuration values - in a real implementation, these would come from environment variables
const STORAGE_ACCOUNT_NAME = "your-storage-account";
const CONTAINER_NAME = "documents";

/**
 * Generates a SAS URL for uploading a blob (Demo implementation)
 * In production, this should be done server-side to keep storage keys secure
 * @param blobName The name of the blob
 * @param contentType The content type of the blob
 * @param expiryMinutes How long the SAS URL should be valid for (in minutes)
 * @returns The SAS URL for uploading
 */
/*
export const generateUploadSasUrl = async (
  blobName: string,
  contentType: string,
  expiryMinutes: number = 15
): Promise<string> => {
  // For demo purposes, return a placeholder URL
  console.log("Generating upload SAS URL for:", blobName, contentType);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?sv=demo&sig=demo`;
};
*/

/**
 * Generates a SAS URL for downloading a blob (Demo implementation)
 * @param blobName The name of the blob
 * @param expiryMinutes How long the SAS URL should be valid for (in minutes)
 * @returns The SAS URL for downloading
 */
/*
export const generateDownloadSasUrl = async (
  blobName: string,
  expiryMinutes: number = 60
): Promise<string> => {
  // For demo purposes, return a placeholder URL
  console.log("Generating download SAS URL for:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?sv=demo&sig=demo`;
};
*/

/**
 * Uploads a file directly to Azure Blob Storage (Demo implementation)
 * In production, this would use actual Azure SDK or server-side proxy
 * @param file The file to upload
 * @param blobName The name to give the blob (if not provided, will use the file name)
 * @returns The URL of the uploaded blob
 */
/*
export const uploadFileToBlobStorage = async (
  file: File,
  blobName?: string
): Promise<string> => {
  // Use the file name if blobName is not provided
  const finalBlobName = blobName || `${Date.now()}-${file.name}`;
  console.log(
    "Uploading file to blob storage:",
    finalBlobName,
    file.size,
    "bytes"
  );
  // Simulate upload delay based on file size
  const uploadDelay = Math.min(2000, Math.max(500, file.size / 1000));
  await new Promise((resolve) => setTimeout(resolve, uploadDelay));
  // Return a demo URL
  const demoUrl = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${finalBlobName}`;
  console.log("File uploaded successfully to:", demoUrl);
  return demoUrl;
};
*/

/**
 * Deletes a blob from Azure Blob Storage (Demo implementation)
 * @param blobName The name of the blob to delete
 * @returns A promise that resolves when the blob is deleted
 */
/*
export const deleteBlob = async (blobName: string): Promise<void> => {
  console.log("Deleting blob from storage:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Blob deleted successfully:", blobName);
};
*/

/**
 * Checks if a blob exists (Demo implementation)
 * @param blobName The name of the blob to check
 * @returns A promise that resolves to true if the blob exists, false otherwise
 */
/*
export const blobExists = async (blobName: string): Promise<boolean> => {
  console.log("Checking if blob exists:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // For demo purposes, return true for any blob name
  return true;
};
*/

/**
 * Gets the properties of a blob (Demo implementation)
 * @param blobName The name of the blob
 * @returns The blob properties
 */
/*
export const getBlobProperties = async (blobName: string) => {
  console.log("Getting blob properties:", blobName);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Return demo properties
  return {
    contentLength: 1024,
    contentType: "application/octet-stream",
    lastModified: new Date(),
    etag: '"demo-etag"',
  };
};
*/

/**
 * Extracts the blob name from a blob URL
 * @param blobUrl The full URL of the blob
 * @returns The blob name
 */
/*
export const getBlobNameFromUrl = (blobUrl: string): string => {
  // Remove any SAS token
  const urlWithoutSas = blobUrl.split("?")[0];
  // Extract the blob name from the URL
  const parts = urlWithoutSas.split("/");
  return parts[parts.length - 1];
};
*/
