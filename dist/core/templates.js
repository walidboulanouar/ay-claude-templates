import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
/**
 * Predefined templates
 */
export const PACKAGE_TEMPLATES = [
    {
        id: 'skill-basic',
        name: 'Basic Skill',
        description: 'Basic skill template with SKILL.md',
        contentType: 'skill',
        files: [
            {
                path: 'SKILL.md',
                content: `# {{name}}

{{description}}

## Usage

\`\`\`typescript
// Example usage
\`\`\`

## Features

- Feature 1
- Feature 2

## Author

{{author}}
`,
            },
            {
                path: 'README.md',
                content: `# {{name}}

{{description}}

## Installation

\`\`\`bash
ay-claude install {{name}}
\`\`\`

## Usage

See SKILL.md for details.
`,
            },
        ],
        variables: ['name', 'description', 'author'],
    },
    {
        id: 'hook-basic',
        name: 'Basic Hook',
        description: 'Basic hook template with shell script',
        contentType: 'hook',
        files: [
            {
                path: 'hook.sh',
                content: `#!/bin/bash
# {{name}} Hook
# {{description}}

# Hook receives JSON input on stdin
input=$(cat)

# Process input
echo "Hook executed: {{name}}"
`,
                executable: true,
            },
            {
                path: 'README.md',
                content: `# {{name}}

{{description}}

## Installation

\`\`\`bash
ay-claude install {{name}}
\`\`\`

## Configuration

Add to \`.claude/settings.json\`:

\`\`\`json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/{{name}}/hook.sh"
          }
        ]
      }
    ]
  }
}
\`\`\`
`,
            },
        ],
        variables: ['name', 'description'],
    },
    {
        id: 'settings-preset',
        name: 'Settings Preset',
        description: 'Settings preset template',
        contentType: 'settings',
        files: [
            {
                path: 'settings.json',
                content: `{
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Write(./src/**)"
    ],
    "ask": [
      "Bash(git:*)"
    ],
    "deny": [
      "Read(./.env)"
    ],
    "defaultMode": "acceptEdits"
  },
  "env": {
    "NODE_ENV": "development"
  },
  "model": "claude-3-7-sonnet-20250929"
}
`,
            },
            {
                path: 'README.md',
                content: `# {{name}} Settings

{{description}}

## Installation

\`\`\`bash
ay-claude install {{name}} --type settings
\`\`\`

## Features

- Pre-configured permissions
- Environment variables
- Model settings
`,
            },
        ],
        variables: ['name', 'description'],
    },
];
/**
 * Get template by ID
 */
export function getTemplate(templateId) {
    return PACKAGE_TEMPLATES.find((t) => t.id === templateId);
}
/**
 * List all templates
 */
export function listTemplates(contentType) {
    if (contentType) {
        return PACKAGE_TEMPLATES.filter((t) => t.contentType === contentType);
    }
    return PACKAGE_TEMPLATES;
}
/**
 * Create package from template
 */
export async function createFromTemplate(templateId, packageName, variables, outputDir) {
    const template = getTemplate(templateId);
    if (!template) {
        throw new Error(`Template not found: ${templateId}`);
    }
    // Create output directory
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }
    // Create files from template
    for (const file of template.files) {
        let content = file.content;
        // Replace variables
        for (const [key, value] of Object.entries(variables)) {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        const filePath = join(outputDir, file.path);
        const { dirname } = await import('path');
        const { ensureDir } = await import('../utils/paths.js');
        await ensureDir(dirname(filePath));
        await writeFile(filePath, content);
        // Set executable if needed
        if (file.executable && process.platform !== 'win32') {
            const { chmodSync } = await import('fs');
            chmodSync(filePath, 0o755);
        }
    }
    console.log(chalk.green(`✓ Created package from template: ${packageName}`));
    console.log(chalk.gray(`  Location: ${outputDir}`));
}
//# sourceMappingURL=templates.js.map