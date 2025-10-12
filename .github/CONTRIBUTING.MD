# Contributing to HireMe.AI

Thank you for your interest in contributing to HireMe.AI! We welcome contributions from the community and appreciate your help in making this project better.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- OpenAI API key (for testing)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HireMe.AI.git
   cd HireMe.AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key to .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the shadcn/ui component patterns
- Ensure accessibility (a11y) compliance

### API Guidelines
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add input validation
- Include proper TypeScript types

## 🐛 Reporting Issues

### Before Creating an Issue
1. Check if the issue already exists
2. Try the latest version
3. Search the documentation

### Issue Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Before Requesting a Feature
1. Check if the feature already exists
2. Consider if it aligns with the project goals
3. Think about the implementation complexity

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🔧 Making Changes

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow the conventional commit format:
```
type(scope): description

feat(api): add resume analysis endpoint
fix(ui): resolve button styling issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide a clear description
   - Link related issues

## 📝 Pull Request Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information about the PR.
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines
- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases and error conditions

## 📚 Documentation

### Updating Documentation
- Update README.md for major changes
- Update API_DOCUMENTATION.md for API changes
- Add inline comments for complex code
- Update type definitions

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up-to-date

## 🏗 Architecture

### Project Structure
```
app/                 # Next.js App Router
├── api/            # API routes
├── (pages)/        # Page components
components/         # Reusable components
├── ui/            # shadcn/ui components
hooks/             # Custom React hooks
lib/               # Utility functions
types/             # TypeScript interfaces
```

### Key Patterns
- **API Routes**: Use Next.js 14 App Router API routes
- **Components**: Functional components with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context
- **Error Handling**: Comprehensive error boundaries

## 🚀 Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Public or private harassment
- Publishing private information
- Other unprofessional conduct

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Email**: dev@hireme-ai.com for direct contact

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to HireMe.AI! 🎉
