# Contributing to Omcommerce

Thank you for your interest in contributing to omcommerce! We appreciate your time and effort. Before you start contributing, please take a moment to read through this document to understand our development process.

## Getting Started

1. Fork the repository to your GitHub account.
2. Clone your forked repository to your local machine:
```bash
   git clone git@github.com:omomcode/omcommerce.git
```
3. Create a soft link in your strapi project to plugin folder
```bash
   ln -s <...>/omcommerce /strapi-project/src/plugins/omcommerce 
```
4. Create a new branch for your feature or bug fix:
```bash
   git checkout -b feature-branch
```
5. Make your changes and commit them:
```bash
   git add .
   git commit -m "Your descriptive commit message"
```
6. Push the changes to your fork:
```bash
   git push origin feature-branch
```
7. Open a pull request (PR) against the main branch of the original repository.

## Code Style

Please follow the coding style and conventions used in the project. If there's a specific style guide, linter, or coding standard, adhere to it.

## Testing

Ensure that your changes do not break existing functionality. If applicable, provide tests for your code. Run existing tests before submitting a pull request.

## Documentation

Update the documentation to reflect your changes if necessary. This includes the README, code comments, and any other relevant documentation.

## Issue Tracker

Before starting work on a new feature or bug fix, check the issue tracker to see if the task is already in progress or if a similar issue has been reported. If not, open a new issue to discuss the proposed change.

## Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.

## License

By contributing to Omcommerce, you agree that your contributions will be licensed under the [project license](LICENSE).

## Acknowledgments

Thank you for your contribution! We truly appreciate your time and effort to make Omcommerce better.

Happy coding!
