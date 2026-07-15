'use strict';
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/modules/**/*.routes.js');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to find comments like: // GET /api/v1/auth/me
  const regex = /\/\/\s+(GET|POST|PUT|PATCH|DELETE)\s+(\/api\/v1\/[\w\/\-\:]+)/g;
  
  let modified = false;
  let newContent = content.replace(regex, (match, method, endpoint) => {
    // Check if there is already a @swagger tag nearby
    const tag = `[${endpoint.split('/')[3] || 'Default'}]`; // extracts module name e.g. auth
    let swaggerPath = endpoint.replace('/api/v1', '');
    // Convert /users/:addressId to /users/{addressId} for swagger
    swaggerPath = swaggerPath.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    
    const isProtected = content.includes('authenticate') || endpoint.includes('me') || content.includes('authorize');
    
    const swaggerDoc = `/**
 * @swagger
 * ${swaggerPath}:
 *   ${method.toLowerCase()}:
 *     summary: ${method} ${swaggerPath}
 *     tags: ${tag}
 *     ${isProtected ? 'security:\n *       - BearerAuth: []' : ''}
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
${match}`;
    
    // Only replace if @swagger is not already there
    if (!content.includes(swaggerPath + ':')) {
      modified = true;
      return swaggerDoc;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Injected Swagger into ${file}`);
  }
});
