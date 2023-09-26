function createAudioContextService() {
  let audioContext: AudioContext | null = null;
  let track: MediaElementAudioSourceNode | undefined = undefined;
  let audioElement: HTMLMediaElement | null = null;
  let gainNode: GainNode | null = null;
  let analyser: AnalyserNode | null = null;
  function createAudioContext() {
    audioContext = new AudioContext();
    if (audioContext) {
      return audioContext;
    }

    throw new Error('Ошибка при создании контекста');
  }

  function addAudioElement(element: HTMLMediaElement) {
    audioElement = element;
  }

  function createMediaElementSource(
    newAudioContext: AudioContext,
    newAudioElement: HTMLMediaElement,
  ): MediaElementAudioSourceNode {
    track = newAudioContext?.createMediaElementSource(newAudioElement);

    if (track) {
      return track;
    }

    throw new Error('Ошибка при создании MediaElementSource');
  }

  function resume() {
    audioContext?.resume();
  }

  function createGain(newAudioContext: AudioContext): GainNode {
    gainNode = newAudioContext.createGain();
    return gainNode;
  }

  function getGain(): GainNode {
    if (gainNode) {
      return gainNode;
    }

    throw new Error('');
  }

  function getDestination(): AudioDestinationNode | undefined {
    return audioContext?.destination;
  }

  function getAudioElement(): HTMLMediaElement {
    if (audioElement) {
      return audioElement;
    }

    throw new Error('No audioElement');
  }

  function createAnalyser(): AnalyserNode {
    if (audioContext) {
      analyser = audioContext.createAnalyser();

      return analyser;
    }

    throw new Error('No analyser');
  }

  function getAudioContext() {
    if (audioContext) {
      return audioContext;
    }
    throw new Error('no audioContext');
  }

  function getState() {
    return audioContext?.state;
  }

  function getTrack() {
    if (track) {
      return track;
    }

    throw new Error('No track');
  }

  return {
    createAudioContext,
    resume,
    createMediaElementSource,
    getDestination,
    getState,
    getTrack,
    getAudioContext,
    addAudioElement,
    getAudioElement,
    createGain,
    getGain,
    createAnalyser,
  };
}

const audioContextService = createAudioContextService();

export default audioContextService;
