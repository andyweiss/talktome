@main
enum AudioRoutePreferenceTests {
  static func main() {
    var preference = TalkToMeAudioRoutePreference()
    preference.preferredId = "port:airpods"
    preference.beginPicker()

    // The regression: iOS reports the speaker selection as a configuration
    // change while the picker is open. Do not immediately reapply AirPods.
    precondition(!preference.routeDidChange(
      reason: .routeConfigurationChange, currentId: "speaker", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "speaker")
    preference.endPicker(currentId: "speaker")
    precondition(!preference.isPickerPresented)

    // A later Bluetooth reconfiguration must restore the selected speaker.
    precondition(preference.routeDidChange(
      reason: .routeConfigurationChange, currentId: "port:airpods", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "speaker")

    // Switching back to AirPods through the same system picker also works.
    preference.beginPicker()
    precondition(!preference.routeDidChange(
      reason: .override, currentId: "port:airpods", preferredStillAvailable: true
    ))
    preference.endPicker(currentId: "port:airpods")
    precondition(preference.preferredId == "port:airpods")

    // Cancelling the picker keeps the currently selected route.
    preference.beginPicker()
    preference.endPicker(currentId: "port:airpods")
    precondition(preference.preferredId == "port:airpods")

    // Routine changes and loss of another device keep the selected headset.
    precondition(preference.routeDidChange(
      reason: .other, currentId: "speaker", preferredStillAvailable: true
    ))
    precondition(preference.routeDidChange(
      reason: .oldDeviceUnavailable, currentId: "speaker", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "port:airpods")

    // Unplugging that headset falls back to speaker; a new headset is adopted.
    precondition(preference.routeDidChange(
      reason: .oldDeviceUnavailable, currentId: "speaker", preferredStillAvailable: false
    ))
    precondition(preference.preferredId == "speaker")
    precondition(preference.routeDidChange(
      reason: .newDeviceAvailable, currentId: "port:earpods", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "port:earpods")

    // Control Center speaker overrides still update the preference.
    precondition(preference.routeDidChange(
      reason: .override, currentId: "speaker", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "speaker")
    // Explicit in-app selection survives transient receiver/Bluetooth events.
    preference.preferredId = "speaker"
    precondition(preference.routeDidChange(
      reason: .override, currentId: "receiver", preferredStillAvailable: true,
      selectionInProgress: true
    ))
    precondition(preference.preferredId == "speaker")
    precondition(!preference.routeDidChange(
      reason: .override, currentId: "speaker", preferredStillAvailable: true,
      selectionInProgress: true
    ))
    // After settling, Control Center can still choose another route.
    precondition(preference.routeDidChange(
      reason: .override, currentId: "port:airpods", preferredStillAvailable: true
    ))
    precondition(preference.preferredId == "port:airpods")
    // Legacy settings and system receiver selections fall back to speaker.
    preference.preferredId = "receiver"
    precondition(preference.preferredId == "speaker")
    preference.beginPicker()
    preference.endPicker(currentId: "receiver")
    precondition(preference.preferredId == "speaker")
    print("Native audio route preference tests passed.")
  }
}
