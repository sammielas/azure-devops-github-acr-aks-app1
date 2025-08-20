# Azure DevOps Pipelines for AKS: Build, Push, and Multi-Stage Deployments

## Overview
This project covers two essential Azure DevOps workflows for Kubernetes:
1. **Build Pipeline**: Building Docker images, pushing to Azure Container Registry (ACR), and deploying to AKS
2. **Release Pipeline**: Multi-stage deployments across Dev, QA, Staging, and Production environments with approval gates

---

## Part 1: Build Pipeline - Build, Push to ACR and Deploy to AKS

### Step-00: Pre-requisites
- Azure AKS Cluster Up and Running
```bash
# Configure Command Line Credentials
az aks get-credentials --name aksdemo2 --resource-group aks-rg2

# Verify Nodes
kubectl get nodes 
kubectl get nodes -o wide
```

### Step-01: Introduction
Create a deployment pipeline to deploy newly built Docker images from ACR to Azure AKS

[![Azure DevOps AKS Deployment](https://www.stacksimplify.com/course-images/azure-devops-pipelines-deploy-to-aks.png)](https://www.stacksimplify.com/course-images/azure-devops-pipelines-deploy-to-aks.png)

### Step-02: Create Pipeline for Deploy to AKS
1. Go to Pipelines → Create new Pipeline
2. Where is your code?: Github
3. Select a Repository: Choose your repository (app1/app1nginx)
4. Configure your pipeline: Deploy to Azure Kubernetes Service
5. Select Subscription: Your subscription
6. Provide Azure cloud admin credentials
7. Configure deployment settings:
   - Cluster: Your cluster name
   - Namespace: default (existing)
   - Container Registry: Your registry name
   - Image Name: app1nginxaks
   - Service Port: 80
8. Click **Validate and Configure**
9. Change Pipeline Name: `02-docker-build-push-to-acs-deploy-to-aks-pipeline.yml`
10. Click **Save and Run**
11. Commit directly to master branch
12. Click **Save and Run**

### Step-03: Verify Build and Deploy logs
- Verify both Build and Deploy stages pass successfully
- Check application deployment:
```bash
# Verify Pods
kubectl get pods

# Get Public IP
kubectl get svc

# Access Application
http://<Public-IP-from-Get-Service-Output>
```

### Step-04: Pipeline Renaming and Organization
- Rename pipeline: `02-Docker-BuildPushToACR-DeployToAKSCluster`
- Move to Folder: `App1-Pipelines`

### Step-05: Code Changes and Automated Deployment
```bash
# Pull latest
git pull

# Make changes to index.html
# Change version to V3

# Commit and Push
git commit -am "V3 commit index.html"
git push

# Verify automated build and deployment
# Check new pod creation
kubectl get pods

# Verify application update
http://<Public-IP-from-Get-Service-Output>
```

### Step-06: Pipeline Code Review
```yaml
# Deploy to Azure Kubernetes Service
# Build and push image to Azure Container Registry; Deploy to Azure Kubernetes Service
# https://docs.microsoft.com/azure/devops/pipelines/languages/docker

trigger:
- master

resources:
- repo: self

variables:
  dockerRegistryServiceConnection: 'your-service-connection-id'
  imageRepository: 'app1nginxaks'
  containerRegistry: 'your-acr.azurecr.io'
  dockerfilePath: '**/Dockerfile'
  tag: '$(Build.BuildId)'
  imagePullSecret: 'your-acr-auth-secret'
  vmImageName: 'ubuntu-latest'

stages:
- stage: Build
  displayName: Build stage
  jobs:  
  - job: Build
    displayName: Build
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          
    - upload: manifests
      artifact: manifests

- stage: Deploy
  displayName: Deploy stage
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    environment: 'your-environment-name'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: KubernetesManifest@0
            displayName: Create imagePullSecret
            inputs:
              action: createSecret
              secretName: $(imagePullSecret)
              dockerRegistryEndpoint: $(dockerRegistryServiceConnection)
              
          - task: KubernetesManifest@0
            displayName: Deploy to Kubernetes cluster
            inputs:
              action: deploy
              manifests: |
                $(Pipeline.Workspace)/manifests/deployment.yml
                $(Pipeline.Workspace)/manifests/service.yml
              imagePullSecrets: |
                $(imagePullSecret)
              containers: |
                $(containerRegistry)/$(imageRepository):$(tag)
```

### Step-07: Clean-Up
```bash
# Delete Deployment
kubectl delete deploy app1nginxaks

# Delete Service
kubectl delete svc app1nginxaks
```

---

## Part 2: Release Pipelines for Multi-Environment AKS Deployments

### Step-01: Introduction
Create release pipelines for deploying Kubernetes workloads across multiple environments with approval gates

[![Release Pipelines Overview](https://stacksimplify.com/course-images/azure-devops-release-pipelines-for-azure-aks.png)](https://stacksimplify.com/course-images/azure-devops-release-pipelines-for-azure-aks.png)

### Step-02: Create Namespaces
```bash
# Create Namespaces
kubectl create ns dev
kubectl create ns qa
kubectl create ns staging
kubectl create ns prod

# Verify Namespaces
kubectl get ns
```

### Step-03: Create Kubernetes Service Connections
Create service connections for each namespace:

#### Dev Service Connection
- Type: Kubernetes
- Authentication: Azure Subscription
- Cluster: aksdemo2
- Namespace: dev
- Name: `dev-ns-k8s-aks-svc-conn`

#### QA Service Connection
- Type: Kubernetes
- Authentication: Azure Subscription
- Cluster: aksdemo2
- Namespace: qa
- Name: `qa-ns-k8s-aks-svc-conn`

#### Staging Service Connection
- Type: Kubernetes
- Authentication: Azure Subscription
- Cluster: aksdemo2
- Namespace: staging
- Name: `staging-ns-k8s-aks-svc-conn`

#### Production Service Connection
- Type: Kubernetes
- Authentication: Azure Subscription
- Cluster: aksdemo2
- Namespace: prod
- Name: `prod-ns-k8s-aks-svc-conn`

### Step-04: Create Release Pipeline
**Pipeline Name**: `01-app1-release-pipeline`

#### Add Artifact
- Source Type: Build
- Build Pipeline: `App1-Pipelines\04-custom2-BuildPushToACR-Publish-k8s-manifests-to-AzurePipelines`
- Default Version: Latest
- Enable Continuous Deployment Trigger

### Step-05: Verify Deployment Manifest
Ensure the image reference in `kube-manifests/01-Deployment-and-LoadBalancer-Service.yml`:
```yaml
spec:
  containers:
    - name: app1-nginx
      image: aksdevopsacr.azurecr.io/custom2aksnginxapp1
      ports:
        - containerPort: 80
```

### Step-06: Configure Dev Stage
**Stage Name**: Dev

#### Task 1: Create Secret
- Display Name: Create Secret to allow image pull from ACR
- Action: create secret
- Kubernetes service connection: `dev-ns-k8s-aks-svc-conn`
- Namespace: dev
- Secret type: dockerRegistry
- Secret name: `dev-aksdevopsacr-secret`
- Docker registry service connection: Your ACR service connection

#### Task 2: Deploy to Kubernetes
- Display Name: Deploy to AKS
- Action: deploy
- Kubernetes Service Connection: `dev-ns-k8s-aks-svc-conn`
- Namespace: dev
- Manifest: `$(System.DefaultWorkingDirectory)/_04-custom2-BuildPushToACR-Publish-k8s-manifests-to-AzurePipelines/kube-manifests/01-Deployment-and-LoadBalancer-Service.yml`
- Container: `aksdevopsacr.azurecr.io/custom2aksnginxapp1:$(Build.SourceVersion)`
- ImagePullSecrets: `dev-aksdevopsacr-secret`

### Step-07: Test Deployment
```bash
# Make code changes
git commit -am "V11 Commit"
git push

# Verify deployment
kubectl get svc -n dev

# Access application
http://<Public-IP-from-Get-Service-Output>
```

### Step-08: Update Deploy to AKS Task with Build.SourceVersion in Release Pipelines
- Go to Release Pipelines → 01-app1-release-pipeline → Edit → Dev Tasks
- Go to **Deploy to AKS** Task
- Replace
```bash
#Before
Containers: aksdevopsacr.azurecr.io/custom2aksnginxapp1:$(Build.BuildId)

# After
Containers: aksdevopsacr.azurecr.io/custom2aksnginxapp1:$(Build.SourceVersion)
```
- Click on **SAVE** to save release
- Comment: Dev Container Tag changed from Build Id to Build Source Version

### Step-09: Check-In Code and Test
- Update index.html
```bash
# Commit and Push
git commit -am "V12 Commit"
git push
```
- View Build Logs
- View Dev Release logs
- Access App after successful deployment
```bash
# Get Public IP
kubectl get svc -n dev

# Access Application
http://<Public-IP-from-Get-Service-Output>
```
- Verify Github Commit Id on Github Repository and Container Registry

### Step-10: Create QA, Staging and Prod Stages
Clone the Dev stage and update configurations:

#### QA Stage Configuration
- Kubernetes service connection: `qa-ns-k8s-aks-svc-conn`
- Namespace: qa
- Secret name: `qa-aksdevopsacr-secret`
- ImagePullSecrets: `qa-aksdevopsacr-secret`

Add pre-deployment approvals for QA, Staging, and Production environments.

### Step-11: Multi-Environment Deployment Test
```bash
# Make code changes
git commit -am "V13 Commit"
git push

# Monitor deployments through all environments
kubectl get svc --all-namespaces

# Access applications in each environment
http://<Public-IP-from-each-environment>
```

### Step-12: Clean-Up
```bash
# Clean up all deployments
kubectl delete ns dev
kubectl delete ns qa
kubectl delete ns staging
kubectl delete ns prod

# Verify cleanup
kubectl get pod,svc --all-namespaces
```

## References
- [Azure DevOps Kubernetes Deployment Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/ecosystems/kubernetes/deploy?view=azure-devops)
- [Azure Container Registry Documentation](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Azure Kubernetes Service Documentation](https://docs.microsoft.com/en-us/azure/aks/)