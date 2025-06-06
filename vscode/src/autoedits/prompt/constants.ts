import { ps } from '@sourcegraph/cody-shared'

export const LINT_ERRORS_TAG_OPEN = ps`<lint_errors>`
export const LINT_ERRORS_TAG_CLOSE = ps`</lint_errors>`
export const EXTRACTED_CODE_SNIPPETS_TAG_OPEN = ps`<extracted_code_snippets>`
export const EXTRACTED_CODE_SNIPPETS_TAG_CLOSE = ps`</extracted_code_snippets>`
export const SNIPPET_TAG_OPEN = ps`<snippet>`
export const SNIPPET_TAG_CLOSE = ps`</snippet>`
export const RECENT_SNIPPET_VIEWS_TAG_OPEN = ps`<recently_viewed_snippets>`
export const RECENT_SNIPPET_VIEWS_TAG_CLOSE = ps`</recently_viewed_snippets>`
export const RECENT_EDITS_TAG_OPEN = ps`<diff_history>`
export const RECENT_EDITS_TAG_CLOSE = ps`</diff_history>`
export const RECENT_COPY_TAG_OPEN = ps`<recent_copy>`
export const RECENT_COPY_TAG_CLOSE = ps`</recent_copy>`
export const FILE_TAG_OPEN = ps`<file>`
export const FILE_TAG_CLOSE = ps`</file>`
export const AREA_FOR_CODE_MARKER = ps`<<<AREA_AROUND_CODE_TO_REWRITE_WILL_BE_INSERTED_HERE>>>`
export const AREA_FOR_CODE_MARKER_OPEN = ps`<area_around_code_to_rewrite>`
export const AREA_FOR_CODE_MARKER_CLOSE = ps`</area_around_code_to_rewrite>`
export const CODE_TO_REWRITE_TAG_CLOSE = ps`</code_to_rewrite>`
export const CODE_TO_REWRITE_TAG_OPEN = ps`<code_to_rewrite>`

// Some common prompt instructions
export const SYSTEM_PROMPT = ps`You are an intelligent programmer and an expert at coding. Your goal is to help a colleague finish a code change.`
export const BASE_USER_PROMPT = ps`Help me finish a coding change. You will see snippets from current open files in my editor, files I have recently viewed, the file I am editing, then a history of my recent codebase changes, then current compiler and linter errors, content I copied from my codebase. You will then rewrite the <code_to_rewrite>, to match what you think I would do next in the codebase. Note: I might have stopped in the middle of typing.`
export const FINAL_USER_PROMPT = ps`Continue where I left off and finish my change by rewriting "code_to_rewrite":`
export const LONG_TERM_SNIPPET_VIEWS_INSTRUCTION = ps`Code snippets I have recently viewed, roughly from oldest to newest. Some may be irrelevant to the change:`
export const JACCARD_SIMILARITY_INSTRUCTION = ps`Code snippets I have extracted from open files in my code editor. Some may be irrelevant to the change:`
export const RECENT_EDITS_INSTRUCTION = ps`My recent edits, from oldest to newest:`
export const LINT_ERRORS_INSTRUCTION = ps`Linter errors from the code that you will rewrite:`
export const RECENT_COPY_INSTRUCTION = ps`Recently copied code from the editor:`
export const CURRENT_FILE_INSTRUCTION = ps`The file currently open:`
export const SHORT_TERM_SNIPPET_VIEWS_INSTRUCTION = ps`Code snippets just I viewed:`

export const LONG_SUGGESTION_BASE_USER_PROMPT = ps`Help me finish a coding change. You will see snippets from current open files in my editor, files I have recently viewed, the file I am editing, then a history of my recent codebase changes, then current compiler and linter errors, content I copied from my codebase. You will then rewrite the code between the <|editable_region_start|> and <|editable_region_end|> tags, to match what you think I would do next in the codebase. <|user_cursor_is_here|> indicates the position of the cursor in the the current file. Note: I might have stopped in the middle of typing.`
export const LONG_SUGGESTION_FINAL_USER_PROMPT = ps`Continue where I left off and finish my change by rewriting the code between the <|editable_region_start|> and <|editable_region_end|> tags:`

export const LONG_SUGGESTION_USER_CURSOR_MARKER = ps`<|user_cursor_is_here|>`
export const LONG_SUGGESTION_EDITABLE_REGION_START_MARKER = ps`<|editable_region_start|>`
export const LONG_SUGGESTION_EDITABLE_REGION_END_MARKER = ps`<|editable_region_end|>`
