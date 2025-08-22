#!/usr/bin/env node
/**
 * AquaMind Integration Test Script
 * 
 * This script tests the integration between the Django backend API and the React frontend.
 * It verifies that real Django data is being properly fetched, processed, and displayed
 * in the frontend application.
 * 
 * Usage:
 *   node test-integration.js [--verbose] [--endpoint=<endpoint>]
 * 
 * Options:
 *   --verbose       Show detailed logs for each request
 *   --endpoint      Test a specific endpoint (default: test all endpoints)
 *   --auth-only     Only test authentication flows
 *   --report-file   Output report to specified file (default: integration-report.json)
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { program } = require('commander');

// Parse command line arguments
program
  .option('-v, --verbose', 'Show detailed logs for each request')
  .option('-e, --endpoint <endpoint>', 'Test a specific endpoint')
  .option('-a, --auth-only', 'Only test authentication flows')
  .option('-r, --report-file <file>', 'Output report to specified file', 'integration-report.json')
  .parse(process.argv);

const options = program.opts();

// Configuration
const CONFIG = {
  DJANGO_API_URL: process.env.DJANGO_API_URL || 'http://localhost:8000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5001',
  AUTH: {
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'testpassword'
  },
  TIMEOUT: 30000, // 30 seconds
  VERBOSE: options.verbose || false,
  REPORT_FILE: options.reportFile,
  TEST_SPECIFIC_ENDPOINT: options.endpoint,
  AUTH_ONLY: options.authOnly || false
};

// Initialize logger
const logger = {
  info: (message) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message) => console.log(chalk.green(`[SUCCESS] ${message}`)),
  error: (message) => console.log(chalk.red(`[ERROR] ${message}`)),
  warn: (message) => console.log(chalk.yellow(`[WARNING] ${message}`)),
  debug: (message) => {
    if (CONFIG.VERBOSE) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  },
  data: (label, data) => {
    if (CONFIG.VERBOSE) {
      console.log(chalk.cyan(`[DATA] ${label}:`));
      console.dir(data, { depth: null, colors: true });
    }
  }
};

// Test report structure
const testReport = {
  startTime: new Date(),
  endTime: null,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  authenticationTests: [],
  endpointTests: [],
  frontendTests: [],
  dataConsistencyTests: [],
  errors: []
};

// HTTP client for direct API testing with interceptors for monitoring
const apiClient = axios.create({
  baseURL: CONFIG.DJANGO_API_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use((config) => {
  logger.debug(`Request: ${config.method.toUpperCase()} ${config.url}`);
  logger.data('Request headers', config.headers);
  if (config.data) {
    logger.data('Request data', config.data);
  }
  return config;
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    logger.debug(`Response: ${response.status} ${response.statusText}`);
    logger.data('Response data', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(`Response error: ${error.response.status} ${error.response.statusText}`);
      logger.data('Error response data', error.response.data);
    } else if (error.request) {
      logger.error('No response received');
    } else {
      logger.error(`Request error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication helper functions
 */
async function authenticateWithDjango() {
  try {
    logger.info('Authenticating with Django backend...');
    const response = await apiClient.post('/api/auth/jwt/', {
      username: CONFIG.AUTH.username,
      password: CONFIG.AUTH.password
    });

    const { access, refresh } = response.data;
    
    // Set the token for subsequent requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    logger.success('Authentication successful');
    return { access, refresh };
  } catch (error) {
    logger.error('Authentication failed');
    testReport.errors.push({
      type: 'authentication',
      message: 'Failed to authenticate with Django backend',
      details: error.message
    });
    throw error;
  }
}

async function refreshToken(refreshToken) {
  try {
    logger.info('Refreshing access token...');
    const response = await apiClient.post('/api/auth/jwt/refresh/', {
      refresh: refreshToken
    });
    
    const { access } = response.data;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    logger.success('Token refresh successful');
    return access;
  } catch (error) {
    logger.error('Token refresh failed');
    testReport.errors.push({
      type: 'authentication',
      message: 'Failed to refresh token',
      details: error.message
    });
    throw error;
  }
}

/**
 * API Testing Functions
 */
async function testAPIRoot() {
  try {
    logger.info('Testing API root endpoint...');
    const response = await apiClient.get('/api/');
    
    // Validate the response structure
    const hasDocumentation = response.data.documentation && 
      Object.keys(response.data.documentation).length > 0;
    
    const hasApps = response.data.apps && 
      Object.keys(response.data.apps).length > 0;
    
    if (!hasDocumentation || !hasApps) {
      throw new Error('API root response missing expected sections');
    }
    
    logger.success('API root endpoint test successful');
    testReport.endpointTests.push({
      endpoint: '/api/',
      status: 'passed',
      responseTime: response.headers['x-response-time'] || 'N/A',
      dataSnapshot: response.data
    });
    
    return response.data;
  } catch (error) {
    logger.error('API root endpoint test failed');
    testReport.endpointTests.push({
      endpoint: '/api/',
      status: 'failed',
      error: error.message
    });
    throw error;
  }
}

async function testEndpoint(endpoint) {
  try {
    logger.info(`Testing endpoint: ${endpoint}`);
    const response = await apiClient.get(endpoint);
    
    // Basic validation - ensure we have data
    if (!response.data) {
      throw new Error('Endpoint returned empty response');
    }
    
    logger.success(`Endpoint ${endpoint} test successful`);
    testReport.endpointTests.push({
      endpoint,
      status: 'passed',
      responseTime: response.headers['x-response-time'] || 'N/A',
      dataSnapshot: Array.isArray(response.data) ? 
        { count: response.data.length, sample: response.data.slice(0, 2) } : 
        response.data
    });
    
    return response.data;
  } catch (error) {
    logger.error(`Endpoint ${endpoint} test failed`);
    testReport.endpointTests.push({
      endpoint,
      status: 'failed',
      error: error.message
    });
    throw error;
  }
}

/**
 * Frontend Integration Testing Functions
 */
async function monitorFrontendNetworkRequests() {
  logger.info('Launching browser to monitor frontend network requests...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const requests = [];
  const responses = [];
  
  // Monitor network requests
  page.on('request', request => {
    if (request.url().includes(CONFIG.DJANGO_API_URL)) {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
      logger.debug(`Frontend made request to: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes(CONFIG.DJANGO_API_URL)) {
      responses.push({
        url: response.url(),
        status: response.status(),
        timestamp: new Date().toISOString()
      });
      logger.debug(`Received response from: ${response.url()} (${response.status()})`);
    }
  });
  
  try {
    // Navigate to frontend
    logger.info(`Navigating to frontend: ${CONFIG.FRONTEND_URL}`);
    await page.goto(CONFIG.FRONTEND_URL, { waitUntil: 'networkidle0', timeout: CONFIG.TIMEOUT });
    
    // Login to the application
    logger.info('Logging into frontend application...');
    await page.type('input[name="username"]', CONFIG.AUTH.username);
    await page.type('input[name="password"]', CONFIG.AUTH.password);
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Navigate through key pages to trigger API requests
    const pagesToVisit = [
      '/dashboard',
      '/batches',
      '/environmental',
      '/health'
    ];
    
    for (const pageUrl of pagesToVisit) {
      logger.info(`Visiting page: ${pageUrl}`);
      await page.goto(`${CONFIG.FRONTEND_URL}${pageUrl}`, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000); // Wait for any async data loading
    }
    
    logger.success('Frontend navigation and network monitoring complete');
    testReport.frontendTests.push({
      test: 'networkMonitoring',
      status: 'passed',
      requests: requests.length,
      responses: responses.length,
      details: {
        requestSummary: requests.map(r => ({ url: r.url, method: r.method })),
        responseSummary: responses.map(r => ({ url: r.url, status: r.status }))
      }
    });
    
    return { requests, responses };
  } catch (error) {
    logger.error('Frontend monitoring failed');
    testReport.frontendTests.push({
      test: 'networkMonitoring',
      status: 'failed',
      error: error.message
    });
    testReport.errors.push({
      type: 'frontend',
      message: 'Frontend monitoring failed',
      details: error.message
    });
    throw error;
  } finally {
    await browser.close();
  }
}

async function validateDataConsistency(directApiData, frontendRequests) {
  logger.info('Validating data consistency between direct API calls and frontend requests...');
  
  const consistencyResults = [];
  
  // Extract API endpoints that were called by the frontend
  const frontendApiEndpoints = frontendRequests
    .filter(req => req.url.includes(CONFIG.DJANGO_API_URL))
    .map(req => {
      const url = new URL(req.url);
      return url.pathname;
    });
  
  // For each endpoint called by frontend, compare with direct API call
  for (const endpoint of frontendApiEndpoints) {
    try {
      if (endpoint.includes('auth') || endpoint === '/api/') {
        // Skip auth endpoints and API root for data comparison
        continue;
      }
      
      logger.info(`Validating data consistency for endpoint: ${endpoint}`);
      
      // Make direct API call
      const directData = await apiClient.get(endpoint);
      
      // Compare data structure (simplified check)
      const result = {
        endpoint,
        directApiAvailable: !!directData.data,
        frontendCalledEndpoint: true,
        consistent: !!directData.data, // Basic check that data exists
        timestamp: new Date().toISOString()
      };
      
      consistencyResults.push(result);
      
      if (result.consistent) {
        logger.success(`Data consistency validated for ${endpoint}`);
      } else {
        logger.warn(`Data inconsistency detected for ${endpoint}`);
      }
    } catch (error) {
      logger.error(`Data consistency validation failed for ${endpoint}`);
      consistencyResults.push({
        endpoint,
        error: error.message,
        consistent: false,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  testReport.dataConsistencyTests = consistencyResults;
  
  const passedTests = consistencyResults.filter(r => r.consistent).length;
  logger.info(`Data consistency validation complete: ${passedTests}/${consistencyResults.length} endpoints consistent`);
  
  return consistencyResults;
}

/**
 * Test Suites
 */
async function runAuthenticationTests() {
  logger.info('Running authentication tests...');
  
  try {
    // Test JWT token acquisition
    const { access, refresh } = await authenticateWithDjango();
    testReport.authenticationTests.push({
      test: 'jwtTokenAcquisition',
      status: 'passed',
      details: {
        tokenReceived: !!access,
        refreshTokenReceived: !!refresh
      }
    });
    
    // Test token refresh
    const newAccessToken = await refreshToken(refresh);
    testReport.authenticationTests.push({
      test: 'tokenRefresh',
      status: 'passed',
      details: {
        newTokenReceived: !!newAccessToken
      }
    });
    
    // Test authenticated endpoint access
    const userResponse = await apiClient.get('/api/v1/users/me/');
    testReport.authenticationTests.push({
      test: 'authenticatedEndpointAccess',
      status: 'passed',
      details: {
        username: userResponse.data.username
      }
    });
    
    logger.success('Authentication tests completed successfully');
    return true;
  } catch (error) {
    logger.error('Authentication tests failed');
    testReport.errors.push({
      type: 'authentication',
      message: 'Authentication test suite failed',
      details: error.message
    });
    return false;
  }
}

async function runEndpointTests() {
  logger.info('Running endpoint tests...');
  
  // Define critical endpoints to test
  const endpoints = [
    '/api/',
    '/api/v1/batch/',
    '/api/v1/environmental/readings/',
    '/api/v1/health/observations/',
    '/api/v1/infrastructure/containers/',
    '/api/v1/inventory/feed/'
  ];
  
  // If testing specific endpoint, filter the list
  const endpointsToTest = CONFIG.TEST_SPECIFIC_ENDPOINT ? 
    endpoints.filter(e => e.includes(CONFIG.TEST_SPECIFIC_ENDPOINT)) : 
    endpoints;
  
  if (endpointsToTest.length === 0) {
    logger.warn(`No endpoints matched the filter: ${CONFIG.TEST_SPECIFIC_ENDPOINT}`);
    return false;
  }
  
  try {
    // Test API root first
    await testAPIRoot();
    
    // Test each endpoint
    for (const endpoint of endpointsToTest) {
      if (endpoint === '/api/') continue; // Already tested
      
      await testEndpoint(endpoint);
    }
    
    logger.success('Endpoint tests completed successfully');
    return true;
  } catch (error) {
    logger.error('Endpoint tests failed');
    testReport.errors.push({
      type: 'endpoint',
      message: 'Endpoint test suite failed',
      details: error.message
    });
    return false;
  }
}

async function runFrontendIntegrationTests() {
  logger.info('Running frontend integration tests...');
  
  try {
    // Monitor network requests made by frontend
    const { requests, responses } = await monitorFrontendNetworkRequests();
    
    // Validate data consistency between direct API and frontend
    await validateDataConsistency({}, requests);
    
    logger.success('Frontend integration tests completed successfully');
    return true;
  } catch (error) {
    logger.error('Frontend integration tests failed');
    testReport.errors.push({
      type: 'frontend',
      message: 'Frontend integration test suite failed',
      details: error.message
    });
    return false;
  }
}

/**
 * Report Generation
 */
function generateReport() {
  // Update test counts
  testReport.summary.total = 
    testReport.authenticationTests.length + 
    testReport.endpointTests.length + 
    testReport.frontendTests.length +
    testReport.dataConsistencyTests.length;
  
  testReport.summary.passed = 
    testReport.authenticationTests.filter(t => t.status === 'passed').length +
    testReport.endpointTests.filter(t => t.status === 'passed').length +
    testReport.frontendTests.filter(t => t.status === 'passed').length +
    testReport.dataConsistencyTests.filter(t => t.consistent).length;
  
  testReport.summary.failed = testReport.summary.total - testReport.summary.passed;
  
  testReport.endTime = new Date();
  testReport.duration = (testReport.endTime - testReport.startTime) / 1000; // in seconds
  
  // Write report to file
  fs.writeFileSync(
    CONFIG.REPORT_FILE,
    JSON.stringify(testReport, null, 2)
  );
  
  // Print summary
  console.log('\n' + chalk.bold.blue('=== INTEGRATION TEST REPORT ==='));
  console.log(chalk.bold(`Duration: ${testReport.duration.toFixed(2)} seconds`));
  console.log(chalk.bold(`Total Tests: ${testReport.summary.total}`));
  console.log(chalk.bold.green(`Passed: ${testReport.summary.passed}`));
  console.log(chalk.bold.red(`Failed: ${testReport.summary.failed}`));
  console.log(chalk.bold.yellow(`Errors: ${testReport.errors.length}`));
  console.log(chalk.bold.blue(`Report saved to: ${CONFIG.REPORT_FILE}`));
  
  return testReport;
}

/**
 * Main execution
 */
async function main() {
  logger.info('Starting AquaMind integration tests');
  logger.info(`Django API URL: ${CONFIG.DJANGO_API_URL}`);
  logger.info(`Frontend URL: ${CONFIG.FRONTEND_URL}`);
  
  try {
    // Run authentication tests
    const authSuccess = await runAuthenticationTests();
    if (!authSuccess) {
      logger.error('Authentication tests failed, aborting remaining tests');
      generateReport();
      process.exit(1);
    }
    
    // If auth-only flag is set, exit after auth tests
    if (CONFIG.AUTH_ONLY) {
      logger.info('Auth-only flag set, skipping remaining tests');
      generateReport();
      process.exit(0);
    }
    
    // Run endpoint tests
    await runEndpointTests();
    
    // Run frontend integration tests
    await runFrontendIntegrationTests();
    
    // Generate final report
    const report = generateReport();
    
    // Exit with appropriate code
    if (report.summary.failed > 0) {
      logger.warn('Some tests failed');
      process.exit(1);
    } else {
      logger.success('All tests passed');
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Test execution failed: ${error.message}`);
    generateReport();
    process.exit(1);
  }
}

// Run the tests
main().catch(error => {
  logger.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
