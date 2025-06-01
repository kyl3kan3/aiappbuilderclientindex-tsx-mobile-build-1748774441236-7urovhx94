import React from 'react';

// Converted from JavaScript
/**
 * SimplifiedProjectDownloader
 * 
 * This utility provides a simplified interface for downloading and packaging
 * mobile app projects built remotely through GitHub Actions.
 * It supports iOS, Android, React Native, and Flutter projects.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class SimplifiedProjectDownloader {
  constructor(apiBase = '/api') {
    this.apiBase = apiBase;
  }

  /**
   * Download a complete mobile app project with binaries
   * 
   * @param {Object} options Download options
   * @param {string} options.owner GitHub repository owner
   * @param {string} options.repo GitHub repository name
   * @param {string} options.platform Platform (ios, android, react-native, flutter)
   * @param {string} options.buildType Build type (debug, release)
   * @param {boolean} options.includeSource Whether to include source code
   * @returns {Promise<Blob>} The downloaded project as a Blob
   */
  async downloadProject(options) {
    try {
      const { owner, repo, platform, buildType = 'release', includeSource = true } = options;
      
      // Create a new zip file
      const zip = new JSZip();
      
      // Add a README file
      const readmeContent = this.generateReadme(options);
      zip.file('README.md', readmeContent);
      
      // Get the latest release with built app binaries
      const latestRelease = await this.fetchLatestRelease(owner, repo);
      
      if (!latestRelease) {
        throw new Error('No releases found for this repository');
      }
      
      // Download and add app binaries
      await this.addBinariesToZip(zip, latestRelease, platform, buildType);
      
      // Include source code if requested
      if (includeSource) {
        await this.addSourceCodeToZip(zip, owner, repo);
      }
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } catch (error) {
      console.error('Error downloading project:', error);
      throw error;
    }
  }
  
  /**
   * Fetch the latest release from GitHub
   * 
   * @param {string} owner GitHub repository owner
   * @param {string} repo GitHub repository name
   * @returns {Promise<Object>} Latest release information
   */
  async fetchLatestRelease(owner, repo) {
    try {
      const endpoint = `${this.apiBase}/github/${owner}/${repo}/releases/latest`;
      
      const response = await fetch(endpoint);
      
      // If there are no releases yet, return null
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch latest release: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return null;
    }
  }
  
  /**
   * Download and add app binaries to the zip file
   * 
   * @param {JSZip} zip JSZip instance
   * @param {Object} release Release information
   * @param {string} platform Platform (ios, android, react-native, flutter)
   * @param {string} buildType Build type (debug, release)
   * @returns {Promise<void>}
   */
  async addBinariesToZip(zip, release, platform, buildType) {
    if (!release || !release.assets || release.assets.length === 0) {
      console.warn('No assets found in the release');
      return;
    }
    
    // Create a binaries folder
    const binFolder = zip.folder('binaries');
    
    // Download assets based on platform
    const assetsToDownload = [];
    
    switch (platform) {
      case 'ios':
        // Find IPA files
        assetsToDownload.push(...release.assets.filter(asset => 
          asset.name.endsWith('.ipa')
        ));
        break;
        
      case 'android':
        // Find APK and AAB files
        assetsToDownload.push(...release.assets.filter(asset => 
          asset.name.endsWith('.apk') || asset.name.endsWith('.aab')
        ));
        break;
        
      case 'react-native':
        // Find both IPA and APK/AAB files
        assetsToDownload.push(...release.assets.filter(asset => 
          asset.name.endsWith('.ipa') || 
          asset.name.endsWith('.apk') || 
          asset.name.endsWith('.aab')
        ));
        break;
        
      case 'flutter':
        // Find IPA, APK/AAB, and web files
        assetsToDownload.push(...release.assets.filter(asset => 
          asset.name.endsWith('.ipa') || 
          asset.name.endsWith('.apk') || 
          asset.name.endsWith('.aab') ||
          asset.name.includes('-web')
        ));
        break;
        
      default:
        // Download all assets
        assetsToDownload.push(...release.assets);
    }
    
    // Filter by build type if specified
    if (buildType) {
      const buildTypeStr = buildType.toLowerCase();
      assetsToDownload = assetsToDownload.filter(asset => 
        asset.name.toLowerCase().includes(buildTypeStr)
      );
    }
    
    if (assetsToDownload.length === 0) {
      console.warn('No matching assets found for the specified platform and build type');
      return;
    }
    
    // Download each asset
    for (const asset of assetsToDownload) {
      try {
        const assetResponse = await fetch(asset.browser_download_url);
        
        if (!assetResponse.ok) {
          console.warn(`Failed to download asset ${asset.name}: ${assetResponse.statusText}`);
          continue;
        }
        
        const assetBlob = await assetResponse.blob();
        binFolder.file(asset.name, assetBlob);
      } catch (error) {
        console.warn(`Error downloading asset ${asset.name}:`, error);
      }
    }
  }
  
  /**
   * Download and add source code to the zip file
   * 
   * @param {JSZip} zip JSZip instance
   * @param {string} owner GitHub repository owner
   * @param {string} repo GitHub repository name
   * @returns {Promise<void>}
   */
  async addSourceCodeToZip(zip, owner, repo) {
    try {
      // Create a source code folder
      const sourceFolder = zip.folder('source');
      
      // Get the repository contents
      const contentsEndpoint = `${this.apiBase}/github/${owner}/${repo}/contents`;
      
      const contentsResponse = await fetch(contentsEndpoint);
      
      if (!contentsResponse.ok) {
        throw new Error(`Failed to fetch repository contents: ${contentsResponse.statusText}`);
      }
      
      const contents = await contentsResponse.json();
      
      // Download repository as a zip file
      const repoEndpoint = `${this.apiBase}/github/${owner}/${repo}/zipball/main`;
      
      const repoResponse = await fetch(repoEndpoint);
      
      if (!repoResponse.ok) {
        throw new Error(`Failed to download repository: ${repoResponse.statusText}`);
      }
      
      const repoBlob = await repoResponse.blob();
      
      // Add repository zip to the source folder
      sourceFolder.file('repository.zip', repoBlob);
      
      // Add information about the repository
      sourceFolder.file('repo-info.md', `# Repository Information

Repository: ${owner}/${repo}
URL: https://github.com/${owner}/${repo}

This folder contains the source code for the project. The repository has been downloaded as a zip file.
You can extract it to view and modify the source code.
`);
    } catch (error) {
      console.warn('Error adding source code to zip:', error);
      // Continue without source code
    }
  }
  
  /**
   * Generate a README file for the downloaded project
   * 
   * @param {Object} options Project options
   * @returns {string} README content
   */
  generateReadme(options) {
    const { owner, repo, platform, buildType } = options;
    
    let platformSpecificInstructions = '';
    
    switch (platform) {
      case 'ios':
        platformSpecificInstructions = `## iOS App Installation

The \`binaries\` folder contains the compiled iOS app (.ipa file) that can be installed on iOS devices.

### Installing on an iOS Device:

1. **Using Xcode** (Development build):
   - Connect your iOS device to your Mac
   - Open Xcode and go to Window > Devices and Simulators
   - Select your device and click the "+" button under Installed Apps
   - Select the .ipa file and click Open

2. **Using Apple TestFlight** (for distribution):
   - Upload the .ipa file to App Store Connect
   - Invite testers through TestFlight
   - Testers will receive an email with instructions to install the app

3. **Using a Mobile Device Management (MDM) solution** (for enterprise distribution):
   - Upload the .ipa file to your MDM solution
   - Follow your MDM provider's instructions for distributing the app to devices

### Source Code:

The \`source\` folder contains the complete Xcode project source code. To open and modify it:

1. Extract the repository.zip file
2. Open the .xcodeproj or .xcworkspace file in Xcode
3. Make your changes and build the app
`;
        break;
        
      case 'android':
        platformSpecificInstructions = `## Android App Installation

The \`binaries\` folder contains the compiled Android app (.apk and/or .aab files).

### Installing on an Android Device:

1. **Using APK file**:
   - Enable "Install from Unknown Sources" in your Android device settings
   - Transfer the .apk file to your Android device
   - Tap on the .apk file to install it

2. **Using Google Play Store** (for .aab files):
   - Upload the .aab file to the Google Play Console
   - Follow the Google Play release process
   - Users can then download the app from the Play Store

### Source Code:

The \`source\` folder contains the complete Android project source code. To open and modify it:

1. Extract the repository.zip file
2. Open the project in Android Studio
3. Make your changes and build the app
`;
        break;
        
      case 'react-native':
        platformSpecificInstructions = `## React Native App Installation

The \`binaries\` folder contains compiled app files for both iOS (.ipa) and Android (.apk and/or .aab).

### Installing on iOS:

1. **Using Xcode** (Development build):
   - Connect your iOS device to your Mac
   - Open Xcode and go to Window > Devices and Simulators
   - Select your device and click the "+" button under Installed Apps
   - Select the .ipa file and click Open

2. **Using Apple TestFlight** (for distribution):
   - Upload the .ipa file to App Store Connect
   - Invite testers through TestFlight
   - Testers will receive an email with instructions to install the app

### Installing on Android:

1. **Using APK file**:
   - Enable "Install from Unknown Sources" in your Android device settings
   - Transfer the .apk file to your Android device
   - Tap on the .apk file to install it

2. **Using Google Play Store** (for .aab files):
   - Upload the .aab file to the Google Play Console
   - Follow the Google Play release process
   - Users can then download the app from the Play Store

### Source Code:

The \`source\` folder contains the complete React Native project. To open and modify it:

1. Extract the repository.zip file
2. Run \`npm install\` or \`yarn install\` to install dependencies
3. Run \`npx react-native run-ios\` or \`npx react-native run-android\` to build and run the app locally
`;
        break;
        
      case 'flutter':
        platformSpecificInstructions = `## Flutter App Installation

The \`binaries\` folder contains compiled app files for iOS (.ipa), Android (.apk and/or .aab), and possibly web.

### Installing on iOS:

1. **Using Xcode** (Development build):
   - Connect your iOS device to your Mac
   - Open Xcode and go to Window > Devices and Simulators
   - Select your device and click the "+" button under Installed Apps
   - Select the .ipa file and click Open

2. **Using Apple TestFlight** (for distribution):
   - Upload the .ipa file to App Store Connect
   - Invite testers through TestFlight
   - Testers will receive an email with instructions to install the app

### Installing on Android:

1. **Using APK file**:
   - Enable "Install from Unknown Sources" in your Android device settings
   - Transfer the .apk file to your Android device
   - Tap on the .apk file to install it

2. **Using Google Play Store** (for .aab files):
   - Upload the .aab file to the Google Play Console
   - Follow the Google Play release process
   - Users can then download the app from the Play Store

### Web Deployment:
If web build is included, extract the web archive and deploy it to any web server or hosting service.

### Source Code:

The \`source\` folder contains the complete Flutter project. To open and modify it:

1. Extract the repository.zip file
2. Run \`flutter pub get\` to install dependencies
3. Run \`flutter run\` to build and run the app locally
`;
        break;
        
      default:
        platformSpecificInstructions = `## App Installation

The \`binaries\` folder contains the compiled app files.

### Source Code:

The \`source\` folder contains the complete project source code.
`;
    }
    
    return `# ${repo} - Mobile App Project

This package contains the mobile app project for **${repo}**, built for the **${platform}** platform.

## Project Information

- **Repository**: ${owner}/${repo}
- **Platform**: ${platform}
- **Build Type**: ${buildType}
- **Build Date**: ${new Date().toLocaleDateString()}

${platformSpecificInstructions}

## Need Help?

If you encounter any issues with this package or need assistance with installation, please contact the repository maintainer.
`;
  }
  
  /**
   * Save a downloaded project to the user's device
   * 
   * @param {Blob} blob The project blob to save
   * @param {string} projectName The project name
   * @param {string} platform The platform (ios, android, etc.)
   */
  saveProject(blob, projectName, platform) {
    const filename = `${projectName}-${platform}-${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(blob, filename);
  }
  
  /**
   * Trigger a remote build on GitHub Actions
   * 
   * @param {Object} options Build options
   * @param {string} options.owner GitHub repository owner
   * @param {string} options.repo GitHub repository name
   * @param {string} options.platform Platform (ios, android, react-native, flutter)
   * @param {string} options.buildType Build type (debug, release)
   * @returns {Promise<Object>} Build result with status and build ID
   */
  async triggerRemoteBuild(options) {
    try {
      const { owner, repo, platform, buildType = 'release' } = options;
      
      // Determine the workflow file to use
      let workflowId;
      let inputs = {};
      
      switch (platform) {
        case 'ios':
          workflowId = 'ios-build.yml';
          inputs = { build_configuration: buildType === 'debug' ? 'Debug' : 'Release' };
          break;
          
        case 'android':
          workflowId = 'android-build.yml';
          inputs = { build_type: buildType };
          break;
          
        case 'react-native':
          workflowId = 'react-native-build.yml';
          inputs = { platform: 'all', build_type: buildType };
          break;
          
        case 'flutter':
          workflowId = 'flutter-build.yml';
          inputs = { platform: 'all', build_type: buildType };
          break;
          
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Trigger the workflow
      const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: 'main',
          inputs
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to trigger build: ${response.statusText}`);
      }
      
      // Return a successful result
      // Note: GitHub API doesn't return the run ID directly when dispatching a workflow
      // We'll need to poll for the new run separately
      return {
        success: true,
        message: `Build triggered successfully for ${platform} (${buildType})`
      };
    } catch (error) {
      console.error('Error triggering remote build:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of a remote build
   * 
   * @param {Object} options Status options
   * @param {string} options.owner GitHub repository owner
   * @param {string} options.repo GitHub repository name
   * @param {number} options.runId Workflow run ID (optional, will get latest if not provided)
   * @returns {Promise<Object>} Build status
   */
  async getRemoteBuildStatus(options) {
    try {
      const { owner, repo, runId } = options;
      
      if (runId) {
        // Get specific run
        const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/runs/${runId}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch run status: ${response.statusText}`);
        }
        
        const run = await response.json();
        
        return {
          runId: run.id,
          status: run.status,
          conclusion: run.conclusion,
          createdAt: run.created_at,
          updatedAt: run.updated_at,
          workflowName: run.name,
          artifacts_url: run.artifacts_url
        };
      } else {
        // Get latest run
        const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/runs?per_page=1`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch runs: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.workflow_runs || data.workflow_runs.length === 0) {
          return { status: 'no_runs' };
        }
        
        const latestRun = data.workflow_runs[0];
        
        return {
          runId: latestRun.id,
          status: latestRun.status,
          conclusion: latestRun.conclusion,
          createdAt: latestRun.created_at,
          updatedAt: latestRun.updated_at,
          workflowName: latestRun.name,
          artifacts_url: latestRun.artifacts_url
        };
      }
    } catch (error) {
      console.error('Error getting remote build status:', error);
      throw error;
    }
  }
}

export default SimplifiedProjectDownloader;

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}