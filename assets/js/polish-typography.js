(function () {
  "use strict";

  const oneLetterWordPattern = /(?<![\p{L}\p{N}_])([aiouwz])(\s+)(?=\S)/giu;

  function joinOneLetterWords(textNodes) {
    let text = "";
    const positions = [];

    textNodes.forEach(function (node) {
      for (let offset = 0; offset < node.nodeValue.length; offset += 1) {
        text += node.nodeValue[offset];
        positions.push({ node: node, offset: offset });
      }
    });

    const matches = Array.from(text.matchAll(oneLetterWordPattern));

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

  function preventPolishWidows(paragraph) {
    let textNodes = [];

    function processTextNodes() {
      if (textNodes.length > 0) {
        joinOneLetterWords(textNodes);
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

      node.childNodes.forEach(visit);
    }

    visit(paragraph);
    processTextNodes();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll(".markdown-body > p, .markdown-body li > p, .markdown-body blockquote > p")
      .forEach(preventPolishWidows);
  });
})();
