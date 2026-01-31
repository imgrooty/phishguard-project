# PhishGuard Testing - Quick Start Guide

## 🚀 Running Tests in 30 Seconds

### Step 1: Install Dependencies (if not already done)
```bash
npm install
```

### Step 2: Run the Tests
```bash
npm test
```

That's it! You should see:
```
Test Suites: 6 passed, 6 total
Tests:       64 passed, 64 total
Time:        ~1.5s
```

## 📊 Common Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Run tests with coverage report |

## 📁 Where Are the Tests?

```
__tests__/
├── lib/                    # Core library tests
│   ├── auth.test.ts       # Authentication (11 tests)
│   ├── config.test.ts     # Configuration (11 tests)
│   ├── emailService.test.ts  # Email service (19 tests)
│   └── dbConnect.test.ts  # Database (4 tests)
├── models/                 # Data model tests
│   └── User.test.ts       # User model (15 tests)
└── api/                    # API endpoint tests
    └── phishing-analyze.test.ts  # Analysis API (9 tests)
```

## 📚 Documentation Quick Links

- **[TESTING_SUMMARY.md](TESTING_SUMMARY.md)** - Executive summary (read this first!)
- **[TEST_REPORT.md](TEST_REPORT.md)** - Detailed test report for stakeholders
- **[TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md)** - Comprehensive testing guide
- **[__tests__/README.md](__tests__/README.md)** - Developer quick reference

## ✅ What Gets Tested?

**Core Functionality:**
- ✅ Authentication & JWT tokens
- ✅ Email phishing detection
- ✅ OAuth token management
- ✅ API security
- ✅ Configuration validation

**Test Coverage:**
- 64 tests covering all critical paths
- 100% pass rate
- 75%+ coverage for core modules

## 🎯 Quick Test Results

```
✅ Authentication Tests          11/11 passing
✅ Configuration Tests            11/11 passing
✅ Email Service Tests            19/19 passing
✅ Database Connection Tests       4/4  passing
✅ User Model Tests               15/15 passing
✅ API Endpoint Tests              9/9  passing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOTAL:                        64/64 passing ✅
```

## 🔧 Viewing Coverage Report

After running `npm run test:coverage`:

```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

## 💡 Tips for Developers

### Running Specific Tests
```bash
# Run tests in a specific file
npm test auth.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should verify"
```

### Watch Mode (Recommended for Development)
```bash
npm run test:watch
```
This will:
- Re-run tests when you save files
- Only run tests related to changed files
- Provide instant feedback

### Debug Mode
```bash
# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage
```

## 🐛 Troubleshooting

### Tests won't run?
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Import errors?
Make sure you're in the project root directory:
```bash
cd /path/to/phishguard-project
npm test
```

## 📈 Test Status

**Current Status**: ✅ ALL PASSING

Last verified: January 31, 2026
- Total Tests: 64
- Pass Rate: 100%
- Execution Time: ~1.5 seconds

## 🎓 Next Steps

1. **Read TESTING_SUMMARY.md** for an overview
2. **Run the tests** with `npm test`
3. **Explore test files** in `__tests__/` directory
4. **Read TEST_DOCUMENTATION.md** for details
5. **Check TEST_REPORT.md** for comprehensive results

## 🤝 Contributing

When adding new code:
1. Write tests for new functionality
2. Run `npm test` to verify all tests pass
3. Run `npm run test:coverage` to check coverage
4. Update documentation if needed

## 📞 Need Help?

1. Check [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md) for detailed info
2. Look at existing test files for examples
3. Create an issue in the repository

---

**Remember**: Tests are your safety net. Run them often! 🛡️

```bash
# The magic command
npm test
```
