import React from 'react';

// Converted from JavaScript
import { Octokit } from '@octokit/rest';

async function checkBuildStatus() {
  const octokit = new Octokit({ 
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN 
  });

  try {
    // Check the specific repository
    const repoName = 'client-mobile-build-1748653843928-xnpmmd82o';
    
    console.log(`🔍 Checking repository: ${repoName}`);
    
    // Get workflow runs
    const runs = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner: 'kyl3kan3',
      repo: repoName,
      per_page: 5
    });
    
    console.log(`📊 Found ${runs.data.workflow_runs.length} workflow runs`);
    
    for (const run of runs.data.workflow_runs) {
      console.log(`\n🔄 Workflow: ${run.name}`);
      console.log(`   Status: ${run.status}`);
      console.log(`   Conclusion: ${run.conclusion}`);
      console.log(`   URL: ${run.html_url}`);
      
      // Get jobs for this run
      const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
        owner: 'kyl3kan3',
        repo: repoName,
        run_id: run.id
      });
      
      for (const job of jobs.data.jobs) {
        console.log(`\n   📋 Job: ${job.name}`);
        console.log(`      Status: ${job.status}`);
        console.log(`      Conclusion: ${job.conclusion}`);
        if (job.conclusion === 'failure') {
          console.log(`      ❌ Failed job URL: ${job.html_url}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status === 404) {
      console.log('Repository might not exist or access denied');
    }
  }
}

checkBuildStatus();

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}