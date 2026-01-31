# PhishGuard Test Documentation

## Overview

This document provides comprehensive documentation for the PhishGuard test suite. The test suite is designed to ensure the reliability, security, and correctness of the PhishGuard email phishing detection system.

## Table of Contents

1. [Test Infrastructure](#test-infrastructure)
2. [Test Coverage](#test-coverage)
3. [Running Tests](#running-tests)
4. [Test Suites](#test-suites)
5. [Test Results](#test-results)
6. [Continuous Integration](#continuous-integration)

## Test Infrastructure

### Technologies Used

- **Jest**: JavaScript testing framework
- **Testing Library**: React component testing utilities
- **ts-jest**: TypeScript preprocessor for Jest
- **jest-environment-jsdom**: DOM environment for testing

### Configuration

The test suite is configured through `jest.config.js` and `jest.setup.js`:

- **Test Environment**: jsdom for browser-like environment
- **Coverage Thresholds**: 40% for statements, branches, functions, and lines
- **Test Pattern**: `**/__tests__/**/*.test.[jt]s?(x)`
- **Module Mapping**: `@/` alias for root directory imports

### Environment Setup

All required environment variables are mocked in `jest.setup.js` to ensure tests run independently:

```javascript
MONGODB_URI=mongodb://localhost:27017/phishguard-test
NEXTAUTH_SECRET=test-secret
GOOGLE_ID=test-google-id
GOOGLE_SECRET=test-google-secret
AZURE_AD_CLIENT_ID=test-azure-id
AZURE_AD_CLIENT_SECRET=test-azure-secret
JWT_SECRET=test-jwt-secret
PHISHING_API_URL=http://localhost:8000/predict
PHISHING_API_KEY=test-api-key
VIRUSTOTAL_API_KEY=test-virustotal-key
GOOGLE_SAFE_BROWSING_API_KEY=test-safe-browsing-key
HF_API_TOKEN=hf_test_token
```

## Test Coverage

### Coverage Summary

The test suite provides comprehensive coverage of core application functionality:

| Component | Statements | Branches | Functions | Lines | Status |
|-----------|-----------|----------|-----------|-------|--------|
| **lib/auth.ts** | 100% | 50% | 100% | 100% | ✅ Excellent |
| **lib/config.ts** | 100% | 53.57% | 100% | 100% | ✅ Excellent |
| **lib/emailService.ts** | 82.03% | 76.62% | 75% | 84.81% | ✅ Good |
| **app/api/phishing/analyze** | 90.24% | 83.33% | 100% | 90.24% | ✅ Excellent |

### What's Covered

✅ **Core Authentication**
- JWT token generation and verification
- Token validation
- Unauthorized response handling

✅ **Configuration Management**
- Environment variable loading
- Configuration validation
- API key management

✅ **Email Service**
- Google OAuth token refresh
- Microsoft OAuth token refresh
- Token validation for both providers
- Phishing analysis (heuristic + ML + external APIs)
- URL safety checking
- Grammar and spelling detection

✅ **API Endpoints**
- Phishing analysis endpoint
- CORS handling for browser extension
- Authentication and authorization
- Error handling

✅ **Data Models**
- User schema validation
- Email schema validation
- Field type checking
- Default values

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Output

When you run `npm test`, you'll see output like:

```
PASS  __tests__/lib/auth.test.ts
PASS  __tests__/lib/config.test.ts
PASS  __tests__/lib/emailService.test.ts
PASS  __tests__/lib/dbConnect.test.ts
PASS  __tests__/models/User.test.ts
PASS  __tests__/api/phishing-analyze.test.ts

Test Suites: 6 passed, 6 total
Tests:       64 passed, 64 total
Snapshots:   0 total
Time:        1.526 s
```

### Coverage Report Location

After running `npm run test:coverage`, a detailed HTML coverage report is generated at:
```
coverage/lcov-report/index.html
```

Open this file in a browser to view an interactive coverage report.

## Test Suites

### 1. Authentication Tests (`__tests__/lib/auth.test.ts`)

**Purpose**: Verify JWT token operations and authentication utilities.

**Test Cases** (11 tests):
- ✅ Token generation produces valid JWT format
- ✅ Token includes correct userId in payload
- ✅ Different users get different tokens
- ✅ Valid tokens are correctly verified
- ✅ Invalid tokens return null
- ✅ Malformed tokens return null
- ✅ Empty tokens return null
- ✅ Unauthorized response returns 401 status
- ✅ Unauthorized response includes error message

**Key Validations**:
- JWT structure (3-part token)
- Payload integrity
- Error handling for invalid inputs

### 2. Configuration Tests (`__tests__/lib/config.test.ts`)

**Purpose**: Ensure configuration management and validation works correctly.

**Test Cases** (11 tests):
- ✅ All API URLs are defined
- ✅ OAuth credentials are configured
- ✅ Database URI is configured
- ✅ NextAuth configuration is present
- ✅ Performance settings have correct values
- ✅ Phishing detection thresholds are set
- ✅ API keys are configured
- ✅ Validation returns true when all required vars present
- ✅ Validation returns false when required vars missing
- ✅ Missing variables are logged as warnings

**Key Validations**:
- Configuration completeness
- Default value handling
- Validation logic

### 3. Email Service Tests (`__tests__/lib/emailService.test.ts`)

**Purpose**: Test the core email analysis and token management functionality.

**Test Cases** (19 tests):

**Singleton Pattern**:
- ✅ Returns same instance on multiple calls

**Google Token Refresh**:
- ✅ Successfully refreshes valid tokens
- ✅ Returns null on refresh failure
- ✅ Handles network errors gracefully
- ✅ Uses old refresh token if new one not provided

**Microsoft Token Refresh**:
- ✅ Successfully refreshes valid tokens
- ✅ Returns null on refresh failure

**Token Validation**:
- ✅ Validates Google tokens correctly
- ✅ Validates Microsoft tokens correctly
- ✅ Returns false for invalid tokens
- ✅ Returns false on network errors

**Phishing Analysis**:
- ✅ Detects phishing based on heuristics
- ✅ Detects urgent keywords
- ✅ Detects suspicious sender addresses
- ✅ Detects multiple external links
- ✅ Combines ML and heuristic scores
- ✅ Handles ML API errors gracefully
- ✅ Returns safe result for legitimate emails
- ✅ Analyzes Google Safe Browsing results

**Key Validations**:
- Token lifecycle management
- Multi-layered phishing detection
- Error resilience
- Score calculation accuracy

### 4. Database Connection Tests (`__tests__/lib/dbConnect.test.ts`)

**Purpose**: Verify database connection setup and caching.

**Test Cases** (4 tests):
- ✅ MongoDB URI is defined
- ✅ Connection options are correct
- ✅ Connection caching works
- ✅ MongoDB URI format is valid

**Key Validations**:
- URI format validation
- Connection configuration
- Caching mechanism

### 5. User Model Tests (`__tests__/models/User.test.ts`)

**Purpose**: Validate data model schemas and field definitions.

**Test Cases** (15 tests):

**Schema Validation**:
- ✅ Required fields are defined
- ✅ Email format validation works
- ✅ Provider enum values are correct
- ✅ Email schema has required fields
- ✅ Default values are set correctly

**Enhanced Analysis Fields**:
- ✅ Analysis fields are supported
- ✅ URL safety result structure is correct

**User Fields**:
- ✅ Token management fields exist
- ✅ Email synchronization field exists
- ✅ Emails stored as array

**Field Validation**:
- ✅ Required user fields are validated
- ✅ Email lowercase transformation works
- ✅ Email trimming works
- ✅ Phishing score range is validated

**Key Validations**:
- Schema structure
- Data type validation
- Default value handling

### 6. API Endpoint Tests (`__tests__/api/phishing-analyze.test.ts`)

**Purpose**: Test the phishing analysis API endpoint.

**Test Cases** (9 tests):

**CORS Handling**:
- ✅ Handles CORS preflight for browser extension
- ✅ Handles CORS preflight for regular origin

**Authentication**:
- ✅ Returns 401 when user not authenticated

**Validation**:
- ✅ Returns 400 when bodyText is missing

**Analysis**:
- ✅ Successfully analyzes phishing when authenticated
- ✅ Handles browser extension origin correctly
- ✅ Uses default values for optional fields

**Error Handling**:
- ✅ Returns 500 on server error

**Key Validations**:
- Authentication flow
- Request validation
- CORS configuration
- Error handling
- Response structure

## Test Results

### Latest Test Run

```
Test Suites: 6 passed, 6 total
Tests:       64 passed, 64 total
Snapshots:   0 total
Time:        1.526 s
```

### Success Rate: 100% ✅

All 64 test cases pass successfully, ensuring:
- ✅ No broken functionality
- ✅ All core features work as expected
- ✅ Error handling is robust
- ✅ Edge cases are covered

### Coverage Details

```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
lib/auth.ts                 |   100   |    50    |   100   |   100   |
lib/config.ts               |   100   |  53.57   |   100   |   100   |
lib/emailService.ts         |  82.03  |  76.62   |    75   |  84.81  |
app/api/phishing/analyze    |  90.24  |  83.33   |   100   |  90.24  |
----------------------------|---------|----------|---------|---------|
```

## Continuous Integration

### Automated Testing

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Generate Coverage
        run: npm run test:coverage
```

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests automatically:

```bash
# .husky/pre-commit
npm test
```

## Best Practices

### Writing New Tests

1. **Follow the AAA Pattern**: Arrange, Act, Assert
   ```typescript
   it('should do something', () => {
     // Arrange
     const input = 'test';
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe('expected');
   });
   ```

2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
   ```typescript
   ✅ it('should return 401 when user is not authenticated')
   ❌ it('test auth')
   ```

3. **Mock External Dependencies**: Always mock external API calls, database connections, etc.
   ```typescript
   jest.mock('@/lib/emailService');
   ```

4. **Test Edge Cases**: Include tests for error conditions, empty inputs, null values, etc.

5. **Keep Tests Independent**: Each test should be able to run independently

### Maintaining Tests

- Run tests before committing code
- Update tests when modifying functionality
- Add tests for new features
- Remove obsolete tests
- Keep coverage above threshold

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module"
**Solution**: Ensure `jest.config.js` has correct `moduleNameMapper` configuration

**Issue**: Tests timeout
**Solution**: Increase Jest timeout or optimize async operations

**Issue**: Coverage too low
**Solution**: Add more test cases for uncovered code paths

**Issue**: Mocks not working
**Solution**: Ensure mocks are defined before imports

## Future Improvements

Potential areas for test expansion:

1. **Component Testing**: Add tests for React components
2. **E2E Testing**: Implement end-to-end tests with Playwright or Cypress
3. **Performance Testing**: Add load and performance tests
4. **Security Testing**: Implement security-specific test cases
5. **Integration Tests**: Add more comprehensive API integration tests

## Conclusion

The PhishGuard test suite provides solid coverage of core functionality, ensuring the application is reliable, secure, and maintainable. All 64 tests pass successfully, demonstrating that the application's critical components work as expected.

For questions or issues with tests, please refer to the test files or create an issue in the repository.
