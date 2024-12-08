# List of Tasks

## 1. Registrácia, prihlásenie a odhlásenie používateľa

- [ ] Registrácia
  - [ ] Pripojiť backend
  - [ ] Kontrolovať unique email a nickname
  - [x] Zapísať cache do browsera
- [ ] Login
  - [ ] Pripojiť backend
  - [x] Zapísať cache do browsera
- [ ] Odhlásenie
  - [x] Vymazať cache z browsera

## 2. Používateľ vidí zoznam kanálov, v ktorých je členom

- [x] Odobrať kanál zo zoznamu pri vyhodení alebo odídení
  - [x] Aktualizovanie kanálov usera
  - [x] Aktualizovanie memberov kanála
- [x] Topovať a zvýrazniť kanál pri pozvánke
- [ ] Vedieť vytvoriť, opusiť a zrušiť (ak admin) kanál cez UI
  - [ ] Každý channel má meno
  - [ ] Pri zobrazení tlačidla na zrušenie kontrolovať, či je admin
  - [ ] Vytvorenie je pod všetkými kanálmi, v prípade overflowu je sticky na spodku
- [x] Kanály sú PUBLIC alebo PRIVATE
- [x] Admin je tvorca kanála

## 3. Odosielanie cez príkazový riadok

- [x] Odosielanie
  - [x] Rozdelenie či ide o command alebo správu

## 4. Vytvorenie kanála

- [x] Verejný kanál
  - [ ] Vie sa vytvoriť
  - [x] User ho vie joinuť
    - [x] Vytvorenie kanála ak neexistuje
  - [ ] Kick systém
- [ ] Súkromný kanál
  - [ ] Vie sa vytvoriť
  - [x] Invite a revoke len admin
- [ ] Kontrola unique názvu channelu
- [ ] Správca zatvára cez /quit

## 5. Zrušenie členstva

- [x] Odobrať kanál zo zoznamu pri odídení
  - [x] Aktualizovanie kanálov usera
  - [x] Aktualizovanie memberov kanála
- [x] Ak je admin, tak sa kanál ruší
- [ ] Spracovať stav keď nie je žiadny channel

## 6. Tagovanie userov v channeli

- [x] User sa taguje cez @
  - [x] pri napísaní @ sa zobrazuje menu so suggestions
  - [ ] limitovať suggestions na max 8
- [x] Zvýrazniť tagovaných userov v správe
- [ ] Možnosť tagnuť všetkých (@everyone)
