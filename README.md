
Sörfőző alkalmazást szeretnénk fejleszteni.

A fő funkciók:
- alapanyagkezelés
- raktárkészletkezelés
- receptkezelés
- főzetkezelés
- jogosultságkezelés

A backend legyen `json-server`: [https://github.com/typicode/json-server](https://github.com/typicode/json-server)
- kommitolj egy `db.json` fájlt értelmes tesztadatokkal
- a bekommitolt `db.json` fájl mindig legyen konzisztens
    - a mentor ezt fogja használni a review során

__implementációs követelmények__
- service rétegbe izolált http kommunikáció
- lazy loading használata
- minél reaktívabb kód (async pipe, .subscribe() kerülése, ...)
    - de nem feltétlenül minden áron
- reszponzív dizájn
- külső komponenskönyvtár, css keretrendszer nem használható



## munkarend

- a megoldásodat egy saját privát repóban írd meg
- a repó nevét a projekt azonosítóból és a nevedből konstruáld, pl. `brew-manager-frontend-gipsz-jakab`
- a feladatok mappákba vannak csoportosítva és sorrendezve vannak
- sorszámozott mappánként egy külön branch
    - a branch nevét a feladatkiírás elérési útvonala alapján konstruáljuk, pl.
        - `01-alapanyagok-01-alapanyag-felvitel`
- minden nap végén pusholj
- pull request irányelvek
    - [The (written) unwritten guide to pull requests](https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests)
- code review irányelvek
    - [Effective Code Reviews](https://addyosmani.com/blog/code-reviews/)

## code review

- nem szeniorokat képezünk
    - nem kell 100%-ban ragaszkodni a tökéletes megoldáshoz
    - a cél, hogy a mentorált értse, amit csinál és gyakorlatot szerezzen
- code review irányelvek
    - [Effective Code Reviews](https://addyosmani.com/blog/code-reviews/)
    - nem kell mindenre kiterjedő review
        - a lényeg, hogy tanuljon a mentorált valamit
    - ha nem találsz javítanivalót, adj pozitív visszajelzést a jó megoldásra
    - review linkjét másold be az értékelő táblázatba

## értékelés

- szempontonként 0-2 pont
- minden red flag -1 pont
- 2 pontról indulunk, ha a mentor elfogadhatónak ítéli a megoldást
- 1 pontról indulunk, ha részben megfelel a követelményeknek a megoldás, de van
  olyan javaslat, amit feltétlenül fontosnak tart a mentor
- angular patternek használata
    - jól felismerhetően, helyesen használja-e a közismert angular patterneket?
        - service with subject
        - lifting state up
        - smart és dumb component
        - shared modul és feature modulok
        - lazy loading
    - red flag
        - alapvető ismeret hiányából eredő egzotikus/túlbonyolított megoldás
- typescript használat
    - jól felismerhetően, helyesen használja-e a közismert typescript patterneket?
        - interface használata generikus típusparaméterként
        - típusinformáció, ahol csak lehet
    - red flag
        - any
- reaktív gondolkodásmód
    - jól felismerhetően, helyesen alkalmazza-e a közismert reaktív patterneket?
    - red flag
        - async pipe helyett subscribe + értékadás
        - tap operátor túlhasználata; tap + értékadás
- olvasható, igényes kód
    - red flag
        - kikommentelt kód
        - csálé, inkonzisztens formázás
        - semmitmondó azonosítók, rövidítések
- karbantartható kód
    - jól felismerhetően, helyesen alkalmazza-e a közismert alapvetéseket?
        - SOLID elvek
        - rétegelt, moduláris architektúra
        - feature slice-ok használata
        - konstansok használata magic value helyett
        - egy függvény egy dolgot csinál
        - minél kevesebb mellékhatás
        -
    - red flag
        - copy paste, duplikált kód
        - stackoverflow kód
- tesztek: TODO

<!--
- értékelés
    - értékelő táblázat: https://kriszoft-my.sharepoint.com/:x:/g/personal/szucs_laszlo_novaservices_hu/ES4TJjkEShhPiZJg5ZT4FOkB5kwV1mKWLoXokGrcgGi1BQ?e=fUqUQL
    - ha valamely témakörrel kapcsolatban az az érzésed, hogy még erősíteni kell,
      tüntesd fel az értékelő táblázatban
-->

01-alapanyagok/01-alapanyag-felvitel
