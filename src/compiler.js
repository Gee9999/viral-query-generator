export function compilePrompts(state) {
  const artifacts = {
    super: '',      // User's exact prompt
    enhanced: ''    // AI-enhanced version
  };

  // Phase check helpers
  const hasP1 = state.problem && state.user && state.success && state.failure;
  const hasP2 = state.seniority && state.specializations?.length > 0;
  const hasP3 = state.systemType && state.userActions && state.outputs;
  const hasP4 = state.techStack && state.forbidden;
  const hasP6 = state.doneMeans && state.notDoneMeans;
  const hasP7 = state.changeMode;

  // --- 1. GENERATE USER'S ORIGINAL PROMPT (as entered) ---
  if (hasP1 && hasP2) {
    let content = `<system_instructions>\n`;
    content += `  <persona>\n`;
    content += `    Role: ${state.seniority || 'Expert Assistant'} specializing in ${state.specializations?.join(', ') || 'General Development'}.\n`;
    content += `    Operational Style: ${state.style || 'Standard'}.\n`;
    content += `  </persona>\n\n`;

    content += `  <task_description>\n`;
    content += `    Main Goal: ${state.problem}\n`;
    content += `    Target User: ${state.user}\n`;
    content += `    Definition of Success: ${state.success}\n`;
    content += `    Definition of Failure/Critical Guardrails: ${state.failure}\n`;
    content += `  </task_description>\n\n`;

    if (hasP3) {
      content += `  <functional_requirements>\n`;
      content += `    System Type: ${state.systemType}\n`;
      content += `    User Interactions: ${state.userActions}\n`;
      content += `    Key Outputs: ${state.outputs}\n`;
      content += `    Data Persistence: ${state.dataLocation || 'In-memory'}\n`;
      content += `  </functional_requirements>\n\n`;
    }

    if (hasP4) {
      content += `  <constraints>\n`;
      content += `    <tech_stack>\n      ${state.techStack}\n    </tech_stack>\n`;
      if (state.stylingRules) content += `    <design_spec>\n      ${state.stylingRules}\n    </design_spec>\n`;
      content += `    <hard_rules>\n      ${state.forbidden}\n    </hard_rules>\n`;
      content += `  </constraints>\n\n`;
    }

    if (hasP6) {
      content += `  <verification_criteria>\n`;
      content += `    Done State: ${state.doneMeans}\n`;
      content += `    Incomplete State: ${state.notDoneMeans}\n`;
      content += `  </verification_criteria>\n\n`;
    }

    if (hasP7) {
      content += `  <evolution_rules>\n`;
      content += `    Maintenance Mode: ${state.changeMode}\n`;
      content += `  </evolution_rules>\n`;
    }

    content += `</system_instructions>`;
    artifacts.super = content;
  }

  // --- 2. GENERATE AI-ENHANCED MASTER PROMPT ---
  // This is a professionally enhanced version with best practices applied
  if (hasP1 && hasP2) {
    // Helper to enhance user text with professional language
    const enhance = (text, type) => {
      if (!text) return '';
      let enhanced = text.trim();

      // Remove vague words and strengthen
      enhanced = enhanced
        .replace(/\bsimple\b/gi, 'streamlined')
        .replace(/\beasy\b/gi, 'intuitive')
        .replace(/\bbasic\b/gi, 'foundational')
        .replace(/\bjust\b/gi, '')
        .replace(/\bmaybe\b/gi, 'should')
        .replace(/\bkind of\b/gi, '')
        .replace(/\bsort of\b/gi, '')
        .trim();

      return enhanced;
    };

    // Create enhanced problem statement
    const enhancedProblem = enhance(state.problem) +
      `. The solution must be production-ready, maintainable, and follow industry best practices.`;

    // Create enhanced success criteria
    const enhancedSuccess = enhance(state.success) +
      ` The implementation should be modular, well-documented, and optimized for performance.`;

    // Create enhanced failure criteria
    const enhancedFailure = enhance(state.failure) +
      ` Additionally, any deviation from the specified requirements, introduction of security vulnerabilities, or creation of unmaintainable code is considered a critical failure.`;

    // Create enhanced user actions
    const enhancedActions = state.userActions ?
      enhance(state.userActions) + ` All interactions must provide clear feedback, handle edge cases gracefully, and maintain data integrity.` : '';

    // Create enhanced outputs
    const enhancedOutputs = state.outputs ?
      enhance(state.outputs) + ` All outputs must be validated, properly formatted, and include appropriate error states.` : '';

    // Build the enhanced prompt
    let enhanced = `<system_instructions>\n`;

    // Enhanced persona with more specific guidance
    enhanced += `  <persona>\n`;
    enhanced += `    Role: You are a ${state.seniority || 'Senior Expert'} with deep expertise in ${state.specializations?.join(', ') || 'software development'}.\n`;
    enhanced += `    Operational Style: ${state.style || 'Methodical'}. Think step-by-step. Explain your reasoning before implementing.\n`;
    enhanced += `    Core Values: Precision, maintainability, security-first mindset, and user-centric design.\n`;
    enhanced += `  </persona>\n\n`;

    // Enhanced task with professional context
    enhanced += `  <task_description>\n`;
    enhanced += `    Primary Objective: ${enhancedProblem}\n`;
    enhanced += `    Target Audience: ${state.user} — design all interactions and documentation with this user profile in mind.\n`;
    enhanced += `    Success Criteria: ${enhancedSuccess}\n`;
    enhanced += `    Failure Conditions: ${enhancedFailure}\n`;
    enhanced += `  </task_description>\n\n`;

    // Add architectural guidelines
    enhanced += `  <architectural_guidelines>\n`;
    enhanced += `    - Separation of Concerns: Keep logic, presentation, and data layers distinct.\n`;
    enhanced += `    - Error Handling: Implement comprehensive error boundaries and user-friendly error messages.\n`;
    enhanced += `    - State Management: Use predictable, traceable state patterns.\n`;
    enhanced += `    - Code Quality: Write self-documenting code with clear naming conventions.\n`;
    enhanced += `  </architectural_guidelines>\n\n`;

    if (hasP3) {
      enhanced += `  <functional_requirements>\n`;
      enhanced += `    System Architecture: ${state.systemType} — implement with scalability in mind.\n`;
      enhanced += `    User Interactions: ${enhancedActions}\n`;
      enhanced += `    Deliverables: ${enhancedOutputs}\n`;
      enhanced += `    Data Strategy: ${state.dataLocation || 'In-memory'} — ensure data integrity and appropriate backup/recovery mechanisms.\n`;
      enhanced += `  </functional_requirements>\n\n`;
    }

    if (hasP4) {
      enhanced += `  <constraints>\n`;
      enhanced += `    <tech_stack>\n`;
      enhanced += `      Required: ${state.techStack}\n`;
      enhanced += `      Note: Use only the specified technologies. Do not introduce dependencies without explicit approval.\n`;
      enhanced += `    </tech_stack>\n`;
      if (state.stylingRules) {
        enhanced += `    <design_spec>\n`;
        enhanced += `      Visual Requirements: ${state.stylingRules}\n`;
        enhanced += `      Accessibility: Ensure WCAG 2.1 AA compliance where applicable.\n`;
        enhanced += `    </design_spec>\n`;
      }
      enhanced += `    <hard_rules>\n`;
      enhanced += `      Prohibited Actions: ${state.forbidden}\n`;
      enhanced += `      CRITICAL: Violating any hard rule is an immediate failure condition.\n`;
      enhanced += `    </hard_rules>\n`;
      enhanced += `  </constraints>\n\n`;
    }

    if (hasP6) {
      enhanced += `  <verification_criteria>\n`;
      enhanced += `    Definition of Done: ${state.doneMeans}\n`;
      enhanced += `    Incomplete Indicators: ${state.notDoneMeans}\n`;
      enhanced += `    Quality Checklist:\n`;
      enhanced += `      - [ ] All specified functionality is implemented\n`;
      enhanced += `      - [ ] No console errors or warnings\n`;
      enhanced += `      - [ ] Edge cases are handled gracefully\n`;
      enhanced += `      - [ ] Code is clean and well-organized\n`;
      enhanced += `  </verification_criteria>\n\n`;
    }

    if (hasP7) {
      enhanced += `  <evolution_rules>\n`;
      enhanced += `    Change Protocol: ${state.changeMode}\n`;
      enhanced += `    Before making any changes:\n`;
      enhanced += `      1. Understand the full scope of the requested change\n`;
      enhanced += `      2. Identify all files and components that will be affected\n`;
      enhanced += `      3. Consider edge cases and potential regressions\n`;
      enhanced += `      4. Implement the minimal change that satisfies the requirement\n`;
      enhanced += `  </evolution_rules>\n\n`;
    }

    // Add behavioral instructions
    enhanced += `  <behavioral_instructions>\n`;
    enhanced += `    1. Before coding, briefly outline your implementation approach.\n`;
    enhanced += `    2. If requirements are ambiguous, ask clarifying questions before proceeding.\n`;
    enhanced += `    3. When making changes, explain what you're modifying and why.\n`;
    enhanced += `    4. After implementation, summarize what was done and any considerations for the user.\n`;
    enhanced += `  </behavioral_instructions>\n`;

    enhanced += `</system_instructions>`;
    artifacts.enhanced = enhanced;
  }

  return artifacts;
}
