# MentorIA

This project provides an adaptive learning platform built with React.

## Data Types

Courses are described by the `Course` interface found in `project/src/types`.
A course may optionally include structured `chapters` which are defined by the
`Chapter` type. Each chapter lists its concepts so that teachers can create
targeted practice sessions.

The `structuredCourse.ts` file contains a simplified hierarchy used during
teacher onboarding. Courses built with the new page return a `Course` object
containing nested `chapters`, `subtopics`, and `concepts`.
