import {FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import YouTubePlayer from 'react-player/youtube';
import { toast } from 'react-toastify'
interface Video {
    id: string;
    type: string;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    active: boolean;
    played: boolean;
    playedTs: Date | null;
    createAt: Date;
    userId: string;
}

interface RefreshResponse extends Video{
    haveUpvoted: boolean;
    upvotes:number,
}

const REFRESH_INTERVAL_MS = 20 * 1000;
const YT_REGEX = new RegExp(/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/);

export default function StreamView({
    creatorId,
    playVideo,
    token,
    userId
}:{
    creatorId:string,
    playVideo:boolean,
    token:string,
    userId:string
}){
    const [inputLink,setInputLink] = useState('');
    const [queue, setQueue] = useState<RefreshResponse[]>([])
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    // const [playNextLoader, setPlayNextLoader] = useState(false);
    const videoPlayerRef = useRef<HTMLDivElement>(null);
    // const [creatorUserId, setCreatorUserId] = useState<string | null>(null)
    // const [isCreator, setIsCreator] = useState(false)
    const count = useRef<number>(0);
    const refreshStreams = useCallback(async function (){
        const res = await axios.get<{streams:RefreshResponse[],activeStream:{stream:RefreshResponse},isCreator:boolean,creatorId:string}>(`http://localhost:3000/api/v1/streams/?creatorId=${creatorId}&&userId=${userId}`,{
            headers:{
                authorization : 'Bearer ' + token
            }
        });
        
        if (res.data.streams && Array.isArray(res.data.streams)) {
            setQueue(res.data.streams.length > 0 
                ? res.data.streams.sort((a: RefreshResponse, b: RefreshResponse) => b.upvotes - a.upvotes)
                : [])
        } else {
            setQueue([])
        }
        
        // setCurrentVideo(video => {
        //     if (video?.id === res.data.activeStream?.stream?.id) {
        //         return video
        //     }
        //     return video = res.data.activeStream?.stream || null
        // })
        count.current++;
        console.log(count.current);

        // Set the creator's ID
        // setCreatorUserId(res.data.creatorId);
        // setIsCreator(res.data.isCreator);
    
    },[creatorId,token,userId]);



    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        },REFRESH_INTERVAL_MS);

        return (() => {
            clearInterval(interval);
        })

    },[refreshStreams]);

    const OnEnding = useCallback( async function (){
        
        await axios.get<{mostUpvotedStream:Video}>(`http://localhost:3000/api/v1/streams/next/?creatorId=${creatorId}`,{
            headers:{
                authorization : 'Bearer ' + token
            }
        }).then((res) => {
            setCurrentVideo(() => {
                return res.data.mostUpvotedStream
            })
            setQueue((prev) => {
                return prev.filter((t) => {
                    return res.data.mostUpvotedStream.id !== t.id
                }).sort((a:RefreshResponse,b:RefreshResponse) => b.upvotes - a.upvotes)
            })
        })
        
    },[creatorId,token])


    useEffect(() => {
        OnEnding();
    },[OnEnding]);

    
   

    async function handleSubmit(e:FormEvent){
        e.preventDefault();
        if (!inputLink.trim()) {
            toast.error("YouTube link cannot be empty")
            return
        }
        if (!inputLink.match(YT_REGEX)) {
            toast.error("Invalid YouTube URL format")
            return
        }
        setLoading(true)
        try {
            const res = await axios.post<RefreshResponse | {message:string}>(`http://localhost:3000/api/v1/streams/`,{
                creatorId:creatorId,
                url:inputLink
            },{
                headers:{
                    authorization: 'Bearer ' + token
                }
            })
            if (res.status !== 200 && 'message' in res.data) {
                throw new Error(res.data.message || "An error occurred")
            }
            setQueue([...queue, res.data as RefreshResponse]);
            setInputLink('')
            toast.success("Song added to queue successfully")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }
    
    const handleShare = () => {
        const shareableLink = `${window.location.origin}/creator/${creatorId}`
        navigator.clipboard.writeText(shareableLink).then(() => {
            toast.success('Link copied to clipboard!')
        }, (err) => {
            console.error('Could not copy text: ', err)
            toast.error('Failed to copy link. Please try again.')
        })
    }
    
    async function handleVote(id:string,isUpvote:boolean){ 
        setQueue(queue.map(video => 
            video.id === id 
                ? { 
                    ...video, 
                    upvotes: !video.haveUpvoted ? video.upvotes + 1 : video.upvotes - 1,
                    haveUpvoted: !video.haveUpvoted
                } 
                : video
        ).sort((a, b) => b.upvotes - a.upvotes));
        
        if(isUpvote){
            await axios.post<{message:string}>(`http://localhost:3000/api/v1/streams/upvote`,{
                streamId:id
            },{
                headers:{
                    authorization : 'Bearer ' + token
                }
            })
        }else{
            await axios.post<{message:string}>(`http://localhost:3000/api/v1/streams/downvote`,{
                streamId:id
            },{
                headers:{
                    authorization : 'Bearer ' + token
                }
            })
        }
        
        
    }
    count.current++;
    console.log(count.current);
    console.log(currentVideo);
    console.log(queue);
   



    return (
        <div className="grid grid-cols-2 gap-8 bg-black">
            <div ref={videoPlayerRef} className="col-span-1 bg-black p-4 rounded-lg shadow-lg ">
                <div className='border-2 border-gray-800 w-96'>
                    <YouTubePlayer 
                        url={currentVideo ? currentVideo.url : ""}
                        playing={true} 
                        thumbnail
                        controls={true}
                        progressInterval={1000}
                        onEnded={OnEnding}
                        width={384} 
                        height={384} 
                    />
                </div>
                <div className="mt-4">
                    <button 
                        onClick={OnEnding} 
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
                    >
                        Play Next
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6">
                    <label 
                        htmlFor="inputField" 
                        className="block text-gray-300 text-lg font-semibold mb-2"
                    >
                        Enter YouTube URL:
                    </label>
                    <div className="flex">
                        <input 
                            type="text" 
                            id="inputField" 
                            value={inputLink} 
                            onChange={(e) => setInputLink(e.target.value)} 
                            className="w-full px-4 py-2 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring focus:ring-blue-500"
                            required 
                        />
                        <button 
                            type="submit" 
                            className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                <button 
                    onClick={handleShare} 
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-md"
                >
                    Share
                </button>
            </div>
    
            <div className="col-span-1 w-full bg-black p-6 rounded-lg shadow-lg">
                <div className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold text-gray-200">Add Songs</h5>
                        <a href="#" className="text-sm font-medium text-blue-400 hover:underline">View all</a>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-600">
                            {queue.map((t, index) => (
                                <div key={index} className="py-3 sm:py-4 flex justify-between">
                                    <CardElement url={t.smallImg} title={t.title} />
                                    <button 
                                        onClick={() => handleVote(t.id, !t.haveUpvoted)} 
                                        className={`px-4 py-2 rounded-md shadow-md text-white ${t.haveUpvoted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        {t.haveUpvoted ? "DownVote" : "UpVote"}
                                    </button>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div> 
            </div>
        </div>
    );
    
}


export function CardElement({ url, title }: { url: string; title: string }) {
    return (
        <li className="py-4 sm:py-6 flex items-center justify-between bg-gray-800 rounded-md p-4 shadow-md hover:bg-gray-700 transition duration-300">
            <div className="flex items-center">
                <img 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-md shadow-md object-cover" 
                    src={url} 
                    alt="YouTube Thumbnail"
                />
                <div className="ml-4">
                    <h4 className="text-lg font-semibold text-white">{title}</h4>
                </div>
            </div>
        </li>
    );
}
