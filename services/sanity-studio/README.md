# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

---

## Seed Script

This project includes a seed script that populates the Sanity dataset with all the website content and images from the `attached_assets/` directory.

### Step-by-Step Run Instructions:

1. **Create a Sanity API Token**:
   - Go to https://www.sanity.io/manage
   - Select your project (`ag-makeup-studio`)
   - Go to "API" → "Tokens"
   - Click "Add API token"
   - Give it a name like "Seed Script"
   - Select "Editor" permissions
   - Copy the token (it will only be shown once!)

2. **Set Up Environment Variables**:
   - In the `services/sanity-studio/` directory, create a `.env` file
   - Add your token:
     ```env
     SANITY_API_TOKEN=your-token-here
     ```

3. **Run the Seed Script**:
   ```bash
   cd services/sanity-studio
   pnpm seed
   ```

### Expected Output:
The script will:
- Upload all required images from `attached_assets/`
- Create singleton documents: `homepage`, `siteSettings`, `beforeAfter`, `bridalMoment`
- Create documents: `portfolio` items, `offering` items, `award` items, `testimonial` items, `archiveInMotion` item
- Show progress updates and a success message on completion

### Note:
- The script uses `createOrReplace` for singleton documents, so it will overwrite existing ones
- For array documents, it will create new ones each time (to avoid duplicates, you may want to delete existing ones first via the Studio UI)
