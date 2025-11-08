# 📦 Publishing Guide: GitHub Packages vs npmjs.org

## 🎯 Two Publishing Options

You can publish the AY Claude CLI to **either**:
1. **GitHub Packages** (already configured) - Private/public packages hosted on GitHub
2. **npmjs.org** (public npm registry) - The standard public npm registry

---

## Option 1: Publish to GitHub Packages

### Current Configuration ✅

Your `package.json` is already configured for GitHub Packages:
- Package name: `@walidboulanouar/ay-claude-cli`
- `publishConfig`: Points to GitHub Packages
- Repository: Linked to GitHub repo

### Steps to Publish

1. **Create Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Generate token (classic) with `write:packages` scope

2. **Authenticate**
   ```bash
   npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com
   ```

3. **Publish**
   ```bash
   cd cli
   npm run build
   npm publish
   ```

4. **Install**
   ```bash
   npm install -g @walidboulanouar/ay-claude-cli
   ```

**Package URL**: https://github.com/walidboulanouar/ay-claude-templates/packages

---

## Option 2: Publish to npmjs.org (Public npm Registry)

### Configuration Changes Needed

To publish to npmjs.org, you need to:

1. **Change package name** (npmjs.org doesn't require GitHub username scope)
2. **Remove or modify publishConfig** (or point to npmjs.org)
3. **Authenticate with npmjs.org**

### Step-by-Step Setup

#### Step 1: Create npm Account

1. Go to: https://www.npmjs.com/signup
2. Create account
3. Verify email

#### Step 2: Update package.json

**Option A: Keep GitHub Packages name, publish to npmjs.org**

```json
{
  "name": "@ay-claude/cli",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  }
}
```

**Option B: Use different name for npmjs.org**

You can publish the same package with a different name to npmjs.org by temporarily changing `package.json`.

#### Step 3: Authenticate with npmjs.org

```bash
npm login --registry=https://registry.npmjs.org/

# When prompted:
# Username: your-npm-username
# Password: your-npm-password
# Email: your-email@example.com
```

#### Step 4: Publish

```bash
cd cli
npm run build
npm publish --registry=https://registry.npmjs.org/
```

#### Step 5: Install from npmjs.org

```bash
npm install -g @ay-claude/cli
```

**Package URL**: https://www.npmjs.com/package/@ay-claude/cli

---

## Option 3: Publish to BOTH (Recommended)

You can publish to **both** registries with different package names:

### Setup for Dual Publishing

1. **GitHub Packages**: `@walidboulanouar/ay-claude-cli`
2. **npmjs.org**: `@ay-claude/cli`

### Publishing Script

Create a script to publish to both:

```bash
#!/bin/bash
# publish-both.sh

echo "🚀 Publishing AY Claude CLI to both registries..."

# Build
npm run build

# Publish to GitHub Packages
echo "📦 Publishing to GitHub Packages..."
npm publish --registry=https://npm.pkg.github.com

# Temporarily change package name for npmjs.org
# (You'd need to modify package.json temporarily)
# npm publish --registry=https://registry.npmjs.org/

echo "✅ Published!"
```

---

## 🔒 Security Best Practices

### For GitHub Packages:
- ✅ `.npmrc` in `.gitignore` (already done)
- ✅ Use Personal Access Token
- ✅ Token with minimal scopes (`write:packages`)

### For npmjs.org:
- ✅ Use `npm login` (stores credentials securely)
- ✅ Enable 2FA on npm account
- ✅ Use `npm publish --dry-run` to verify first

---

## 📊 Comparison

| Feature | GitHub Packages | npmjs.org |
|---------|----------------|-----------|
| **Visibility** | Public/Private | Public only |
| **Authentication** | Personal Access Token | npm login |
| **Package Name** | `@walidboulanouar/ay-claude-cli` | `@ay-claude/cli` |
| **Installation** | Requires auth | Public (no auth) |
| **Discovery** | GitHub Packages page | npmjs.com search |
| **Cost** | Free (with limits) | Free |

---

## 🎯 Recommended Approach

**For maximum reach**: Publish to **npmjs.org** (public registry)
- ✅ No authentication required for users
- ✅ Discoverable on npmjs.com
- ✅ Standard npm installation
- ✅ Better for open-source projects

**For GitHub integration**: Publish to **GitHub Packages**
- ✅ Integrated with GitHub repo
- ✅ Can be private
- ✅ Version history linked to repo

**Best of both**: Publish to **both** with different names!

---

## 📚 References

- [GitHub Packages npm Registry](https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Creating Personal Access Tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## ✅ Quick Commands

### GitHub Packages
```bash
npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com
npm publish
```

### npmjs.org
```bash
npm login --registry=https://registry.npmjs.org/
npm publish --registry=https://registry.npmjs.org/
```
