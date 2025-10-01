# Plan Directory Structure

This directory contains all planning documents organized by development phase.

## Structure

```
plan/
├── README.md              # This file - explains structure
└── phase-1-mvp/          # Phase 1: MVP Development
    ├── prd.md            # Product Requirements Document
    └── tasks.md          # Task tracking and progress
```

## How to Use

### Starting a New Phase

When starting a new development phase:

1. Create a new folder: `phase-X-[name]/`
2. Add `prd.md` - Product requirements for the phase
3. Add `tasks.md` - Task tracking (use phase-1-mvp/tasks.md as template)

Example:
```bash
mkdir plan/phase-2-user-accounts
# Then create prd.md and tasks.md in that folder
```

### Current Phase

**Active Phase**: Phase 1 - MVP
**Location**: `/plan/phase-1-mvp/`
**Status**: In Progress

To resume work, read:
1. `/plan/phase-1-mvp/prd.md` - Understand scope
2. `/plan/phase-1-mvp/tasks.md` - See progress and next steps

## Future Phases (Planned)

- **Phase 2**: File upload + transcription
- **Phase 3**: User accounts and saved content
- **Phase 4**: Custom templates and brand voice
