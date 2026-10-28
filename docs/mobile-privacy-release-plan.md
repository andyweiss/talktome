# Vorbereitung der ersten iOS-Store-Version

Stand: 28. Oktober 2026.

- Öffentliche Datenschutzerklärung in Englisch und Deutsch veröffentlicht.
- Privacy-Policy-Link auf Login, Profilübersicht und im Session-Menü eingebaut.
- Store-Name **Talktome Intercom**, Kategorie **Produktivität**,
  Texte in Englisch (UK) und Deutsch sowie Support-/Datenschutz-URLs vorbereitet
  und im bearbeitbaren App-Store-Entwurf gespeichert.
- Kostenloser Preis eingerichtet; öffentliche Freigabe erfolgt manuell.
- Build 33 mit Datenschutz-Link in TestFlight verfügbar.
- Build 34 wurde lokal gebaut und zu Apple hochgeladen; er ergänzt die Audioauswahl innerhalb der App, einen neutralen,
  abgerundeten Play-Pfeil und Scene-Start für das iOS-27-SDK.

Der aktuelle Metadatenstand steht in
[app-store.json](../mobile-app/store/app-store.json).
Die noch zu bestätigenden Datenschutz-/Altersfragen und Review-Schritte stehen in
[privacy-and-age-rating.de.md](../mobile-app/store/privacy-and-age-rating.de.md).

TestFlight ist keine öffentliche Store-Veröffentlichung. Vor der Einreichung sind
Gerätetests und ein für Apple erreichbarer Review-Server samt Demo-Zugang nötig.

Die Store-Screenshots liegen unter
[mobile-app/store/screenshots](../mobile-app/store/screenshots/manifest.json)
und sind in den englischen und deutschen Store-Entwurf hochgeladen.
Die öffentliche App-Oberfläche ist derzeit Englisch.

Validierung: 391 mobile Tests, TypeScript, iOS-/Android-Bundle-Export und nativer
Swift-Routing-Test erfolgreich. Simulator: Login und Datenschutz-Link vor/nach
Anmeldung, Audio-Menü schließen und außerhalb antippen geprüft. Vorher/Nachher-
Aufnahmen nach „Done“ sind einschließlich der Statusleiste pixelgleich. Die
Screenshot-Kopie deaktiviert ausschließlich im Simulator Audio-I/O wegen eines
RemoteIO-RPC-Absturzes. Deshalb ersetzt dies keine Hör-/AirPods-Prüfung auf echter
Hardware; die veröffentlichte Geräte-App enthält diese Simulator-Anpassung nicht.
