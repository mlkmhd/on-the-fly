const express = require('express');
const shell = require('shelljs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/getPods', async (req, res) => {
    try {
        let pods = await getPods();

        // Check if all pods are ready
        while (!areAllPodsReady(pods)) {
            console.log('Waiting for pods to become ready...');
            await sleep(5000); // Wait for 5 seconds before checking again
            pods = await getPods(); // Refresh pods data
        }

        res.json(pods);
    } catch (error) {
        console.error('Error fetching or waiting for pods:', error);
        res.status(500).json({ error: 'Failed to fetch or wait for pods' });
    }
});

app.post('/api/createPod', async (req, res) => {
    const directoryPath = 'manifests'; // Directory containing YAML files

    const { projectLink } = req.body;

    try {
        const files = await fs.promises.readdir(directoryPath);

        // Filter out directories if needed
        const fileList = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile());

        // Array to store promises for shell commands
        const shellPromises = fileList.map(file => {
            const filePath = path.join(directoryPath, file);
            const command = `kubectl -n ecfd-devops-backstage-poc apply -f ${filePath}`;

            // Create a promise for each shell command
            return new Promise((resolve, reject) => {
                shell.exec(command, { silent: true }, (code, stdout, stderr) => {
                    if (code !== 0) {
                        console.error(`Error executing kubectl: ${stderr}`);
                        reject(`Failed to apply ${file}`);
                    } else {
                        console.log(`Applied ${file} successfully`);
                        resolve(stdout);
                    }
                });
            });
        });

        // Wait for all shell commands to complete
        await Promise.all(shellPromises);
        console.log('All kubectl apply commands completed successfully');

        // Wait for all pods to become ready
        let pods = await getPods();
        while (!areAllPodsReady(pods)) {
            console.log('Waiting for pods to become ready...');
            await sleep(5000); // Wait for 5 seconds before checking again
            pods = await getPods(); // Refresh pods data
        }

        res.json({
            result: 'workspace created successfully',
            workspaceUrl: 'https://vscode-test-8080-ecfd-devops-backstage-poc.jpe2-caas1-dev1.caas.jpe2b.r-local.net',
            workspacePassword: 'JmaFM4pS87JH6arm3DZJ'
        });
    } catch (error) {
        console.error('Error applying manifests or waiting for pods:', error);
        res.status(500).json({ error: 'Failed to apply manifests or wait for pods' });
    }
});

// Helper function to execute kubectl command and fetch pods
function getPods() {
    return new Promise((resolve, reject) => {
        shell.exec('kubectl -n ecfd-devops-backstage-poc get pods -l app.kubernetes.io/component=remote-development -o json', { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                console.error(`Error executing kubectl: ${stderr}`);
                reject(new Error('Failed to fetch pods'));
            }
            const pods = JSON.parse(stdout);
            resolve(pods);
        });
    });
}

// Helper function to check if all pods are ready
function areAllPodsReady(pods) {
    return pods.items.every(pod => {
        return pod.status.phase === 'Running' && pod.status.conditions.some(condition => condition.type === 'Ready' && condition.status === 'True');
    });
}

// Helper function to simulate sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});