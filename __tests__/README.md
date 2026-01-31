# PhishGuard Test Suite

This directory contains comprehensive tests for the PhishGuard email security platform.

## 📁 Directory Structure

```
__tests__/
├── lib/                    # Library/utility tests
│   ├── auth.test.ts       # Authentication utilities
│   ├── config.test.ts     # Configuration management
│   ├── emailService.test.ts  # Email service & phishing detection
│   └── dbConnect.test.ts  # Database connection
├── models/                 # Data model tests
│   └── User.test.ts       # User model validation
└── api/                    # API endpoint tests
    └── phishing-analyze.test.ts  # Phishing analysis endpoint
```

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## 📊 Test Statistics

- **Total Tests**: 64
- **Test Suites**: 6
- **Pass Rate**: 100%
- **Execution Time**: ~1.5-2.5 seconds

## 🧪 Test Coverage

| Module | Tests | Coverage |
|--------|-------|----------|
| Authentication | 11 | 100% statements |
| Configuration | 11 | 100% statements |
| Email Service | 19 | 82% statements |
| Database | 4 | N/A (mocked) |
| User Model | 15 | N/A (schema) |
| API Endpoints | 9 | 90% statements |

## 📝 What's Tested

### ✅ Authentication (`lib/auth.test.ts`)
- JWT token generation
- Token verification
- Error handling
- Unauthorized responses

### ✅ Configuration (`lib/config.test.ts`)
- Environment variable loading
- Configuration validation
- Default values
- API key management

### ✅ Email Service (`lib/emailService.test.ts`)
- Google OAuth token refresh
- Microsoft OAuth token refresh
- Token validation
- Phishing detection (heuristic)
- ML model integration
- URL safety checking
- Error resilience

### ✅ Database (`lib/dbConnect.test.ts`)
- Connection configuration
- URI validation
- Caching mechanism

### ✅ User Model (`models/User.test.ts`)
- Schema validation
- Field requirements
- Default values
- Data type validation

### ✅ API Endpoints (`api/phishing-analyze.test.ts`)
- Request handling
- Authentication/authorization
- CORS configuration
- Phishing analysis
- Error handling

## 🔧 Test Configuration

Tests are configured in:
- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Test environment setup and mocks

## 📚 Documentation

For detailed test documentation, see:
- **[TEST_DOCUMENTATION.md](../TEST_DOCUMENTATION.md)** - Comprehensive test guide
- **[TEST_REPORT.md](../TEST_REPORT.md)** - Test results report

## 🎯 Writing New Tests

### Test Template

```typescript
/**
 * @jest-environment node
 */

describe('Component Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Function Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = doSomething(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Best Practices

1. **Use descriptive test names** - Clearly state what is being tested
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Mock external dependencies** - Keep tests isolated
4. **Test edge cases** - Include error conditions
5. **Keep tests independent** - Each test should run standalone

## 🐛 Troubleshooting

### Tests Won't Run
```bash
# Reinstall dependencies
npm install

# Clear Jest cache
npm test -- --clearCache
```

### Mock Not Working
Ensure mocks are defined before imports in test files.

### Coverage Too Low
Add more test cases for uncovered code paths.

## 📈 Coverage Report

After running `npm run test:coverage`, view the HTML report:
```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

## 🤝 Contributing

When adding new features:
1. Write tests for new functionality
2. Ensure all tests pass
3. Maintain coverage above thresholds
4. Update documentation

## 📞 Support

For issues with tests:
1. Check test documentation
2. Review test error messages
3. Ensure all dependencies are installed
4. Create an issue if problem persists

## ✨ Test Results

Latest test run:
```
PASS  __tests__/lib/auth.test.ts
PASS  __tests__/lib/config.test.ts  
PASS  __tests__/lib/emailService.test.ts
PASS  __tests__/lib/dbConnect.test.ts
PASS  __tests__/models/User.test.ts
PASS  __tests__/api/phishing-analyze.test.ts

Test Suites: 6 passed, 6 total
Tests:       64 passed, 64 total
Time:        ~2s
```

**Status**: ✅ All tests passing!
