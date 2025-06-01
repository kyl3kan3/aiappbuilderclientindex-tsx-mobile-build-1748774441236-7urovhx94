import React from 'react';

// Converted from JavaScript
const express = require('express');
const router = express.Router();
const simpleGit = require('simple-git');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

router.post('/github', async (req, res) => {
  const { token, repoName, user } = req.body;
  const localPath = path.join(__dirname, `../../output/${repoName}`);
  const git = simpleGit(localPath);

  try {
    await axios.post('https://api.github.com/user/repos',
      { name: repoName, private: false },
      { headers: { Authorization: `token ${token}` } }
    );

    if (!fs.existsSync(localPath)) {
      return res.status(404).json({ error: 'Project folder not found' });
    }

    await git.init();
    await git.add('.');
    await git.commit('Initial commit from AI App Builder');
    await git.addRemote('origin', `https://github.com/${user}/${repoName}.git`);
    await git.push('origin', 'main');

    res.json({ success: true, url: `https://github.com/${user}/${repoName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}