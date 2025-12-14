#!/usr/bin/env node

/**
 * Auto-Post Script for RestroWorks
 *
 * This script automatically creates pages/posts in PayloadCMS with images.
 * It can upload images from URLs or local files and create pages with custom content.
 *
 * Usage:
 *   node auto-post.js <payload-url> <admin-email> <admin-password> [options]
 *
 * Options:
 *   --config <file>     : JSON config file with page content (optional)
 *   --slug <slug>       : Page slug (default: auto-generated)
 *   --title <title>     : Page title (default: "Test Page")
 *   --images <urls>     : Comma-separated image URLs to upload
 *   --local-images <paths> : Comma-separated local image file paths
 *   --status <status>   : Page status: draft or published (default: published)
 *   --overwrite         : Overwrite existing page if it exists
 *
 * Examples:
 *   # Create a simple test page with images from URLs
 *   node auto-post.js https://restroworks-production.up.railway.app admin@example.com password123 \
 *     --images "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920,https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920" \
 *     --title "Test Page" --slug "test-page"
 *
 *   # Create a page with local images
 *   node auto-post.js https://restroworks-production.up.railway.app admin@example.com password123 \
 *     --local-images "./images/hero.jpg,./images/feature.jpg" \
 *     --title "Local Images Test" --slug "local-test"
 *
 *   # Use a config file for complex content
 *   node auto-post.js https://restroworks-production.up.railway.app admin@example.com password123 \
 *     --config ./my-page-config.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let PAYLOAD_URL = null;
let ADMIN_EMAIL = null;
let ADMIN_PASSWORD = null;
let configFile = null;
let slug = null;
let title = null;
let imageUrls = null;
let localImages = null;
let status = 'published';
let overwrite = false;

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const value = args[i + 1];
    switch (key) {
      case 'config':
        configFile = value;
        i++;
        break;
      case 'slug':
        slug = value;
        i++;
        break;
      case 'title':
        title = value;
        i++;
        break;
      case 'images':
        imageUrls = value.split(',').map(url => url.trim());
        i++;
        break;
      case 'local-images':
        localImages = value.split(',').map(p => p.trim());
        i++;
        break;
      case 'status':
        status = value;
        i++;
        break;
      case 'overwrite':
        overwrite = true;
        break;
    }
  } else if (!PAYLOAD_URL) {
    PAYLOAD_URL = arg;
  } else if (!ADMIN_EMAIL) {
    ADMIN_EMAIL = arg;
  } else if (!ADMIN_PASSWORD) {
    ADMIN_PASSWORD = arg;
  }
}

if (!PAYLOAD_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Error: Missing required arguments');
  console.log('\nUsage: node auto-post.js <payload-url> <admin-email> <admin-password> [options]');
  console.log('\nOptions:');
  console.log('  --config <file>       JSON config file with page content');
  console.log('  --slug <slug>         Page slug (default: auto-generated)');
  console.log('  --title <title>       Page title (default: "Test Page")');
  console.log('  --images <urls>       Comma-separated image URLs');
  console.log('  --local-images <paths> Comma-separated local image paths');
  console.log('  --status <status>     Page status: draft or published (default: published)');
  console.log('  --overwrite           Overwrite existing page if it exists');
  console.log('\nExamples:');
  console.log('  node auto-post.js https://restroworks-production.up.railway.app admin@example.com password123 \\');
  console.log('    --images "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920" \\');
  console.log('    --title "Test Page" --slug "test-page"');
  process.exit(1);
}

// Helper function to make HTTP requests
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Helper function to upload image from URL
async function uploadImageFromUrl(imageUrl, filename, altText, token) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading image from URL: ${imageUrl}...`);

    const urlObj = new URL(imageUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    client.get(imageUrl, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const contentType = response.headers['content-type'] || 'image/jpeg';

          // Create multipart form data
          const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
          const delimiter = `\r\n--${boundary}\r\n`;
          const closeDelimiter = `\r\n--${boundary}--`;

          let body = Buffer.concat([
            Buffer.from(delimiter),
            Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
            Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
            buffer,
            Buffer.from(delimiter),
            Buffer.from(`Content-Disposition: form-data; name="alt"\r\n\r\n`),
            Buffer.from(altText),
            Buffer.from(closeDelimiter)
          ]);

          const uploadUrl = `${PAYLOAD_URL}/api/media`;
          const options = {
            method: 'POST',
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': `multipart/form-data; boundary=${boundary}`,
              'Content-Length': body.length
            }
          };

          console.log(`📤 Uploading ${filename} to PayloadCMS...`);

          const uploadUrlObj = new URL(uploadUrl);
          const uploadClient = uploadUrlObj.protocol === 'https:' ? https : http;

          const req = uploadClient.request(uploadUrl, options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
              try {
                const parsed = JSON.parse(responseBody);
                if (res.statusCode >= 400) {
                  reject(new Error(`Upload failed: ${JSON.stringify(parsed)}`));
                } else {
                  console.log(`✅ Uploaded ${filename} (ID: ${parsed.doc.id})`);
                  resolve(parsed.doc);
                }
              } catch (e) {
                reject(new Error(`Failed to parse upload response: ${responseBody}`));
              }
            });
          });

          req.on('error', reject);
          req.write(body);
          req.end();

        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Helper function to upload image from local file
async function uploadImageFromFile(filePath, altText, token) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      reject(new Error(`File not found: ${fullPath}`));
      return;
    }

    console.log(`📥 Reading local image: ${path.basename(fullPath)}...`);

    fs.readFile(fullPath, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const filename = path.basename(fullPath);
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';

        // Create multipart form data
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        let body = Buffer.concat([
          Buffer.from(delimiter),
          Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
          Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
          buffer,
          Buffer.from(delimiter),
          Buffer.from(`Content-Disposition: form-data; name="alt"\r\n\r\n`),
          Buffer.from(altText),
          Buffer.from(closeDelimiter)
        ]);

        const uploadUrl = `${PAYLOAD_URL}/api/media`;
        const options = {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
          }
        };

        console.log(`📤 Uploading ${filename} to PayloadCMS...`);

        const uploadUrlObj = new URL(uploadUrl);
        const uploadClient = uploadUrlObj.protocol === 'https:' ? https : http;

        const req = uploadClient.request(uploadUrl, options, (res) => {
          let responseBody = '';
          res.on('data', chunk => responseBody += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(responseBody);
              if (res.statusCode >= 400) {
                reject(new Error(`Upload failed: ${JSON.stringify(parsed)}`));
              } else {
                console.log(`✅ Uploaded ${filename} (ID: ${parsed.doc.id})`);
                resolve(parsed.doc);
              }
            } catch (e) {
              reject(new Error(`Failed to parse upload response: ${responseBody}`));
            }
          });
        });

        req.on('error', reject);
        req.write(body);
        req.end();

      } catch (error) {
        reject(error);
      }
    });
  });
}

// Main function
async function autoPost() {
  try {
    console.log('\n🚀 Starting Auto-Post Script\n');
    console.log(`📍 Target: ${PAYLOAD_URL}\n`);

    // Step 1: Login
    console.log('🔐 Logging in...');
    const loginData = JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const loginResponse = await makeRequest(
      `${PAYLOAD_URL}/api/users/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      },
      loginData
    );

    const token = loginResponse.token;
    console.log('✅ Login successful\n');

    // Step 2: Load config or use defaults
    let pageData;
    if (configFile) {
      console.log(`📄 Loading config from: ${configFile}`);
      const configContent = fs.readFileSync(configFile, 'utf8');
      pageData = JSON.parse(configContent);
      console.log('✅ Config loaded\n');
    } else {
      // Generate default page data
      pageData = {
        title: {
          en: title || 'Test Page',
          es: title || 'Página de Prueba'
        },
        slug: slug || `test-page-${Date.now()}`,
        seo: {
          metaTitle: {
            en: title || 'Test Page',
            es: title || 'Página de Prueba'
          },
          metaDescription: {
            en: 'Auto-generated test page',
            es: 'Página de prueba generada automáticamente'
          }
        },
        blocks: [],
        status: status
      };
    }

    // Step 3: Upload images
    const uploadedImages = [];
    
    if (imageUrls && imageUrls.length > 0) {
      console.log('🖼️  Uploading images from URLs...\n');
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const filename = `image-${i + 1}-${Date.now()}.jpg`;
        const altText = `Uploaded image ${i + 1}`;
        
        try {
          const uploadedImage = await uploadImageFromUrl(imageUrl, filename, altText, token);
          uploadedImages.push(uploadedImage);
          console.log('');
        } catch (error) {
          console.error(`⚠️  Failed to upload image ${i + 1}: ${error.message}`);
        }
      }
    }

    if (localImages && localImages.length > 0) {
      console.log('🖼️  Uploading local images...\n');
      for (let i = 0; i < localImages.length; i++) {
        const filePath = localImages[i];
        const altText = `Local image ${i + 1}`;
        
        try {
          const uploadedImage = await uploadImageFromFile(filePath, altText, token);
          uploadedImages.push(uploadedImage);
          console.log('');
        } catch (error) {
          console.error(`⚠️  Failed to upload local image ${i + 1}: ${error.message}`);
        }
      }
    }

    // Step 4: Add images to page if not using config file
    if (!configFile && uploadedImages.length > 0) {
      // Add a hero block with the first image
      pageData.blocks.push({
        blockType: 'hero',
        heading: {
          en: title || 'Test Page',
          es: title || 'Página de Prueba'
        },
        subheading: {
          en: 'This is an auto-generated test page with uploaded images.',
          es: 'Esta es una página de prueba generada automáticamente con imágenes subidas.'
        },
        ctaText: {
          en: 'Learn More',
          es: 'Saber Más'
        },
        ctaLink: '#',
        backgroundImage: uploadedImages[0].id
      });

      // Add SEO meta image
      if (!pageData.seo.metaImage) {
        pageData.seo.metaImage = uploadedImages[0].id;
      }
    }

    // Step 5: Check if page already exists
    let pageCreated = false;
    if (pageData.slug) {
      console.log(`🔍 Checking for existing page with slug: ${pageData.slug}...`);
      const existingPages = await makeRequest(
        `${PAYLOAD_URL}/api/pages?where[slug][equals]=${pageData.slug}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `JWT ${token}`
          }
        }
      );

      if (existingPages.docs && existingPages.docs.length > 0) {
        if (overwrite) {
          console.log('⚠️  Page exists. Overwriting...\n');
          const existingPage = existingPages.docs[0];
          
          // Update existing page
          const updateData = JSON.stringify(pageData);
          const updatedPage = await makeRequest(
            `${PAYLOAD_URL}/api/pages/${existingPage.id}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': updateData.length
              }
            },
            updateData
          );

          console.log(`✅ Page updated successfully (ID: ${updatedPage.id})\n`);
          pageCreated = true;
        } else {
          console.log('⚠️  Page already exists. Use --overwrite to update it.');
          console.log(`   Existing page ID: ${existingPages.docs[0].id}\n`);
          return;
        }
      } else {
        console.log('✅ No existing page found\n');
      }
    }

    // Step 6: Create page (if not updated)
    if (!pageCreated) {
      console.log('📝 Creating page...');
      const createData = JSON.stringify(pageData);
      const page = await makeRequest(
        `${PAYLOAD_URL}/api/pages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': createData.length
          }
        },
        createData
      );

      console.log(`✅ Page created successfully (ID: ${page.doc.id})\n`);
    }

    // Success summary
    console.log('✨ Auto-post completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Uploaded ${uploadedImages.length} image(s)`);
    console.log(`   - Page slug: ${pageData.slug}`);
    console.log(`   - Page status: ${pageData.status || status}`);
    console.log(`   - Blocks: ${pageData.blocks ? pageData.blocks.length : 0}\n`);

    console.log('🌐 View your page:');
    console.log(`   - Admin: ${PAYLOAD_URL}/admin`);
    console.log(`   - API: ${PAYLOAD_URL}/api/pages?where[slug][equals]=${pageData.slug}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check your credentials and try again.\n');
    process.exit(1);
  }
}

// Run the script
autoPost();

