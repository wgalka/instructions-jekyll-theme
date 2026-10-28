---
title: LAB — Tytuł instrukcji
---

# LAB — Tytuł instrukcji

## Nazwa przedmiotu lub kursu

**Czas:** 90–120 minut zajęć; przygotowanie środowiska przed zajęciami, dokończenie implementacji, testów i README po zajęciach.

**Technologia:** uzupełnij technologie używane na laboratorium.

**Forma:** indywidualnie lub w parach.

**Rezultat:** opisz, co student powinien mieć po zakończeniu pracy.

## 1. Cele i zakres laboratorium

Po laboratorium powinieneś:

- wyjaśnić najważniejsze pojęcia;
- wykonać zadania w przygotowanym projekcie;
- zweryfikować rozwiązanie testami;
- opisać decyzje i ograniczenia w README.

### Zachowanie ciągłości projektu

<figure class="table-example" markdown="1">

| Etap wcześniejszy | Rozwinięcie w tym laboratorium |
| --- | --- |
| Dotychczasowe wymaganie | Co należy zachować |
| Istniejący kod i testy | Co należy rozwinąć |

<figcaption>Tabela 1. Powiązanie z wcześniejszymi zajęciami</figcaption>
</figure>

## 2. Organizacja pracy

Opisz kolejność realizacji ćwiczeń, wymagane przygotowanie oraz punkt kontrolny na koniec zajęć.

### Przykładowy fragment kodu

```python
def example() -> str:
    return "Uzupełnij ćwiczenie"
```

### Fragment kodu z nazwą pliku

<figure class="code-example" markdown="1">
<figcaption>Person.java</figcaption>

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}
```

</figure>

### Ilustracja z podpisem

<figure class="image-example" markdown="1">
<figcaption>Rysunek 1. Przykładowy układ okna aplikacji</figcaption>

![Okno aplikacji z paskiem tytułu, menu po lewej i panelem treści po prawej]({{ '/assets/images/example-layout.svg' | relative_url }})

</figure>

### Przykładowy wzór matematyczny

Złożoność obliczeniowa wynosi $O(n \log n)$, a błąd średniokwadratowy wyraża się wzorem:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} \left( y_i - \hat{y}_i \right)^2
$$

### Przykładowy diagram

```mermaid
flowchart LR
    Student --> Instrukcja
    Instrukcja --> Projekt
    Projekt --> Testy
```

## 3. Kryteria zaliczenia

| Obszar | Wymaganie | Punkty |
| --- | --- | ---: |
| Implementacja | Rozwiązanie działa zgodnie z wymaganiami | 60 |
| Dokumentacja | README opisuje uruchomienie i weryfikację | 40 |
| **Razem** |  | **100** |
