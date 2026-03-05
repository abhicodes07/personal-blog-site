import re
from markdown.preprocessors import Preprocessor
from markdown.extensions import Extension

# Matches the opening line:  > [!TYPE] Optional Title
CALLOUT_START = re.compile(r"^\s*>\s*\[!(\w+)\]\s*(.*)?$", re.IGNORECASE)
# Matches subsequent blockquote content lines:  > some text
CALLOUT_BODY = re.compile(r"^\s*>\s?(.*)$")


class ObsidianCalloutPreprocessor(Preprocessor):
    def run(self, lines):
        new_lines = []
        i = 0
        while i < len(lines):
            start = CALLOUT_START.match(lines[i])
            if start:
                callout_type = start.group(1).lower()
                title = start.group(2).strip()

                if title:
                    new_lines.append(f'!!! {callout_type} "{title}"')
                else:
                    new_lines.append(f"!!! {callout_type}")

                i += 1
                # Consume all following `> ...` lines as indented body
                while i < len(lines):
                    body = CALLOUT_BODY.match(lines[i])
                    if body and not CALLOUT_START.match(lines[i]):
                        new_lines.append(f"    {body.group(1)}")
                        i += 1
                    else:
                        break
            else:
                new_lines.append(lines[i])
                i += 1

        return new_lines


class ObsidianCalloutExtension(Extension):
    def extendMarkdown(self, md):
        # Priority 175 — runs before blockquote processing (priority 70)
        md.preprocessors.register(
            ObsidianCalloutPreprocessor(md), "obsidian_callout", 175
        )


def makeExtension(**kwargs):
    return ObsidianCalloutExtension(**kwargs)
