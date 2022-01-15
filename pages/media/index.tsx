import Player from "../../components/Player";
import ReactAudioPlayer from "react-audio-player";

export default function MediaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6">
            {/* Content goes here */}
            {/* We use less vertical padding on card headers on desktop than on body sections */}
          </div>
          <div className="px-4 py-5 sm:p-6">{/* Content goes here */}</div>
          <div className="px-4 py-4 sm:px-6">
            <ReactAudioPlayer
              src="https://cdn.pixabay.com/download/audio/2022/01/12/audio_45cacdef8f.mp3?filename=both-of-us-14037.mp3"
              controls
            />
          </div>
        </div>
      </div>
    </div>
  );
}
