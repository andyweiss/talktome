# Datenschutz und Altersfreigabe zur Durchsicht

Stand: 29. Oktober 2026. Vorbereitete Angaben für Talktome Intercom 1.0.0.
Die Store-Texte stehen in [app-store.json](app-store.json).

## App-Datenschutz

Vorgeschlagene Antwort in App Store Connect → App-Datenschutz → Erste Schritte:
**Nein, wir erheben keine Daten aus dieser App.**

Grundlage ist die Bestätigung des Herausgebers: aktuell ausschließlich ein Client,
kein Hosting-Angebot für reguläre Nutzer. Die App verbindet sich mit dem vom Nutzer
gewählten Server. Unabhängige Serverbetreiber bestimmen ihre eigene Verarbeitung.
Profile, Einstellungen und Zertifikatsfreigaben werden lokal gespeichert. Es gibt
keine eigene Analyse- oder Werbeintegration und keinen zentralen Profil-Upload.
Die QR-Kamera dient dem lokalen Einlesen; sie lädt keine Fotos oder Videos hoch.
Audio und Betriebsdaten gehen an den ausgewählten Server.

Apples Definition von „erheben“ betrifft Daten, die der Entwickler oder seine
Partner über die Bearbeitung einer Echtzeitanfrage hinaus abrufen können. Rein
lokale Verarbeitung zählt nicht dazu. Freiwillige, gelegentliche Support-Anfragen
außerhalb der Hauptfunktion können unter Apples Ausnahmen fallen.
[Apple: App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)

Vor dem Veröffentlichen des Labels noch einmal bestätigen, dass keine zusätzlichen
SDKs, eigenen Betriebsserver oder Diagnose-Endpunkte hinzugekommen sind. Die
Datenschutzerklärung allein beantwortet den Fragebogen nicht. Die URL wurde bereits
in beiden Store-Sprachen eingetragen; das Label ist noch nicht veröffentlicht.

Ein späteres Hosting-Angebot ist möglich. Vor dessen Start die tatsächlichen Daten,
Zwecke, Aufbewahrung, Dienstleister und Verantwortlichkeiten dokumentieren und
Datenschutzerklärung sowie Store-Angaben entsprechend aktualisieren. Einen nur für
Apple eingerichteten Review-Server einschließlich seiner Logs separat beschreiben.

Öffentliche Erklärung: https://platonstudio.de/talktome/privacy/
Deutsche Fassung: https://platonstudio.de/talktome/privacy/de/

## Altersfreigabe

Vorbereitete Antworten, noch nicht als endgültige Erklärung gespeichert:

| Frage | Vorschlag | Grundlage |
| --- | --- | --- |
| Messaging und Chat | Ja | Live-Sprachkommunikation zwischen Teilnehmern |
| Nutzergenerierte Inhalte | Ja | Von Teilnehmern übertragene Sprache |
| Uneingeschränkter Webzugriff | Nein | Kein eingebauter allgemeiner Webbrowser; Datenschutz-Link öffnet Safari |
| Werbung | Nein | Keine Werbeintegration |
| Altersprüfung / Kindersicherung | Nein / Nein | Keine entsprechenden Funktionen |
| Soziale Medien | Nein | Keine öffentliche Community oder Social-Media-Plattform |
| Medizin / Gesundheit | Keine / Nein | Kein entsprechender App-Inhalt |
| Glücksspiel / simuliertes Glücksspiel / Wettbewerbe / Lootboxen | Nein / Keine / Keine / Nein | Keine entsprechenden Funktionen |
| Gewalt, Waffen, Sexualität, Nacktheit, Horror, anzügliche Themen, Drogen, anstößige Sprache | Jeweils keine eingebauten entsprechenden Inhalte | Team-Kommunikation kann nutzergenerierte Sprache enthalten; tatsächlichen Einsatz und Apples Erläuterungen bei der Bestätigung prüfen |
| Kinderkategorie | Keine | Allgemeines Team-Werkzeug |
| Höhere freiwillige Altersgrenze | Zunächst keine | Apple berechnet die Einstufung aus den bestätigten Antworten |

Keine konkrete Altersstufe vorwegnehmen. Apple berechnet sie länderabhängig.
[Apple: Altersfreigabe festlegen](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/)

## Noch vor App Review

- Datenschutzauskunft und Altersfragen in App Store Connect durchsehen und bestätigen.
- Review-Server und zwei Demo-Konten sind im privaten App-Review-Bereich hinterlegt;
  Anmeldung und gegenseitige Sprechberechtigung geprüft. Zweiwege-Audio und
  Backup-Anmeldung/-Audio noch auf echten Geräten prüfen.
  Die öffentliche [Anleitungsvorlage](app-review-instructions.en.md) enthält keine Passwörter.
- Kontaktdaten für App Review eintragen; Zugangsdaten nur im geschützten Review-Bereich.
- Inhaltsrechte und regionale Verfügbarkeit bestätigen.
- Neue TestFlight-Version auf einem echten iPhone prüfen, insbesondere AirPods,
  Lautsprecher/Headset, Mikrofon, Hintergrundbetrieb, QR-Anmeldung und Watch/Widget.
- Build bewusst zur Store-Version auswählen und erst danach zur Prüfung einreichen.

Die Freigabeart steht auf **manuelle Veröffentlichung**. Es wurde keine App-Prüfung
und keine öffentliche Veröffentlichung ausgelöst.
