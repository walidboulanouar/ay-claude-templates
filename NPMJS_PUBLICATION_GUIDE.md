# 🚀 Quick Guide: Publish to npmjs.org

## 📦 Publishing to Public npm Registry

This guide shows you how to publish the AY Claude CLI to **npmjs.org** (the public npm registry).

---

## Step 1: Create npm Account

1. Go to: https://www.npmjs.com/signup
2. Create account
3. Verify email
4. **Enable 2FA** (recommended)

---

## Step 2: Update package.json for npmjs.org

You have two options:

### Option A: Publish with current name to npmjs.org

Temporarily modify `package.json`:

```json
{
  "name": "@ay-claude/cli",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Option B: Keep GitHub Packages config, override on publish

Keep current config, use `--registry` flag when publishing.

---

## Step 3: Authenticate with npmjs.org

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
```

---

## Step 4: Verify Package

```bash
cd cli

# Check what will be published
npm pack --dry-run

# Verify package name is available
npm view @ay-claude/cli
# (Should return 404 if name is available)
```

---

## Step 5: Build and Publish

```bash
# Build
npm run build

# Publish to npmjs.org
npm publish --registry=https://registry.npmjs.org/

# Or if you updated publishConfig:
npm publish
```

---

## Step 6: Verify Publication

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
# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Publish
npm publish --registry=https://registry.npmjs.org/
```

---

## 🔒 Security

- ✅ Use `npm login` (secure credential storage)
- ✅ Enable 2FA on npm account
- ✅ Never commit `.npmrc` with tokens
- ✅ Use `npm publish --dry-run` first

---

## 📊 Package Name Considerations

**Current**: `@walidboulanouar/ay-claude-cli` (GitHub Packages format)

**For npmjs.org**: Consider `@ay-claude/cli` (cleaner, no username)

**Note**: You can publish the same package to both registries with different names!

---

## ✅ Checklist

- [ ] npm account created
- [ ] Email verified
- [ ] 2FA enabled (recommended)
- [ ] Logged in to npmjs.org
- [ ] Package name verified (available)
- [ ] Build successful
- [ ] Published successfully
- [ ] Installation tested

---

## 🎯 Quick Commands

```bash
# Login
npm login --registry=https://registry.npmjs.org/

# Build
npm run build

# Verify
npm pack --dry-run

# Publish
npm publish --registry=https://registry.npmjs.org/

# Verify
npm view @ay-claude/cli
```

---

**Ready to publish to npmjs.org!** 🚀
