# Contributing to ImageJ.js Knowledge Base

## Overview

The ImageJ.js knowledge base is a **community-driven** collection of working code examples. Your contributions help others avoid the trial-and-error of figuring out what works in the CheerpJ environment.

## What Makes a Good Example?

### 1. It Works in CheerpJ
- Test your code in ImageJ.js (browser environment)
- Confirm it produces expected results
- Note any limitations or workarounds

### 2. It Solves a Real Problem
- Addresses a common image analysis task
- Provides a working alternative when standard methods fail
- Documents CheerpJ-specific issues and solutions

### 3. It's Well Documented
- Clear description of what the code does
- Explanation of when to use it
- Notes about why it works (or why other approaches don't)
- Related examples for further exploration

## Example Template

Use this template for new examples:

```markdown
---
title: Descriptive Title Here
category: segmentation|roi|measurement|preprocessing
tags: [relevant, tags, cheerpj-safe]
language: macro|javascript
difficulty: easy|medium|hard
works_in_cheerpj: true|false
date_added: YYYY-MM-DD
---

# Title

## Description
Brief description of what this example does and the problem it solves.

## When to Use
- Specific scenario 1
- Specific scenario 2
- When standard approach fails

## Code

### Macro Version
\`\`\`imagej-macro
// Working macro code here
run("Blobs (25K)");
// ...
\`\`\`

### JavaScript Version (optional)
\`\`\`javascript
const IJ = window.IJClass || window.IJ;
// Direct API version
\`\`\`

## Notes
- **Why it works**: Explanation of the approach
- **Performance**: Any performance considerations
- **Limitations**: What doesn't work or limitations

## Common Issues

### Issue 1
Description and solution

### Issue 2
Description and solution

## Related Examples
- [Related Example 1](../category/example.md)
- [Related Example 2](../category/example.md)

## See Also
- ImageJ documentation links
- Java class references
```

## Tags to Use

- `cheerpj-safe` - Confirmed working in browser
- `workaround` - Alternative when standard method fails
- `macro` - Uses ImageJ macro language
- `javascript` - Uses direct Java API
- `roi` - ROI Manager operations
- `measurement` - Quantitative analysis
- `batch` - Batch processing examples
- `plugin` - Plugin-specific code

## Categories

- **segmentation/** - Object detection, thresholding, particle analysis
- **roi/** - ROI Manager, selections, measurements
- **measurement/** - Quantitative data extraction, statistics
- **preprocessing/** - Filters, enhancement, transformations
- **visualization/** - Overlays, annotations, display
- **batch/** - Batch processing, automation

## How to Contribute

### Via saveExample() Tool
```javascript
saveExample("category/my-example.md", `
---
title: My Example
category: segmentation
tags: [cheerpj-safe]
language: macro
---

# My Example

...
`)
```

This will download the file. Then:
1. Save it to `imagej-examples/category/my-example.md`
2. Test it works
3. Commit and push to git

### Via Git Pull Request

1. Fork the repository
2. Add your example to `imagej-examples/category/`
3. Update `imagej-examples/README.md` with link to your example
4. Create pull request

### Improving Existing Examples

Found a better way? Improve existing examples:
1. Add your improvements to the existing file
2. Update the `date_added` to track changes
3. Add a note about what was improved

## Quality Checklist

Before submitting, verify:

- [ ] Code works in ImageJ.js browser environment
- [ ] YAML frontmatter is complete and accurate
- [ ] Description clearly explains the purpose
- [ ] Code includes comments for clarity
- [ ] Tags are appropriate and useful
- [ ] Related examples are linked
- [ ] Common issues are documented
- [ ] Markdown formatting is correct

## Examples of Good Contributions

### Example 1: Alternative Methods
When you discover that a standard ImageJ command doesn't work in CheerpJ, document:
- What doesn't work
- Why it fails
- Working alternative approach

### Example 2: CheerpJ-Specific Workarounds
Document browser-specific limitations and solutions:
- Memory management tips
- Performance optimizations
- API differences

### Example 3: Complete Workflows
Full analysis pipelines from start to finish:
- Image loading
- Preprocessing
- Analysis
- Results export

## Review Process

Contributions will be reviewed for:
1. **Correctness** - Does it work as described?
2. **Completeness** - Is documentation sufficient?
3. **Clarity** - Can others understand and use it?
4. **Value** - Does it help solve a real problem?

## Questions?

- Open an issue on GitHub
- Ask in discussions
- Check existing examples for guidance

## Recognition

Contributors will be acknowledged in:
- Git commit history
- Example metadata (optional author field)
- Project README

Thank you for helping make ImageJ.js better for everyone! 🎉

