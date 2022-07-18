import TrackPlayer from "react-native-track-player";

const playList = async (list, start) => {
  await TrackPlayer.reset();
  await TrackPlayer.add(list);
  await TrackPlayer.skip(start);
  await TrackPlayer.play();
};

const initialize = list => {
  TrackPlayer.getQueue()
    .then(r => {
      if (r.length === 0) {
        TrackPlayer.add(list);
      }
    });
}

const usePlayerAction = () => ({
  play: () => TrackPlayer.play(),
  pause: () => TrackPlayer.pause(),
  skipToNext: () => TrackPlayer.skipToNext(),
  skipToPrevious: () => TrackPlayer.skipToPrevious(),
  seekTo: (s) => TrackPlayer.seekTo(s),
  playList,
  initialize,
});

export default usePlayerAction;
