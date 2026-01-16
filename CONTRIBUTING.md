# Contributing to HRM Platform

Thank you for considering contributing to the HRM Platform! We welcome contributions from the community.

## 📋 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/hrm-platform.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Add some feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## 🎯 Pull Request Process

1. **Update documentation** if you're adding new features
2. **Add tests** for new functionality
3. **Follow code style** guidelines (see below)
4. **Update CHANGELOG.md** with your changes
5. **Ensure all tests pass** before submitting
6. **Get at least 2 approvals** from maintainers

## 📝 Code Style

### Backend (PHP/Laravel)

- Follow PSR-12 coding standards
- Use meaningful variable and function names
- Add PHPDoc comments for classes and methods
- Run `./vendor/bin/php-cs-fixer fix` before committing

```php
/**
 * Create a new employee record.
 *
 * @param  array  $data
 * @return Employee
 */
public function createEmployee(array $data): Employee
{
    // Implementation
}
```

### Frontend (React/TypeScript)

- Follow Airbnb JavaScript Style Guide
- Use TypeScript for type safety
- Use functional components with hooks
- Run `npm run lint` before committing

```tsx
interface EmployeeProps {
  id: string;
  name: string;
}

export const Employee: React.FC<EmployeeProps> = ({ id, name }) => {
  // Implementation
};
```

### Mobile (Flutter/Dart)

- Follow official Dart style guide
- Use meaningful widget and variable names
- Run `dart format .` before committing

```dart
class EmployeeWidget extends StatelessWidget {
  final String employeeId;
  final String employeeName;

  const EmployeeWidget({
    required this.employeeId,
    required this.employeeName,
  });

  @override
  Widget build(BuildContext context) {
    // Implementation
  }
}
```

## 🧪 Testing Requirements

- **Backend**: Minimum 80% code coverage
- **Frontend**: Test critical user flows
- **Mobile**: Unit tests for business logic

```bash
# Run all tests
./scripts/run-tests.sh

# Run specific tests
cd backend && php artisan test
cd frontend && npm run test
cd mobile && flutter test
```

## 📚 Documentation

- Update README.md if adding new features
- Add inline comments for complex logic
- Update API documentation for new endpoints
- Create migration guides for breaking changes

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**: OS, browser, versions

## 💡 Feature Requests

When requesting features, please:

1. **Describe the feature**: Clear description
2. **Use case**: Why is this needed?
3. **Alternatives**: Any alternatives considered?
4. **Additional context**: Screenshots, mockups, etc.

## 🏷️ Commit Message Guidelines

Follow conventional commits:

```
feat: Add employee bulk import
fix: Correct payroll calculation bug
docs: Update API documentation
style: Format code with prettier
refactor: Simplify authentication logic
test: Add tests for leave module
chore: Update dependencies
```

## 📦 Module Structure

When adding new modules, follow DDD structure:

```
Modules/
├── YourModule/
│   ├── Domain/
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Events/
│   │   └── Repositories/
│   ├── Application/
│   │   ├── UseCases/
│   │   ├── DTOs/
│   │   └── Services/
│   ├── Infrastructure/
│   │   ├── Repositories/
│   │   └── Eloquent/
│   └── Presentation/
│       ├── Controllers/
│       └── Requests/
```

## 🔒 Security

- **Never commit secrets** or credentials
- **Sanitize user input** properly
- **Follow security best practices**
- Report security vulnerabilities to security@hrm-platform.com

## 📞 Need Help?

- 💬 Join our [Discord](https://discord.gg/hrm-platform)
- 📧 Email: dev@hrm-platform.com
- 📚 Read the [documentation](https://docs.hrm-platform.com)

Thank you for contributing! 🎉
