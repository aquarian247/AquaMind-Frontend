#!/usr/bin/env node
/**
 * quick-integration-test.js
 * 
 * A simple script to verify the integration between Django backend and React frontend
 * for the AquaMind application. Uses only built-in Node.js modules.
 * 
 * Usage: node quick-integration-test.js [--auth-only] [--verbose]
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const { promisify } = require('util');

// Configuration
const CONFIG = {
  DJANGO_URL: process.env.DJANGO_URL || 'http://localhost:8000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5001',
  AUTH: {
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'testpassword'
  },
  TIMEOUT_MS: 10000, // 10 seconds
  VERBOSE: process.argv.includes('--verbose'),
  AUTH_ONLY: process.argv.includes('--auth-only')
};

// Global state
const state = {
  accessToken: null,
  refreshToken: null,
  testResults: {
    passed: 0,
    failed: 0,
    total: 0
  }
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Utility Functions
 */

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const defaultOptions = {
      method: 'GET',
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: CONFIG.TIMEOUT_MS
    };
    
    // Merge options
    const requestOptions = { ...defaultOptions, ...options };
    
    // Add authorization header if token exists
    if (state.accessToken && !requestOptions.headers['Authorization']) {
      requestOptions.headers['Authorization'] = `Bearer ${state.accessToken}`;
    }
    
    if (CONFIG.VERBOSE) {
      console.log(`${colors.blue}[REQUEST]${colors.reset} ${requestOptions.method} ${url}`);
      console.log(`${colors.blue}[HEADERS]${colors.reset}`, requestOptions.headers);
      if (options.body) {
        console.log(`${colors.blue}[BODY]${colors.reset}`, options.body);
      }
    }
    
    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        
        try {
          // Try to parse as JSON if content-type is application/json
          const contentType = res.headers['content-type'];
          if (contentType && contentType.includes('application/json')) {
            parsedData = JSON.parse(data);
          } else {
            parsedData = data;
          }
          
          if (CONFIG.VERBOSE) {
            console.log(`${colors.green}[RESPONSE]${colors.reset} ${res.statusCode} ${res.statusMessage}`);
            console.log(`${colors.green}[RESPONSE DATA]${colors.reset}`, parsedData);
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
            raw: data
          });
        } catch (error) {
          if (CONFIG.VERBOSE) {
            console.log(`${colors.red}[PARSE ERROR]${colors.reset} ${error.message}`);
            console.log(`${colors.red}[RAW RESPONSE]${colors.reset}`, data);
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            raw: data,
            parseError: error.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      if (CONFIG.VERBOSE) {
        console.log(`${colors.red}[REQUEST ERROR]${colors.reset} ${error.message}`);
      }
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${CONFIG.TIMEOUT_MS}ms`));
    });
    
    // Write request body if it exists
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    
    req.end();
  });
}

/**
 * Test Functions
 */

// Test if a service is running
async function testServiceAvailability(name, url) {
  console.log(`\n${colors.cyan}Testing ${name} availability at ${url}${colors.reset}`);
  
  try {
    const response = await makeRequest(url, { timeout: 5000 });
    console.log(`${colors.green}✓ ${name} is running (Status: ${response.statusCode})${colors.reset}`);
    state.testResults.passed++;
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ ${name} is not available: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

// Test authentication
async function testAuthentication() {
  console.log(`\n${colors.cyan}Testing authentication${colors.reset}`);
  
  try {
    const response = await makeRequest(`${CONFIG.DJANGO_URL}/api/auth/jwt/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: CONFIG.AUTH.username,
        password: CONFIG.AUTH.password
      }
    });
    
    if (response.statusCode === 200 && response.data.access && response.data.refresh) {
      state.accessToken = response.data.access;
      state.refreshToken = response.data.refresh;
      
      console.log(`${colors.green}✓ Authentication successful${colors.reset}`);
      state.testResults.passed++;
      return true;
    } else {
      console.log(`${colors.red}✗ Authentication failed: ${response.statusCode}${colors.reset}`);
      state.testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Authentication error: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

// Test token refresh
async function testTokenRefresh() {
  if (!state.refreshToken) {
    console.log(`${colors.yellow}! Skipping token refresh test (no refresh token)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.cyan}Testing token refresh${colors.reset}`);
  
  try {
    const response = await makeRequest(`${CONFIG.DJANGO_URL}/api/auth/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        refresh: state.refreshToken
      }
    });
    
    if (response.statusCode === 200 && response.data.access) {
      state.accessToken = response.data.access;
      
      console.log(`${colors.green}✓ Token refresh successful${colors.reset}`);
      state.testResults.passed++;
      return true;
    } else {
      console.log(`${colors.red}✗ Token refresh failed: ${response.statusCode}${colors.reset}`);
      state.testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Token refresh error: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

// Test authenticated endpoint
async function testAuthenticatedEndpoint() {
  if (!state.accessToken) {
    console.log(`${colors.yellow}! Skipping authenticated endpoint test (no access token)${colors.reset}`);
    return false;
  }
  
  console.log(`\n${colors.cyan}Testing authenticated endpoint access${colors.reset}`);
  
  try {
    const response = await makeRequest(`${CONFIG.DJANGO_URL}/api/v1/users/me/`);
    
    if (response.statusCode === 200 && response.data.username) {
      console.log(`${colors.green}✓ Authenticated endpoint access successful (User: ${response.data.username})${colors.reset}`);
      state.testResults.passed++;
      return true;
    } else {
      console.log(`${colors.red}✗ Authenticated endpoint access failed: ${response.statusCode}${colors.reset}`);
      state.testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Authenticated endpoint error: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

// Test API root endpoint
async function testApiRoot() {
  console.log(`\n${colors.cyan}Testing API root endpoint${colors.reset}`);
  
  try {
    const response = await makeRequest(`${CONFIG.DJANGO_URL}/api/`);
    
    if (response.statusCode === 200) {
      // Validate the response structure
      const hasDocumentation = response.data.documentation && 
        Object.keys(response.data.documentation).length > 0;
      
      const hasApps = response.data.apps && 
        Object.keys(response.data.apps).length > 0;
      
      if (hasDocumentation && hasApps) {
        console.log(`${colors.green}✓ API root endpoint test successful${colors.reset}`);
        console.log(`${colors.green}  Found ${Object.keys(response.data.apps).length} app endpoints${colors.reset}`);
        state.testResults.passed++;
        return true;
      } else {
        console.log(`${colors.red}✗ API root endpoint missing expected sections${colors.reset}`);
        state.testResults.failed++;
        return false;
      }
    } else {
      console.log(`${colors.red}✗ API root endpoint test failed: ${response.statusCode}${colors.reset}`);
      state.testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ API root endpoint error: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

// Test key endpoints
async function testKeyEndpoints() {
  const endpoints = [
    '/api/v1/batch/batches/',
    '/api/v1/environmental/readings/',
    '/api/v1/health/observations/',
    '/api/v1/infrastructure/containers/'
  ];
  
  console.log(`\n${colors.cyan}Testing key API endpoints${colors.reset}`);
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await makeRequest(`${CONFIG.DJANGO_URL}${endpoint}`);
      
      if (response.statusCode === 200) {
        // Check if the response has the expected pagination structure
        if (response.data.hasOwnProperty('count') && response.data.hasOwnProperty('results')) {
          console.log(`${colors.green}✓ Endpoint ${endpoint} test successful (${response.data.count} items)${colors.reset}`);
          state.testResults.passed++;
        } else {
          console.log(`${colors.yellow}! Endpoint ${endpoint} response missing expected pagination structure${colors.reset}`);
          state.testResults.failed++;
        }
      } else {
        console.log(`${colors.red}✗ Endpoint ${endpoint} test failed: ${response.statusCode}${colors.reset}`);
        state.testResults.failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Endpoint ${endpoint} error: ${error.message}${colors.reset}`);
      state.testResults.failed++;
    } finally {
      state.testResults.total++;
    }
  }
}

// Test frontend-backend integration
async function testFrontendBackendIntegration() {
  console.log(`\n${colors.cyan}Testing frontend-backend integration${colors.reset}`);
  
  try {
    // Check if frontend loads the API schema
    const response = await makeRequest(`${CONFIG.FRONTEND_URL}/api/openapi.yaml`);
    
    if (response.statusCode === 200 && response.raw.includes('openapi:')) {
      console.log(`${colors.green}✓ Frontend successfully loads API schema${colors.reset}`);
      state.testResults.passed++;
      return true;
    } else {
      console.log(`${colors.red}✗ Frontend API schema test failed: ${response.statusCode}${colors.reset}`);
      state.testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Frontend-backend integration error: ${error.message}${colors.reset}`);
    state.testResults.failed++;
    return false;
  } finally {
    state.testResults.total++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n${colors.magenta}=== AquaMind Integration Test ====${colors.reset}`);
  console.log(`${colors.blue}Django URL: ${CONFIG.DJANGO_URL}${colors.reset}`);
  console.log(`${colors.blue}Frontend URL: ${CONFIG.FRONTEND_URL}${colors.reset}`);
  console.log(`${colors.blue}Test User: ${CONFIG.AUTH.username}${colors.reset}`);
  
  // Test service availability
  const djangoAvailable = await testServiceAvailability('Django backend', `${CONFIG.DJANGO_URL}/admin/login/`);
  const frontendAvailable = await testServiceAvailability('React frontend', CONFIG.FRONTEND_URL);
  
  if (!djangoAvailable) {
    console.log(`${colors.red}Django backend is not available. Skipping API tests.${colors.reset}`);
    printSummary();
    process.exit(1);
  }
  
  // Test authentication
  const authSuccess = await testAuthentication();
  if (authSuccess) {
    await testTokenRefresh();
    await testAuthenticatedEndpoint();
  }
  
  // If auth-only flag is set, exit after auth tests
  if (CONFIG.AUTH_ONLY) {
    console.log(`${colors.yellow}Auth-only flag set, skipping remaining tests${colors.reset}`);
    printSummary();
    process.exit(state.testResults.failed > 0 ? 1 : 0);
  }
  
  // Test API root endpoint
  await testApiRoot();
  
  // Test key endpoints
  await testKeyEndpoints();
  
  // Test frontend-backend integration if frontend is available
  if (frontendAvailable) {
    await testFrontendBackendIntegration();
  } else {
    console.log(`${colors.yellow}Frontend is not available. Skipping frontend-backend integration tests.${colors.reset}`);
  }
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  process.exit(state.testResults.failed > 0 ? 1 : 0);
}

function printSummary() {
  console.log(`\n${colors.magenta}=== Test Summary ====${colors.reset}`);
  console.log(`${colors.white}Total Tests: ${state.testResults.total}${colors.reset}`);
  console.log(`${colors.green}Passed: ${state.testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${state.testResults.failed}${colors.reset}`);
  
  const passRate = state.testResults.total > 0 ? 
    Math.round((state.testResults.passed / state.testResults.total) * 100) : 0;
  
  console.log(`${colors.cyan}Pass Rate: ${passRate}%${colors.reset}`);
  
  if (state.testResults.failed > 0) {
    console.log(`${colors.red}Integration Test Result: FAILED${colors.reset}`);
  } else if (state.testResults.passed > 0) {
    console.log(`${colors.green}Integration Test Result: PASSED${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Integration Test Result: NO TESTS RUN${colors.reset}`);
  }
}

// Run the tests
main().catch(error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});
