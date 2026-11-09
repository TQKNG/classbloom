# ClassBloom teacher demo

## Summary

Build a Vietnamese lesson-planning demo for teachers of grades 1-5. ClassBloom will use STEAM for Vietnam’s visual tokens in a distinct planning workspace. Lesson planning is the only complete creation flow; quiz and worksheet tools appear as previews.

## Implementation

- **Stack:** Scaffold a Next.js App Router project with TypeScript and Tailwind CSS. Use shadcn/ui for controls, React Hook Form with Zod validation for planning inputs, and Zustand for lesson drafts and saved plans. Keep generation entirely in client-side TypeScript, with no API routes, model calls, or backend. The current machine has Node 16; update it to a supported version before scaffolding, since current Next.js requires Node 20.9 or later. [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- **Design system:** Adapt the earlier STEAM for Vietnam extraction: Quicksand typography; primary blue `#447AFF`; heading navy `#172B4D`; body gray `#6B778C`; muted gray `#97A0AF`; white surfaces; and restrained soft accent backgrounds. Use its 40 px page, 36 px section, 20 px introductory, 16 px control, and 14 px supporting type scale. ClassBloom gets its own wordmark, top navigation, split workspace, and lesson-focused components rather than MagicSchool’s tool-card layout.
- **Screens and components:** Provide a home view with a primary “Soạn bài mới” action and recent plans, a planner with an input panel and editable lesson preview, and a saved-plans view. Build reusable shadcn-based fields, buttons, cards, tabs, dialogs, feedback messages, and an agent refinement panel. Include responsive mobile layouts, visible keyboard focus, clear labels, and a print layout.
- **Lesson workflow:** Collect grade, subject, topic, duration, objective, materials, and optional support needs. Provide three curated examples. Generate a practical plan with objectives, preparation, timed activities, checks for understanding, adaptations, and a closing activity. Guided actions can shorten the plan, add group work, or add learner support. Teachers can edit sections, save, reopen, and print.
- **Mock behavior:** Use typed lesson data and pure, deterministic generation functions so inputs and refinements produce consistent visible changes. Persist saved plans through Zustand’s local-storage middleware, with client hydration handled explicitly. Label generated content as a simulated AI demo. [Zustand persistence](https://zustand.docs.pmnd.rs/reference/middlewares/persist)

## Verification

- Test required-field guidance, all three examples, custom topics, duration totals, refinement actions, editing, saving, reopening, and printing.
- Run type checking, linting, and a production build. Check for hydration errors and unintended network requests.
- Inspect desktop and mobile views, keyboard navigation, focus states, contrast, and Vietnamese text rendering.

## Assumptions

“1-5” means Vietnamese primary grades 1 through 5. ClassBloom adapts STEAM for Vietnam’s colors and typography, while retaining its own layout and identity. The app stores demo plans only in the current browser.

