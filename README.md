<div align="center">
  <h1>
    AI Code Reviewer
  </h1>
  
  <p><em>Context-aware, intelligent and instant PR reviews</em></p>

</div>

<br/>

Optimize your code review process with this AI Code Reviewer that catches bugs, suggests improvements, and provides meaningful summary - all before human reviewers take their first look.

- 🔍 **Instant, In-depth PR Analysis**: Catches bugs, security issues, and optimization opportunities in real-time
- 🎯 **Focus on What Matters**: Let AI handle the basics while humans focus on architecture and complex logic
- ✨ **Title and description generation**: Save time by having the AI generate meaningful title and description for your PR
- 💬 **Interactive & Smart**: Responds to questions and generates code suggestions right in your PR
- ⚡ **Lightning-Fast Setup**: Up and running in 2 minutes with GitHub Actions

<br/>

> 🤝 **Note**: This tool is designed to complement human reviewers, not replace them. It helps catch security issues and bugs early on while also providing context about the overall change, making the human review process more efficient.

<br/>

## Usage

### Step 1: Add LLM_API_KEY secret

1. Go to your repository's Settings > Secrets and Variables > Actions
2. Click "New repository secret"
3. Add a new secret with:
   - Name: `LLM_API_KEY`
   - Value: Your API key from one of these providers:
     - [Anthropic Console](https://console.anthropic.com/) (Claude)
     - [OpenAI API](https://platform.openai.com/api-keys) (GPT-4)
     - [Google AI Studio](https://aistudio.google.com/app/apikeys) (Gemini)

### Step 2: Create GitHub Workflow

Add this GitHub Action to your repository by creating `.github/workflows/ai-reviewer.yml`.

Since you are using this Action privately or from your own fork/clone:

```yaml
name: AI Code Reviewer

permissions:
  contents: read
  pull-requests: write
  issues: write

on:
  pull_request_target:
    types: [opened, synchronize]
  pull_request_review_comment:
    types: [created]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Check required secrets
        run: |
          if [ -z "${{ secrets.LLM_API_KEY }}" ]; then
            echo "Error: LLM_API_KEY secret is not configured"
            exit 1
          fi
      # If using in the SAME repository where the action code is:
      - uses: ./ 
      # If using from a different repository (your fork):
      # - uses: your-username/ai-reviewer@main 
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          LLM_MODEL: "claude-4.5-sonnet"
```

The action requires:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `LLM_API_KEY`: Your API key (added in step 1)
- `LLM_MODEL`: Which LLM model to use. 

### GitHub Enterprise Server Support

If you're using GitHub Enterprise Server, you can configure the action to work with your instance by adding these environment variables:

```yaml
        env:
          GITHUB_API_URL: "https://github.example.com/api/v3"
          GITHUB_SERVER_URL: "https://github.example.com"
```

<br/>

## Development

This project uses [Bun](https://bun.sh) for development.

### Prerequisites

- Bun 1.x
- GitHub CLI authenticated: `gh auth login`

### Setup

```bash
bun install
bun run build
```

### Local CLI (Dry-Run) Testing

Run the reviewer locally against real PRs using your GitHub authentication.

```bash
# List PRs
bun run review -- --list-prs --state open --limit 5

# Review a PR (dry-run)
bun run review -- --pr 123 --dry-run
```

<br/>
