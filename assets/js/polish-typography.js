(function () {
  "use strict";

  const shortPolishWords = [
    "a", "i", "o", "u", "w", "z",
    "aż", "bo", "by", "ci", "co", "do", "go", "im", "ja", "je",
    "ją", "ku", "ma", "mi", "my", "na", "ni", "no", "od", "on",
    "po", "są", "ta", "te", "to", "tu", "tę", "ty", "we", "wy",
    "za", "ze", "że",
  ];
  const shortPolishWordAlternation = shortPolishWords
    .sort(function (left, right) {
      return right.length - left.length;
    })
    .join("|");
  const shortPolishWordPattern = new RegExp(
    "(?<![\\p{L}\\p{N}_])(" + shortPolishWordAlternation + ")(\\s+)(?=\\S)",
    "giu"
  );
  const shortPolishWordBeforeInlineTokenPattern = new RegExp(
    "(?<![\\p{L}\\p{N}_])(" + shortPolishWordAlternation + ")(\\s+)$",
    "iu"
  );
  const mathSegmentPattern =
    /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^\$\n]+?(?<!\\)\$/gu;

  function findMathRanges(text) {
    const ranges = [];
    for (const match of text.matchAll(mathSegmentPattern)) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    return ranges;
  }

  function isInsideMathRange(index, ranges) {
    for (let i = 0; i < ranges.length; i += 1) {
      if (index >= ranges[i].start && index < ranges[i].end) {
        return true;
      }
    }
    return false;
  }

  function joinShortPolishWords(textNodes, followedByInlineToken) {
    let text = "";
    const positions = [];

    textNodes.forEach(function (node) {
      for (let offset = 0; offset < node.nodeValue.length; offset += 1) {
        text += node.nodeValue[offset];
        positions.push({ node: node, offset: offset });
      }
    });

    const mathRanges = findMathRanges(text);
    const matches = Array.from(text.matchAll(shortPolishWordPattern)).filter(
      function (match) {
        return !isInsideMathRange(match.index, mathRanges);
      }
    );

    if (followedByInlineToken) {
      const trailingMatch = text.match(shortPolishWordBeforeInlineTokenPattern);
      if (
        trailingMatch &&
        !isInsideMathRange(trailingMatch.index, mathRanges)
      ) {
        matches.push(trailingMatch);
      }
    }

    matches.sort(function (left, right) {
      return left.index - right.index;
    });
    matches.reverse().forEach(function (match) {
      const whitespaceStart = match.index + match[1].length;
      const whitespaceEnd = whitespaceStart + match[2].length;

      for (let index = whitespaceEnd - 1; index > whitespaceStart; index -= 1) {
        const position = positions[index];
        position.node.nodeValue =
          position.node.nodeValue.slice(0, position.offset) +
          position.node.nodeValue.slice(position.offset + 1);
      }

      const position = positions[whitespaceStart];
      position.node.nodeValue =
        position.node.nodeValue.slice(0, position.offset) +
        "\u00a0" +
        position.node.nodeValue.slice(position.offset + 1);
    });
  }

  function preventPolishOrphans(paragraph) {
    if (
      paragraph.closest(
        ".mermaid, .mermaid-block, .math-block, mjx-container, .MathJax, svg, math"
      )
    ) {
      return;
    }

    let textNodes = [];

    function processTextNodes(followedByInlineToken) {
      if (textNodes.length > 0) {
        joinShortPolishWords(textNodes, followedByInlineToken);
        textNodes = [];
      }
    }

    function visit(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      if (
        node.matches(
          "pre, script, style, br, svg, math, .mermaid, .mermaid-block, .math-block"
        )
      ) {
        processTextNodes();
        return;
      }

      if (
        node.matches(
          "code, kbd, samp, mjx-container, .MathJax, .math-inline"
        )
      ) {
        processTextNodes(true);
        return;
      }

      const isNestedBlock =
        node !== paragraph &&
        node.matches(
          "p, ul, ol, li, table, blockquote, div, h1, h2, h3, h4, h5, h6"
        );

      if (isNestedBlock) processTextNodes();
      node.childNodes.forEach(visit);
      if (isNestedBlock) processTextNodes();
    }

    visit(paragraph);
    processTextNodes();
  }

  function applyPolishTypography() {
    document
      .querySelectorAll(
        ".markdown-body p, .markdown-body li, .markdown-body h1, .markdown-body h2, " +
          ".markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6, " +
          ".markdown-body th, .markdown-body td, .markdown-body dt, .markdown-body dd, " +
          ".markdown-body figcaption"
      )
      .forEach(preventPolishOrphans);
  }

  window.applyPolishTypography = applyPolishTypography;

  document.addEventListener("DOMContentLoaded", function () {
    applyPolishTypography();
  });
})();
