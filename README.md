<p align="center"><img src="./static/images/slauth-logo.png" alt="slauth.io logo"/></p>
<p align="center">
  CLI that scans repositories and generates the necessary IAM Permissions for the service to run.
  <br>
  <a href="https://github.com/slauth-io/slauth-cli/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=">Report bug</a>
  ·
  <a href="https://github.com/slauth-io/slauth-cli/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=">Feature request</a>
  ·
  <a href="https://blog.slauth.io/">Slauth.io blog</a>
  <br>
  <br>
  🤩
  <br>
  We're always open to feedback!
  <br>
  If you have any or are in need of some help, please join our <a href="https://join.slack.com/t/slauthiocommunity/shared_invite/zt-268nxuwyd-Vav8lYJdiP44Kt8lQSSybg">Slack Community</a>
  <br>
  <br>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/@slauth.io/slauth" />
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/slauth-io/slauth-cli" />
  <img alt="NPM License" src="https://img.shields.io/npm/l/@slauth.io/slauth" />
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/slauth-io/slauth-cli" />
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/slauth-io/slauth-cli" />
  <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/slauth-io/slauth-cli" />
</p>

## Quick Links

- [Installation](#installation)
- [Usage](#usage)
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Contributing](CONTRIBUTING.md)
- [Project Structure](#project-structure)

## Version Compatibility

| Slauth CLI Version | Node.js Version |
|-------------------|-----------------|
| 1.x.x            | >= 16.x        |
| 0.x.x            | >= 14.x        |

## Prerequisites

- Node.js (LTS version 16+)
- npm (version 7+)
- Git
- OpenAI API key for development
- Basic understanding of IAM policies and cloud services (AWS/GCP)
## Installation

```bash
npm install -g @slauth.io/slauth
```

## Usage

1. Set the `OPENAI_API_KEY` environment variable: `export OPENAI_API_KEY=<key>`
2. Run `slauth --help` to see available commands

### Commands

#### Scan

The scan command will look for any calls of your Cloud Provider `sdk` in your git repository and generate the necessary permissions for it.

```bash
slauth scan -p aws ../path/to/my/repository
```

> Note: By default the `scan` command will print the result to `stdout`. Use `-o,--output-file` option to specify a file to output to.

**Result:**

The result of the scan command is an array of IAM Permissions.

> Note: For `aws` cloud provider, if the resource is not explicit in the code (e.g. comes from a variable), we use a placholder for it. Before deploying the policies, you will have to **manually** change these placeholders with the correct resources the service will try to interact with.

```bash
Detected Policies:

[
  {
    "Version": "2012-10-17",
    "Id": "S3Policy",
    "Statement": [
      {
        "Sid": "S3Permissions",
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetBucketAcl"
        ],
        "Resource": [
          "<S3_BUCKET_PLACEHOLDER>",
          "<S3_BUCKET_1_PLACEHOLDER>",
          "arn:aws:s3:::my_bucket_2/*"
        ]
      }
    ]
  },
  {
    "Version": "2012-10-17",
    "Id": "DynamoDBPolicy",
    "Statement": [
      {
        "Sid": "DynamoDBPermissions",
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem"
        ],
        "Resource": [
          "<DYNAMODB_TABLE_PLACEHOLDER>"
        ]
      }
    ]
  },
  {
    "Version": "2012-10-17",
    "Id": "SQSPolicy",
    "Statement": [
      {
        "Sid": "SQSPermissions",
        "Effect": "Allow",
        "Action": [
          "sqs:SendMessage"
        ],
        "Resource": [
          "<SQS_QUEUE_URL_PLACEHOLDER>"
        ]
      }
    ]
  }
]
```

##### Available options

- `-p, --cloud-provider <cloudProvider>` select the cloud provider you would like to generate policies for (choices: "aws", "gcp")
- `-m, --openai-model <openaiModel>` select the openai model to use (choices: "gpt-3.5-turbo-16k", "gpt-4-32k")
- `-o, --output-file <outputFile>` write generated policies to a file instead of stdout

#### Selecting which OpenAI Model to use

By default `slauth` will use `gpt-4-32k` as it provides the best results. You can still choose to use other models to scan you repo, specially if cost is a concern:

To choose a different model, use the `-m` option of the `scan` command

```bash
slauth scan -p aws -m gpt-3.5-turbo-16k ./path/to/my/repository
```

Available models:

- `gpt-3.5-turbo-16k` (results with this model might be incomplete)
- `gpt-4-32k` (default)

#### Example repos to test with

In case you want to give the CLI a quick test you can fork the following repositories.

- aws-sdk: <https://github.com/slauth-io/aws-sdk-tester>
- google-cloud sdk: <https://github.com/slauth-io/gcp-sdk-tester>

### Running in CI/CD

Slauth being a CLI, it can be easily integrated in your CI/CD pipelines.

#### Github Action Example

In this GitHub action workflow we install Slauth, run it and then output the result to an artifact which can then be downloaded so it can be used in your IaC.

```yaml
name: scan
on:
  push:

permissions:
  contents: read

jobs:
  release:
    name: policy-scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 'lts/*'
      - name: Install Slauth
        run: npm install -g @slauth.io/slauth
      - name: Run Slauth
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: slauth scan -p aws -o ./policies.json .
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: policies
          path: policies.json
```

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/slauth-io/slauth-cli.git
   cd slauth-cli
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your OpenAI API key in `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Install CLI globally for local testing:
   ```bash
   npm install -g .
   ```

6. Start development build watch:
   ```bash
   npm run build-watch
   ```

7. Verify installation:
   ```bash
   slauth --help
   ```

## Project Structure

```bash
slauth-cli/
├── src/                    # Source code
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and helpers
│   │   ├── scanner-strategies/  # Cloud provider specific scanners
│   │   └── ...
│   └── ...
├── static/                # Static assets
├── tests/                 # Test files
├── .github/               # GitHub specific files
│   └── workflows/         # CI/CD workflow definitions
└── package.json          # Project dependencies and scripts
```

### Key Components

- **Scanner Strategies**: Implementation of different cloud provider scanning logic
- **Types**: TypeScript interfaces and type definitions
- **Utils**: Helper functions and core functionality

## Testing

1. Run unit tests:
   ```bash
   npm test
   ```

2. Run linting:
   ```bash
   npm run lint
   ```

3. Run type checking:
   ```bash
   npm run type-check
   ```

## Debug Mode

Enable debug mode by setting the DEBUG environment variable:
```bash
DEBUG=slauth:* slauth scan -p aws ./path/to/repository
```

## Common Development Tasks

1. Adding a new scanner strategy:
   - Create new strategy file in `src/utils/scanner-strategies/`
   - Implement `ScannerStrategy` interface
   - Register strategy in scanner factory

2. Modifying existing scanners:
   - Update relevant strategy in `src/utils/scanner-strategies/`
   - Add tests in `tests/` directory
   - Update documentation if necessary

## Security

### Reporting Security Issues

If you discover a security vulnerability within Slauth CLI, please send an email to security@slauth.io. All security vulnerabilities will be promptly addressed.

### Best Practices

- Keep your OpenAI API key secure and never commit it to version control
- Regularly update to the latest version for security patches
- Review generated IAM policies before implementation

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**
   - Ensure the key is properly set in your environment
   - Verify the key has sufficient permissions

2. **Scanning Errors**
   - Check if the repository path is correct
   - Ensure you have sufficient permissions to read the repository

3. **Installation Problems**
   - Clear npm cache: `npm cache clean --force`
   - Try installing with `--verbose` flag

For more help, please:
- Check our [FAQ](https://docs.slauth.io/faq) section
- Join our [Slack community](https://join.slack.com/t/slauthiocommunity/shared_invite/zt-268nxuwyd-Vav8lYJdiP44Kt8lQSSybg)
- Open an issue on GitHub
