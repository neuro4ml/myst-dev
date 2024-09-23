import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import React, { useEffect } from "react";

interface VideoVolumeProps {
  ast: GenericNode[];
}

function VideoVolume({ ast }: VideoVolumeProps) {
    useEffect(() => {
        const videos = document.querySelectorAll('video');
        //let vidCount = 0;
        videos.forEach(video => {
            video.loop = false;
            video.muted = false;
            video.autoplay = true;

        });
    }, []);

    return <MyST ast={ast} />;
}

export default VideoVolume;