import { PHASES } from './phases.js';
import { compilePrompts } from './compiler.js';

class PromptCompilerApp {
    constructor() {
        this.currentPhaseIndex = 0;
        this.state = {
            specializations: []
        };
        this.artifacts = {};

        // DOM Elements
        this.stepNav = document.getElementById('step-nav');
        this.stepForm = document.getElementById('step-form');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.qualityFill = document.getElementById('quality-fill');
        this.qualityStatus = document.getElementById('quality-status');
        this.qualityHints = document.getElementById('quality-hints');

        // Modal elements
        this.finishModal = document.getElementById('finish-modal');
        this.closeModalBtn = document.getElementById('close-modal');
        this.finalCopyBtn = document.getElementById('final-copy-btn');
        this.finalSaveBtn = document.getElementById('final-save-btn');

        this.init();
    }

    init() {
        this.renderStepNav();
        this.renderCurrentPhase();
        this.setupGlobalListeners();
        this.updatePreview();
        this.updateQualityMeter();
    }

    renderStepNav() {
        this.stepNav.innerHTML = PHASES.map((phase, index) => `
            <div class="step-nav-item ${index === this.currentPhaseIndex ? 'active' : ''} ${index < this.currentPhaseIndex ? 'completed' : ''}" data-index="${index}">
                <span class="index">${index + 1}</span>
                <span class="label">${phase.name}</span>
            </div>
        `).join('');

        this.stepNav.querySelectorAll('.step-nav-item').forEach(item => {
            item.onclick = () => {
                const idx = parseInt(item.dataset.index);
                if (idx < this.currentPhaseIndex || this.canGoTo(idx)) {
                    this.currentPhaseIndex = idx;
                    this.renderStepNav();
                    this.renderCurrentPhase();
                }
            };
        });
    }

    canGoTo(targetIdx) {
        // Simple validation: must complete current before moving far ahead
        return targetIdx <= this.currentPhaseIndex + 1;
    }

    renderCurrentPhase() {
        const phase = PHASES[this.currentPhaseIndex];

        // --- QUICK TEMPLATES (Only for Phase 1) ---
        let templateSelectorHtml = '';
        if (this.currentPhaseIndex === 1) {
            templateSelectorHtml = `
                <div class="template-section">
                    <label class="template-label">⚡ Start Fast with a Template</label>
                    <select id="quick-template-select" class="template-select">
                        <option value="" selected>Choose a starting point...</option>
                        <option value="webapp">Full Stack Web App (React/Node)</option>
                        <option value="data">Python Data Analysis Script</option>
                        <option value="content">Content Marketing Generator</option>
                    </select>
                </div>
                <hr class="template-divider">
            `;
        }

        let fieldsHtml = phase.fields.map(field => {
            const value = this.state[field.id] || '';
            const requiredStar = field.required ? ' <span class="required-star">*</span>' : '';

            if (field.type === 'select') {
                return `
                    <div class="form-group">
                        <label for="${field.id}">
                            <div class="field-label-text">${field.label}${requiredStar}</div>
                            <div class="field-directive">${field.directive}</div>
                        </label>
                        <select id="${field.id}" ${field.required ? 'required' : ''}>
                            <option value="" disabled ${!value ? 'selected' : ''}>Select an option...</option>
                            ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            }

            if (field.type === 'multi-select') {
                const selected = this.state[field.id] || [];
                return `
                    <div class="form-group">
                        <label>
                            <div class="field-label-text">${field.label}${requiredStar}</div>
                            <div class="field-directive">${field.directive}</div>
                        </label>
                        <div class="options-grid">
                            ${field.options.map(opt => `
                                <div class="option-card ${selected.includes(opt) ? 'selected' : ''}" data-value="${opt}" data-field="${field.id}">
                                    ${opt}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            if (field.type === 'textarea') {
                return `
                    <div class="form-group">
                        <label for="${field.id}">
                            <div class="field-label-text">${field.label}${requiredStar}</div>
                            <div class="field-directive">${field.directive}</div>
                        </label>
                        <textarea id="${field.id}" autocomplete="off" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>${value}</textarea>
                    </div>
                `;
            }

            return `
                <div class="form-group">
                    <label for="${field.id}">
                        <div class="field-label-text">${field.label}${requiredStar}</div>
                        <div class="field-directive">${field.directive}</div>
                    </label>
                    <input type="text" id="${field.id}" autocomplete="off" value="${value}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
                </div>
            `;
        }).join('');

        this.stepForm.innerHTML = `
            <h1 class="phase-title">${phase.title}</h1>
            <p class="phase-desc">${phase.description}</p>
            <form id="active-form">
                ${templateSelectorHtml}
                ${fieldsHtml}
            </form>
        `;

        this.updateNavButtons();
        this.setupFormListeners();
    }

    applyTemplate(type) {
        const templates = {
            webapp: {
                problem: "I need to build a scalable dashboard for tracking business metrics.",
                user: "A Professional Team",
                success: "Team members can log in, view charts of daily sales, and export reports to PDF.",
                failure: "If the site is slow or data is inaccurate.",
                seniority: "Lead Full Stack Developer",
                specializations: ["Designing Interfaces", "Speed & Performance", "Security & Safety"],
                style: "Modern & Clean",
                systemType: "Web Application (SPA)",
                userActions: "Login via OAuth, Filter Data by Date, Export to PDF",
                outputs: "Interactive Charts, CSV Exports, User Profile Settings",
                techStack: "React, TailwindCSS, Node.js, PostgreSQL",
                doneMeans: "All pages load under 1s, 100% test coverage on critical paths.",
                notDoneMeans: "Console errors present, UI not responsive on mobile."
            },
            data: {
                problem: "To automate the cleaning and analysis of raw CSV customer data.",
                user: "Just Me",
                success: "I can drop a folder of CSVs and get a clean summary Excel file automatically.",
                failure: "If it corrupts the original data or crashes on large files.",
                seniority: "Data Scientist",
                specializations: ["Building Data Systems", "Speed & Performance"],
                style: "Functional",
                systemType: "CLI Tool / Python Script",
                userActions: "Run script via terminal with arguments",
                outputs: "Cleaned Excel report with pivot tables",
                techStack: "Python, Pandas, OpenPyXL",
                doneMeans: "Script runs successfully on 1GB dataset.",
                notDoneMeans: "Memory overflow errors."
            },
            content: {
                problem: "To generate consistent LinkedIn posts from my rough notes.",
                user: "Expert Users",
                success: "I input bullet points and get 3 perfectly formatted viral posts.",
                failure: "If the tone sounds robotic or generic.",
                seniority: "Editorial Director",
                specializations: ["User Experience"],
                style: "Engaging & Viral",
                systemType: "Prompt / Text Generator",
                userActions: "Paste notes, Select Tone, Click Generate",
                outputs: "3 Variations of social posts with hashtags",
                techStack: "GPT-4, Markdown",
                doneMeans: "Output feels like a human wrote it.",
                notDoneMeans: "Uses cliché AI phrases like 'delve' or 'landscape'."
            }
        };

        const data = templates[type];
        if (data) {
            // Merge template data into state
            this.state = { ...this.state, ...data };
            // Re-render to show populated fields
            this.renderCurrentPhase();
            this.updatePreview();
            this.updateQualityMeter();
            this.updateNavButtons();
        }
    }

    updateNavButtons() {
        this.prevBtn.disabled = this.currentPhaseIndex === 0;

        const phase = PHASES[this.currentPhaseIndex];
        const canGoNext = phase.fields.every(f => {
            if (!f.required) return true;
            const val = this.state[f.id];
            if (Array.isArray(val)) return val.length > 0;
            return !!val;
        });

        this.nextBtn.textContent = this.currentPhaseIndex === PHASES.length - 1 ? 'Finish Project' : 'Next Phase';
        this.nextBtn.disabled = !canGoNext;
    }

    updateQualityMeter() {
        let score = 0;
        let totalPossible = 0;
        let hints = [];

        PHASES.forEach(phase => {
            phase.fields.forEach(field => {
                if (field.required) {
                    totalPossible += 10;
                    const val = this.state[field.id];

                    if (!val || (Array.isArray(val) && val.length === 0)) {
                        hints.push({
                            text: `Missing: ${field.label}`,
                            priority: true,
                            action: { label: 'Quick Start', type: 'template', fieldId: field.id }
                        });
                    } else if (typeof val === 'string') {
                        const trimmed = val.trim();
                        if (trimmed.length > 0) {
                            score += 5;
                            if (trimmed.length < 30) {
                                hints.push({
                                    text: `${field.label} is too brief. AI needs more detail.`,
                                    action: { label: 'Auto-Expand', type: 'expand', fieldId: field.id }
                                });
                            } else {
                                score += 5;
                            }

                            if (trimmed.toLowerCase().includes('simple') || trimmed.toLowerCase().includes('easy')) {
                                hints.push({
                                    text: `Avoid "simple" in instructions.`,
                                    action: { label: 'Tech Refactor', type: 'refactor', fieldId: field.id }
                                });
                            }
                        }
                    } else if (Array.isArray(val) && val.length > 0) {
                        score += 10;
                    }
                }
            });
        });

        const percentage = Math.min(100, Math.floor((score / totalPossible) * 100)) || 0;
        this.qualityFill.style.width = `${percentage}%`;

        let feedback = "START BUILDING...";
        if (percentage > 0 && percentage < 40) {
            feedback = "LOW SIGNAL - ADD DETAIL";
            this.qualityFill.style.background = 'hsl(35, 100%, 60%)';
        } else if (percentage < 80) {
            feedback = "GOOD - BUILD PROGRESSING";
            this.qualityFill.style.background = 'var(--accent-primary)';
        } else if (percentage < 100) {
            feedback = "STRONG - NEARLY READY";
            this.qualityFill.style.background = 'var(--accent-secondary)';
        } else {
            feedback = "ELITE - ARCHITECTURE OPTIMIZED";
            this.qualityFill.style.background = 'var(--accent-success)';
        }

        this.qualityStatus.textContent = feedback;

        // Render Hints
        this.qualityHints.innerHTML = '';
        hints.slice(0, 3).forEach(hint => {
            const li = document.createElement('li');
            li.className = `quality-hint ${hint.priority ? 'priority' : ''}`;

            const text = document.createElement('div');
            text.textContent = hint.text;
            li.appendChild(text);

            if (hint.action) {
                const btn = document.createElement('button');
                btn.className = 'hint-btn';
                btn.textContent = hint.action.label;
                btn.onclick = () => this.applyFix(hint.action);
                li.appendChild(btn);
            }

            this.qualityHints.appendChild(li);
        });
    }

    applyFix(action) {
        const { type, fieldId } = action;
        let currentVal = this.state[fieldId] || "";

        if (type === 'template') {
            if (fieldId === 'roleTitle' || fieldId === 'seniority') this.state[fieldId] = "Expert Senior Systems Architect";
            else if (fieldId === 'specializations') this.state[fieldId] = ["Designing Interfaces", "User Experience", "Security & Safety"];
            else if (fieldId === 'problem') this.state[fieldId] = "I need to build a modular application that solves the specific challenge of [Problem Description] while ensuring high performance and security.";
        }
        else if (type === 'refactor') {
            this.state[fieldId] = currentVal.replace(/simple|easy/gi, (match) => {
                return match.toLowerCase() === 'simple' ? 'robust and production-ready' : 'efficiently structured';
            });
        }
        else if (type === 'expand') {
            this.state[fieldId] = currentVal + " The solution must strictly adhere to architectural best practices, including error boundaries and modular separation of concerns.";
        }

        this.renderCurrentPhase();
        this.updatePreview();
        this.updateQualityMeter();
    }

    setupFormListeners() {
        const form = document.getElementById('active-form');
        const inputs = form.querySelectorAll('input, textarea');
        const selects = form.querySelectorAll('select');

        // Template Selector Listener
        const templateSelect = document.getElementById('quick-template-select');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.applyTemplate(e.target.value);
                }
            });
        }

        // Handle text inputs and textareas
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.state[e.target.id] = e.target.value;
                this.updatePreview();
                this.updateQualityMeter();
                this.updateNavButtons();
            });
        });

        // Handle select dropdowns with 'change' event
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.state[e.target.id] = e.target.value;
                this.updatePreview();
                this.updateQualityMeter();
                this.updateNavButtons();
            });
        });

        form.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                const fieldId = card.dataset.field;
                const value = card.dataset.value;
                if (!this.state[fieldId]) this.state[fieldId] = [];

                const index = this.state[fieldId].indexOf(value);
                if (index > -1) {
                    this.state[fieldId].splice(index, 1);
                } else {
                    this.state[fieldId].push(value);
                }

                this.renderCurrentPhase();
                this.updatePreview();
                this.updateQualityMeter();
                this.updateNavButtons();
            });
        });
    }

    setupGlobalListeners() {
        this.prevBtn.addEventListener('click', () => {
            if (this.currentPhaseIndex > 0) {
                this.currentPhaseIndex--;
                this.renderStepNav();
                this.renderCurrentPhase();
            }
        });

        this.nextBtn.addEventListener('click', () => {
            if (this.currentPhaseIndex < PHASES.length - 1) {
                this.currentPhaseIndex++;
                this.renderStepNav();
                this.renderCurrentPhase();
            } else {
                // FINISH FLOW
                this.showFinishModal();
            }
        });

        // Copy buttons logic (Delegated for dynamically generated content)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.copy-btn');
            if (btn) {
                const type = btn.dataset.artifact;
                const text = this.artifacts[type];
                if (text) {
                    navigator.clipboard.writeText(text).then(() => {
                        const originalText = btn.textContent;
                        // Keep the icon if present (not using icons here but good practice)
                        btn.textContent = 'Copied!';
                        setTimeout(() => btn.textContent = originalText, 2000);
                    });
                }
            }
        });

        // Save/Load buttons
        document.getElementById('export-btn').addEventListener('click', () => this.saveProject());
        document.getElementById('import-btn').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => this.loadProject(e));
        document.getElementById('new-btn').addEventListener('click', () => this.resetProject());

        // LIBRARY LISTENERS
        document.getElementById('library-btn').addEventListener('click', () => this.toggleLibrary(true));
        document.getElementById('close-library').addEventListener('click', () => this.toggleLibrary(false));
        document.getElementById('save-to-library-btn').addEventListener('click', () => this.saveToLibrary());
        document.getElementById('backup-library-btn').addEventListener('click', () => this.backupLibrary());

        // Modal closures
        if (this.closeModalBtn) this.closeModalBtn.onclick = () => this.finishModal.classList.add('hidden');
        if (this.finalCopyBtn) this.finalCopyBtn.onclick = () => {
            navigator.clipboard.writeText(this.artifacts.super);
            this.finalCopyBtn.textContent = 'Copied to Clipboard!';
        };
        if (this.finalSaveBtn) this.finalSaveBtn.onclick = () => this.saveProject();
    }

    showFinishModal() {
        this.finishModal.classList.remove('hidden');
    }

    resetProject() {
        // Only ask for confirmation if there is actual data
        const hasData = Object.keys(this.state).length > 1; // >1 because specializations[] is always present
        if (hasData && !confirm('Start a new project? Any unsaved changes will be lost.')) {
            return;
        }

        this.state = { specializations: [] };
        this.currentPhaseIndex = 0;
        this.init();
    }

    saveProject() {
        const manifest = {
            version: '2.0',
            projectName: this.state.projectName || 'My Superprompt',
            state: this.state
        };
        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(this.state.projectName || 'project').toLowerCase().replace(/\s+/g, '-')}-prompt.json`;
        a.click();
    }

    backupLibrary() {
        const library = this.getLibrary();
        if (library.length === 0) {
            alert('Your memory is empty. Nothing to backup yet!');
            return;
        }
        const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-builder-memory-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
    }

    loadProject(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const manifest = JSON.parse(event.target.result);
                if (manifest.state) {
                    this.state = manifest.state;
                    this.currentPhaseIndex = 0;
                    this.init();
                    // Clear input to allow reloading same file
                    e.target.value = '';
                } else {
                    alert('Error: Invalid project file format.');
                }
            } catch (err) {
                alert('Error: Could not parse project file.');
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    // --- LIBRARY SYSTEM ---
    toggleLibrary(show) {
        const modal = document.getElementById('library-modal');
        if (show) {
            this.renderLibrary();
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }

    getLibrary() {
        const data = localStorage.getItem('prompt_library');
        return data ? JSON.parse(data) : [];
    }

    saveToLibrary() {
        const library = this.getLibrary();
        const newItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            name: this.state.projectName || 'Untitled Project',
            problem: this.state.problem || 'No description',
            state: this.state
        };
        library.unshift(newItem); // Add to top
        localStorage.setItem('prompt_library', JSON.stringify(library));
        this.renderLibrary(); // Refresh list if open

        // Visual feedback
        const btn = document.getElementById('save-to-library-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Saved!';
        setTimeout(() => btn.textContent = originalText, 1500);
    }

    deleteFromLibrary(id) {
        if (!confirm('Are you sure you want to delete this prompt?')) return;
        let library = this.getLibrary();
        library = library.filter(item => item.id !== id);
        localStorage.setItem('prompt_library', JSON.stringify(library));
        this.renderLibrary();
    }

    loadFromLibrary(id) {
        const library = this.getLibrary();
        const item = library.find(i => i.id === id);
        if (item) {
            this.state = item.state;
            this.currentPhaseIndex = 0;
            this.init();
            this.toggleLibrary(false); // Close modal
        }
    }

    renderLibrary() {
        const list = document.getElementById('library-list');
        const library = this.getLibrary();

        if (library.length === 0) {
            list.innerHTML = `<div class="empty-state">
                <div style="font-size: 2rem; margin-bottom: 0.5rem">📭</div>
                No saved prompts yet.<br>Click "+ Save Current" to add one!
            </div>`;
            return;
        }

        // Render HTML
        list.innerHTML = library.map(item => `
            <div class="library-card">
                <div class="card-info">
                    <div class="card-title">${item.name}</div>
                    <div class="card-meta">Saved: ${item.date}</div>
                    <div class="card-desc">${item.problem.substring(0, 60)}...</div>
                </div>
                <div class="card-actions">
                    <button class="lib-btn load" data-id="${item.id}">Load</button>
                    <button class="lib-btn delete" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');

        // Attach Event Listeners securely
        list.querySelectorAll('.lib-btn.load').forEach(btn => {
            btn.addEventListener('click', () => this.loadFromLibrary(parseInt(btn.dataset.id)));
        });

        list.querySelectorAll('.lib-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => this.deleteFromLibrary(parseInt(btn.dataset.id)));
        });
    }

    updatePreview() {
        const newArtifacts = compilePrompts(this.state);

        // Detect if enhanced content actually changed to avoid restarting animation on minor edits
        const enhancedChanged = newArtifacts.enhanced !== this.artifacts.enhanced;
        this.artifacts = newArtifacts;

        ['super', 'enhanced'].forEach(key => {
            const block = document.getElementById(`artifact-${key}`);
            if (!block) return;
            const pre = block.querySelector('.prompt-text');
            const btn = block.querySelector('.copy-btn');

            if (this.artifacts[key]) {
                if (key === 'super') {
                    // User prompt updates instantly
                    pre.textContent = this.artifacts[key];
                } else if (key === 'enhanced') {
                    // AI prompt gets the typewriter effect ONLY if it changed significantly
                    if (enhancedChanged) {
                        this.typeWriter(pre, this.artifacts[key]);
                    } else if (pre.classList.contains('placeholder')) {
                        // First load
                        this.typeWriter(pre, this.artifacts[key]);
                    }
                }

                pre.classList.remove('placeholder');
                btn.disabled = false;
            } else {
                pre.textContent = key === 'super' ? 'Complete more phases to generate the master prompt...' : 'Complete Phase 1 & 2 to generate enhanced version...';
                pre.classList.add('placeholder');
                btn.disabled = true;
            }
        });
    }

    typeWriter(element, text) {
        // Clear any existing interval for this element
        if (element.dataset.typingInterval) {
            clearInterval(parseInt(element.dataset.typingInterval));
        }

        element.textContent = '';
        let i = 0;
        const speed = 2; // ms per chunk
        const chunkSize = 3; // chars per chunk

        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.slice(i, i + chunkSize);
                i += chunkSize;
                // Auto-scroll to bottom to follow typing
                element.scrollTop = element.scrollHeight;
            } else {
                clearInterval(interval);
                delete element.dataset.typingInterval;
            }
        }, speed);

        element.dataset.typingInterval = interval;
    }
}

// Initialize the app
window.app = new PromptCompilerApp();

// --- GATEKEEPER LOGIC ---
// --- GATEKEEPER REMOVED ---
