# GitHub Packages Setup Guide

## 📦 Publishing to GitHub Packages

This guide explains how to publish the AY Claude CLI to GitHub Packages.

### Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Personal Access Token**: Create a token with `write:packages` scope
3. **Repository**: The package is already connected to `walidboulanouar/ay-claude-templates`

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "AY Claude CLI Publishing"
4. Expiration: Choose appropriate (90 days recommended)
5. Select scopes:
   - ✅ `write:packages` - Required to publish packages
   - ✅ `read:packages` - Required to read packages
   - ✅ `repo` - Required if repository is private
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)

### Step 2: Configure npm Authentication

**Option A: Using npm login (Recommended)**

```bash
cd cli
npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com
```

When prompted:
- **Username**: `walidboulanouar` (your GitHub username)
- **Password**: `YOUR_PERSONAL_ACCESS_TOKEN` (paste your token)
- **Email**: `your-email@example.com` (your GitHub email)

**Option B: Using .npmrc file**

Create a `.npmrc` file in the `cli/` directory (NOT committed to git):

```bash
cd cli
cat > .npmrc << 'EOF'
@walidboulanouar:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
EOF
```

Replace `YOUR_PERSONAL_ACCESS_TOKEN` with your actual token.

**⚠️ Security Note**: 
- The `.npmrc` file is in `.gitignore` - **NEVER commit it!**
- Use `.npmrc.example` as a template (without the token)

### Step 3: Verify package.json

The `package.json` already includes:

```json
{
  "name": "@walidboulanouar/ay-claude-cli",
  "repository": {
    "type": "git",
    "url": "https://github.com/walidboulanouar/ay-claude-templates.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### Step 4: Build and Publish

```bash
cd cli

# Build the package
npm run build

# Verify what will be published
npm pack --dry-run

# Publish to GitHub Packages
npm publish
```

### Step 5: Verify Publication

1. Go to: https://github.com/walidboulanouar/ay-claude-templates/packages
2. You should see `@walidboulanouar/ay-claude-cli` listed
3. Click on it to see package details

### Step 6: Install from GitHub Packages

Users can install with:

```bash
# First authenticate (see README.md)
npm install -g @walidboulanouar/ay-claude-cli
```

## 🔒 Security Best Practices

1. **Never commit `.npmrc` files** containing tokens
2. **Use environment variables** in CI/CD:
   ```bash
   echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
   ```
3. **Rotate tokens regularly** (every 90 days)
4. **Use minimal scopes** (only what's needed)
5. **Revoke tokens** if compromised

## 📚 References

- [GitHub Packages npm Registry](https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Creating Personal Access Tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Package Permissions](https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages)

## 🎯 Quick Commands

```bash
# Authenticate
npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com

# Build
npm run build

# Publish
npm publish

# View package
# Visit: https://github.com/walidboulanouar/ay-claude-templates/packages
```
