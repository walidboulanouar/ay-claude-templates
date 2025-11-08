# GitHub Release Creation Guide

## 🎯 Release Information

### Tag Version
```
v1.0.0
```

### Release Title
```
v1.0.0 - Initial Release 🎉
```

### Target Branch
```
main
```

## 📝 Release Notes

Copy the content from `RELEASE_NOTES_v1.0.0.md` and paste it into the release notes field.

## 🚀 Steps to Create Release

1. **Go to Releases Page**:
   - Visit: https://github.com/walidboulanouar/ay-claude-templates/releases/new

2. **Fill in the Form**:
   - **Tag**: Select "1.0.0" (or create new tag `v1.0.0`)
   - **Target**: Select `main` branch
   - **Release title**: `v1.0.0 - Initial Release 🎉`
   - **Release notes**: Copy from `RELEASE_NOTES_v1.0.0.md`

3. **Optional: Attach Binaries**:
   - You can attach the npm package tarball if needed
   - Or leave it empty (users will install via npm)

4. **Pre-release?**:
   - ❌ **Uncheck** "Set as a pre-release" (this is a stable release)

5. **Publish Release**:
   - Click **"Publish release"** button

## ✨ What Happens After Release

- Release will be visible on the repository's Releases page
- Tag `v1.0.0` will be created automatically
- Release notes will be displayed
- Users can reference this specific version

## 📦 npm Package

The package is already published on npm:
- **Package**: [@ay-claude/cli@1.0.0](https://www.npmjs.com/package/@ay-claude/cli)
- **Installation**: `npm install -g @ay-claude/cli`

## 🔄 Future Releases

For future releases:
1. Update version in `package.json`
2. Update `RELEASE_NOTES_vX.X.X.md`
3. Create new release on GitHub
4. Publish to npm: `npm publish`

