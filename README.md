# Motyw instrukcji laboratoryjnych

Motyw Jekyll dla GitHub Pages, oparty na oryginalnym layoucie i stylach [Primer v0.6.0](https://github.com/pages-themes/primer/tree/v0.6.0). Można go użyć w tym repozytorium jako strony demonstracyjnej albo podpiąć do innych witryn Jekyll przez `remote_theme`.

## Publikacja w GitHub Pages

1. Opublikuj to repozytorium jako publiczne repozytorium GitHub.
2. W repozytorium strony, która ma używać motywu, ustaw w `_config.yml`:

   ```yml
   remote_theme: TWOJ_LOGIN/TWOJE_REPO@v1.0.0
   plugins:
     - jekyll-remote-theme
   ```

   Zastąp `TWOJ_LOGIN/TWOJE_REPO` właścicielem i nazwą tego repozytorium. Po opublikowaniu tagu `v1.0.0` można przypinać strony do tej wersji.
3. Ustaw `title`, `description` i `lang` w konfiguracji własnej strony, a treść instrukcji dodaj jako pliki Markdown.

GitHub Pages obsługuje `remote_theme` z repozytorium GitHub; plugin `jekyll-remote-theme` pobiera wskazaną wersję podczas budowania strony.

`_layouts/default.html` zachowuje układ Primer, `assets/css/style.scss` importuje jego oryginalne style i justuje akapity z automatycznym dzieleniem wyrazów. Fragmenty kodu nie są dzielone. Skrypt `assets/js/polish-typography.js` łączy twardą spacją częste krótkie polskie wyrazy (np. `a`, `i`, `w`, `z`, `do`, `na`, `po`, `że`) z następnym wyrazem, również gdy jest on zapisany jako kod inline. Działa w akapitach, nagłówkach, listach, tabelach i podpisach, pomijając fragmenty kodu. Przełącznik motywu w prawym górnym rogu domyślnie odczytuje preferencję systemu, a ręczny wybór zapamiętuje w `localStorage`. `_includes/head-custom.html` dodaje renderowanie bloków `mermaid` z paletą dopasowaną do motywu. `index.md` służy jako demonstracyjna instrukcja i wzór treści.

## Podgląd lokalny

Po zainstalowaniu Ruby i Bundlera można uruchomić demonstrację lokalnie:

```sh
bundle install
bundle exec jekyll serve
```

## Licencja i pochodzenie

Układ HTML został oparty na pliku `_layouts/default.html` z `pages-themes/primer` w wersji `v0.6.0`. Primer jest udostępniany na licencji MIT; zachowaj informację o licencji przy dalszym rozpowszechnianiu motywu.
