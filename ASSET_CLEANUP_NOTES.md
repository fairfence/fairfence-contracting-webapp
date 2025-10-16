# Asset Cleanup Notes

## Duplicate Files Identified

The following duplicate asset files were found in your project. Consider removing the duplicates to reduce project size and improve deployment performance:

### High Priority - Delete These Duplicates

1. **IMG_0562 copy.JPG**
   - Location: `attached_assets/IMG_0562 copy.JPG`
   - Status: ⚠️ Contains "copy" in filename (naming violation)
   - Recommendation: **DELETE** - Keep either `IMG_0562.JPG` or `IMG_0562_rural_fence.JPG` instead

2. **IMG_0562.JPG vs IMG_0562_rural_fence.JPG**
   - Locations:
     - `attached_assets/IMG_0562.JPG`
     - `attached_assets/IMG_0562_rural_fence.JPG`
   - Recommendation: Keep `IMG_0562_rural_fence.JPG` (has descriptive name), delete `IMG_0562.JPG`

3. **IMG_0874 Duplicates**
   - Locations:
     - `attached_assets/IMG_0874_1758750142436.jpeg`
     - `attached_assets/IMG_0874_1758784125349.jpeg`
   - Recommendation: Compare images, keep one, delete the other

4. **IMG_0456 Duplicates**
   - Locations:
     - `attached_assets/IMG_0456_1758750142437.jpeg`
     - `attached_assets/IMG_0456_1758784382482.jpeg`
   - Recommendation: Compare images, keep one, delete the other

## How to Clean Up Assets

### Option 1: Manual Deletion via File Manager
1. Navigate to `attached_assets/` folder
2. Delete the files marked for deletion above
3. Verify references in your code still work

### Option 2: Use the Asset Validator Script
```bash
npm run audit:assets
```
This will scan for:
- Files with spaces in names
- Files with "copy" in the name
- Special characters
- Duplicate patterns

### Option 3: Move to Supabase Storage (Recommended)
Instead of bundling large images in your project, upload them to Supabase Storage:

1. Go to Supabase Dashboard > Storage
2. Create a bucket (e.g., "project-assets")
3. Upload your images
4. Update image references in code to use Supabase URLs
5. Delete local files from `attached_assets/`

**Benefits:**
- Smaller project size
- Faster deployments
- Better CDN performance
- Easier image management

## Files to Keep

These assets appear to be unique and properly named:

### Fencing Showcase Images
- `attached_assets/fencing/aluminium-fence-gate.jpg`
- `attached_assets/fencing/coloursteel-aluminium.jpg`
- `attached_assets/fencing/exposed-post-paling.jpeg`
- `attached_assets/fencing/timber-fence-gate.jpeg`
- `attached_assets/fencing/timber-fence.jpeg`
- `attached_assets/fencing/vinyl-pvc-fence.webp`
- `attached_assets/fencing/files_7134594-1760607584209-IMG_0562.jpg`

### Stock Images
- `attached_assets/stock_images/professional_residen_37df0c68.jpg`
- `attached_assets/stock_images/professional_residen_4b1572a3.jpg`
- `attached_assets/stock_images/professional_residen_b2c1ec56.jpg`

### Unique Project Images
- `attached_assets/IMG_0032_1758750142435.jpeg`
- `attached_assets/IMG_0801_1758753451867.jpeg`
- `attached_assets/IMG_0852_1758750142436.jpeg`
- `attached_assets/IMG_0457_1758784382482.jpeg`

## Naming Conventions

Follow these rules for asset filenames:

✅ **Good:**
- `rural-fence-installation.jpg`
- `timber_fence_example.jpeg`
- `coloursteel-aluminium.jpg`

❌ **Bad:**
- `IMG 0562 copy.JPG` (spaces and "copy")
- `Fence Photo (1).jpg` (spaces and parentheses)
- `my-image.final.FINAL.jpg` (multiple versions)

## After Cleanup

Once you've cleaned up duplicate assets:

1. Test the application in preview mode
2. Verify all images still load correctly
3. Check the portfolio/gallery sections
4. Run `npm run build` to ensure build succeeds
5. Commit the changes

## Impact on Deployment

Removing duplicate assets will:
- Reduce project size by ~20-40% (estimated)
- Speed up Bolt.new deployment process
- Reduce memory usage during build
- Lower risk of context window overflow errors
- Improve overall application performance

## .boltignore Protection

A `.boltignore` file has been created to exclude the entire `attached_assets/` directory from Bolt's AI context. This prevents:
- Memory exhaustion during deployment
- Context window overflow
- "Internal Bolt Error" messages

The assets are still included in the build - they're just excluded from Bolt's analysis during deployment.
