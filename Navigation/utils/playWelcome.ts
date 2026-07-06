import Sound from "react-native-sound";

Sound.setCategory("Playback");

export function playWelcome() {
  const sound = new Sound("welcome.mp3", Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("failed to load sound", error);
      return;
    }

    sound.play(() => {
      console.log("should be playing")
      sound.release();
    });
  });
}