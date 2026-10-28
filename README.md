# Motyw instrukcji laboratoryjnych

Motyw Jekyll dla GitHub Pages, oparty na oryginalnym layoucie i stylach [Primer v0.6.0](https://github.com/pages-themes/primer/tree/v0.6.0). Można go użyć w tym repozytorium jako strony demonstracyjnej albo podpiąć do innych witryn Jekyll przez `remote_theme`.

## Publikacja w GitHub Pages

1. Opublikuj to repozytorium jako publiczne repozytorium GitHub.
2. W repozytorium strony, która ma używać motywu, ustaw w `_config.yml`:

   ```yml
   remote_theme: TWOJ_LOGIN/TWOJE_REPO@v1.0.0
   plugins:
     - jekyll-remote-theme
   kramdown:
     input: GFM
     parse_block_html: true
   ```

   Zastąp `TWOJ_LOGIN/TWOJE_REPO` właścicielem i nazwą tego repozytorium. Po opublikowaniu tagu `v1.0.0` można przypinać strony do tej wersji.
3. Ustaw `title`, `description` i `lang` w konfiguracji własnej strony, a treść instrukcji dodaj jako pliki Markdown.

GitHub Pages obsługuje `remote_theme` z repozytorium GitHub; plugin `jekyll-remote-theme` pobiera wskazaną wersję podczas budowania strony.

`_layouts/default.html` zachowuje układ Primer, `assets/css/style.scss` importuje jego oryginalne style i justuje akapity z automatycznym dzieleniem wyrazów. Fragmenty kodu nie są dzielone. Skrypt `assets/js/polish-typography.js` łączy twardą spacją częste krótkie polskie wyrazy (np. `a`, `i`, `w`, `z`, `do`, `na`, `po`, `że`) z następnym wyrazem, również gdy jest on zapisany jako kod inline lub wzór matematyczny, pomijając zawartość bloków kodu, diagramów i równań. Panel w prawym górnym rogu pozwala przełączać motyw jasny/ciemny oraz maksymalną szerokość linii tekstu (`45`, `55`, `65`, `80` lub `100` znaków, domyślnie `55`), dopasowując jednocześnie szerokość zdjęć, bloków kodu, tabel, diagramów i wzorów; oba ustawienia są zapamiętywane w `localStorage`. `_includes/head-custom.html` odpowiada za renderowanie diagramów `mermaid` oraz równań matematycznych `MathJax` (`$...$`, `$$...$$`, `\(...\)`, `\[...\]` i bloków `math`/`latex`) z zabezpieczeniem przed utratą lub uszkodzeniem elementów podczas przełączania motywu jasny/ciemny i zmiany szerokości kolumny. `index.md` służy jako demonstracyjna instrukcja i wzór treści.

## Podpisy kodu, obrazów i tabel

Element `figure` grupuje treść z jej podpisem `figcaption`. Atrybut `markdown="1"` pozwala używać zwykłego Markdown wewnątrz. Zachowuj puste linie oddzielające podpis, kod, obraz lub tabelę, tak jak w przykładach.

### Kod — nazwa pliku nad blokiem

````markdown
<figure class="code-example" markdown="1">
<figcaption>Person.java</figcaption>

```java
public class Person {
    private String name;
}
```

</figure>
````

Możesz podać też ścieżkę, np. `src/main/java/Person.java`. Długie nazwy zawijają się do szerokości kolumny. Podpis pozostaje poza blokiem kodu, a kolorowanie składni określa język po otwierających trzech znakach backtick.

### Obraz — podpis nad ilustracją

```markdown
<figure class="image-example" markdown="1">
<figcaption>Rysunek 1. Układ okna aplikacji</figcaption>

![Okno z menu po lewej i panelem treści po prawej](/assets/images/okno.png)

</figure>
```

Zastąp adres obrazu własnym. Gdy strona ma ustawione `baseurl`, zastosuj filtr Jekylla `relative_url`, tak jak w demonstracji `index.md`. Tekst alternatywny w `![...]` opisuje zawartość obrazu; podpis może podawać jego tytuł, numer lub źródło.

### Tabela — podpis nad tabelą

```markdown
<figure class="table-example" markdown="1">
<figcaption>Tabela 1. Pola klasy Person</figcaption>

| Pole | Typ |
| --- | --- |
| name | String |
| age | int |

</figure>
```

W tym wariancie `figcaption` umieść **przed tabelą**. Motyw obsługuje również natywny element HTML `caption` wewnątrz `table` i wyświetla go nad tabelą. Wybierz jeden rodzaj podpisu dla danej tabeli.

Wszystkie podpisy dopasowują kolory do jasnego i ciemnego motywu. W tekście podpisów zapisanych jako HTML zamieniaj `&` na `&amp;` i `<` na `&lt;`.

## Podgląd lokalny

Po zainstalowaniu Ruby i Bundlera można uruchomić demonstrację lokalnie:

```sh
bundle install
bundle exec jekyll serve
```

## Licencja i pochodzenie

Motyw zawiera zmodyfikowany układ HTML z [Primer v0.6.0](https://github.com/pages-themes/primer/tree/v0.6.0) i korzysta z jego stylów. Oryginalne elementy Primer są udostępniane na licencji MIT: **Copyright (c) 2016-2017 GitHub, Inc.**

Pełny, niezmieniony tekst licencji wraz z informacją copyright znajduje się w [`_includes/licenses/primer-MIT.txt`](_includes/licenses/primer-MIT.txt). Motyw dołącza go również do komentarzy w generowanym HTML i CSS. Przy dalszym rozpowszechnianiu kopii lub istotnych części kodu Primer należy zachować informację copyright i tekst licencji. Pochodzenie wykorzystanych elementów opisano w [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
