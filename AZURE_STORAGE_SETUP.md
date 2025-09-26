# Azure Storage Setup for Document Upload

This guide explains how to configure Azure Blob Storage for your document upload functionality.

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Azure Storage Account Configuration
STORAGE_ACCOUNT_NAME=your-storage-account-name
CONTAINER_NAME=documents
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key

# Alternative: Use SAS Token instead of Storage Account Key
# SAS_TOKEN=your-sas-token-here
```

## Azure Portal Setup

### 1. Create Storage Account
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Storage Account
3. Note down the **Storage Account Name**

### 2. Get Storage Account Key
1. In your Storage Account, go to **Access Keys**
2. Copy **Key1** value
3. This is your `AZURE_STORAGE_ACCOUNT_KEY`

### 3. Create Container
1. Go to **Containers** in your Storage Account
2. Create a new container named `documents` (or your preferred name)
3. Set public access level as needed (typically **Private**)

### 4. Configure CORS (if needed)
If you plan to access blobs directly from the browser:
1. Go to **Resource sharing (CORS)** in your Storage Account
2. Add allowed origins, methods, and headers

## Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `STORAGE_ACCOUNT_NAME` | Your Azure Storage Account name | ✅ |
| `CONTAINER_NAME` | Container name for storing documents | ✅ |
| `AZURE_STORAGE_ACCOUNT_KEY` | Storage Account access key | ✅* |
| `SAS_TOKEN` | Alternative to storage key | ✅* |

*Either `AZURE_STORAGE_ACCOUNT_KEY` or `SAS_TOKEN` is required

## Vercel Deployment

For Vercel deployment, add these environment variables in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add each variable with their values
4. Make sure to mark sensitive keys as **Secret**

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. Use **Storage Account Key** for server-side operations only
3. Consider using **SAS tokens** with limited permissions
4. Rotate keys regularly
5. Use **Managed Identity** in production if possible

## Testing the Setup

1. Start your development server: `npm run dev`
2. Try uploading a document through the DocumentUpload component
3. Check the browser console for any errors
4. Verify files appear in your Azure Storage container

## Troubleshooting

### Common Issues:

1. **"No AZURE_STORAGE_ACCOUNT_KEY or SAS_TOKEN available"**
   - Check your environment variables are properly set
   - Restart your development server after adding env vars

2. **"Upload failed with status 403"**
   - Verify your storage account key is correct
   - Check container permissions

3. **"Upload failed with status 404"**
   - Verify storage account name and container name
   - Ensure container exists

4. **CORS errors**
   - Configure CORS settings in Azure Storage Account
   - Add your domain to allowed origins

## File Structure

Your files will be stored in Azure Blob Storage with the following structure:
```
https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{CONTAINER_NAME}/{filename}
```

The upload API automatically handles:
- File upload to Azure Blob Storage
- Unique blob naming
- Content type detection
- Error handling
