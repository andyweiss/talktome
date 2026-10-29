/// The system picker owns routing while it is visible. Remember its result
/// before restoring that preference across later audio-session reconfiguration.
struct TalkToMeAudioRoutePreference {
  enum ChangeReason: UInt {
    case other = 0
    case newDeviceAvailable = 1
    case oldDeviceUnavailable = 2
    case override = 4
    case routeConfigurationChange = 8
  }

  private var storedPreferredId = "speaker"
  var preferredId: String {
    get { storedPreferredId }
    set { storedPreferredId = newValue.isEmpty || newValue == "receiver" ? "speaker" : newValue }
  }
  private(set) var isPickerPresented = false

  mutating func beginPicker() {
    isPickerPresented = true
  }

  mutating func endPicker(currentId: String) {
    preferredId = currentId
    isPickerPresented = false
  }

  /// Returns whether the controller should restore the preferred route.
  mutating func routeDidChange(
    reason: ChangeReason,
    currentId: String,
    preferredStillAvailable: Bool,
    selectionInProgress: Bool = false
  ) -> Bool {
    if isPickerPresented {
      preferredId = currentId
      return false
    }
    // setPreferredInput and overrideOutputAudioPort can report intermediate
    // routes. Those notifications must not overwrite an explicit selection.
    if selectionInProgress && preferredStillAvailable {
      return currentId != preferredId
    }
    switch reason {
    case .newDeviceAvailable, .override:
      preferredId = currentId
    case .oldDeviceUnavailable:
      if !preferredStillAvailable { preferredId = "speaker" }
    default:
      break
    }
    return true
  }
}
