# 🚀 Complete Publishing Guide: npmjs.org

Based on [GitHub Packages npm Registry documentation](https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), here's how to publish to **npmjs.org** (the public npm registry).

---

## 📋 Prerequisites

1. **npm Account**: Create at https://www.npmjs.com/signup
2. **Email Verified**: Verify your npm account email
3. **2FA Enabled**: Recommended for security

---

## 🔧 Step-by-Step: Publish to npmjs.org

### Step 1: Create npm Account

1. Go to: https://www.npmjs.com/signup
2. Create account with username, email, password
3. Verify email
4. **Enable 2FA** (Settings → Enable 2FA)

### Step 2: Update package.json for npmjs.org

**Current config** (GitHub Packages):
```json
{
  "name": "@walidboulanouar/ay-claude-cli",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

**For npmjs.org**, you have two options:

#### Option A: Change package name and registry

```json
{
  "name": "@ay-claude/cli",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  }
}
```

#### Option B: Keep current config, override on publish

Keep current `package.json`, use `--registry` flag:
```bash
npm publish --registry=https://registry.npmjs.org/
```

**Recommendation**: Use Option A for cleaner setup.

### Step 3: Authenticate with npmjs.org

```bash
npm login --registry=https://registry.npmjs.org/

# When prompted:
# Username: your-npm-username
# Password: your-npm-password
# Email: your-email@example.com
# OTP: (if 2FA enabled)
```

**Verify login:**
```bash
npm whoami --registry=https://registry.npmjs.org/
# Should show your npm username
```

### Step 4: Check Package Name Availability

```bash
npm view @ay-claude/cli
# If 404: Name is available ✅
# If package exists: You'll see package info
```

**Note**: Package names must be **lowercase only** (per GitHub docs).

### Step 5: Build Package

```bash
cd cli
npm run build
```

### Step 6: Verify What Will Be Published

```bash
npm pack --dry-run
```

This shows exactly what files will be included.

### Step 7: Publish to npmjs.org

**If you updated package.json:**
```bash
npm publish
```

**If using --registry flag:**
```bash
npm publish --registry=https://registry.npmjs.org/
```

### Step 8: Verify Publication

1. **Check npm registry:**
   ```bash
   npm view @ay-claude/cli
   ```

2. **Visit package page:**
   https://www.npmjs.com/package/@ay-claude/cli

3. **Test installation:**
   ```bash
   npm install -g @ay-claude/cli
   ay-claude --version
   ```

---

## 🔄 Publishing Updates

For future versions:

```bash
# Update version (automatically creates git tag)
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Publish
npm publish --registry=https://registry.npmjs.org/
```

---

## 🔒 Security Checklist

- ✅ **Never commit `.npmrc`** with tokens (already in `.gitignore`)
- ✅ **Use `npm login`** (secure credential storage)
- ✅ **Enable 2FA** on npm account
- ✅ **Use `npm publish --dry-run`** before publishing
- ✅ **Verify package contents** before publishing

---

## 📊 Package Name Format

According to GitHub documentation:
- ✅ **Scoped packages**: `@namespace/package-name` (required for GitHub Packages)
- ✅ **Lowercase only**: Package names must be lowercase
- ✅ **npmjs.org**: Can use same format or simpler names

**Current**: `@walidboulanouar/ay-claude-cli` (GitHub Packages format)  
**For npmjs.org**: `@ay-claude/cli` (cleaner, no username)

---

## 🎯 Quick Reference

### Publish to npmjs.org:
```bash
# 1. Login
npm login --registry=https://registry.npmjs.org/

# 2. Build
npm run build

# 3. Publish
npm publish --registry=https://registry.npmjs.org/
```

### Publish to GitHub Packages:
```bash
# 1. Login
npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com

# 2. Build
npm run build

# 3. Publish
npm publish
```

---

## 📚 References

- [GitHub Packages npm Registry](https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm Login Documentation](https://docs.npmjs.com/cli/v10/commands/npm-login)

---

## ✅ Ready to Publish!

Follow the steps above to publish to npmjs.org. Your credentials are safe - `.npmrc` is in `.gitignore`! 🚀
