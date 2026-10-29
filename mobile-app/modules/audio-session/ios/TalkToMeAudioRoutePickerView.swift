import AVKit
import ExpoModulesCore
import UIKit

/// Transparent hit target for Apple's system audio route picker (`AVRoutePickerView`).
/// The React Native button draws the visible icon; this view only presents the iOS overlay.
public final class TalkToMeAudioRoutePickerView: ExpoView, AVRoutePickerViewDelegate {
  static let willPresentRoutes = Notification.Name("TalkToMeAudioRoutePickerWillPresent")
  static let didDismissRoutes = Notification.Name("TalkToMeAudioRoutePickerDidDismiss")
  private let picker = AVRoutePickerView()

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    backgroundColor = .clear
    isOpaque = false
    clipsToBounds = true

    picker.prioritizesVideoDevices = false
    picker.delegate = self
    picker.tintColor = .clear
    picker.activeTintColor = .clear
    picker.backgroundColor = .clear
    picker.isOpaque = false
    picker.accessibilityLabel = "Audio output"
    picker.accessibilityHint = "Choose speaker or a headset"
    addSubview(picker)
  }

  public func routePickerViewWillBeginPresentingRoutes(_ routePickerView: AVRoutePickerView) {
    NotificationCenter.default.post(name: Self.willPresentRoutes, object: self)
  }

  public func routePickerViewDidEndPresentingRoutes(_ routePickerView: AVRoutePickerView) {
    NotificationCenter.default.post(name: Self.didDismissRoutes, object: self)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    picker.frame = bounds
    expandPickerButton(in: picker)
  }

  private func expandPickerButton(in view: UIView) {
    for subview in view.subviews {
      if let button = subview as? UIButton {
        button.frame = view.bounds
        button.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        button.setImage(nil, for: .normal)
        button.setImage(nil, for: .highlighted)
        button.imageView?.isHidden = true
        button.backgroundColor = .clear
        button.tintColor = .clear
        button.isAccessibilityElement = true
        button.accessibilityLabel = "Audio output"
        button.accessibilityHint = "Choose an audio device with iOS"
      } else {
        expandPickerButton(in: subview)
      }
    }
  }
}
