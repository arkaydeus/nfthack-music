import { useZNFT, useNFTMetadata, } from '@zoralabs/nft-hooks'
import { useRouter } from "next/router";
import {NextPage} from "next";
import ReactAudioPlayer from "react-audio-player";
import {toValidHTTPSURI} from "../../utils/helpers";
import React, {useEffect, useRef, useState} from "react";
import { PlayIcon, PauseIcon } from '@heroicons/react/solid'
import {Layout} from "../../components";

const MediaPage: NextPage = () => {
    const [showWalletOptions, setShowWalletOptions] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const router = useRouter();
    const { id } = router.query;
    const { data, error } = useZNFT(`${id}`)
    const { metadata } = useNFTMetadata(data?.nft.metadataURI)
    let audioPlayer: ReactAudioPlayer;

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.audioEl.current?.duration);
        setDuration(calculateTime(seconds));
    }, [isPlaying]);

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.audioEl.current?.currentTime);
        setCurrentTime(calculateTime(seconds));
    }, [audioPlayer?.audioEl.current?.currentTime]);


    const calculateTime = (secs: number) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}` || '00';
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}` || '00';
        return (isNaN(minutes) ? "00:00" : `${returnedMinutes}:${returnedSeconds}`);
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer?.audioEl?.current.play();
            // animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            audioPlayer?.audioEl?.current.pause();
            // cancelAnimationFrame(animationRef.current);
        }
    }

    return (
        <Layout
            showWalletOptions={showWalletOptions}
            setShowWalletOptions={setShowWalletOptions}
        >
        <div className="bg-white">
            <main className="mt-24 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
                    <div className="lg:col-start-8 lg:col-span-5">
                    </div>

                    {/* Image gallery */}
                    <div className="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-2">
                        <h2 className="sr-only">Images</h2>

                        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 lg:gap-8">
                                <img

                                    src="https://source.unsplash.com/ILTfM75YtKM/640x640"
                                    alt="placeholder"
                                    className="lg:col-span-2 lg:row-span-2 sm:rounded-lg"

                                />
                        </div>
                        <div className="block sm:hidden">
                            <div className="relative w-80 h-80 rounded-full overflow-hidden mx-auto">
                                <button
                                    onClick={togglePlayPause}>
                                <img
                                    src="https://source.unsplash.com/ojBNiaeykwc/640x640" alt="album art"
                                    className={`${isPlaying ? 'animate-spin-slow' : ''}` + " object-cover w-full h-full"}/>
                                <div
                                    className="absolute w-full top-1/3 pt-6 text-white text-xs text-center leading-4">
                                    {
                                        isPlaying ?
                                            <PauseIcon className="h-16 w-16 m-auto text-black hover:text-gray-500" /> :
                                            <PlayIcon className="h-16 w-16 m-auto text-black hover:text-gray-500" />
                                    }
                                </div>
                                </button>
                            </div>
                            <p className="mx-auto text-center">{currentTime} / {duration || "00:00"}</p>
                        </div>
                    </div>
                    <div className="mt-8 lg:col-span-5">

                        <div className="flex justify-between">
                            <h1 className="text-2xl font-medium text-gray-900">{metadata?.name}</h1>
                        </div>
                        <div>
                            <ReactAudioPlayer
                                className="hidden sm:flex mt-8 w-full bg-rose-600 border border-transparent rounded-md py-3 px-8 items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                src={toValidHTTPSURI(data?.zoraNFT?.contentURI || "")}
                                controls
                                ref={(element) => {audioPlayer = element; }}
                            />
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Description</h2>

                            <div
                                className="mt-4 prose prose-sm text-gray-500"
                            >{metadata?.description}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </Layout>
    )
}

export default MediaPage
