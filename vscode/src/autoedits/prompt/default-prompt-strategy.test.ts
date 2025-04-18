import { describe, expect, it } from 'vitest'

import {
    type AutoEditsTokenLimit,
    type AutocompleteContextSnippet,
    testFileUri,
} from '@sourcegraph/cody-shared'

import { RetrieverIdentifier } from '../../completions/context/utils'
import { getCurrentDocContext } from '../../completions/get-current-doc-context'
import { documentAndPosition } from '../../completions/test-helpers'

import type { UserPromptArgs } from './base'
import { DefaultUserPromptStrategy } from './default-prompt-strategy'
import { getCodeToReplaceData } from './prompt-utils'

describe('DefaultUserPromptStrategy', () => {
    const promptProvider = new DefaultUserPromptStrategy()

    const getContextItem = (
        content: string,
        timeSinceActionMs: number,
        identifier: string,
        filePath = 'foo.ts'
    ): AutocompleteContextSnippet => ({
        type: 'file',
        content,
        identifier,
        uri: testFileUri(filePath),
        startLine: 0,
        endLine: 0,
        metadata: {
            timeSinceActionMs,
        },
    })

    const getUserPromptData = ({
        shouldIncludeContext,
    }: { shouldIncludeContext: boolean }): UserPromptArgs => {
        const prefix = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join('\n')
        const suffix = Array.from({ length: 50 }, (_, i) => `line ${50 + i + 1}`).join('\n')
        const textContent = `${prefix}█\n${suffix}`

        const { document, position } = documentAndPosition(textContent)
        const docContext = getCurrentDocContext({
            document,
            position,
            maxPrefixLength: 100,
            maxSuffixLength: 100,
        })
        const tokenBudget: AutoEditsTokenLimit = {
            prefixTokens: 10,
            suffixTokens: 10,
            maxPrefixLinesInArea: 20,
            maxSuffixLinesInArea: 20,
            codeToRewritePrefixLines: 3,
            codeToRewriteSuffixLines: 3,
            contextSpecificTokenLimit: {
                [RetrieverIdentifier.RecentViewPortRetriever]: 100,
                [RetrieverIdentifier.RecentEditsRetriever]: 100,
                [RetrieverIdentifier.RecentCopyRetriever]: 100,
                [RetrieverIdentifier.JaccardSimilarityRetriever]: 100,
                [RetrieverIdentifier.DiagnosticsRetriever]: 100,
            },
        }

        const codeToReplaceData = getCodeToReplaceData({
            docContext,
            document,
            position,
            tokenBudget,
        })

        const context: AutocompleteContextSnippet[] = shouldIncludeContext
            ? [
                  getContextItem(
                      'view port context 1',
                      100,
                      RetrieverIdentifier.RecentViewPortRetriever,
                      'test0.ts'
                  ),
                  getContextItem(
                      'view port context 2',
                      100,
                      RetrieverIdentifier.RecentViewPortRetriever,
                      'test1.ts'
                  ),
                  getContextItem(
                      'view port context 3',
                      60 * 1000,
                      RetrieverIdentifier.RecentViewPortRetriever,
                      'test2.ts'
                  ),
                  getContextItem(
                      'view port context 4',
                      120 * 1000,
                      RetrieverIdentifier.RecentViewPortRetriever,
                      'test3.ts'
                  ),

                  getContextItem(
                      'recent edits context 1',
                      100,
                      RetrieverIdentifier.RecentEditsRetriever,
                      'test0.ts'
                  ),
                  getContextItem(
                      'recent edits context 2',
                      100,
                      RetrieverIdentifier.RecentEditsRetriever,
                      'test0.ts'
                  ),
                  getContextItem(
                      'recent edits context 3',
                      60 * 1000,
                      RetrieverIdentifier.RecentEditsRetriever,
                      'test3.ts'
                  ),
                  getContextItem(
                      'recent edits context 4',
                      120 * 1000,
                      RetrieverIdentifier.RecentEditsRetriever,
                      'test3.ts'
                  ),
                  getContextItem(
                      'recent edits context 5',
                      120 * 1000,
                      RetrieverIdentifier.RecentEditsRetriever,
                      'test2.ts'
                  ),

                  getContextItem(
                      'diagnostics context 1',
                      60 * 1000,
                      RetrieverIdentifier.DiagnosticsRetriever,
                      'test1.ts'
                  ),
                  getContextItem(
                      'diagnostics context 2',
                      120 * 1000,
                      RetrieverIdentifier.DiagnosticsRetriever,
                      'test1.ts'
                  ),
                  getContextItem(
                      'diagnostics context 3',
                      120 * 1000,
                      RetrieverIdentifier.DiagnosticsRetriever,
                      'test2.ts'
                  ),

                  getContextItem(
                      'recent copy context 1',
                      120 * 1000,
                      RetrieverIdentifier.RecentCopyRetriever,
                      'test1.ts'
                  ),
                  getContextItem(
                      'recent copy context 2',
                      120 * 1000,
                      RetrieverIdentifier.RecentCopyRetriever,
                      'test2.ts'
                  ),

                  getContextItem(
                      'jaccard similarity context 1',
                      120 * 1000,
                      RetrieverIdentifier.JaccardSimilarityRetriever,
                      'test1.ts'
                  ),
                  getContextItem(
                      'jaccard similarity context 2',
                      120 * 1000,
                      RetrieverIdentifier.JaccardSimilarityRetriever,
                      'test2.ts'
                  ),
              ]
            : []

        return {
            context,
            codeToReplaceData,
            document,
            tokenBudget,
        }
    }

    it('creates prompt with the context source with context', () => {
        const userPromptData = getUserPromptData({ shouldIncludeContext: true })
        const prompt = promptProvider.getUserPrompt(userPromptData)
        expect(prompt.toString()).toMatchInlineSnapshot(`
          "Help me finish a coding change. You will see snippets from current open files in my editor, files I have recently viewed, the file I am editing, then a history of my recent codebase changes, then current compiler and linter errors, content I copied from my codebase. You will then rewrite the <code_to_rewrite>, to match what you think I would do next in the codebase. Note: I might have stopped in the middle of typing.

          Code snippets I have extracted from open files in my code editor. Some may be irrelevant to the change:
          <extracted_code_snippets>
          <snippet>
          (\`test1.ts\`)

          jaccard similarity context 1
          </snippet>
          <snippet>
          (\`test2.ts\`)

          jaccard similarity context 2
          </snippet>
          </extracted_code_snippets>

          Code snippets I have recently viewed, roughly from oldest to newest. Some may be irrelevant to the change:
          <recently_viewed_snippets>
          <snippet>
          (\`test3.ts\`)

          view port context 4
          </snippet>
          <snippet>
          (\`test2.ts\`)

          view port context 3
          </snippet>
          <snippet>
          (\`test1.ts\`)

          view port context 2
          </snippet>
          <snippet>
          (\`test0.ts\`)

          view port context 1
          </snippet>
          </recently_viewed_snippets>

          The file currently open:(\`test.ts\`)
          <file>
          <<<AREA_AROUND_CODE_TO_REWRITE_WILL_BE_INSERTED_HERE>>>
          </file>

          My recent edits, from oldest to newest:
          <diff_history>
          test2.ts
          recent edits context 5
          test3.ts
          recent edits context 4
          test3.ts
          recent edits context 3
          test0.ts
          recent edits context 2
          test0.ts
          recent edits context 1
          </diff_history>

          Linter errors from the code that you will rewrite:
          <lint_errors>
          (\`test1.ts\`)

          diagnostics context 1

          diagnostics context 2

          (\`test2.ts\`)

          diagnostics context 3
          </lint_errors>

          Recently copied code from the editor:
          <recent_copy>
          (\`test1.ts\`)

          recent copy context 1

          (\`test2.ts\`)

          recent copy context 2
          </recent_copy>

          <area_around_code_to_rewrite>
          line 37
          line 38
          line 39
          line 40
          line 41
          line 42
          line 43
          line 44
          line 45
          line 46

          <code_to_rewrite>
          line 47
          line 48
          line 49
          line 50
          line 51
          line 52
          line 53

          </code_to_rewrite>
          line 54
          line 55
          line 56
          line 57
          line 58
          line 59
          line 60
          line 61
          line 62
          line 63
          line 64

          </area_around_code_to_rewrite>

          Continue where I left off and finish my change by rewriting "code_to_rewrite":"
        `)
    })

    it('creates a prompt in the correct format', () => {
        const userPromptData = getUserPromptData({ shouldIncludeContext: false })
        const prompt = promptProvider.getUserPrompt(userPromptData)
        expect(prompt.toString()).toMatchInlineSnapshot(`
          "Help me finish a coding change. You will see snippets from current open files in my editor, files I have recently viewed, the file I am editing, then a history of my recent codebase changes, then current compiler and linter errors, content I copied from my codebase. You will then rewrite the <code_to_rewrite>, to match what you think I would do next in the codebase. Note: I might have stopped in the middle of typing.

          The file currently open:(\`test.ts\`)
          <file>
          <<<AREA_AROUND_CODE_TO_REWRITE_WILL_BE_INSERTED_HERE>>>
          </file>

          <area_around_code_to_rewrite>
          line 37
          line 38
          line 39
          line 40
          line 41
          line 42
          line 43
          line 44
          line 45
          line 46

          <code_to_rewrite>
          line 47
          line 48
          line 49
          line 50
          line 51
          line 52
          line 53

          </code_to_rewrite>
          line 54
          line 55
          line 56
          line 57
          line 58
          line 59
          line 60
          line 61
          line 62
          line 63
          line 64

          </area_around_code_to_rewrite>

          Continue where I left off and finish my change by rewriting "code_to_rewrite":"
        `)
    })
})
