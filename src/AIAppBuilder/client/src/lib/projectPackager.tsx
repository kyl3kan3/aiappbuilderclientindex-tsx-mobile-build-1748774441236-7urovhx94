import React from 'react';

// Converted from JavaScript
import JSZip from 'jszip';
import { saveAs } from './fileSaver';

/**
 * Parse code blocks from AI-generated code with filename headers
 * @param {string} generatedCode - The raw code from the AI with filename comments
 * @returns {Object} - Object with filenames as keys and content as values
 */
function parseCodeBlocks(generatedCode) {
  const fileMap = {};
  const fileRegex = /\/\/ Filename: ([^\n]+)\n```(?:\w+)?\n([\s\S]+?)\n```/g;
  
  let match;
  while ((match = fileRegex.exec(generatedCode)) !== null) {
    const [, filename, content] = match;
    fileMap[filename] = content;
  }
  
  // If no matches found, try alternative format
  if (Object.keys(fileMap).length === 0) {
    const altRegex = /```(?:\w+)?\s*\/\/ Filename: ([^\n]+)\n([\s\S]+?)```/g;
    
    while ((match = altRegex.exec(generatedCode)) !== null) {
      const [, filename, content] = match;
      fileMap[filename] = content;
    }
  }
  
  // If still no matches, try another common format
  if (Object.keys(fileMap).length === 0) {
    const basicRegex = /```(?:\w+)?\n([^:]+\.(?:swift|kt|gradle|xml|java|plist)):\n([\s\S]+?)```/g;
    
    while ((match = basicRegex.exec(generatedCode)) !== null) {
      const [, filename, content] = match;
      fileMap[filename] = content;
    }
  }

  return fileMap;
}

/**
 * Process the generated code and add the files to a zip
 * @param {JSZip} zip - JSZip instance
 * @param {Object} fileMap - Object with filenames as keys and content as values
 * @param {string} rootFolderName - The name of the root folder
 */
function addFilesToZip(zip, fileMap, rootFolderName) {
  const rootFolder = zip.folder(rootFolderName);
  
  if (!rootFolder) {
    throw new Error(`Failed to create root folder: ${rootFolderName}`);
  }
  
  // Add each file to the zip
  Object.entries(fileMap).forEach(([path, content]) => {
    // Clean up the path
    const cleanPath = path.trim().replace(/^[\/\\]+/, '');
    
    // Create the folder structure
    const folderPath = cleanPath.split('/').slice(0, -1).join('/');
    if (folderPath) {
      rootFolder.folder(folderPath);
    }
    
    // Add the file
    rootFolder.file(cleanPath, content);
  });
  
  // Add a README file if one doesn't exist
  if (!Object.keys(fileMap).some(path => path.toLowerCase().includes('readme'))) {
    rootFolder.file('README.md', `# ${rootFolderName}\n\nGenerated by AppCraft AI\n\n## Getting Started\n\nThis is a complete, runnable project generated by AI based on your requirements.`);
  }
}

/**
 * Generate a zip file from AI-generated code
 * @param {string} generatedCode - The raw code from the AI with filename comments
 * @param {string} appName - The name of the app
 * @param {string} platform - The platform ('ios' or 'android')
 * @returns {Promise<Blob>} - A promise that resolves to a Blob with the zip content
 */
export async function generateProjectZip(generatedCode, appName, platform) {
  const zip = new JSZip();
  const fileMap = parseCodeBlocks(generatedCode);
  
  if (Object.keys(fileMap).length === 0) {
    // If no code blocks were parsed correctly, create a single file with all the code
    const singleFilename = platform === 'ios' 
      ? `${appName.replace(/\s+/g, '')}App.swift` 
      : `${appName.replace(/\s+/g, '')}App.kt`;
    
    fileMap[singleFilename] = generatedCode;
  }
  
  const rootFolderName = `${appName.replace(/\s+/g, '')}-${platform}`;
  addFilesToZip(zip, fileMap, rootFolderName);
  
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Download a complete project as a zip file
 * @param {string} generatedCode - The raw code from the AI with filename comments
 * @param {string} appName - The name of the app
 * @param {string} platform - The platform ('ios' or 'android')
 */
export async function downloadCompleteProject(generatedCode, appName, platform) {
  try {
    const zipBlob = await generateProjectZip(generatedCode, appName, platform);
    const fileName = `${appName.replace(/\s+/g, '')}-${platform}.zip`;
    saveAs(zipBlob, fileName);
    console.log(`Successfully packaged and downloaded ${platform} project: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Error creating project zip for ${platform}:`, error);
    throw error;
  }
}

/**
 * Add iOS project-specific files to enhance project structure
 * @param {JSZip} zip - JSZip instance with the root folder
 * @param {string} appName - The name of the app
 */
function enhanceIosProject(zip, appName) {
  const rootFolder = zip.folder(`${appName}-ios`);
  if (!rootFolder) return;
  
  // Add a basic .gitignore if it doesn't exist
  if (!rootFolder.file('.gitignore')) {
    rootFolder.file('.gitignore', `# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
.DS_Store

# Swift Package Manager
.build/
Packages/
`);
  }
  
  // Add a basic .xcode-version file if it doesn't exist
  if (!rootFolder.file('.xcode-version')) {
    rootFolder.file('.xcode-version', '14.3.1');
  }
  
  // Add sample app icon asset if there's no Assets.xcassets folder
  if (!Object.keys(zip.files).some(path => path.includes('Assets.xcassets'))) {
    const assetsFolder = rootFolder.folder('Assets.xcassets');
    const appIconFolder = assetsFolder.folder('AppIcon.appiconset');
    
    appIconFolder.file('Contents.json', JSON.stringify({
      "images": [
        {
          "size": "60x60",
          "idiom": "iphone",
          "filename": "Icon-60@2x.png",
          "scale": "2x"
        },
        {
          "size": "60x60",
          "idiom": "iphone",
          "filename": "Icon-60@3x.png",
          "scale": "3x"
        }
      ],
      "info": {
        "version": 1,
        "author": "xcode"
      }
    }, null, 2));
  }
}

/**
 * Add Android project-specific files to enhance project structure
 * @param {JSZip} zip - JSZip instance with the root folder
 * @param {string} appName - The name of the app
 */
function enhanceAndroidProject(zip, appName) {
  const rootFolder = zip.folder(`${appName}-android`);
  if (!rootFolder) return;
  
  // Add a basic .gitignore if it doesn't exist
  if (!rootFolder.file('.gitignore')) {
    rootFolder.file('.gitignore', `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
`);
  }
  
  // Add empty .idea folder for Android Studio
  rootFolder.folder('.idea');
  
  // Add sample gradle.properties if it doesn't exist
  if (!rootFolder.file('gradle.properties')) {
    rootFolder.file('gradle.properties', `# Project-wide Gradle settings
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`);
  }
}

/**
 * Download a complete project with enhanced structure
 * @param {string} generatedCode - The raw code from the AI with filename comments
 * @param {string} appName - The name of the app
 * @param {string} platform - The platform ('ios' or 'android')
 */
export async function downloadEnhancedProject(generatedCode, appName, platform) {
  try {
    const zip = new JSZip();
    const fileMap = parseCodeBlocks(generatedCode);
    
    const cleanAppName = appName.replace(/\s+/g, '');
    const rootFolderName = `${cleanAppName}-${platform}`;
    
    if (Object.keys(fileMap).length > 0) {
      addFilesToZip(zip, fileMap, rootFolderName);
    } else {
      // Fall back to including the full code in a single file
      const singleFileName = platform === 'ios' ? 'App.swift' : 'App.kt';
      const rootFolder = zip.folder(rootFolderName);
      if (rootFolder) {
        rootFolder.file(singleFileName, generatedCode);
        rootFolder.file('README.md', `# ${cleanAppName} (${platform.toUpperCase()})\n\nGenerated by AppCraft AI\n\n## Important Note\n\nThis file contains the complete source code for your app. You'll need to properly organize these files into a standard ${platform === 'ios' ? 'Xcode' : 'Android Studio'} project structure.`);
      }
    }
    
    // Add platform-specific enhancements
    if (platform === 'ios') {
      enhanceIosProject(zip, cleanAppName);
    } else {
      enhanceAndroidProject(zip, cleanAppName);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fileName = `${cleanAppName}-${platform}.zip`;
    saveAs(zipBlob, fileName);
    
    console.log(`Successfully packaged and downloaded enhanced ${platform} project: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Error creating enhanced project zip for ${platform}:`, error);
    throw error;
  }
}

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}