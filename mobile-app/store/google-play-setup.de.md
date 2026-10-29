# Google Play: Einrichtung und Betatests

Stand: 29. Oktober 2026. App: **Talktome Intercom**,
Paketname **`com.talktome.mobile`**. Standard-Store-Sprache **en-US**, zusätzlich
Deutsch. Texte stehen in [google-play.json](google-play.json).

Der Herausgeber hat ein **neues persönliches Entwicklerkonto** bestätigt.
Ein Google-Service-Konto für Play ist noch nicht eingerichtet. Für den späteren
Produktionszugang ist deshalb der unten beschriebene geschlossene Test mit zwölf
Testern über 14 Tage einzuplanen; ein interner Test allein genügt nicht.

## Bereits vorbereitet

- Android-Paketname und Production-AAB-Profil in der App-Konfiguration.
- Android-Upload-Keystore in EAS unter `@talktomecomm/talktome`,
  Application Identifier `com.talktome.mobile`, Build Credentials „Talktome Play Upload“.
  Dieser Schlüssel ist keine JSON-Datei für die Google-API. Er signiert das AAB.
- Einreichungsprofil: Track `internal`, Release-Status `draft`.
- Production-AAB 1.0.0 (38) über EAS erfolgreich gebaut:
  [Build-Status](https://expo.dev/accounts/talktomecomm/projects/talktome/builds/58cf15c4-d457-497a-8896-0714afe310d3).
  Heruntergeladen und geprüft: tatsächlicher Manifest-Paketname `com.talktome.mobile`,
  Versionscode 38, Version 1.0.0, ZIP-Integrität und JAR-Signatur. Lokale Datei im
  privaten Benutzerordner `Library/Application Support/Talktome/builds/`.
  Noch kein AAB zu Google Play hochgeladen.
- Deutsche und englische Texte mit geprüften Google-Längenlimits. Android-Texte
  versprechen keine Apple-Watch-/Live-Activity-Funktionen.
- Kontakt: `talktome@platonstudio.de`; öffentliche Datenschutz-URL:
  `https://platonstudio.de/talktome/privacy/`.

Die Vorbereitung bestätigt noch keine hochgeladenen Play-Console-Metadaten.
Es ist noch kein Google-Service-Konto mit EAS verknüpft. Der Browserzugriff auf
Play Console steht in dieser Sitzung nicht zur Verfügung.

## Zugriff für automatisierte Uploads einrichten

1. In [Google Cloud](https://console.cloud.google.com/projectcreate) ein eigenes
   Projekt erstellen oder ein vorhandenes Projekt auswählen.
2. Die [Google Play Android Developer API](https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com)
   in diesem Projekt aktivieren.
3. Unter [IAM und Verwaltung → Dienstkonten](https://console.cloud.google.com/iam-admin/serviceaccounts)
   ein Dienstkonto anlegen, beispielsweise `talktome-play`.
4. Unter diesem Dienstkonto → Schlüssel → Schlüssel hinzufügen → Neuen Schlüssel
   erstellen → JSON. Die Datei außerhalb des Git-Repos aufbewahren; nicht in den
   Chat kopieren und nicht committen.
5. In Play Console → Nutzer und Berechtigungen → Neue Nutzer einladen die
   Dienstkonto-Adresse `…@….iam.gserviceaccount.com` eintragen. Nur **Talktome
   Intercom** auswählen. Expo nennt für die Einreichung folgende App-Berechtigungen:
   App-Informationen ansehen, App-Entwürfe bearbeiten/löschen, Releases für
   Test-Tracks, Test-Tracks/Testerlisten verwalten, Store-Präsenz verwalten sowie
   Veröffentlichung/Play App Signing. Keine kontoweiten Administrator- oder
   Finanzrechte nötig. Die englischen aktuellen Bezeichnungen stehen in der
   [Expo-Anleitung](https://github.com/expo/fyi/blob/main/creating-google-service-account.md).
6. Den JSON-Schlüssel in Expo → Projekt → Credentials → Android →
   `com.talktome.mobile` → Google service account key for EAS Submit hinterlegen.
   Alternativ im App-Ordner `npx eas-cli credentials --platform android`, Profil
   `production` → Google Service Account → Play Store Submissions.

Danach lassen sich Build-Uploads über EAS Submit und unterstützte Play-Developer-
API-Aufgaben über dieses Dienstkonto ausführen. Einige Console-Fragebögen und
Kontoverifizierungen bleiben Schritte im Browser.

[Google: API-Zugriff](https://developers.google.com/android-publisher/getting_started),
[Expo: Android-Einreichung](https://docs.expo.dev/submit/android/)

## Ersten Test veröffentlichen und Link teilen

1. App → Testen und veröffentlichen → Tests → Interner Test öffnen.
2. Release erstellen und das **signierte Production-AAB für `com.talktome.mobile`**
   hochladen. Play App Signing nach Googles Ablauf aktivieren. Die GitHub-APK mit
   Paketnamen `.sideload` und Debug-Signierung ist dafür nicht geeignet.
3. Unter Tester eine E-Mail-Liste mit den Google-Konten der Tester oder eine
   Google-Gruppe hinterlegen. Feedback-Adresse: `talktome@platonstudio.de`.
4. Release prüfen und für diesen Test-Track veröffentlichen. Anschließend unter
   Tester den von Google bereitgestellten Teilnahme-Link kopieren und teilen.
5. Tester müssen mit einem freigeschalteten Google-Konto angemeldet sein, dem
   Test beitreten und können die App danach über Google Play installieren.

Interne Tests erlauben bis zu 100 Tester pro App. Ein Teilnahme-Link ersetzt
nicht die Freigabe über E-Mail-Liste/Google-Gruppe. Der Link wird erst nach
Einrichtung aus der Console übernommen; kein aktiver Einladungslink wird hier
vorweggenommen.

Bei einem **persönlichen Entwicklerkonto nach dem 13. November 2023** ist vor dem
Produktionszugang ein **geschlossener Test mit mindestens zwölf über mindestens
14 Tage durchgehend angemeldeten Testern** nötig. Interne Tests ersetzen diese
Anforderung nicht. Danach kann der Produktionszugang beantragt werden. Offene
Tests mit allgemeinem Zugang werden für solche Konten erst nach Produktionszugang
verfügbar. Für Organisationen den tatsächlichen Console-Status prüfen.
Beim Wechsel vom internen in einen geschlossenen Test zuerst den internen Test
verlassen und anschließend dem geschlossenen Test beitreten; ein interner Tester
erhält nicht gleichzeitig Zugriff auf den offenen/geschlossenen Track.

[Google: Test-Tracks](https://support.google.com/googleplay/android-developer/answer/9845334),
[Google: neue persönliche Konten](https://support.google.com/googleplay/android-developer/answer/14151465)

## Vor geschlossenem Test bzw. öffentlichem Release

- Store-Texte, Kategorie (Vorschlag: Produktivität), Kontakt und Datenschutz-Link.
- Echte Android-Screenshots, Play-Icon und Feature-Grafik. Die vorhandenen
  iPhone-/Watch-Screenshots nicht als Android-Screenshots verwenden.
- App-Zugriff: Anmeldung erforderlich; Review-Demo-Zugänge und Server-Anleitung
  ausschließlich in den privaten Zugriffshinweisen der Console hinterlegen.
- Werbung: keine Werbeintegration im aktuellen Code. Keine Bezahlfunktionen.
- Inhaltsbewertung, tatsächliche Zielgruppe und gegebenenfalls Händlerangaben.
- **Datensicherheit separat bearbeiten.** Googles Definition unterscheidet sich
  von Apple: Datenübertragung vom Gerät an einen ausgewählten Server zählt
  grundsätzlich mit; auch nur kurzzeitig verarbeitete Daten müssen im Fragebogen
  angegeben werden. Die Apple-Antwort „keine Datenerhebung“ nicht ungeprüft kopieren.
  Prüfen: Benutzerkennung/Anmeldung, Live-Audio, Server-Betriebsdaten und tatsächlich
  eingesetzte SDKs; QR-Kamerabilder und Profile verbleiben lokal. Speicherfristen
  bzw. Protokollierung bestimmen teilweise die jeweiligen Serverbetreiber.
  [Google: Datensicherheit](https://support.google.com/googleplay/android-developer/answer/10787469)
- Android-Foreground-Service-Erklärung: `microphone`, `mediaPlayback` und optional
  `connectedDevice` sind im Manifest deklariert. Für die Console Nachweisvideos
  vorbereiten: Nutzer startet die Intercom-Verbindung, Hintergrundempfang/-sprechen
  mit dauerhafter Benachrichtigung; optional verbundenes PTT-Zubehör. Die finale
  Erklärung richtet sich nach dem tatsächlich hochgeladenen AAB.
  [Google: Foreground Services](https://support.google.com/googleplay/android-developer/answer/13392821)
- Android-Gerätetest: Sprechen/Hören, Headset-/Bluetooth-Wechsel, PTT-Zubehör,
  Hintergrundbetrieb, Mikrofon-/Benachrichtigungsfreigaben und QR-Anmeldung.

Die öffentliche Store-Veröffentlichung wird durch diese Vorbereitung nicht ausgelöst.
