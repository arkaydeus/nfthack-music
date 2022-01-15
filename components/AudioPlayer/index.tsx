import React, { useState, useEffect, useRef } from "react";

interface Props {
  url: string;
}

class Player extends React.Component<Props, { audio: HTMLAudioElement }> {
  constructor(props: Props) {
    super(props);
  }

  createAudio = (url: string) => {
    const [audio, setAudio] = useState(null);
    useEffect(() => {
      setAudio(new Audio(url));
      // only run once on the first render on the client
    }, []);
  };

  useAudio = (url: string) => {
    // const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
      setAudio(new Audio(url));
      // only run once on the first render on the client
    }, []);
    useEffect(() => {
      playing ? this.state.audio.play() : this.state.audio.pause();
    }, [playing]);

    useEffect(() => {
      this.state.audio.addEventListener("ended", () => setPlaying(false));
      return () => {
        this.state.audio.removeEventListener("ended", () => setPlaying(false));
      };
    }, []);

    return [playing, toggle];
  };

  render(): React.ReactNode {
    const [playing, toggle] = this.useAudio(this.props.url);

    return (
      <div>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
      </div>
    );
  }
}

export default Player;
