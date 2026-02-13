function average(arr: Array<number> | Uint8Array) {
  // Prevent returning NaN
  if (!arr.length) {
    return 0;
  }

  let fullValue = 0;
  for (let i = 0; i < arr.length; i += 1) {
    fullValue += arr[i];
  }

  return fullValue / arr.length;
}

const FFT_SIZE = 128;
const SMOOTHING = 0.1;

// tl;dr; Put stereo audio in, get averaged FFT data out
// Audio -> MediaElementSource -> ChannelSplitter -> AnalyserNode(s) -> Averaged FFT
//                             -> AudioContext.Destination -> Speakers

export default class StereoAnalyser {
  private analyserLeft: AnalyserNode;
  private analyserRight: AnalyserNode;
  private audio: HTMLAudioElement;
  private audioContext: AudioContext;
  private dataArrayLeft: Uint8Array;
  private dataArrayRight: Uint8Array;

  constructor(audio: HTMLAudioElement, audioContext: AudioContext) {
    this.audio = audio;
    this.audioContext = audioContext;
    this.setupAudioNodes();
  }

  /**
   * Construct and connect all the necessary AudioContext nodes
   * @private
   */
  setupAudioNodes() {
    const analyserLeft = this.createAnalyserNode();
    const analyserRight = this.createAnalyserNode();
    const splitter = this.audioContext.createChannelSplitter(2);

    const mediaElement = this.audioContext.createMediaElementSource(this.audio);

    // Plug analysers nodes into separate channels
    splitter.connect(analyserLeft, 0);
    splitter.connect(analyserRight, 1);

    // Plug source into the splitter
    mediaElement.connect(splitter);
    mediaElement.connect(this.audioContext.destination);

    this.dataArrayLeft = new Uint8Array(analyserLeft.frequencyBinCount);
    this.dataArrayRight = new Uint8Array(analyserRight.frequencyBinCount);
    this.analyserLeft = analyserLeft;
    this.analyserRight = analyserRight;
  }

  /**
   * Creates an analyser node and connects context destination
   * @private
   */
  createAnalyserNode() {
    const analysisNode = this.audioContext.createAnalyser();

    analysisNode.smoothingTimeConstant = SMOOTHING;
    analysisNode.fftSize = FFT_SIZE;

    return analysisNode;
  }

  // No-ops kept for API compatibility with audioManager event listeners
  start = () => {};
  pause = () => {};

  stop = () => {
    this.audioContext.close();
  };

  /**
   * Read FFT data inline — no separate rAF loop needed.
   * getByteFrequencyData is designed to be called synchronously
   * from within an existing animation frame.
   */
  get averageFFT() {
    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;
    analyserLeft.getByteFrequencyData(dataArrayLeft);
    analyserRight.getByteFrequencyData(dataArrayRight);
    return [average(dataArrayLeft), average(dataArrayRight)];
  }

  get rawFFT() {
    const { analyserLeft, analyserRight, dataArrayLeft, dataArrayRight } = this;
    analyserLeft.getByteFrequencyData(dataArrayLeft);
    analyserRight.getByteFrequencyData(dataArrayRight);
    return [dataArrayLeft, dataArrayRight];
  }
}
