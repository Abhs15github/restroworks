#!/usr/bin/env node

/**
 * Content Seeder Script for RestroWorks
 *
 * This script automatically creates sample content in PayloadCMS including:
 * - Sample images (uploaded to Media collection)
 * - Homepage with Hero, Features, Testimonials, and CTA blocks
 * - Both English and Spanish content
 *
 * Usage:
 *   node seed-content.js <payload-url> <admin-email> <admin-password>
 *
 * Example:
 *   node seed-content.js https://restroworks-production.up.railway.app admin@example.com password123
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const args = process.argv.slice(2);
const PAYLOAD_URL = args[0] || 'http://localhost:3001';
const ADMIN_EMAIL = args[1];
const ADMIN_PASSWORD = args[2];

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Error: Missing credentials');
  console.log('\nUsage: node seed-content.js <payload-url> <admin-email> <admin-password>');
  console.log('\nExample:');
  console.log('  node seed-content.js https://restroworks-production.up.railway.app admin@example.com password123');
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

// Helper function to download and upload image
async function downloadAndUploadImage(imageUrl, filename, token) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading image: ${filename}...`);

    https.get(imageUrl, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);

          // Create multipart form data manually
          const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
          const delimiter = `\r\n--${boundary}\r\n`;
          const closeDelimiter = `\r\n--${boundary}--`;

          let body = Buffer.concat([
            Buffer.from(delimiter),
            Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
            Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
            buffer,
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

          const urlObj = new URL(uploadUrl);
          const client = urlObj.protocol === 'https:' ? https : http;

          const req = client.request(uploadUrl, options, (res) => {
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

// Main seeding function
async function seedContent() {
  try {
    console.log('\n🚀 Starting RestroWorks Content Seeder\n');
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

    // Step 2: Upload Images
    console.log('🖼️  Uploading sample images...\n');

    const heroImage = await downloadAndUploadImage(
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
      'restaurant-interior.jpg',
      token
    );

    console.log('');

    // Step 3: Check if home page already exists
    console.log('🔍 Checking for existing home page...');
    const existingPages = await makeRequest(
      `${PAYLOAD_URL}/api/pages?where[slug][equals]=home`,
      {
        method: 'GET',
        headers: {
          'Authorization': `JWT ${token}`
        }
      }
    );

    if (existingPages.docs && existingPages.docs.length > 0) {
      console.log('⚠️  Home page already exists. Skipping creation to avoid duplicates.');
      console.log('✅ If you want to recreate it, please delete the existing page first.\n');
      return;
    }

    console.log('✅ No existing home page found\n');

    // Step 4: Create Home Page with all blocks
    console.log('📝 Creating homepage with sample content...');

    const pageData = JSON.stringify({
      title: {
        en: "Home",
        es: "Inicio"
      },
      slug: "home",
      seo: {
        metaTitle: {
          en: "RestroWorks - Exceptional Dining Experience",
          es: "RestroWorks - Experiencia Gastronómica Excepcional"
        },
        metaDescription: {
          en: "Discover culinary excellence at RestroWorks. Farm-to-table cuisine, award-winning chefs, and unforgettable dining moments.",
          es: "Descubre la excelencia culinaria en RestroWorks. Cocina de granja a mesa, chefs galardonados y momentos gastronómicos inolvidables."
        },
        metaImage: heroImage.id
      },
      blocks: [
        {
          blockType: "hero",
          heading: {
            en: "Where Culinary Art Meets Passion",
            es: "Donde el Arte Culinario se Encuentra con la Pasión"
          },
          subheading: {
            en: "Experience the perfect blend of traditional flavors and modern innovation. Every dish tells a story, crafted with locally sourced ingredients and decades of expertise.",
            es: "Experimenta la combinación perfecta de sabores tradicionales e innovación moderna. Cada plato cuenta una historia, elaborado con ingredientes locales y décadas de experiencia."
          },
          ctaText: {
            en: "Reserve Your Table",
            es: "Reserva Tu Mesa"
          },
          ctaLink: "#contact",
          backgroundImage: heroImage.id
        },
        {
          blockType: "features",
          heading: {
            en: "Why Dine With Us",
            es: "Por Qué Cenar Con Nosotros"
          },
          featureList: [
            {
              title: {
                en: "Farm-to-Table Freshness",
                es: "Frescura de Granja a Mesa"
              },
              description: {
                en: "We partner with local farmers and suppliers to bring you the freshest seasonal ingredients. Every ingredient is carefully selected for quality and sustainability.",
                es: "Nos asociamos con agricultores y proveedores locales para ofrecerte los ingredientes de temporada más frescos. Cada ingrediente se selecciona cuidadosamente por su calidad y sostenibilidad."
              }
            },
            {
              title: {
                en: "Award-Winning Chefs",
                es: "Chefs Galardonados"
              },
              description: {
                en: "Our culinary team brings together decades of international experience, with Michelin-trained expertise and a passion for creating memorable dining experiences.",
                es: "Nuestro equipo culinario reúne décadas de experiencia internacional, con formación Michelin y pasión por crear experiencias gastronómicas memorables."
              }
            },
            {
              title: {
                en: "Elegant Atmosphere",
                es: "Ambiente Elegante"
              },
              description: {
                en: "Immerse yourself in our thoughtfully designed space that combines contemporary elegance with warm hospitality. Perfect for intimate dinners or celebrations.",
                es: "Sumérgete en nuestro espacio cuidadosamente diseñado que combina elegancia contemporánea con cálida hospitalidad. Perfecto para cenas íntimas o celebraciones."
              }
            },
            {
              title: {
                en: "Curated Wine Selection",
                es: "Selección de Vinos Curada"
              },
              description: {
                en: "Explore our extensive wine collection featuring both prestigious international labels and hidden gems from boutique vineyards, expertly paired with our menu.",
                es: "Explora nuestra extensa colección de vinos con etiquetas internacionales prestigiosas y joyas ocultas de viñedos boutique, expertamente maridados con nuestro menú."
              }
            }
          ]
        },
        {
          blockType: "testimonials",
          heading: {
            en: "What Our Guests Say",
            es: "Lo Que Dicen Nuestros Huéspedes"
          },
          testimonialList: [
            {
              name: {
                en: "Sarah Mitchell",
                es: "Sarah Mitchell"
              },
              role: {
                en: "Food Critic, Gourmet Magazine",
                es: "Crítica Gastronómica, Revista Gourmet"
              },
              content: {
                en: "RestroWorks redefines fine dining. The attention to detail in every course is remarkable, and the flavors are simply extraordinary. A true culinary destination that exceeds all expectations.",
                es: "RestroWorks redefine la alta cocina. La atención al detalle en cada plato es notable, y los sabores son simplemente extraordinarios. Un verdadero destino culinario que supera todas las expectativas."
              },
              rating: 5
            },
            {
              name: {
                en: "Michael Chen",
                es: "Michael Chen"
              },
              role: {
                en: "Regular Guest",
                es: "Huésped Habitual"
              },
              content: {
                en: "I have celebrated every important milestone here for the past five years. The consistency in quality, the warmth of the service, and the ever-evolving menu keep me coming back.",
                es: "He celebrado cada hito importante aquí durante los últimos cinco años. La consistencia en la calidad, la calidez del servicio y el menú en constante evolución me hacen volver."
              },
              rating: 5
            },
            {
              name: {
                en: "Elena Rodriguez",
                es: "Elena Rodríguez"
              },
              role: {
                en: "Wedding Anniversary Celebrant",
                es: "Celebrante de Aniversario de Bodas"
              },
              content: {
                en: "Our anniversary dinner was magical. From the moment we walked in, we felt special. The chef even prepared a custom dessert for us. This is more than a restaurant, it is an experience.",
                es: "Nuestra cena de aniversario fue mágica. Desde el momento en que entramos, nos sentimos especiales. El chef incluso preparó un postre personalizado para nosotros. Esto es más que un restaurante, es una experiencia."
              },
              rating: 5
            }
          ]
        },
        {
          blockType: "cta",
          heading: {
            en: "Ready to Experience Excellence?",
            es: "¿Listo para Experimentar la Excelencia?"
          },
          description: {
            en: "Reserve your table today and discover why RestroWorks has become the premier dining destination. Whether it is a romantic evening, a business dinner, or a special celebration, we create unforgettable moments.",
            es: "Reserva tu mesa hoy y descubre por qué RestroWorks se ha convertido en el destino gastronómico premier. Ya sea una velada romántica, una cena de negocios o una celebración especial, creamos momentos inolvidables."
          },
          buttonText: {
            en: "Make a Reservation",
            es: "Hacer una Reservación"
          },
          buttonLink: "#contact"
        }
      ],
      status: "published"
    });

    const page = await makeRequest(
      `${PAYLOAD_URL}/api/pages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': pageData.length
        }
      },
      pageData
    );

    console.log(`✅ Homepage created successfully (ID: ${page.doc.id})\n`);

    // Success summary
    console.log('✨ Content seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Uploaded 1 hero image`);
    console.log(`   - Created homepage with 4 content blocks`);
    console.log(`   - Added bilingual content (English & Spanish)`);
    console.log(`   - Status: Published\n`);

    console.log('🌐 View your site:');
    console.log(`   - Frontend: https://restroworks-phi.vercel.app`);
    console.log(`   - Admin: ${PAYLOAD_URL}/admin`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check your credentials and try again.\n');
    process.exit(1);
  }
}

// Run the seeder
seedContent();
