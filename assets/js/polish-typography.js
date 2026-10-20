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

  function joinShortPolishWords(textNodes) {
    let text = "";
    const positions = [];

    textNodes.forEach(function (node) {
      for (let offset = 0; offset < node.nodeValue.length; offset += 1) {
        text += node.nodeValue[offset];
        positions.push({ node: node, offset: offset });
      }
    });

    const matches = Array.from(text.matchAll(shortPolishWordPattern));

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
    let textNodes = [];

    function processTextNodes() {
      if (textNodes.length > 0) {
        joinShortPolishWords(textNodes);
        textNodes = [];
      }
    }

    function visit(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      if (node.matches("code, pre, kbd, samp, script, style, br")) {
        processTextNodes();
        return;
      }

      const isNestedBlock =
        node !== paragraph &&
        node.matches("p, ul, ol, li, table, blockquote, div, h1, h2, h3, h4, h5, h6");

      if (isNestedBlock) processTextNodes();
      node.childNodes.forEach(visit);
      if (isNestedBlock) processTextNodes();
    }

    visit(paragraph);
    processTextNodes();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll(
        ".markdown-body p, .markdown-body li, .markdown-body h1, .markdown-body h2, " +
          ".markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6, " +
          ".markdown-body th, .markdown-body td, .markdown-body dt, .markdown-body dd, " +
          ".markdown-body figcaption"
      )
      .forEach(preventPolishOrphans);
  });
})();
