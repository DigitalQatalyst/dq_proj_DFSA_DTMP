import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import { AlertCircleIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
const DiagnosticsTab: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState({
    supabaseConfigured: false,
    authState: {
      loggedIn: false,
      email: ''
    },
    storageBucketExists: false,
    databaseConnected: false
  });
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  useEffect(() => {
    const runDiagnostics = async () => {
      setLoading(true);
      try {
        // Check Supabase configuration
        const isConfigured = isSupabaseConfigured();
        // Check auth state
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        // Check storage bucket
        let storageBucketExists = false;
        try {
          const {
            data: buckets
          } = await supabase.storage.listBuckets();
          storageBucketExists = buckets?.some(bucket => bucket.name === 'media') || false;
        } catch (error) {
          console.error('Error checking storage bucket:', error);
        }
        // Check database connection
        let databaseConnected = false;
        try {
          const {
            count
          } = await supabase.from('media_items').select('*', {
            count: 'exact',
            head: true
          });
          databaseConnected = count !== null;
        } catch (error) {
          console.error('Error checking database connection:', error);
        }
        setDiagnostics({
          supabaseConfigured: isConfigured,
          authState: {
            loggedIn: !!user,
            email: user?.email || ''
          },
          storageBucketExists,
          databaseConnected
        });
      } catch (error) {
        console.error('Error running diagnostics:', error);
      } finally {
        setLoading(false);
      }
    };
    runDiagnostics();
  }, []);
  const seedDemoData = async () => {
    setSeedLoading(true);
    try {
      // Create demo media items
      const demoItems = [{
        id: uuidv4(),
        title: 'Getting Started with the Media Hub',
        slug: 'getting-started',
        summary: 'Learn how to use the Media Hub effectively.',
        body: '<p>This is a demo article explaining how to use the Media Hub.</p>',
        type: 'Article',
        status: 'Published',
        visibility: 'Public',
        language: 'en',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        id: uuidv4(),
        title: 'Upcoming Features Roadmap',
        slug: 'upcoming-features',
        summary: "Discover what's coming next to the Media Hub.",
        body: '<p>This is a demo article about upcoming features.</p>',
        type: 'Announcement',
        status: 'Draft',
        visibility: 'Private',
        language: 'en',
        published_at: null,
        updated_at: new Date().toISOString()
      }, {
        id: uuidv4(),
        title: 'Content Strategy Guide',
        slug: 'content-strategy',
        summary: 'Best practices for developing your content strategy.',
        body: '<p>This is a demo article about content strategy.</p>',
        type: 'Report',
        status: 'InReview',
        visibility: 'Public',
        language: 'en',
        published_at: null,
        updated_at: new Date().toISOString()
      }, {
        id: uuidv4(),
        title: 'Annual Conference 2023',
        slug: 'annual-conference-2023',
        summary: 'Information about our upcoming annual conference.',
        body: '<p>This is a demo event page.</p>',
        type: 'Event',
        status: 'Scheduled',
        visibility: 'Public',
        language: 'en',
        published_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }, {
        id: uuidv4(),
        title: 'Legacy Documentation',
        slug: 'legacy-documentation',
        summary: 'Archive of our legacy documentation.',
        body: '<p>This is archived documentation.</p>',
        type: 'Article',
        status: 'Archived',
        visibility: 'Public',
        language: 'en',
        published_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }];
      // Insert demo items
      const {
        error: insertError
      } = await supabase.from('media_items').upsert(demoItems, {
        onConflict: 'slug'
      });
      if (insertError) throw insertError;
      // Create a demo asset for each item
      for (const item of demoItems) {
        const assetId = uuidv4();
        const assetPath = `media/${item.id}/demo-asset.jpg`;
        const {
          error: assetError
        } = await supabase.from('media_assets').insert([{
          id: assetId,
          media_id: item.id,
          storage_path: assetPath,
          public_url: 'https://via.placeholder.com/800x600?text=Demo+Asset',
          mime: 'image/jpeg',
          size_bytes: 12345,
          width: 800,
          height: 600,
          duration_sec: null,
          checksum: `demo-${Date.now()}`
        }]);
        if (assetError) throw assetError;
      }
      setNotification({
        type: 'success',
        message: 'Demo data seeded successfully!'
      });
    } catch (error) {
      console.error('Error seeding demo data:', error);
      setNotification({
        type: 'error',
        message: 'Error seeding demo data: ' + (error instanceof Error ? error.message : String(error))
      });
    } finally {
      setSeedLoading(false);
    }
  };
  const clearDemoData = async () => {
    setClearLoading(true);
    try {
      // Delete all assets first (foreign key constraint)
      const {
        error: assetsError
      } = await supabase.from('media_assets').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Safety check
      if (assetsError) throw assetsError;
      // Delete all media items
      const {
        error: itemsError
      } = await supabase.from('media_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Safety check
      if (itemsError) throw itemsError;
      setNotification({
        type: 'success',
        message: 'Demo data cleared successfully!'
      });
    } catch (error) {
      console.error('Error clearing demo data:', error);
      setNotification({
        type: 'error',
        message: 'Error clearing demo data: ' + (error instanceof Error ? error.message : String(error))
      });
    } finally {
      setClearLoading(false);
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          System Diagnostics
        </h2>
        {notification && <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex justify-between items-start`}>
            <div className="flex items-start">
              {notification.type === 'success' ? <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5" /> : <AlertCircleIcon className="h-5 w-5 mr-2 mt-0.5" />}
              <p>{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-gray-700" aria-label="Dismiss">
              <XIcon className="h-4 w-4" />
            </button>
          </div>}
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          {loading ? <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div> : <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {diagnostics.supabaseConfigured ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> : <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
                  <span className="text-gray-700">Supabase Configuration</span>
                </div>
                <span className={`text-sm ${diagnostics.supabaseConfigured ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.supabaseConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {diagnostics.authState.loggedIn ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> : <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
                  <span className="text-gray-700">Authentication</span>
                </div>
                <span className={`text-sm ${diagnostics.authState.loggedIn ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.authState.loggedIn ? `Logged in as ${diagnostics.authState.email}` : 'Not logged in'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {diagnostics.storageBucketExists ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> : <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
                  <span className="text-gray-700">Storage Bucket</span>
                </div>
                <span className={`text-sm ${diagnostics.storageBucketExists ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.storageBucketExists ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {diagnostics.databaseConnected ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> : <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
                  <span className="text-gray-700">Database Connection</span>
                </div>
                <span className={`text-sm ${diagnostics.databaseConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnostics.databaseConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Demo Data</h2>
        <div className="bg-white p-4 border border-gray-200 rounded-md space-y-4">
          <p className="text-sm text-gray-600">
            Use these tools to quickly seed or clear demo data for testing
            purposes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={seedDemoData} disabled={seedLoading || !diagnostics.databaseConnected} className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${seedLoading || !diagnostics.databaseConnected ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}>
              {seedLoading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Seeding...
                </> : 'Seed Demo Data'}
            </button>
            <button onClick={clearDemoData} disabled={clearLoading || !diagnostics.databaseConnected} className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${clearLoading || !diagnostics.databaseConnected ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'}`}>
              {clearLoading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Clearing...
                </> : 'Clear Demo Data'}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default DiagnosticsTab;