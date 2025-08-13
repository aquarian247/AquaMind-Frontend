#!/usr/bin/env tsx
/**
 * validate-endpoints.ts
 * 
 * This script validates that all API endpoints used in the frontend code
 * exist in the backend OpenAPI specification. It helps prevent 404 errors
 * by catching mismatches before they reach production.
 * 
 * Usage:
 *   npx tsx scripts/validate-endpoints.ts
 * 
 * Exit codes:
 *   0: Success - all endpoints are valid
 *   1: Error - mismatches found
 *   2: Error - could not parse OpenAPI spec or other critical error
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';
import yaml from 'js-yaml';
import chalk from 'chalk';

// Configuration
const CONFIG = {
  openApiPath: path.resolve(process.cwd(), 'api/openapi.yaml'),
  sourceGlobs: [
    'client/src/**/*.{ts,tsx,js,jsx}',
    'server/**/*.{ts,js}'
  ],
  excludeGlobs: [
    '**/node_modules/**',
    '**/*.test.{ts,tsx,js,jsx}',
    '**/generated/**'
  ],
  // Regex patterns to match API endpoint usage
  patterns: [
    // Match string literals with /api/v1/...
    /['"`]\/api\/v1\/([^'"`]+)['"`]/g,
    // Match DJANGO_ENDPOINTS usage
    /DJANGO_ENDPOINTS\.([A-Z_]+)/g,
    // Match fetch calls
    /fetch\(['"`]([^)]+)['"`]\)/g,
    // Match getApiUrl calls
    /getApiUrl\(['"`]([^)]+)['"`]\)/g,
    // Match queryKey arrays
    /queryKey:\s*\[\s*['"`]([^'"`]+)['"`]/g
  ]
};

/**
 * Represents an API endpoint reference found in the codebase
 */
interface EndpointReference {
  path: string;
  file: string;
  line: number;
  column: number;
  context: string;
}

/**
 * Parse the OpenAPI spec and extract all valid API paths
 */
async function getOpenApiPaths(): Promise<string[]> {
  try {
    console.log(chalk.blue('📚 Reading OpenAPI specification...'));
    const fileContent = await fs.promises.readFile(CONFIG.openApiPath, 'utf8');
    const openApiDoc = yaml.load(fileContent) as any;
    
    if (!openApiDoc || !openApiDoc.paths) {
      console.error(chalk.red('❌ Invalid OpenAPI specification: missing paths object'));
      process.exit(2);
    }
    
    // Extract all paths and normalize them
    const paths = Object.keys(openApiDoc.paths).map(normalizeEndpoint);
    console.log(chalk.green(`✅ Found ${paths.length} valid endpoints in OpenAPI spec`));
    return paths;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to parse OpenAPI spec: ${error}`));
    process.exit(2);
  }
}

/**
 * Scan the frontend codebase for API endpoint patterns
 */
async function scanSourceFiles(): Promise<EndpointReference[]> {
  console.log(chalk.blue('🔍 Scanning source files for API endpoints...'));
  
  // Find all source files matching the globs
  const files = await glob(CONFIG.sourceGlobs, {
    ignore: CONFIG.excludeGlobs
  });
  
  console.log(chalk.blue(`📂 Scanning ${files.length} files...`));
  
  const references: EndpointReference[] = [];
  
  for (const file of files) {
    try {
      const content = await fs.promises.readFile(file, 'utf8');
      const lines = content.split('\n');
      
      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        
        for (const pattern of CONFIG.patterns) {
          // Reset the regex lastIndex to avoid issues with global flag
          pattern.lastIndex = 0;
          let match;
          
          while ((match = pattern.exec(line)) !== null) {
            const path = match[1];
            
            // Skip if it doesn't look like an API path
            if (!path || (!path.startsWith('/api') && !path.includes('/api/'))) {
              continue;
            }
            
            // Normalize the path
            const normalizedPath = normalizeEndpoint(path);
            
            references.push({
              path: normalizedPath,
              file,
              line: lineNum + 1,
              column: match.index,
              context: line.trim()
            });
          }
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Could not read file ${file}: ${error}`));
    }
  }
  
  console.log(chalk.green(`✅ Found ${references.length} API endpoint references`));
  return references;
}

/**
 * Normalize an endpoint path for comparison
 * - Ensures leading slash
 * - Handles trailing slashes consistently
 * - Removes query parameters
 */
function normalizeEndpoint(path: string): string {
  // Remove query parameters
  path = path.split('?')[0];
  
  // Ensure leading slash
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Ensure path starts with /api/v1
  if (!path.startsWith('/api/v1') && path.includes('/api/v1')) {
    path = '/api/v1' + path.split('/api/v1')[1];
  }
  
  // Ensure trailing slash for consistency with Django REST Framework
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  
  return path;
}

/**
 * Validate that all referenced endpoints exist in the OpenAPI spec
 */
function validateEndpoints(
  openApiPaths: string[], 
  references: EndpointReference[]
): { valid: EndpointReference[], invalid: EndpointReference[] } {
  console.log(chalk.blue('🔍 Validating endpoints...'));
  
  const valid: EndpointReference[] = [];
  const invalid: EndpointReference[] = [];
  
  // Create a Set for faster lookups
  const validPathsSet = new Set(openApiPaths);
  
  // Group references by path to avoid duplicate reports
  const pathMap = new Map<string, EndpointReference[]>();
  
  for (const ref of references) {
    if (!pathMap.has(ref.path)) {
      pathMap.set(ref.path, []);
    }
    pathMap.get(ref.path)!.push(ref);
  }
  
  // Check each unique path
  for (const [path, refs] of pathMap.entries()) {
    // Skip paths with variables (we can't validate these precisely)
    if (path.includes('${') || path.includes('${}') || path.includes(':`')) {
      console.log(chalk.yellow(`⚠️ Skipping dynamic path: ${path}`));
      continue;
    }
    
    if (validPathsSet.has(path)) {
      valid.push(...refs);
    } else {
      // Try to find a similar path for suggestion
      const suggestion = findSimilarPath(path, openApiPaths);
      
      // Add a suggestion to the first reference
      if (suggestion) {
        refs[0].suggestion = suggestion;
      }
      
      invalid.push(...refs);
    }
  }
  
  return { valid, invalid };
}

/**
 * Find a similar path in the OpenAPI spec for suggestions
 */
function findSimilarPath(path: string, validPaths: string[]): string | null {
  // Simple similarity: paths that share the same prefix
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length < 3) return null;
  
  // Try to find paths with the same resource type
  const resourceType = segments[2]; // e.g., "inventory" in "/api/v1/inventory/..."
  const similarPaths = validPaths.filter(p => p.includes(`/${resourceType}/`));
  
  if (similarPaths.length > 0) {
    return similarPaths[0];
  }
  
  return null;
}

/**
 * Format and print validation results
 */
function printResults(
  valid: EndpointReference[], 
  invalid: EndpointReference[]
): void {
  console.log('\n' + chalk.blue('📊 Validation Results:'));
  console.log(chalk.green(`✅ ${valid.length} valid endpoint references`));
  
  if (invalid.length === 0) {
    console.log(chalk.green('🎉 All endpoints are valid! No 404s here.'));
    return;
  }
  
  console.log(chalk.red(`❌ ${invalid.length} invalid endpoint references`));
  
  // Group by path for cleaner output
  const pathMap = new Map<string, EndpointReference[]>();
  
  for (const ref of invalid) {
    if (!pathMap.has(ref.path)) {
      pathMap.set(ref.path, []);
    }
    pathMap.get(ref.path)!.push(ref);
  }
  
  console.log('\n' + chalk.red('📝 Invalid Endpoints:'));
  
  for (const [path, refs] of pathMap.entries()) {
    console.log('\n' + chalk.red(`❌ ${path}`));
    
    if (refs[0].suggestion) {
      console.log(chalk.yellow(`   Did you mean: ${refs[0].suggestion}`));
    }
    
    // Show up to 3 references for each path
    const displayRefs = refs.slice(0, 3);
    const remaining = refs.length - displayRefs.length;
    
    for (const ref of displayRefs) {
      console.log(chalk.gray(`   ${ref.file}:${ref.line} - ${ref.context}`));
    }
    
    if (remaining > 0) {
      console.log(chalk.gray(`   ... and ${remaining} more references`));
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.blue('🚀 Starting API Endpoint Validation'));
  
  try {
    // Get valid paths from OpenAPI spec
    const openApiPaths = await getOpenApiPaths();
    
    // Scan source files for endpoint references
    const references = await scanSourceFiles();
    
    // Validate endpoints
    const { valid, invalid } = validateEndpoints(openApiPaths, references);
    
    // Print results
    printResults(valid, invalid);
    
    // Exit with error if any invalid endpoints found
    if (invalid.length > 0) {
      console.log('\n' + chalk.red('❌ Validation failed! Please fix the invalid endpoints.'));
      process.exit(1);
    }
    
    console.log('\n' + chalk.green('✅ Validation passed! All endpoints are valid.'));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red(`❌ Unexpected error: ${error}`));
    process.exit(2);
  }
}

// Run the main function
main();
