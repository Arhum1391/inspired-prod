# Binance Integration Deployment Fix:

## Issues Fixed

### 1. Missing Environment Variables
**Problem**: The `BINANCE_CREDENTIALS_ENCRYPTION_KEY` environment variable was not configured in the deployed environment, causing credential storage to fail.

**Fix**: 
- Added validation check in the API route to detect missing encryption key
- Updated error messages to be more informative
- Added documentation to `ENV_EXAMPLE.md`, `VERCEL_DEPLOYMENT_GUIDE.md`, and `Dockerfile`

### 2. Crypto Module Bundling Issue
**Problem**: The Node.js `crypto` module was being bundled into client-side code, causing the error: `Failed to execute 'getRandomValues' on 'Crypto': parameter 1 is not of type 'ArrayBufferView'`

**Fix**: 
- Updated `next.config.ts` to externalize Node.js built-in modules (`crypto`, `fs`, `net`, `tls`) for client-side builds
- This prevents server-only modules from being bundled into the browser bundle

## Required Action: Add Environment Variable

To fix the Binance integration on your deployed site, you **MUST** add the `BINANCE_CREDENTIALS_ENCRYPTION_KEY` environment variable:

### Step 1: Generate Encryption Key

Run this command locally to generate a secure 32-byte key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

This will output a base64-encoded string like: `xK7vN2pQ9mR4tY8uI3oP6wE1sD5fG0hJ2kL9mN4bV7cX0zA=`

### Step 2: Add Environment Variable (Docker Compose)

If you're using **Docker Compose**, you have two options:

#### Option A: Using `.env` file (Recommended)

1. Create or edit a `.env` file in the same directory as your `docker-compose.yml`:
   ```bash
   # Add this line to your .env file
   BINANCE_CREDENTIALS_ENCRYPTION_KEY=xK7vN2pQ9mR4tY8uI3oP6wE1sD5fG0hJ2kL9mN4bV7cX0zA=
   ```

2. Update your `docker-compose.yml` to pass the environment variable:
   ```yaml
   services:
     app:
       build:
         context: .
         args:
           # Note: Build args are needed if the variable is used during build
           # For runtime-only variables, you can omit from build.args
           BINANCE_CREDENTIALS_ENCRYPTION_KEY: ${BINANCE_CREDENTIALS_ENCRYPTION_KEY}
       environment:
         # This is the important part - runtime environment variables
         - BINANCE_CREDENTIALS_ENCRYPTION_KEY=${BINANCE_CREDENTIALS_ENCRYPTION_KEY}
         # ... other environment variables
   ```

   **Important**: The `environment` section is what makes the variable available at runtime. The `build.args` section is optional for runtime-only variables but included in the Dockerfile for consistency.

3. Rebuild and restart your containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```
   
   **Note**: If you only added the variable to the `environment` section (not `build.args`), you can just restart without rebuilding:
   ```bash
   docker-compose restart
   ```

#### Option B: Directly in docker-compose.yml

1. Edit your `docker-compose.yml` file:
   ```yaml
   services:
     app:
       build:
         context: .
         args:
           BINANCE_CREDENTIALS_ENCRYPTION_KEY: your-generated-key-here
       environment:
         - BINANCE_CREDENTIALS_ENCRYPTION_KEY=your-generated-key-here
         # ... other environment variables
   ```

2. Rebuild and restart:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Step 2 Alternative: Docker Build (without Compose)

If you're building Docker images directly:

1. Build the image with the build argument:
   ```bash
   docker build \
     --build-arg BINANCE_CREDENTIALS_ENCRYPTION_KEY=your-generated-key-here \
     --build-arg MONGODB_URI=your-mongodb-uri \
     --build-arg JWT_SECRET=your-jwt-secret \
     # ... other build args
     -t your-app-name .
   ```

2. Run the container with the environment variable:
   ```bash
   docker run -d \
     -e BINANCE_CREDENTIALS_ENCRYPTION_KEY=your-generated-key-here \
     -e MONGODB_URI=your-mongodb-uri \
     # ... other environment variables
     -p 3000:3000 \
     your-app-name
   ```

### Step 3: Verify the Environment Variable

Check that the environment variable is set in your running container:

```bash
# If using Docker Compose
docker-compose exec app env | grep BINANCE_CREDENTIALS_ENCRYPTION_KEY

# If using Docker directly
docker exec <container-name> env | grep BINANCE_CREDENTIALS_ENCRYPTION_KEY
```

You should see the variable printed. If not, check your docker-compose.yml or docker run command.

### Step 4: Test

1. Visit your deployed site
2. Try connecting your Binance account
3. The connection should now work without errors
4. Check container logs for any errors:
   ```bash
   # Docker Compose
   docker-compose logs -f app
   
   # Docker directly
   docker logs -f <container-name>
   ```

## Important Notes

⚠️ **CRITICAL**: If you already have Binance credentials stored in your database:
- You **MUST** use the **same encryption key** that was used to encrypt them
- If you use a different key, all existing encrypted credentials will become unreadable
- If you don't know the original key, you'll need to ask users to reconnect their Binance accounts

⚠️ **Security**: 
- Never commit the encryption key to git
- Keep it secure and backed up
- Use the same key across all environments (dev, staging, production) if you want to share the same database

## Files Changed

1. `next.config.ts` - Added webpack config to externalize crypto module
2. `src/app/api/portfolio/credentials/route.ts` - Added encryption key validation
3. `ENV_EXAMPLE.md` - Added Binance encryption key documentation
4. `VERCEL_DEPLOYMENT_GUIDE.md` - Added Binance setup instructions
5. `Dockerfile` - Added Binance encryption key as build argument
6. `docker-compose.example.yml` - Created example Docker Compose configuration

## Verification

After deploying, you can verify the fix by:

1. Checking server logs for any encryption key errors (should be none)
2. Testing Binance account connection on the deployed site
3. Verifying credentials are stored successfully in MongoDB

If you still see errors after adding the environment variable and redeploying, check:
- The key is exactly 32 bytes when decoded
- The key is set in the `environment` section of docker-compose.yml (runtime variables)
- The environment variable is accessible inside the container (use `docker exec` to verify):
  ```bash
  docker-compose exec app env | grep BINANCE_CREDENTIALS_ENCRYPTION_KEY
  # or
  docker exec <container-name> env | grep BINANCE_CREDENTIALS_ENCRYPTION_KEY
  ```
- If the variable is not found, restart the container:
  ```bash
  docker-compose restart app
  # or
  docker restart <container-name>
  ```
- Server logs for more detailed error messages:
  ```bash
  docker-compose logs -f app
  # or
  docker logs -f <container-name>
  ```
- **Important**: For runtime-only environment variables, you don't need to rebuild the image - just restart the container after updating docker-compose.yml

## Quick Docker Compose Setup Checklist

- [ ] Generated `BINANCE_CREDENTIALS_ENCRYPTION_KEY` using the command above
- [ ] Added `BINANCE_CREDENTIALS_ENCRYPTION_KEY` to your `.env` file
- [ ] Updated `docker-compose.yml` to include the key in both `build.args` and `environment`
- [ ] Rebuilt containers with `docker-compose build --no-cache`
- [ ] Restarted containers with `docker-compose up -d`
- [ ] Verified the variable is set: `docker-compose exec app env | grep BINANCE`
- [ ] Tested Binance connection on the deployed site

