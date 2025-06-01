import React from 'react';

// Converted from JavaScript
/**
 * XcodeProjectDownloader
 * 
 * This utility handles downloading Xcode projects and compiled iOS apps from GitHub.
 * It's part of Project Phoenix's remote iOS app building system.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Class for downloading and packaging Xcode projects
 */
class XcodeProjectDownloader {
  constructor(apiBase = '/api') {
    this.apiBase = apiBase;
  }

  /**
   * Download a compiled app bundle (IPA) from a GitHub release
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {string} releaseTag Release tag name (optional, will use latest if not provided)
   * @returns {Promise<Blob>} The downloaded IPA file as a Blob
   */
  async downloadAppBundle(owner, repo, releaseTag = 'latest') {
    try {
      // First get the release info to find the asset URLs
      const releaseEndpoint = releaseTag === 'latest' 
        ? `${this.apiBase}/github/${owner}/${repo}/releases/latest`
        : `${this.apiBase}/github/${owner}/${repo}/releases/tags/${releaseTag}`;
        
      const releaseResponse = await fetch(releaseEndpoint);
      
      if (!releaseResponse.ok) {
        throw new Error(`Failed to fetch release info: ${releaseResponse.statusText}`);
      }
      
      const releaseData = await releaseResponse.json();
      
      // Find the IPA asset
      const ipaAsset = releaseData.assets.find(asset => 
        asset.name.endsWith('.ipa') || 
        asset.content_type === 'application/octet-stream'
      );
      
      if (!ipaAsset) {
        throw new Error('No IPA file found in the release assets');
      }
      
      // Download the IPA file
      const assetResponse = await fetch(ipaAsset.browser_download_url);
      
      if (!assetResponse.ok) {
        throw new Error(`Failed to download IPA file: ${assetResponse.statusText}`);
      }
      
      const ipaBlob = await assetResponse.blob();
      
      return ipaBlob;
    } catch (error) {
      console.error('Error downloading app bundle:', error);
      throw error;
    }
  }
  
  /**
   * Download workflow artifacts from a GitHub Actions run
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {number} runId Workflow run ID
   * @param {string} artifactName Artifact name (optional, will download all if not provided)
   * @returns {Promise<Blob>} The downloaded artifacts as a Blob
   */
  async downloadWorkflowArtifacts(owner, repo, runId, artifactName = null) {
    try {
      // First get the list of artifacts
      const artifactsEndpoint = `${this.apiBase}/github/${owner}/${repo}/actions/runs/${runId}/artifacts`;
      
      const artifactsResponse = await fetch(artifactsEndpoint);
      
      if (!artifactsResponse.ok) {
        throw new Error(`Failed to fetch artifacts: ${artifactsResponse.statusText}`);
      }
      
      const artifactsData = await artifactsResponse.json();
      
      if (artifactsData.total_count === 0) {
        throw new Error('No artifacts found for this workflow run');
      }
      
      // Filter artifacts by name if provided
      let artifactsToDownload = artifactsData.artifacts;
      if (artifactName) {
        artifactsToDownload = artifactsToDownload.filter(artifact => 
          artifact.name === artifactName
        );
        
        if (artifactsToDownload.length === 0) {
          throw new Error(`No artifacts found with name "${artifactName}"`);
        }
      }
      
      // Download each artifact
      const artifactBlobs = [];
      
      for (const artifact of artifactsToDownload) {
        const downloadEndpoint = `${this.apiBase}/github/${owner}/${repo}/actions/artifacts/${artifact.id}/zip`;
        
        const downloadResponse = await fetch(downloadEndpoint);
        
        if (!downloadResponse.ok) {
          console.warn(`Failed to download artifact "${artifact.name}": ${downloadResponse.statusText}`);
          continue;
        }
        
        const artifactBlob = await downloadResponse.blob();
        artifactBlobs.push({
          name: artifact.name,
          blob: artifactBlob
        });
      }
      
      if (artifactBlobs.length === 0) {
        throw new Error('Failed to download any artifacts');
      }
      
      // If only one artifact was requested, return just that one
      if (artifactName) {
        return artifactBlobs[0].blob;
      }
      
      // Otherwise, package all artifacts into a zip file
      const zip = new JSZip();
      
      for (const artifact of artifactBlobs) {
        zip.file(`${artifact.name}.zip`, artifact.blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } catch (error) {
      console.error('Error downloading workflow artifacts:', error);
      throw error;
    }
  }
  
  /**
   * Download and package a complete Xcode project from a GitHub repository
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {string} branch Branch name (defaults to 'main')
   * @returns {Promise<Blob>} The packaged Xcode project as a zip Blob
   */
  async downloadXcodeProject(owner, repo, branch = 'main') {
    try {
      // List files in the repository
      const filesEndpoint = `${this.apiBase}/github/${owner}/${repo}/contents?ref=${branch}`;
      
      const filesResponse = await fetch(filesEndpoint);
      
      if (!filesResponse.ok) {
        throw new Error(`Failed to fetch repository contents: ${filesResponse.statusText}`);
      }
      
      const filesData = await filesResponse.json();
      
      // Create a new zip file
      const zip = new JSZip();
      
      // Recursively download all files
      await this.downloadDirectory(zip, owner, repo, branch, '', filesData);
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } catch (error) {
      console.error('Error downloading Xcode project:', error);
      throw error;
    }
  }
  
  /**
   * Recursively download a directory from GitHub
   * 
   * @param {JSZip} zip JSZip instance
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {string} branch Branch name
   * @param {string} path Current path in the repository
   * @param {Array} contents Directory contents
   * @returns {Promise<void>}
   */
  async downloadDirectory(zip, owner, repo, branch, path, contents) {
    for (const item of contents) {
      const itemPath = path ? `${path}/${item.name}` : item.name;
      
      if (item.type === 'dir') {
        // Create directory in zip
        zip.folder(itemPath);
        
        // Fetch directory contents
        const dirEndpoint = `${this.apiBase}/github/${owner}/${repo}/contents/${itemPath}?ref=${branch}`;
        
        const dirResponse = await fetch(dirEndpoint);
        
        if (!dirResponse.ok) {
          console.warn(`Failed to fetch directory "${itemPath}": ${dirResponse.statusText}`);
          continue;
        }
        
        const dirContents = await dirResponse.json();
        
        // Recursively download directory contents
        await this.downloadDirectory(zip, owner, repo, branch, itemPath, dirContents);
      } else if (item.type === 'file') {
        // Fetch file content
        const fileEndpoint = `${this.apiBase}/github/${owner}/${repo}/contents/${itemPath}?ref=${branch}`;
        
        const fileResponse = await fetch(fileEndpoint);
        
        if (!fileResponse.ok) {
          console.warn(`Failed to fetch file "${itemPath}": ${fileResponse.statusText}`);
          continue;
        }
        
        const fileData = await fileResponse.json();
        
        // Add file to zip
        let fileContent;
        
        if (fileData.encoding === 'base64') {
          fileContent = atob(fileData.content);
          
          // If binary file, convert to Uint8Array
          if (this.isBinaryFile(itemPath)) {
            const binary = new Uint8Array(fileContent.length);
            for (let i = 0; i < fileContent.length; i++) {
              binary[i] = fileContent.charCodeAt(i);
            }
            fileContent = binary;
          }
        } else {
          // Handle other encodings if needed
          fileContent = fileData.content;
        }
        
        zip.file(itemPath, fileContent);
      }
    }
  }
  
  /**
   * Check if a file is likely to be binary based on extension
   * 
   * @param {string} filePath File path
   * @returns {boolean} Whether the file is likely binary
   */
  isBinaryFile(filePath) {
    const binaryExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', 
      '.ico', '.pdf', '.doc', '.docx', '.ppt', '.pptx',
      '.xls', '.xlsx', '.zip', '.tar', '.gz', '.7z',
      '.exe', '.dll', '.so', '.dylib', '.a', '.o',
      '.class', '.jar', '.war', '.ear', '.pyc',
      '.mp3', '.mp4', '.mov', '.avi', '.mkv',
      '.psd', '.ai', '.sketch'
    ];
    
    const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    return binaryExtensions.includes(extension);
  }
  
  /**
   * Save a downloaded project or app bundle to the user's device
   * 
   * @param {Blob} blob The file blob to save
   * @param {string} filename The filename to save as
   */
  saveToDevice(blob, filename) {
    saveAs(blob, filename);
  }
  
  /**
   * List workflow runs for a GitHub repository
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @returns {Promise<Array>} Array of workflow runs
   */
  async listWorkflowRuns(owner, repo) {
    try {
      const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/runs`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow runs: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.workflow_runs || [];
    } catch (error) {
      console.error('Error listing workflow runs:', error);
      throw error;
    }
  }
  
  /**
   * Get details about a specific workflow run
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {number} runId Workflow run ID
   * @returns {Promise<Object>} Workflow run details
   */
  async getWorkflowRunDetails(owner, repo, runId) {
    try {
      const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/runs/${runId}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow run details: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting workflow run details:', error);
      throw error;
    }
  }
  
  /**
   * Trigger a workflow run on GitHub
   * 
   * @param {string} owner GitHub username or organization
   * @param {string} repo Repository name
   * @param {string} workflowId Workflow ID or filename
   * @param {string} ref Git reference (branch, tag, commit)
   * @param {Object} inputs Workflow inputs
   * @returns {Promise<Object>} Trigger result
   */
  async triggerWorkflow(owner, repo, workflowId, ref = 'main', inputs = {}) {
    try {
      const endpoint = `${this.apiBase}/github/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref,
          inputs
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to trigger workflow: ${response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }
}

export default XcodeProjectDownloader;

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}