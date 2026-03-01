export const PHASES = [
    {
        id: 'p0',
        name: 'Project Name',
        title: "Hi! Let's give your project a name.",
        description: 'This is just for you to keep track of your prompts.',
        fields: [
            {
                id: 'projectName',
                label: 'Project Name',
                type: 'text',
                placeholder: 'e.g. My Personal Journal App',
                directive: 'Tip: Pick a name that describes the final result.',
                required: true
            }
        ]
    },
    {
        id: 'p1',
        name: 'The Goal',
        title: 'Phase 1 — The Goal',
        description: 'Tell us why you are building this. Do not mention technology like "React" or "Python" yet.',
        fields: [
            {
                id: 'problem',
                label: 'What is the real-world problem you are solving?',
                type: 'textarea',
                placeholder: 'e.g. It takes too long to track my daily expenses manually...',
                directive: 'Directive: Describe the struggle, not the solution.',
                required: true,
                sanitize: true
            },
            {
                id: 'user',
                label: 'Who will use this?',
                type: 'select',
                options: ['Just Me', 'A Professional Team', 'Expert Users', 'A Beginner User'],
                directive: 'Guidance: This helps the AI decide how complex the buttons and screens should be.',
                required: true
            },
            {
                id: 'success',
                label: 'What does a perfect result look like?',
                type: 'textarea',
                placeholder: 'e.g. I can see my total monthly spend in one click...',
                directive: 'Directive: Describe the outcome you want to achieve.',
                required: true,
                sanitize: true
            },
            {
                id: 'failure',
                label: 'What would make this project a failure?',
                type: 'textarea',
                placeholder: 'e.g. If the data is messy or if I can\'t find the delete button...',
                directive: 'Directive: Tell the AI what "bad work" looks like.',
                required: true,
                sanitize: true
            }
        ]
    },
    {
        id: 'p2',
        name: 'AI Role',
        title: 'Phase 2 — Setting the AI\'s Role',
        description: 'Decide how the AI should think and behave while helping you.',
        fields: [
            {
                id: 'seniority',
                label: 'How much experience should the AI act like it has?',
                type: 'select',
                options: ['Expert Engineer', 'Lead Architect', 'Founding Engineer'],
                directive: 'Note: Higher experience levels result in cleaner, deeper code.',
                required: true
            },
            {
                id: 'specializations',
                label: 'What specific skills does the AI need for this?',
                type: 'multi-select',
                options: [
                    'Designing Interfaces',
                    'Building Data Systems',
                    'Security & Safety',
                    'Speed & Performance',
                    'User Experience',
                    'Servers & Infrastructure'
                ],
                directive: 'Directive: Pick the "superpowers" your AI helper should have.',
                required: true
            },
            {
                id: 'style',
                label: 'How should the AI work through tasks?',
                type: 'select',
                options: ['Slowly but Safely', 'Step-by-Step with Updates', 'Fast but Controlled'],
                directive: 'Directive: This controls how much the AI changes at once.',
                required: true
            }
        ]
    },
    {
        id: 'p3',
        name: 'Core Features',
        title: 'Phase 3 — Core Features & Logic',
        description: 'Define exactly what the tool does and how it handles information.',
        fields: [
            {
                id: 'systemType',
                label: 'What kind of tool is this?',
                type: 'select',
                options: ['Dashboard / Review Screen', 'Guided Workflow', 'Small Utility Script', 'Database API', 'Command Tool'],
                directive: 'Guidance: This helps the AI understand the general layout.',
                required: true
            },
            {
                id: 'userActions',
                label: 'What can a person actually DO with this?',
                type: 'textarea',
                placeholder: 'e.g. Upload a file, click "Analyze", see a chart...',
                directive: 'Directive: List every button or click the user will have.',
                required: true
            },
            {
                id: 'outputs',
                label: 'What does the tool create or show at the end?',
                type: 'textarea',
                placeholder: 'e.g. A PDF report, a new row in a table, an updated graph...',
                directive: 'Directive: List every piece of "proof" the work is done.',
                required: true
            },
            {
                id: 'dataLocation',
                label: 'Where is the information saved?',
                type: 'text',
                placeholder: 'e.g. Only on this computer, on a remote server, in a file...',
                directive: 'Constraint: This tells the AI how to save your data.',
                required: true
            }
        ]
    },
    {
        id: 'p4',
        name: 'Strict Rules',
        title: 'Phase 4 — The Strict Rules',
        description: 'These are the non-negotiable rules the AI must follow.',
        fields: [
            {
                id: 'techStack',
                label: 'What technology MUST be used?',
                type: 'textarea',
                placeholder: 'e.g. HTML, CSS, JavaScript, Vite...',
                directive: 'Requirement: You must list any specific software/languages you want.',
                required: true
            },
            {
                id: 'stylingRules',
                label: 'How should it look?',
                type: 'textarea',
                placeholder: 'e.g. Modern and dark, using blue accents, very professional...',
                directive: 'Directive: Describe the "Design Style" you want.',
                required: false
            },
            {
                id: 'forbidden',
                label: 'What is the AI NEVER allowed to do?',
                type: 'textarea',
                placeholder: 'e.g. Don\'t change my colors, don\'t add new library, don\'t refactor...',
                directive: 'Constraint: Be very strict here to keep the AI in its lane.',
                required: true
            }
        ]
    },
    {
        id: 'p5',
        name: 'Aesthetic',
        title: 'Phase 5 — Aesthetic & Energy (Optional)',
        description: 'Fine-tune the mood of the interface.',
        fields: [
            {
                id: 'visualTone',
                label: 'Visual Theme',
                type: 'text',
                placeholder: 'e.g. Futuristic, Minimalist, Colorful...',
                directive: 'Note: This only affects looks, not how the code works.',
                required: false
            },
            {
                id: 'interactionEnergy',
                label: 'How should it feel to click?',
                type: 'select',
                options: ['Fast & Snappy', 'Smooth & Flowing', 'Solid & Heavy'],
                directive: 'Directive: This controls animations and buttons.',
                required: false
            }
        ]
    },
    {
        id: 'p6',
        name: 'Done vs Not Done',
        title: 'Phase 6 — Knowing When It Is Finished',
        description: 'Define exactly when the AI should stop working.',
        fields: [
            {
                id: 'doneMeans',
                label: 'What does "All Done" mean?',
                type: 'textarea',
                placeholder: 'e.g. The user sees a green checkmark and the file is saved.',
                directive: 'Directive: Be so clear that a robot could verify it.',
                required: true
            },
            {
                id: 'notDoneMeans',
                label: 'What indicates it is NOT finished yet?',
                type: 'textarea',
                placeholder: 'e.g. If the button is missing or if the screen crashes...',
                directive: 'Directive: Explain common mistakes the AI might make.',
                required: true
            },
            {
                id: 'safeToChange',
                label: 'What is okay for the AI to fix or polish later?',
                type: 'textarea',
                placeholder: 'e.g. Font sizes, small color tweaks, background icons...',
                directive: 'Directive: List things that aren\'t critical to the logic.',
                required: false
            }
        ]
    },
    {
        id: 'p7',
        name: 'Future Safety',
        title: 'Phase 7 — How to Handle Future Changes',
        description: 'Decide how the AI should behave if you ask for edits later.',
        fields: [
            {
                id: 'changeMode',
                label: 'How should the AI handle updates?',
                type: 'select',
                options: [
                    'Only make the tiniest possible change',
                    'Re-write whole sections if it helps',
                    'Ask me for permission before changing anything'
                ],
                directive: 'Guidance: This prevents the AI from breaking your code later.',
                required: true
            }
        ]
    }
];

export const STRIP_KEYWORDS = [
    'react', 'vue', 'nextjs', 'typescript', 'python', 'node', 'express',
    'supabase', 'tailwind', 'css', 'javascript', 'sql', 'database',
    'frontend', 'backend', 'api', 'framework', 'library'
];
