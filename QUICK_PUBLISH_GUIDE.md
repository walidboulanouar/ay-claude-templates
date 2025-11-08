# 🚀 Quick Start: Publish to npm

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name: `claude-skills-cli`
3. Description: `Official CLI for Claude Skills Platform`
4. **Public** ✅
5. Don't initialize (we have files)
6. Create repository

## Step 2: Push to GitHub

```bash
cd cli

# Initialize git
git init
git add .
git commit -m "Initial commit: Claude Skills CLI v1.0.0"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/claude-skills-cli.git

# Push
git branch -M main
git push -u origin main
```

## Step 3: Update package.json URLs

Edit `cli/package.json` and replace `YOUR_USERNAME` with your GitHub username:

```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/claude-skills-cli.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/claude-skills-cli/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/claude-skills-cli#readme"
}
```

## Step 4: Create GitHub Release

1. Go to repository → Releases → Create new release
2. Tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Publish

## Step 5: Publish to npm

```bash
# Login to npm
npm login

# Verify package
npm pack --dry-run

# Publish
cd cli
npm publish --access public
```

## Step 6: Verify

```bash
npm view @claude-skills/cli
npm install -g @claude-skills/cli
claude-skills --version
```

## ✅ Done!

Your CLI is now available on npm! 🎉

Users can install with:
```bash
npm install -g @claude-skills/cli
```
